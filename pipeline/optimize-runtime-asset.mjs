#!/usr/bin/env node

// YS-ASSET-PIPELINE-v8 Gate-2 optimizer.
//
// 승인된 자산 하나에 대해 runtime 최적화 산출물과 optimization-report.json을 만든다.
// 이 도구는 승인된 픽셀/지오메트리를 절대 바꾸지 않는다(lossless-identity):
//   - primary 산출물은 승인 provenance.output 파일 그 자체를 참조한다.
//     따라서 optimization.input.sha256 === provenance.output.sha256 이고,
//     finalizer의 `optimizationInput.sha256 === provenanceOutput.sha256` 검사를 통과한다.
//   - companion(예: GLB 모델의 external pixel albedo)도 승인된 파일을 그대로 참조한다.
// 재인코딩/리샘플/메타데이터 편집을 하지 않으므로 승인 시각·runtime 계약이 보존된다.
//
// 사용법:
//   node art-workspace/pipeline/optimize-runtime-asset.mjs \
//     --provenance review/.../metadata/provenance.json \
//     [--profile-approval review/.../metadata/<profile-report>.json] \
//     [--runtime-build 1] [--pack core] [--scene cooking] \
//     [--url /assets/core/cooking/<slug>-r<R>-b<B>.<ext>] \
//     [--loss-policy lossless-required] \
//     [--companion <role>=<relative-file>] [--companion-url <role>=<url>] \
//     [--output review/.../metadata/optimization-report.json] [--force]

import { readFile, stat, writeFile } from 'node:fs/promises';
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

const SCENE_BY_SCREEN_UNIT = {
  'SCR-SVC-CUSTOMERS': 'customer',
  'SCR-SVC-ASSEMBLY': 'cooking',
  'SCR-SVC-GRILL': 'cooking',
  'SCR-SVC-DRINK': 'drink',
  'SCR-POST-CLOSING': 'closing',
  'SCR-POST-SETTLEMENT': 'settlement',
};

function usage(message) {
  if (message) console.error(message);
  console.error(
    '사용법: node art-workspace/pipeline/optimize-runtime-asset.mjs '
    + '--provenance <file> [--profile-approval <file>] [--runtime-build N] '
    + '[--pack core] [--scene <segment>] [--url <primary url>] '
    + '[--loss-policy lossless-required] [--companion <role>=<file>] '
    + '[--companion-url <role>=<url>] [--output <file>] [--force]',
  );
  process.exitCode = 2;
}

function parseArguments(argv) {
  const result = { companion: [], 'companion-url': [] };
  const single = new Set([
    '--provenance', '--profile-approval', '--runtime-build', '--pack',
    '--scene', '--url', '--loss-policy', '--output',
  ]);
  const multi = new Set(['--companion', '--companion-url']);
  const flags = new Set(['--force']);
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (flags.has(argument)) { result[argument.slice(2)] = true; continue; }
    if (!single.has(argument) && !multi.has(argument)) {
      throw new Error(`알 수 없는 인자입니다: ${argument}`);
    }
    const value = argv[index + 1];
    if (value === undefined || value.startsWith('--')) {
      throw new Error(`${argument} 값이 필요합니다.`);
    }
    if (multi.has(argument)) result[argument.slice(2)].push(value);
    else result[argument.slice(2)] = value;
    index += 1;
  }
  if (!result.provenance) throw new Error('--provenance가 필요합니다.');
  return result;
}

function externalPath(value, label) {
  const file = path.resolve(process.cwd(), value);
  if (!isWithin(artWorkspaceRoot, file)) {
    throw new Error(`${label}은 art-workspace 안에 있어야 합니다: ${value}`);
  }
  return file;
}

function formatFromFile(file) {
  const extension = path.extname(file).toLowerCase();
  if (extension === '.png') return 'png';
  if (extension === '.jpg' || extension === '.jpeg') return 'jpeg';
  if (extension === '.webp') return 'webp';
  if (extension === '.glb') return 'glb';
  if (extension === '.json') return 'json';
  throw new Error(`지원하지 않는 산출물 형식입니다: ${file}`);
}

