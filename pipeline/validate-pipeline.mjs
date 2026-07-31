import { createHash } from "node:crypto";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { inflateSync } from "node:zlib";
import {
  contract,
  isWithin,
  schemaErrors,
  schemaValidator,
  validateSchema,
  verifyWorkspaceEvidence,
} from "./schema-tools.mjs";

const pipelineDir = path.dirname(fileURLToPath(import.meta.url));
const artDir = path.resolve(pipelineDir, "..");
const workspaceRoot = path.resolve(artDir, "..");

const walk = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(target)));
    } else {
      files.push(target);
    }
  }
  return files;
};

const paethPredictor = (left, above, upperLeft) => {
  const prediction = left + above - upperLeft;
  const leftDistance = Math.abs(prediction - left);
  const aboveDistance = Math.abs(prediction - above);
  const upperLeftDistance = Math.abs(prediction - upperLeft);
  if (leftDistance <= aboveDistance && leftDistance <= upperLeftDistance) {
    return left;
  }
  if (aboveDistance <= upperLeftDistance) {
    return above;
  }
  return upperLeft;
};

const pngAnalysis = (buffer) => {
  const expectedSignature = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
  ]);
  if (!buffer.subarray(0, 8).equals(expectedSignature)) {
    throw new Error("Expected PNG output.");
  }

  let width;
  let height;
  let bitDepth;
  let colorType;
  let interlace;
  const idatChunks = [];
  let offset = 8;
  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.subarray(offset + 4, offset + 8).toString("ascii");
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
      interlace = data[12];
    } else if (type === "IDAT") {
      idatChunks.push(data);
    } else if (type === "IEND") {
      break;
    }
    offset += length + 12;
  }

  if (!width || !height || bitDepth !== 8 || interlace !== 0) {
    throw new Error("Only non-interlaced 8-bit PNG outputs are supported.");
  }
  const channelCountByColorType = new Map([
    [0, 1],
    [2, 3],
    [4, 2],
    [6, 4],
  ]);
  const channels = channelCountByColorType.get(colorType);
  if (!channels) {
    throw new Error(`Unsupported PNG color type ${colorType}.`);
  }

  const inflated = inflateSync(Buffer.concat(idatChunks));
  const rowBytes = width * channels;
  if (inflated.length !== height * (rowBytes + 1)) {
    throw new Error("Unexpected PNG scanline data length.");
  }

  let transparentPixels = 0;
  let opaquePixels = 0;
  let partialAlphaPixels = 0;
  let greenSpillPixels = 0;
  const cornerAlpha = [];
  const rgba = Buffer.alloc(width * height * 4);
  let previous = Buffer.alloc(rowBytes);
  let inputOffset = 0;

  for (let y = 0; y < height; y += 1) {
    const filterType = inflated[inputOffset];
    inputOffset += 1;
    const filtered = inflated.subarray(inputOffset, inputOffset + rowBytes);
    inputOffset += rowBytes;
    const current = Buffer.alloc(rowBytes);

    for (let x = 0; x < rowBytes; x += 1) {
      const left = x >= channels ? current[x - channels] : 0;
      const above = previous[x];
      const upperLeft = x >= channels ? previous[x - channels] : 0;
      let predictor;
      if (filterType === 0) {
        predictor = 0;
      } else if (filterType === 1) {
        predictor = left;
      } else if (filterType === 2) {
        predictor = above;
      } else if (filterType === 3) {
        predictor = Math.floor((left + above) / 2);
      } else if (filterType === 4) {
        predictor = paethPredictor(left, above, upperLeft);
      } else {
        throw new Error(`Unsupported PNG filter type ${filterType}.`);
      }
      current[x] = (filtered[x] + predictor) & 0xff;
    }

    for (let x = 0; x < width; x += 1) {
      const sourceOffset = x * channels;
      const alpha =
        colorType === 6
          ? current[sourceOffset + 3]
          : colorType === 4
            ? current[sourceOffset + 1]
            : 255;
      const targetOffset = (y * width + x) * 4;
      if (colorType === 0 || colorType === 4) {
        rgba[targetOffset] = current[sourceOffset];
        rgba[targetOffset + 1] = current[sourceOffset];
        rgba[targetOffset + 2] = current[sourceOffset];
      } else {
        rgba[targetOffset] = current[sourceOffset];
        rgba[targetOffset + 1] = current[sourceOffset + 1];
        rgba[targetOffset + 2] = current[sourceOffset + 2];
      }
      rgba[targetOffset + 3] = alpha;
      if (alpha === 0) {
        transparentPixels += 1;
      } else if (alpha === 255) {
        opaquePixels += 1;
      } else {
        partialAlphaPixels += 1;
      }
      if (
        alpha > 0 &&
        rgba[targetOffset + 1] >= 200 &&
        rgba[targetOffset] <= 80 &&
        rgba[targetOffset + 2] <= 80
      ) {
        greenSpillPixels += 1;
      }
      if (
        (y === 0 || y === height - 1) &&
        (x === 0 || x === width - 1)
      ) {
        cornerAlpha.push(alpha);
      }
    }
    previous = current;
  }

  return {
    width,
    height,
    transparentPixels,
    opaquePixels,
    partialAlphaPixels,
    greenSpillPixels,
    cornerAlpha,
    rgba,
  };
};

