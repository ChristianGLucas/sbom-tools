import { isPlainObject } from './jsonSafe';
import { detectFormat } from './detect';

export interface ValidateOutcome {
  ok: boolean;
  error: string;
  valid: boolean;
  format: string;
  issues: string[];
}

function validateCycloneDx(doc: Record<string, unknown>): string[] {
  const issues: string[] = [];
  if (typeof doc.specVersion !== 'string' || !doc.specVersion) issues.push('missing required field: specVersion');

  const refs = new Set<string>();
  const components = Array.isArray(doc.components) ? doc.components : [];
  const collectRefs = (list: unknown[]) => {
    for (const raw of list) {
      if (!isPlainObject(raw)) continue;
      if (typeof raw.name !== 'string' || !raw.name) issues.push(`component missing required field: name (bom-ref="${String(raw['bom-ref'] ?? '')}")`);
      if (typeof raw.type !== 'string' || !raw.type) issues.push(`component missing required field: type (bom-ref="${String(raw['bom-ref'] ?? '')}")`);
      if (typeof raw['bom-ref'] === 'string' && raw['bom-ref']) refs.add(raw['bom-ref']);
      if (Array.isArray(raw.components)) collectRefs(raw.components);
    }
  };
  collectRefs(components);
  if (isPlainObject(doc.metadata) && isPlainObject(doc.metadata.component) && typeof doc.metadata.component['bom-ref'] === 'string') {
    refs.add(doc.metadata.component['bom-ref'] as string);
  }

  if (Array.isArray(doc.dependencies)) {
    for (const raw of doc.dependencies) {
      if (!isPlainObject(raw) || typeof raw.ref !== 'string') continue;
      if (!refs.has(raw.ref)) issues.push(`dependencies entry refers to unknown bom-ref: "${raw.ref}"`);
      if (Array.isArray(raw.dependsOn)) {
        for (const d of raw.dependsOn) {
          if (typeof d === 'string' && !refs.has(d)) issues.push(`dependencies entry "${raw.ref}" depends on unknown bom-ref: "${d}"`);
        }
      }
    }
  }
  return issues;
}

function validateSpdxJson(doc: Record<string, unknown>): string[] {
  const issues: string[] = [];
  if (typeof doc.dataLicense !== 'string' || !doc.dataLicense) issues.push('missing required field: dataLicense');
  if (typeof doc.SPDXID !== 'string' || !doc.SPDXID) issues.push('missing required field: SPDXID (document)');
  if (typeof doc.name !== 'string' || !doc.name) issues.push('missing required field: name (document)');

  const ids = new Set<string>();
  if (typeof doc.SPDXID === 'string') ids.add(doc.SPDXID);
  const packages = Array.isArray(doc.packages) ? doc.packages : [];
  for (const raw of packages) {
    if (!isPlainObject(raw)) continue;
    if (typeof raw.SPDXID !== 'string' || !raw.SPDXID) issues.push('package missing required field: SPDXID');
    else ids.add(raw.SPDXID);
    if (typeof raw.name !== 'string' || !raw.name) issues.push(`package missing required field: name (SPDXID="${String(raw.SPDXID ?? '')}")`);
  }

  if (Array.isArray(doc.relationships)) {
    for (const raw of doc.relationships) {
      if (!isPlainObject(raw)) continue;
      const a = raw.spdxElementId;
      const b = raw.relatedSpdxElement;
      if (typeof a === 'string' && a !== 'NOASSERTION' && !ids.has(a)) issues.push(`relationship refers to unknown SPDXID: "${a}"`);
      if (typeof b === 'string' && b !== 'NOASSERTION' && b !== 'NONE' && !ids.has(b)) issues.push(`relationship refers to unknown SPDXID: "${b}"`);
    }
  }
  return issues;
}

export function validateStructure(text: string, formatHint: string): ValidateOutcome {
  const detection = detectFormat(text, formatHint);
  if (!detection.ok) return { ok: false, error: detection.error, valid: false, format: 'unknown', issues: [] };

  if (detection.format === 'unknown') {
    return { ok: true, error: '', valid: false, format: 'unknown', issues: ['could not detect a supported SBOM format (expected CycloneDX JSON or SPDX JSON/tag-value)'] };
  }
  if (detection.format === 'spdx' && detection.encoding === 'tag-value') {
    return { ok: true, error: '', valid: false, format: 'spdx', issues: ['SPDX tag-value structural validation is not supported by this node — only cyclonedx-json and spdx-json'] };
  }
  const doc = detection.parsed;
  if (!isPlainObject(doc)) {
    return { ok: true, error: '', valid: false, format: detection.format, issues: ['document did not parse as a JSON object'] };
  }

  const issues = detection.format === 'cyclonedx' ? validateCycloneDx(doc) : validateSpdxJson(doc);
  return { ok: true, error: '', valid: issues.length === 0, format: detection.format, issues };
}
