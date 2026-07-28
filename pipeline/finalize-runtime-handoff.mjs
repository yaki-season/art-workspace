#!/usr/bin/env node

import { readFile, rename, stat, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  artWorkspaceRoot,
  isWithin,
  sha256,
  validateSchema,
} from './schema-tools.mjs';

const workspaceRoot = path.resolve(artWorkspaceRoot, '..');
const runtimeLibrary = await import(
  pathToFileURL(path.join(workspaceRoot, 'app/tools/assets/runtime-assets-lib.mjs'))
);

function usage(message) {
  if (message) console.error(message);
  console.error(
    '사용법: node art-workspace/pipeline/finalize-runtime-handoff.mjs '
    + '--provenance <file> --profile-approval <file> '
    + '--recomposition <file> --optimization <file> '
    + '--final-approval <file> --entry-template <file> '
    + '--entry-output <runtime-manifest-entry.json> '
    + '--handoff-output <runtime-handoff.json>',
  );
  process.exitCode = 2;
}

function parseArguments(argv) {
  const result = {};
  const names = new Set([
    '--provenance',
    '--profile-approval',
    '--recomposition',
    '--optimization',
    '--final-approval',
    '--entry-template',
    '--entry-output',
    '--handoff-output',
  ]);
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (!names.has(argument)) throw new Error(`알 수 없는 인자입니다: ${argument}`);
    const value = argv[index + 1];
    if (!value || value.startsWith('--')) throw new Error(`${argument} 값이 필요합니다.`);
    result[argument.slice(2)] = value;
    index += 1;
  }
  return result;
}

function requireArguments(args) {
  for (const name of [
    'provenance',
    'profile-approval',
    'recomposition',
    'optimization',
    'final-approval',
    'entry-template',
    'entry-output',
    'handoff-output',
  ]) {
    if (!args[name]) throw new Error(`--${name}가 필요합니다.`);
  }
}

function externalPath(value, label) {
  const file = path.resolve(process.cwd(), value);
  if (!isWithin(artWorkspaceRoot, file)) {
    throw new Error(`${label}은 art-workspace 안에 있어야 합니다.`);
  }
  return file;
}

async function readDocument(file, schemaName, label) {
  const buffer = await readFile(file);
  const document = JSON.parse(buffer.toString('utf8'));
  await validateSchema(schemaName, document, label);
  return { file, buffer, document, sha256: sha256(buffer) };
}

async function verifyFileEvidence(reference, baseDirectory, label) {
  const file = path.resolve(baseDirectory, reference.file);
  if (!isWithin(artWorkspaceRoot, file)) {
    throw new Error(`${label}이 art-workspace 밖을 가리킵니다.`);
  }
  const fileStat = await stat(file);
  if (!fileStat.isFile()) throw new Error(`${label}이 일반 파일이 아닙니다.`);
  const buffer = await readFile(file);
  const digest = sha256(buffer);
  if (digest !== reference.sha256) {
    throw new Error(`${label} SHA-256 불일치: 기록 ${reference.sha256}, 실제 ${digest}`);
  }
  if (reference.bytes !== undefined && reference.bytes !== buffer.byteLength) {
    throw new Error(`${label} byte가 실제 파일과 일치하지 않습니다.`);
  }
  return { file, buffer, sha256: digest };
}

function assertIdentity(base, candidate, label, includeBuild = false) {
  for (const field of ['id', 'profile', 'sourceRevision', 'screenUnit']) {
    if (candidate[field] !== base[field]) {
      throw new Error(`${label}.${field}가 provenance와 일치하지 않습니다.`);
    }
  }
  if (includeBuild && candidate.runtimeBuild !== base.runtimeBuild) {
    throw new Error(`${label}.runtimeBuild가 entry template과 일치하지 않습니다.`);
  }
}

function profileApprovalSchema(profile) {
  return {
    'complete-layer': 'completion-report',
    'standalone-raster': 'standalone-raster-report',
    'bundle-model': 'bundle-model-report',
  }[profile];
}

function assertProfileApprovalState(document, profile) {
  if (profile === 'complete-layer') {
    if (
      document.approvalStatus !== 'approved-by-user'
      || !['approved', 'approved-by-user'].includes(document.userApproval?.status)
    ) {
      throw new Error('complete-layer profile approval이 사용자 승인 상태가 아닙니다.');
    }
    return;
  }
  if (document.approval?.status !== 'approved-by-user') {
    throw new Error(`${profile} profile approval이 사용자 승인 상태가 아닙니다.`);
  }
}