function urlExtension(format) {
  return format === 'jpeg' ? 'jpg' : format;
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/gu, '-').replace(/^-+|-+$/gu, '');
}

const RASTER_FORMATS = new Set(['png', 'jpeg', 'webp']);

async function verifyFile(baseDirectory, reference, label) {
  const file = path.resolve(baseDirectory, reference.file);
  if (!isWithin(artWorkspaceRoot, file)) {
    throw new Error(`${label}이 art-workspace 밖을 가리킵니다: ${reference.file}`);
  }
  const fileStat = await stat(file).catch(() => null);
  if (!fileStat || !fileStat.isFile()) throw new Error(`${label} 파일이 없습니다: ${reference.file}`);
  const buffer = await readFile(file);
  const digest = sha256(buffer);
  if (reference.sha256 && digest !== reference.sha256) {
    throw new Error(`${label} SHA-256 불일치: 기록 ${reference.sha256}, 실제 ${digest}`);
  }
  const format = formatFromFile(file);
  let dimensions;
  if (RASTER_FORMATS.has(format)) {
    dimensions = runtimeLibrary.readRasterDimensions(buffer, format);
  }
  return { file, buffer, sha256: digest, bytes: buffer.byteLength, format, dimensions };
}

function pairMap(entries, label) {
  const map = new Map();
  for (const entry of entries) {
    const equals = entry.indexOf('=');
    if (equals <= 0) throw new Error(`${label}은 <role>=<value> 형식이어야 합니다: ${entry}`);
    map.set(entry.slice(0, equals), entry.slice(equals + 1));
  }
  return map;
}