const hexColor = (value) => {
  if (!/^#[0-9a-f]{6}$/iu.test(value ?? "")) {
    return null;
  }
  return [
    Number.parseInt(value.slice(1, 3), 16),
    Number.parseInt(value.slice(3, 5), 16),
    Number.parseInt(value.slice(5, 7), 16),
  ];
};

const reviewFiles = await walk(path.join(artDir, "review"));
const reports = reviewFiles.filter((file) =>
  file.endsWith("completion-report.json"),
);
const standaloneReports = reviewFiles.filter((file) =>
  file.endsWith("standalone-raster-report.json"),
);
const bundleReports = reviewFiles.filter((file) =>
  file.endsWith("bundle-model-report.json"),
);
const provenanceFiles = reviewFiles.filter((file) =>
  file.endsWith("provenance.json"),
);
const errors = [];
const results = [];
const profileApprovalKeys = new Set();

async function verifyEvidenceFile(reference, baseDirectory, label) {
  const evidencePath = path.resolve(baseDirectory, reference.file);
  if (!isWithin(artDir, evidencePath)) {
    throw new Error(`${label}: evidence가 art-workspace 밖을 가리킵니다`);
  }
  const evidenceStat = await stat(evidencePath);
  if (!evidenceStat.isFile()) throw new Error(`${label}: 일반 파일이 아닙니다`);
  const buffer = await readFile(evidencePath);
  const digest = createHash("sha256").update(buffer).digest("hex");
  if (digest !== reference.sha256) {
    throw new Error(`${label}: SHA-256 불일치`);
  }
  if (reference.bytes !== undefined && reference.bytes !== buffer.byteLength) {
    throw new Error(`${label}: bytes 불일치`);
  }
  return { buffer, path: evidencePath, sha256: digest };
}

for (const reportPath of standaloneReports) {
  const report = JSON.parse(await readFile(reportPath, "utf8"));
  const reportDir = path.dirname(reportPath);
  const relativeReport = path.relative(workspaceRoot, reportPath);
  const schema = await schemaValidator("standalone-raster-report");
  if (!schema(report)) {
    errors.push(
      `${relativeReport}: standalone raster schema 오류 (${schemaErrors(schema).join("; ")})`,
    );
    continue;
  }
  profileApprovalKeys.add(`${report.profile}:${report.id}:R${report.sourceRevision}`);
  for (const [index, source] of report.sourceEvidence.entries()) {
    try {
      await verifyEvidenceFile(
        source,
        reportDir,
        `${relativeReport}: sourceEvidence[${index}]`,
      );
    } catch (error) {
      errors.push(error.message);
    }
  }
  try {
    const output = await verifyEvidenceFile(
      report.output,
      reportDir,
      `${relativeReport}: output`,
    );
    const analysis = pngAnalysis(output.buffer);
    if (
      analysis.width !== report.output.width
      || analysis.height !== report.output.height
    ) {
      errors.push(`${relativeReport}: output 치수 불일치`);
    }
    if (
      report.output.alpha === "straight"
      && !analysis.cornerAlpha.every((alpha) => alpha === 0)
    ) {
      errors.push(`${relativeReport}: straight-alpha output 네 모서리는 투명해야 합니다`);
    }
    if (analysis.greenSpillPixels !== report.output.greenSpillPixels) {
      errors.push(`${relativeReport}: green spill 측정값 불일치`);
    }
  } catch (error) {
    errors.push(error.message);
  }
  try {
    const reviewBoard = await verifyEvidenceFile(
      report.reviewBoard,
      reportDir,
      `${relativeReport}: review board`,
    );
    const analysis = pngAnalysis(reviewBoard.buffer);
    if (
      analysis.width !== report.reviewBoard.width
      || analysis.height !== report.reviewBoard.height
    ) {
      errors.push(`${relativeReport}: review board 치수 불일치`);
    }
  } catch (error) {
    errors.push(error.message);
  }
  results.push({
    report: relativeReport,
    profile: report.profile,
    screenUnit: report.screenUnit,
    approvalStatus: report.approval.status,
    runtimeRegistrationAllowed: report.runtimeRegistrationAllowed,
  });
}