async function verifyProfileApprovalEvidence(profileApproval) {
  const { document } = profileApproval;
  const directory = path.dirname(profileApproval.file);
  if (document.profile === 'complete-layer') {
    await verifyFileEvidence(document.approvedCutout, directory, 'profile approved cutout');
    await verifyFileEvidence(document.spatialInference, directory, 'profile spatial inference');
    const outputDirectory = path.resolve(directory, '..');
    const completed = await verifyFileEvidence(
      document.outputs.completed,
      outputDirectory,
      'profile completed output',
    );
    const reviewBoard = await verifyFileEvidence(
      document.outputs.reviewBoard,
      outputDirectory,
      'profile review board',
    );
    verifyRasterDimensions(
      completed,
      { width: document.measurements.width, height: document.measurements.height },
      'profile completed output',
    );
    verifyRasterDimensions(
      reviewBoard,
      { width: 1920, height: 1080 },
      'profile review board',
    );
    return;
  }
  if (document.profile === 'standalone-raster') {
    for (const [index, source] of document.sourceEvidence.entries()) {
      await verifyFileEvidence(source, directory, `profile sourceEvidence[${index}]`);
    }
    const output = await verifyFileEvidence(
      document.output,
      directory,
      'profile standalone output',
    );
    const reviewBoard = await verifyFileEvidence(
      document.reviewBoard,
      directory,
      'profile standalone review board',
    );
    verifyRasterDimensions(output, document.output, 'profile standalone output');
    verifyRasterDimensions(
      reviewBoard,
      document.reviewBoard,
      'profile standalone review board',
    );
    return;
  }
  for (const [index, artifact] of document.artifacts.entries()) {
    await verifyFileEvidence(artifact, directory, `profile artifact[${index}]`);
  }
}

function relativeFrom(directory, file) {
  return path.relative(directory, file).split(path.sep).join('/');
}

function rasterFormatFromFile(file) {
  const extension = path.extname(file).toLowerCase();
  if (extension === '.png') return 'png';
  if (extension === '.jpg' || extension === '.jpeg') return 'jpeg';
  if (extension === '.webp') return 'webp';
  return null;
}

function verifyRasterDimensions(evidence, reference, label) {
  const format = rasterFormatFromFile(evidence.file);
  if (!format) throw new Error(`${label}은 PNG, JPEG 또는 WebP여야 합니다.`);
  const dimensions = runtimeLibrary.readRasterDimensions(evidence.buffer, format);
  if (
    !dimensions
    || dimensions.width !== reference.width
    || dimensions.height !== reference.height
  ) {
    throw new Error(`${label} 실제 치수가 report와 일치하지 않습니다.`);
  }
}