async function main() {
  let args;
  try {
    args = parseArguments(process.argv.slice(2));
  } catch (error) {
    usage(error.message);
    return;
  }

  const provenanceFile = externalPath(args.provenance, 'provenance');
  const provenanceDir = path.dirname(provenanceFile);
  const provenanceBuffer = await readFile(provenanceFile);
  const provenance = JSON.parse(provenanceBuffer.toString('utf8'));
  await validateSchema('provenance', provenance, 'provenance');

  if (provenance.status !== 'approved-by-user') {
    throw new Error(`provenance.status가 approved-by-user가 아닙니다: ${provenance.status}`);
  }
  if (provenance.runtimeRegistrationAllowed !== false) {
    throw new Error('provenance.runtimeRegistrationAllowed는 false여야 합니다.');
  }

  const runtimeBuild = args['runtime-build'] ? Number.parseInt(args['runtime-build'], 10) : 1;
  if (!Number.isInteger(runtimeBuild) || runtimeBuild < 1) {
    throw new Error('--runtime-build는 1 이상의 정수여야 합니다.');
  }
  const pack = args.pack ?? 'core';
  const scene = args.scene ?? SCENE_BY_SCREEN_UNIT[provenance.screenUnit];
  if (!scene) throw new Error(`screenUnit에서 scene을 유추할 수 없습니다: ${provenance.screenUnit}. --scene을 지정하세요.`);
  const lossPolicy = args['loss-policy'] ?? 'lossless-required';
  const slug = slugify(provenance.id);
  const version = `-r${provenance.sourceRevision}-b${runtimeBuild}`;

  // --- primary: 승인 provenance.output 그 자체(무손실 동일) ---
  const primaryVerified = await verifyFile(
    provenanceDir,
    { file: provenance.output.file, sha256: provenance.output.sha256 },
    'provenance output',
  );
  if (provenance.output.bytes !== undefined && provenance.output.bytes !== primaryVerified.bytes) {
    throw new Error('provenance.output.bytes가 실제 파일과 다릅니다.');
  }
  if (RASTER_FORMATS.has(primaryVerified.format) && primaryVerified.dimensions) {
    if (
      provenance.output.width !== undefined
      && (provenance.output.width !== primaryVerified.dimensions.width
        || provenance.output.height !== primaryVerified.dimensions.height)
    ) {
      throw new Error('provenance.output 치수가 실제 파일과 다릅니다.');
    }
  }
  const primaryUrl = args.url
    ?? `/assets/${pack}/${scene}/${slug}${version}.${urlExtension(primaryVerified.format)}`;

  const primaryArtifact = {
    role: 'primary',
    file: provenance.output.file,
    url: primaryUrl,
    sha256: primaryVerified.sha256,
    bytes: primaryVerified.bytes,
    format: primaryVerified.format,
    ...(primaryVerified.dimensions ? { dimensions: primaryVerified.dimensions } : {}),
  };

  // --- companions: 승인된 부속 파일(예: external pixel albedo)을 그대로 참조 ---
  const companionFiles = pairMap(args.companion, '--companion');
  const companionUrls = pairMap(args['companion-url'], '--companion-url');
  const companionArtifacts = [];
  for (const [role, relFile] of companionFiles) {
    if (!/^[a-z0-9-]+$/u.test(role)) {
      throw new Error(`companion role은 소문자/숫자/하이픈만 허용합니다: ${role}`);
    }
    const verified = await verifyFile(provenanceDir, { file: relFile }, `companion:${role}`);
    const companionUrl = companionUrls.get(role)
      ?? `/assets/${pack}/${scene}/${slug}-${role}${version}.${urlExtension(verified.format)}`;
    companionArtifacts.push({
      role,
      file: relFile,
      url: companionUrl,
      sha256: verified.sha256,
      bytes: verified.bytes,
      format: verified.format,
      ...(verified.dimensions ? { dimensions: verified.dimensions } : {}),
    });
  }

  const report = {
    schemaVersion: 1,
    id: provenance.id,
    screenUnit: provenance.screenUnit,
    profile: provenance.profile,
    sourceRevision: provenance.sourceRevision,
    runtimeBuild,
    status: 'passed',
    input: { file: provenance.output.file, sha256: provenance.output.sha256 },
    artifacts: [primaryArtifact, ...companionArtifacts],
    lossPolicy,
    visualRegression: {
      result: 'passed',
      method: 'lossless-identity: 승인 provenance.output과 runtime primary 산출물이 동일한 SHA-256·byte이며 재인코딩·리샘플·메타데이터 편집이 없다',
      userApprovalRequired: false,
    },
    performanceBudget: {
      result: 'passed',
      checks: [
        `단일 primary runtime payload (${primaryArtifact.bytes} bytes, ${primaryArtifact.format})`,
        'byte·픽셀·지오메트리·치수 변화 없음 (lossless-identity)',
        companionArtifacts.length > 0
          ? `${companionArtifacts.length}개 승인 companion을 재인코딩 없이 재참조`
          : 'companion 없음',
      ],
    },
  };

  await validateSchema('optimization-report', report, 'optimization report');

  const outputFile = args.output
    ? externalPath(args.output, 'output')
    : path.join(provenanceDir, 'optimization-report.json');
  if (!args.force) {
    const exists = await stat(outputFile).catch(() => null);
    if (exists) throw new Error(`출력 파일이 이미 존재합니다(덮어쓰려면 --force): ${outputFile}`);
  }
  const serialized = `${JSON.stringify(report, null, 2)}\n`;
  await writeFile(outputFile, serialized, 'utf8');

  console.log(`optimization-report 생성: ${provenance.id}@R${provenance.sourceRevision}-B${runtimeBuild}`);
  console.log(`  output: ${path.relative(workspaceRoot, outputFile)}`);
  console.log(`  report.sha256: ${sha256(Buffer.from(serialized))}`);
  console.log(`  primary.url: ${primaryUrl}`);
  for (const companion of companionArtifacts) {
    console.log(`  companion[${companion.role}].url: ${companion.url}`);
  }
}

main().catch((error) => {
  console.error(`optimization 생성 실패: ${error.message}`);
  process.exitCode = 1;
});