for (const reportPath of bundleReports) {
  const report = JSON.parse(await readFile(reportPath, "utf8"));
  const reportDir = path.dirname(reportPath);
  const relativeReport = path.relative(workspaceRoot, reportPath);
  const schema = await schemaValidator("bundle-model-report");
  if (!schema(report)) {
    errors.push(
      `${relativeReport}: bundle model schema 오류 (${schemaErrors(schema).join("; ")})`,
    );
    continue;
  }
  profileApprovalKeys.add(`${report.profile}:${report.id}:R${report.sourceRevision}`);
  for (const [index, artifact] of report.artifacts.entries()) {
    try {
      await verifyEvidenceFile(
        artifact,
        reportDir,
        `${relativeReport}: artifact[${index}]`,
      );
    } catch (error) {
      errors.push(error.message);
    }
  }
  results.push({
    report: relativeReport,
    profile: report.profile,
    screenUnit: report.screenUnit,
    approvalStatus: report.approval.status,
    runtimeRegistrationAllowed: report.runtimeRegistrationAllowed,
  });
}
for (const reportPath of reports) {
  const report = JSON.parse(await readFile(reportPath, "utf8"));
  const reportDir = path.dirname(reportPath);
  const relativeReport = path.relative(workspaceRoot, reportPath);

  const completionSchema = await schemaValidator("completion-report");
  if (!completionSchema(report)) {
    errors.push(
      `${relativeReport}: completion schema 오류 (${schemaErrors(completionSchema).join("; ")})`,
    );
  } else {
    profileApprovalKeys.add(
      `${report.profile}:${report.id}:R${report.sourceRevision}`,
    );
  }
  if (
    report.pipelineContract
    !== "art-workspace/pipeline/pipeline-contract.json"
  ) {
    errors.push(`${relativeReport}: pipeline contract reference is missing`);
  }
  if (!contract.approvalStatuses.includes(report.approvalStatus)) {
    errors.push(`${relativeReport}: invalid approvalStatus`);
  }
  if (report.runtimeRegistrationAllowed !== false) {
    errors.push(
      `${relativeReport}: runtime 등록 허용은 final handoff에서만 파생할 수 있습니다`,
    );
  }
  if (report.approvedCutout?.status !== "approved-by-user") {
    errors.push(`${relativeReport}: approved cutout evidence is missing`);
  } else if (report.approvedCutout?.file && report.approvedCutout?.sha256) {
    const cutoutPath = path.resolve(reportDir, report.approvedCutout.file);
    if (!isWithin(workspaceRoot, cutoutPath)) {
      errors.push(`${relativeReport}: approved cutout이 작업공간 밖을 가리킵니다`);
    } else {
      try {
        const cutout = await readFile(cutoutPath);
        const cutoutSha256 = createHash("sha256").update(cutout).digest("hex");
        if (cutoutSha256 !== report.approvedCutout.sha256) {
          errors.push(`${relativeReport}: approved cutout SHA-256 mismatch`);
        }
      } catch (error) {
        errors.push(`${relativeReport}: approved cutout file invalid (${error.message})`);
      }
    }
  }
  if (!report.outputs?.completed || !report.outputs?.reviewBoard) {
    errors.push(`${relativeReport}: completed output and review board are required`);
  }

  const outputResults = {};
  const outputRgba = {};
  for (const [id, output] of Object.entries(report.outputs ?? {})) {
    const outputPath = path.resolve(reportDir, "..", output.file);
    try {
      const outputStat = await stat(outputPath);
      if (!outputStat.isFile()) {
        throw new Error("not a file");
      }
      const buffer = await readFile(outputPath);
      const sha256 = createHash("sha256").update(buffer).digest("hex");
      if (sha256 !== output.sha256) {
        errors.push(`${relativeReport}: ${id} SHA-256 mismatch`);
      }
      const { rgba, ...analysis } = pngAnalysis(buffer);
      if (analysis.width !== 1920 || analysis.height !== 1080) {
        errors.push(
          `${relativeReport}: ${id} must be 1920x1080, got ${analysis.width}x${analysis.height}`,
        );
      }
      outputResults[id] = { ...analysis, sha256 };
      outputRgba[id] = rgba;
    } catch (error) {
      errors.push(`${relativeReport}: ${id} output missing (${error.message})`);
    }
  }

  const completed = outputResults.completed;
  const transparencyMode = report.measurements?.transparencyMode;
  if (!contract.transparencyModes?.[transparencyMode]) {
    errors.push(`${relativeReport}: invalid transparencyMode`);
  } else if (completed) {
    if (
      report.measurements.transparentPixels !== completed.transparentPixels ||
      report.measurements.opaquePixels !== completed.opaquePixels ||
      report.measurements.partialAlphaPixels !== completed.partialAlphaPixels
    ) {
      errors.push(`${relativeReport}: measured alpha counts do not match PNG`);
    }
    if (
      transparencyMode === "opaque-full-frame" &&
      (completed.transparentPixels !== 0 ||
        completed.partialAlphaPixels !== 0)
    ) {
      errors.push(`${relativeReport}: opaque full-frame layer contains alpha`);
    }
    if (transparencyMode === "alpha-cutout") {
      if (
        completed.transparentPixels === 0 ||
        completed.opaquePixels === 0
      ) {
        errors.push(`${relativeReport}: alpha cutout lacks subject or transparency`);
      }
      if (!completed.cornerAlpha.every((alpha) => alpha === 0)) {
        errors.push(`${relativeReport}: alpha cutout corners must be transparent`);
      }

      const reviewComposition = report.reviewComposition;
      const reviewMode =
        contract.reviewCompositionModes?.["isolated-alpha-checkerboard"];
      if (
        reviewComposition?.mode !== "isolated-alpha-checkerboard" ||
        reviewComposition?.subjectAssetOnly !== true
      ) {
        errors.push(
          `${relativeReport}: alpha cutout review must be subject-only on checkerboard`,
        );
      } else {
        const cellSize = reviewComposition.cellSize;
        const colors = (reviewComposition.colors ?? []).map(hexColor);
        const completedRgba = outputRgba.completed;
        const reviewRgba = outputRgba.reviewBoard;
        if (
          !Number.isInteger(cellSize) ||
          cellSize < 4 ||
          colors.length !== 2 ||
          colors.some((color) => color === null)
        ) {
          errors.push(`${relativeReport}: invalid checkerboard review definition`);
        } else if (completedRgba && reviewRgba) {
          let isolationDifferentPixels = 0;
          for (let y = 0; y < completed.height; y += 1) {
            for (let x = 0; x < completed.width; x += 1) {
              const offset = (y * completed.width + x) * 4;
              const sourceAlpha = completedRgba[offset + 3];
              let differs = reviewRgba[offset + 3] !== 255;
              if (sourceAlpha === 0) {
                const checkerIndex =
                  (Math.floor(x / cellSize) + Math.floor(y / cellSize)) % 2;
                const checker = colors[checkerIndex];
                for (let channel = 0; channel < 3; channel += 1) {
                  differs ||= reviewRgba[offset + channel] !== checker[channel];
                }
              } else if (sourceAlpha === 255) {
                for (let channel = 0; channel < 3; channel += 1) {
                  differs ||=
                    reviewRgba[offset + channel] !== completedRgba[offset + channel];
                }
              } else {
                const checkerIndex =
                  (Math.floor(x / cellSize) + Math.floor(y / cellSize)) % 2;
                const checker = colors[checkerIndex];
                for (let channel = 0; channel < 3; channel += 1) {
                  const expected = Math.round(
                    (
                      completedRgba[offset + channel] * sourceAlpha
                      + checker[channel] * (255 - sourceAlpha)
                    ) / 255,
                  );
                  differs ||= Math.abs(reviewRgba[offset + channel] - expected) > 1;
                }
              }
              isolationDifferentPixels += differs ? 1 : 0;
            }
          }
          if (
            isolationDifferentPixels !==
            reviewComposition.isolationDifferentPixels
          ) {
            errors.push(
              `${relativeReport}: isolated review pixel count does not match report`,
            );
          }
          if (isolationDifferentPixels !== 0) {
            errors.push(
              `${relativeReport}: review board contains pixels outside the completed asset`,
            );
          }
        }

        const forbidden = reviewMode?.forbiddenVisibleCategories ?? [];
        const missingForbidden = forbidden.filter(
          (category) => !reviewComposition.absent?.includes(category),
        );
        if (missingForbidden.length > 0) {
          errors.push(
            `${relativeReport}: review composition exclusions missing (${missingForbidden.join(", ")})`,
          );
        }
      }
    }
  }

  if (report.rejectedIntermediate?.retained !== false) {
    errors.push(`${relativeReport}: rejected intermediate must not be retained`);
  }

  results.push({
    report: relativeReport,
    profile: report.profile,
    screenUnit: report.screenUnit,
    approvalStatus: report.approvalStatus,
    runtimeRegistrationAllowed: report.runtimeRegistrationAllowed,
    outputs: outputResults,
  });
}

