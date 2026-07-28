import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const metadataDir = path.dirname(fileURLToPath(import.meta.url));
const reportPath = path.join(metadataDir, "ui-extraction-report.json");
const report = JSON.parse(await readFile(reportPath, "utf8"));
const resolveFromMetadata = (file) => path.resolve(metadataDir, file);
const sha256 = (buffer) => createHash("sha256").update(buffer).digest("hex");
const errors = [];

const sourcePath = resolveFromMetadata(report.source.file);
const sourceBuffer = await readFile(sourcePath);
if (sha256(sourceBuffer) !== report.source.sha256) {
  errors.push("source SHA-256 mismatch");
}

const assetInputs = [];
for (const asset of report.assets) {
  const buffer = await readFile(resolveFromMetadata(asset.file));
  if (sha256(buffer) !== asset.sha256) {
    errors.push(`${asset.id}: SHA-256 mismatch`);
  }
  assetInputs.push({
    ...asset,
    dataUrl: `data:image/png;base64,${buffer.toString("base64")}`,
  });
}
const reviewBuffer = await readFile(resolveFromMetadata(report.reviewBoard.file));
if (sha256(reviewBuffer) !== report.reviewBoard.sha256) {
  errors.push("review board SHA-256 mismatch");
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const pixelChecks = await page.evaluate(
  async ({ sourceDataUrl, assets }) => {
    const load = (src) =>
      new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = src;
      });
    const source = await load(sourceDataUrl);
    const sourceCanvas = document.createElement("canvas");
    sourceCanvas.width = source.naturalWidth;
    sourceCanvas.height = source.naturalHeight;
    const sourceContext = sourceCanvas.getContext("2d", {
      willReadFrequently: true,
    });
    sourceContext.drawImage(source, 0, 0);
    const sourcePixels = sourceContext.getImageData(
      0,
      0,
      sourceCanvas.width,
      sourceCanvas.height,
    ).data;
    const checks = [];

    for (const asset of assets) {
      const image = await load(asset.dataUrl);
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      context.drawImage(image, 0, 0);
      const pixels = context.getImageData(
        0,
        0,
        canvas.width,
        canvas.height,
      ).data;
      let nonTransparentPixels = 0;
      let differentPreservedPixels = 0;
      for (let y = 0; y < canvas.height; y += 1) {
        for (let x = 0; x < canvas.width; x += 1) {
          const outputOffset = (y * canvas.width + x) * 4;
          if (pixels[outputOffset + 3] === 0) {
            continue;
          }
          nonTransparentPixels += 1;
          const sourceX = asset.sourceBounds.x + x;
          const sourceY = asset.sourceBounds.y + y;
          const sourceOffset =
            (sourceY * sourceCanvas.width + sourceX) * 4;
          for (let channel = 0; channel < 4; channel += 1) {
            if (
              pixels[outputOffset + channel] !==
              sourcePixels[sourceOffset + channel]
            ) {
              differentPreservedPixels += 1;
              break;
            }
          }
        }
      }
      const cornerAlpha = [
        pixels[3],
        pixels[(canvas.width - 1) * 4 + 3],
        pixels[((canvas.height - 1) * canvas.width) * 4 + 3],
        pixels[
          ((canvas.height - 1) * canvas.width + canvas.width - 1) * 4 + 3
        ],
      ];
      checks.push({
        id: asset.id,
        width: canvas.width,
        height: canvas.height,
        nonTransparentPixels,
        differentPreservedPixels,
        cornerAlpha,
      });
    }
    return checks;
  },
  {
    sourceDataUrl: `data:image/png;base64,${sourceBuffer.toString("base64")}`,
    assets: assetInputs,
  },
);
await browser.close();

for (const check of pixelChecks) {
  const asset = report.assets.find((candidate) => candidate.id === check.id);
  if (check.width !== asset.width || check.height !== asset.height) {
    errors.push(`${check.id}: dimension mismatch`);
  }
  if (check.nonTransparentPixels !== asset.nonTransparentPixels) {
    errors.push(`${check.id}: non-transparent pixel count mismatch`);
  }
  if (check.differentPreservedPixels !== 0) {
    errors.push(
      `${check.id}: ${check.differentPreservedPixels} preserved pixels differ`,
    );
  }
  if (check.cornerAlpha.some((alpha) => alpha !== 0)) {
    errors.push(`${check.id}: one or more corners are not transparent`);
  }
}

console.log(
  JSON.stringify(
    {
      reportId: report.id,
      assetCount: report.assets.length,
      generatedPixels: report.extraction.generatedPixels,
      imageGenerationModelCalls: report.extraction.imageGenerationModelCalls,
      pixelChecks,
      errorCount: errors.length,
      errors,
    },
    null,
    2,
  ),
);
if (errors.length > 0) {
  process.exitCode = 1;
}