async function writePairAtomically({ entryOutput, entry, handoffOutput, handoff }) {
  for (const output of [entryOutput, handoffOutput]) {
    try {
      await stat(output);
      throw new Error(`출력 파일이 이미 존재합니다: ${output}`);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  const entryTemporary = `${entryOutput}.finalizing`;
  const handoffTemporary = `${handoffOutput}.finalizing`;
  let entryInstalled = false;
  try {
    await writeFile(entryTemporary, `${JSON.stringify(entry, null, 2)}\n`, 'utf8');
    await writeFile(handoffTemporary, `${JSON.stringify(handoff, null, 2)}\n`, 'utf8');
    await rename(entryTemporary, entryOutput);
    entryInstalled = true;
    await rename(handoffTemporary, handoffOutput);
  } catch (error) {
    await unlink(entryTemporary).catch(() => {});
    await unlink(handoffTemporary).catch(() => {});
    if (entryInstalled) await unlink(entryOutput).catch(() => {});
    throw error;
  }
}

async function main() {
  let args;
  try {
    args = parseArguments(process.argv.slice(2));
    requireArguments(args);
  } catch (error) {
    usage(error.message);
    return;
  }

  const provenance = await readDocument(
    externalPath(args.provenance, 'provenance'),
    'provenance',
    'provenance',
  );
  const provenanceProfile = provenance.document.profile;
  const profileSchema = profileApprovalSchema(provenanceProfile);
  if (!profileSchema) {
    throw new Error(`지원하지 않는 profile입니다: ${provenanceProfile}`);
  }
  const profileApproval = await readDocument(
    externalPath(args['profile-approval'], 'profile approval'),
    profileSchema,
    'profile approval',
  );
  const recomposition = await readDocument(
    externalPath(args.recomposition, 'recomposition'),
    'recomposition-report',
    'recomposition report',
  );
  const optimization = await readDocument(
    externalPath(args.optimization, 'optimization'),
    'optimization-report',
    'optimization report',
  );
  const finalApproval = await readDocument(
    externalPath(args['final-approval'], 'final approval'),
    'final-approval',
    'final approval',
  );
  const entryTemplate = await readDocument(
    externalPath(args['entry-template'], 'entry template'),
    'runtime-entry-template',
    'runtime entry template',
  );
  const entryOutput = externalPath(args['entry-output'], 'manifest entry output');
  const handoffOutput = externalPath(args['handoff-output'], 'handoff output');
  if (path.dirname(entryOutput) !== path.dirname(handoffOutput)) {
    throw new Error('manifest entry와 handoff 출력은 같은 metadata 디렉터리에 있어야 합니다.');
  }

  const base = provenance.document;
  if (
    base.status !== 'approved-by-user'
    || base.runtimeRegistrationAllowed !== false
  ) {
    throw new Error('provenance는 승인 상태이며 runtimeRegistrationAllowed=false여야 합니다.');
  }
  assertIdentity(base, optimization.document, 'optimization');
  assertIdentity(base, entryTemplate.document, 'entry template');
  assertIdentity(base, profileApproval.document, 'profile approval');
  assertProfileApprovalState(profileApproval.document, base.profile);
  if (profileApproval.document.runtimeRegistrationAllowed !== false) {
    throw new Error('profile approval의 runtimeRegistrationAllowed는 false여야 합니다.');
  }
  await verifyProfileApprovalEvidence(profileApproval);
  if (finalApproval.document.screenUnit !== base.screenUnit) {
    throw new Error('final approval screenUnit이 provenance와 일치하지 않습니다.');
  }
  if (
    recomposition.document.screenUnit !== base.screenUnit
    || recomposition.document.status !== 'passed'
  ) {
    throw new Error('recomposition report의 소비 화면 또는 상태가 provenance와 일치하지 않습니다.');
  }
  if (!finalApproval.document.assets.includes(base.id)) {
    throw new Error('final approval에 대상 asset ID가 없습니다.');
  }
  if (!recomposition.document.approvedAssets.some(
    (asset) => (
      asset.id === base.id
      && asset.profile === base.profile
      && asset.sourceRevision === base.sourceRevision
    ),
  )) {
    throw new Error('recomposition report에 승인된 대상 source revision이 없습니다.');
  }

  const provenanceDirectory = path.dirname(provenance.file);
  const provenanceOutput = await verifyFileEvidence(
    base.output,
    provenanceDirectory,
    'provenance output',
  );
  for (const [index, source] of base.sourceReferences.entries()) {
    await verifyFileEvidence(source, provenanceDirectory, `provenance sourceReferences[${index}]`);
  }

  const recompositionDirectory = path.dirname(recomposition.file);
  const fhdRecomposition = await verifyFileEvidence(
    recomposition.document.outputs.fhd,
    recompositionDirectory,
    'FHD recomposition',
  );
  const hdRecomposition = await verifyFileEvidence(
    recomposition.document.outputs.hd,
    recompositionDirectory,
    '720p recomposition',
  );
  verifyRasterDimensions(
    fhdRecomposition,
    recomposition.document.outputs.fhd,
    'FHD recomposition',
  );
  verifyRasterDimensions(
    hdRecomposition,
    recomposition.document.outputs.hd,
    '720p recomposition',
  );

  const optimizationDirectory = path.dirname(optimization.file);
  const optimizationInput = await verifyFileEvidence(
    optimization.document.input,
    optimizationDirectory,
    'optimization input',
  );
  if (optimizationInput.sha256 !== provenanceOutput.sha256) {
    throw new Error('optimization input이 승인 provenance output과 일치하지 않습니다.');
  }
  const artifacts = [];
  for (const [index, artifact] of optimization.document.artifacts.entries()) {
    const verified = await verifyFileEvidence(
      artifact,
      optimizationDirectory,
      `optimization artifact[${index}]`,
    );
    const dimensions = runtimeLibrary.readRasterDimensions(
      verified.buffer,
      artifact.format,
    );
    if (
      dimensions
      && (
        dimensions.width !== artifact.dimensions?.width
        || dimensions.height !== artifact.dimensions?.height
      )
    ) {
      throw new Error(`optimization artifact[${index}] 실제 치수가 다릅니다.`);
    }
    artifacts.push({ ...artifact, file: verified.file });
  }

  const finalApprovalDirectory = path.dirname(finalApproval.file);
  const approvedRecomposition = await verifyFileEvidence(
    finalApproval.document.recomposition,
    finalApprovalDirectory,
    'final approval recomposition',
  );
  if (approvedRecomposition.sha256 !== recomposition.sha256) {
    throw new Error('final approval이 현재 recomposition report를 가리키지 않습니다.');
  }
  const approvedOptimizations = [];
  for (const reference of finalApproval.document.optimizations) {
    approvedOptimizations.push(
      await verifyFileEvidence(reference, finalApprovalDirectory, 'final approval optimization'),
    );
  }
  if (!approvedOptimizations.some((item) => item.sha256 === optimization.sha256)) {
    throw new Error('final approval이 현재 optimization report를 가리키지 않습니다.');
  }

  const primary = artifacts.find((artifact) => artifact.role === 'primary');
  if (!primary) throw new Error('optimization artifacts에 primary가 하나 필요합니다.');
  if (artifacts.filter((artifact) => artifact.role === 'primary').length !== 1) {
    throw new Error('optimization artifacts의 primary는 정확히 하나여야 합니다.');
  }

  const template = entryTemplate.document;
  assertIdentity(base, template, 'entry template');
  if (template.runtimeBuild !== optimization.document.runtimeBuild) {
    throw new Error('entry template runtimeBuild가 optimization report와 다릅니다.');
  }
  const expectedSource = `ARTSRC:${base.id}:R${base.sourceRevision}`;
  const expectedProvenance = `PROV:${base.id}:R${base.sourceRevision}`;
  if (
    template.source !== expectedSource
    || template.provenance !== expectedProvenance
  ) {
    throw new Error('entry template의 source/provenance stable identity가 대상과 다릅니다.');
  }
  if (
    (
      template.profile === 'standalone-raster'
      || template.kind === 'atlas'
      || template.alpha === 'straight'
    )
    && optimization.document.lossPolicy !== 'lossless-required'
  ) {
    throw new Error('standalone raster·atlas·alpha 자산은 lossless-required여야 합니다.');
  }
  if (
    optimization.document.lossPolicy === 'lossy-background-approved'
    && !optimization.document.visualRegression.userApproval
  ) {
    throw new Error('lossy background 최적화에는 사용자 visual regression 승인이 필요합니다.');
  }

  const entry = {
    ...template,
    url: primary.url,
    sha256: primary.sha256,
    bytes: primary.bytes,
    ...(primary.dimensions ? { dimensions: primary.dimensions } : {}),
    format: primary.format,
    ...(artifacts.length > 1
      ? {
        companions: artifacts
          .filter((artifact) => artifact.role !== 'primary')
          .map((artifact) => ({
            role: artifact.role,
            url: artifact.url,
            sha256: artifact.sha256,
            bytes: artifact.bytes,
            format: artifact.format,
            ...(artifact.dimensions ? { dimensions: artifact.dimensions } : {}),
          })),
      }
      : {}),
  };
  const entryErrors = await runtimeLibrary.validateManifestEntry(entry);
  if (entryErrors.length > 0) {
    throw new Error(`생성 manifest entry가 app schema를 통과하지 못했습니다:\n- ${entryErrors.join('\n- ')}`);
  }

  const handoffDirectory = path.dirname(handoffOutput);
  const entryBuffer = Buffer.from(`${JSON.stringify(entry, null, 2)}\n`);
  const handoff = {
    schemaVersion: 1,
    pipelineContract: 'YS-ASSET-PIPELINE-v7',
    profile: base.profile,
    id: base.id,
    sourceRevision: base.sourceRevision,
    runtimeBuild: template.runtimeBuild,
    screenUnit: base.screenUnit,
    allPriorGatesPassed: true,
    runtimeRegistrationAllowed: true,
    evidence: {
      provenance: {
        file: relativeFrom(handoffDirectory, provenance.file),
        sha256: provenance.sha256,
      },
      profileApproval: {
        file: relativeFrom(handoffDirectory, profileApproval.file),
        sha256: profileApproval.sha256,
      },
      recomposition: {
        file: relativeFrom(handoffDirectory, recomposition.file),
        sha256: recomposition.sha256,
      },
      optimization: {
        file: relativeFrom(handoffDirectory, optimization.file),
        sha256: optimization.sha256,
      },
      finalApproval: {
        file: relativeFrom(handoffDirectory, finalApproval.file),
        sha256: finalApproval.sha256,
      },
    },
    manifestEntry: {
      file: relativeFrom(handoffDirectory, entryOutput),
      sha256: sha256(entryBuffer),
    },
    bundle: artifacts.map((artifact) => ({
      role: artifact.role,
      sourceFile: relativeFrom(handoffDirectory, artifact.file),
      url: artifact.url,
      sha256: artifact.sha256,
      bytes: artifact.bytes,
      format: artifact.format,
      ...(artifact.dimensions ? { dimensions: artifact.dimensions } : {}),
    })),
    generatedAt: new Date().toISOString(),
  };
  await validateSchema('runtime-handoff', handoff, 'generated runtime handoff');
  await writePairAtomically({
    entryOutput,
    entry,
    handoffOutput,
    handoff,
  });

  console.log(`runtime handoff 생성 완료: ${base.id}@R${base.sourceRevision}-B${template.runtimeBuild}`);
  console.log(`manifest entry: ${path.relative(workspaceRoot, entryOutput)}`);
  console.log(`handoff: ${path.relative(workspaceRoot, handoffOutput)}`);
}

main().catch((error) => {
  console.error(`runtime handoff 생성 실패: ${error.message}`);
  process.exitCode = 1;
});