for (const provenancePath of provenanceFiles) {
  const provenance = JSON.parse(await readFile(provenancePath, "utf8"));
  const provenanceDir = path.dirname(provenancePath);
  const relativeProvenance = path.relative(workspaceRoot, provenancePath);
  const provenanceSchema = await schemaValidator("provenance");
  if (!provenanceSchema(provenance)) {
    errors.push(
      `${relativeProvenance}: provenance schema 오류 (${schemaErrors(provenanceSchema).join("; ")})`,
    );
    continue;
  }
  for (const [index, source] of provenance.sourceReferences.entries()) {
    try {
      await verifyEvidenceFile(
        source,
        provenanceDir,
        `${relativeProvenance}: sourceReferences[${index}]`,
      );
    } catch (error) {
      errors.push(error.message);
    }
  }
  try {
    await verifyEvidenceFile(
      {
        file: provenance.generation.rawChromaSource,
        sha256: provenance.generation.rawChromaSourceSha256,
        bytes: provenance.generation.rawChromaSourceBytes,
      },
      provenanceDir,
      `${relativeProvenance}: raw chroma source`,
    );
  } catch (error) {
    errors.push(error.message);
  }
  try {
    const output = await verifyEvidenceFile(
      provenance.output,
      provenanceDir,
      `${relativeProvenance}: output`,
    );
    if (provenance.output.file.toLowerCase().endsWith(".png")) {
      const analysis = pngAnalysis(output.buffer);
      if (
        provenance.output.width !== undefined
        && (
          analysis.width !== provenance.output.width
          || analysis.height !== provenance.output.height
        )
      ) {
        errors.push(`${relativeProvenance}: output 치수 불일치`);
      }
    }
  } catch (error) {
    errors.push(error.message);
  }
  if (provenance.status === "approved-by-user") {
    const profileKey =
      `${provenance.profile}:${provenance.id}:R${provenance.sourceRevision}`;
    if (!profileApprovalKeys.has(profileKey)) {
      errors.push(
        `${relativeProvenance}: 승인 provenance에 대응하는 profile approval report가 없습니다`,
      );
    }
  }
}

const validation = {
  contract: contract.id,
  reportCount: reports.length + standaloneReports.length + bundleReports.length,
  provenanceCount: provenanceFiles.length,
  errorCount: errors.length,
  errors,
  results,
};

console.log(JSON.stringify(validation, null, 2));

if (errors.length > 0) {
  process.exitCode = 1;
}
