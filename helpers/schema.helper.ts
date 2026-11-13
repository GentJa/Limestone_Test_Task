import Ajv from 'ajv';
import addFormats from 'ajv-formats';

// Playwright has no JSON-schema matcher, so validation uses Ajv. One shared instance compiles each schema once.
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

/** Validates data against a JSON schema and returns readable errors (empty array when valid). */
export function schemaErrors(schema: object, data: unknown): string[] {
  const validate = ajv.getSchema((schema as { $id?: string }).$id ?? '') ?? ajv.compile(schema);
  return validate(data) ? [] : (validate.errors ?? []).map((e) => `${e.instancePath || '/'} ${e.message}`);
}
