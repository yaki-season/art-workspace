import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const pipelineDir = path.dirname(fileURLToPath(import.meta.url));
export const artWorkspaceRoot = path.resolve(pipelineDir, '..');
export const workspaceRoot = path.resolve(artWorkspaceRoot, '..');
const appPackage = path.join(workspaceRoot, 'app/package.json');
const requireFromApp = createRequire(appPackage);
const Ajv2020 = requireFromApp('ajv/dist/2020.js').default;

export const contract = JSON.parse(
  await readFile(path.join(pipelineDir, 'pipeline-contract.json'), 'utf8'),
);

function createAjv() {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  ajv.addFormat('date', {
    type: 'string',
    validate(value) {
      if (!/^\d{4}-\d{2}-\d{2}$/u.test(value)) return false;
      const parsed = new Date(`${value}T00:00:00Z`);
      return Number.isFinite(parsed.valueOf())
        && parsed.toISOString().slice(0, 10) === value;
    },
  });
  ajv.addFormat('date-time', {
    type: 'string',
    validate(value) {
      return Number.isFinite(new Date(value).valueOf())
        && /T/u.test(value);
    },
  });
  return ajv;
}

const validatorCache = new Map();

export async function schemaValidator(schemaName) {
  if (validatorCache.has(schemaName)) return validatorCache.get(schemaName);
  const schemaRelative = contract.schemaCatalog?.[schemaName];
  if (!schemaRelative) throw new Error(`알 수 없는 pipeline schema입니다: ${schemaName}`);
  const schema = JSON.parse(
    await readFile(path.join(pipelineDir, schemaRelative), 'utf8'),
  );
  const validator = createAjv().compile(schema);
  validatorCache.set(schemaName, validator);
  return validator;
}

export function schemaErrors(validator) {
  return (validator.errors ?? []).map(
    (error) => `${error.instancePath || '/'} ${error.message}`,
  );
}

export async function validateSchema(schemaName, document, label = schemaName) {
  const validate = await schemaValidator(schemaName);
  if (!validate(document)) {
    throw new Error(`${label} schema 오류:\n- ${schemaErrors(validate).join('\n- ')}`);
  }
}

export function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

export function isWithin(parent, candidate) {
  const relative = path.relative(parent, candidate);
  return relative === ''
    || (
      relative !== '..'
      && !relative.startsWith(`..${path.sep}`)
      && !path.isAbsolute(relative)
    );
}

export function resolveWithin(parent, base, relative, label) {
  if (typeof relative !== 'string' || relative.length === 0) {
    throw new Error(`${label} 경로가 비어 있습니다.`);
  }
  const resolved = path.resolve(base, relative);
  if (!isWithin(parent, resolved)) {
    throw new Error(`${label}이 허용 작업공간 밖을 가리킵니다: ${relative}`);
  }
  return resolved;
}

export async function readHashedJson({
  reference,
  baseDirectory,
  schemaName,
  label,
}) {
  const file = resolveWithin(
    workspaceRoot,
    baseDirectory,
    reference.file,
    label,
  );
  const buffer = await readFile(file);
  const digest = sha256(buffer);
  if (digest !== reference.sha256) {
    throw new Error(`${label} SHA-256 불일치: 기록 ${reference.sha256}, 실제 ${digest}`);
  }
  const document = JSON.parse(buffer.toString('utf8'));
  if (schemaName) await validateSchema(schemaName, document, label);
  return { file, buffer, document, sha256: digest };
}

export async function verifyWorkspaceEvidence(reference, label) {
  const file = resolveWithin(
    workspaceRoot,
    workspaceRoot,
    reference.file,
    label,
  );
  const buffer = await readFile(file);
  const digest = sha256(buffer);
  if (digest !== reference.sha256) {
    throw new Error(`${label} SHA-256 불일치: 기록 ${reference.sha256}, 실제 ${digest}`);
  }
  return { file, buffer, sha256: digest };
}
