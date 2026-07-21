import { isPlainObject } from './jsonSafe';
import { detectFormat } from './detect';
import { NComponent, NDependencyEdge, NVulnerability, NVulnerabilityRating, NMetadata, NormalizedSbomData, emptyMetadata, failedSbom } from './types';
import { MAX_COMPONENTS } from './limits';

function str(v: unknown): string {
  return typeof v === 'string' ? v : '';
}
function num(v: unknown): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : 0;
}

function licensesFromEntry(entry: unknown): string[] {
  if (!isPlainObject(entry)) return [];
  const out: string[] = [];
  if (isPlainObject(entry.license)) {
    const lic = entry.license;
    if (typeof lic.id === 'string' && lic.id) out.push(lic.id);
    else if (typeof lic.name === 'string' && lic.name) out.push(lic.name);
  }
  if (typeof entry.expression === 'string' && entry.expression) out.push(entry.expression);
  return out;
}

function extractLicenses(component: Record<string, unknown>): string[] {
  const licensesField = component.licenses;
  if (!Array.isArray(licensesField)) return [];
  const out: string[] = [];
  for (const entry of licensesField) {
    out.push(...licensesFromEntry(entry));
  }
  return out;
}

function toComponent(raw: unknown): NComponent | undefined {
  if (!isPlainObject(raw)) return undefined;
  const licenses = extractLicenses(raw);
  let supplier = '';
  if (isPlainObject(raw.supplier) && typeof raw.supplier.name === 'string') {
    supplier = raw.supplier.name;
  } else if (typeof raw.author === 'string') {
    supplier = raw.author;
  }
  return {
    ref: str(raw['bom-ref']),
    name: str(raw.name),
    version: str(raw.version),
    type: str(raw.type),
    purl: str(raw.purl),
    supplier,
    licenses,
    licenseDeclared: licenses.length > 0,
    copyright: str(raw.copyright),
    description: str(raw.description),
  };
}

// CycloneDX components can nest sub-components recursively (bill-of-materials
// trees). Flatten with a depth cap so a pathologically deep/wide document can't
// blow the stack or the output size.
function flattenComponents(list: unknown, depth: number, out: NComponent[], seenRefs: Set<string>): void {
  if (!Array.isArray(list) || depth > 50 || out.length >= MAX_COMPONENTS) return;
  for (const raw of list) {
    if (out.length >= MAX_COMPONENTS) return;
    const c = toComponent(raw);
    if (c) {
      if (!(c.ref && seenRefs.has(c.ref))) {
        if (c.ref) seenRefs.add(c.ref);
        out.push(c);
      }
    }
    if (isPlainObject(raw) && Array.isArray(raw.components)) {
      flattenComponents(raw.components, depth + 1, out, seenRefs);
    }
  }
}

function extractMetadata(doc: Record<string, unknown>, components: NComponent[]): NMetadata {
  const md = emptyMetadata();
  md.documentName = str(doc.serialNumber);
  const meta = doc.metadata;
  if (!isPlainObject(meta)) return md;
  md.timestamp = str(meta.timestamp);

  const tools = meta.tools;
  if (Array.isArray(tools) && tools.length > 0 && isPlainObject(tools[0])) {
    // CycloneDX <=1.4 shape: metadata.tools is a plain array of {vendor,name,version}.
    md.toolName = str(tools[0].name);
    md.toolVersion = str(tools[0].version);
  } else if (isPlainObject(tools) && Array.isArray(tools.components) && tools.components.length > 0) {
    // CycloneDX >=1.5 shape: metadata.tools = { components: [...], services: [...] }.
    const t = tools.components[0];
    if (isPlainObject(t)) {
      md.toolName = str(t.name);
      md.toolVersion = str(t.version);
    }
  }

  if (isPlainObject(meta.component)) {
    md.primaryComponentRef = str(meta.component['bom-ref']);
    md.primaryComponentName = str(meta.component.name);
    // Ensure the primary component itself is present in the component list.
    if (md.primaryComponentRef && !components.some((c) => c.ref === md.primaryComponentRef)) {
      const primary = toComponent(meta.component);
      if (primary && components.length < MAX_COMPONENTS) components.push(primary);
    }
  }
  return md;
}

function extractDependencies(doc: Record<string, unknown>): NDependencyEdge[] {
  if (!Array.isArray(doc.dependencies)) return [];
  const out: NDependencyEdge[] = [];
  for (const raw of doc.dependencies) {
    if (!isPlainObject(raw)) continue;
    const ref = str(raw.ref);
    if (!ref) continue;
    const dependsOn = Array.isArray(raw.dependsOn) ? raw.dependsOn.filter((x): x is string => typeof x === 'string') : [];
    out.push({ ref, dependsOn });
  }
  return out;
}

function extractVulnerabilities(doc: Record<string, unknown>): NVulnerability[] {
  if (!Array.isArray(doc.vulnerabilities)) return [];
  const out: NVulnerability[] = [];
  for (const raw of doc.vulnerabilities) {
    if (!isPlainObject(raw)) continue;
    const ratings: NVulnerabilityRating[] = [];
    if (Array.isArray(raw.ratings)) {
      for (const r of raw.ratings) {
        if (!isPlainObject(r)) continue;
        ratings.push({
          source: isPlainObject(r.source) ? str(r.source.name) : '',
          severity: str(r.severity),
          score: num(r.score),
          method: str(r.method),
          vector: str(r.vector),
        });
      }
    }
    const affects: string[] = [];
    if (Array.isArray(raw.affects)) {
      for (const a of raw.affects) {
        if (isPlainObject(a) && typeof a.ref === 'string') affects.push(a.ref);
      }
    }
    out.push({
      id: str(raw.id),
      source: isPlainObject(raw.source) ? str(raw.source.name) : '',
      ratings,
      affects,
      description: str(raw.description),
    });
  }
  return out;
}

export function parseCycloneDx(text: string, formatHint: string): NormalizedSbomData {
  const detection = detectFormat(text, formatHint || 'cyclonedx-json');
  if (!detection.ok) return failedSbom(detection.error, detection);
  if (detection.format !== 'cyclonedx') {
    return failedSbom(`document is not CycloneDX (detected: ${detection.format})`, detection);
  }
  const doc = detection.parsed;
  if (!isPlainObject(doc)) return failedSbom('CycloneDX document did not parse as an object', detection);

  const components: NComponent[] = [];
  const seenRefs = new Set<string>();
  flattenComponents(doc.components, 0, components, seenRefs);
  const truncatedComponents = Array.isArray(doc.components) && components.length >= MAX_COMPONENTS;

  const metadata = extractMetadata(doc, components);
  const dependencies = extractDependencies(doc);
  const vulnerabilities = extractVulnerabilities(doc);

  return {
    ok: true,
    error: '',
    format: { ok: true, error: '', format: detection.format, encoding: detection.encoding, specVersion: detection.specVersion, detected: true },
    metadata,
    components,
    dependencies,
    vulnerabilities,
    truncated: truncatedComponents,
  };
}
