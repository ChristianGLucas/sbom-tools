import { isPlainObject } from './jsonSafe';
import { detectFormat } from './detect';
import { NComponent, NDependencyEdge, NMetadata, NormalizedSbomData, emptyMetadata, failedSbom } from './types';

function str(v: unknown): string {
  return typeof v === 'string' ? v : '';
}

const UNSET_LICENSE = new Set(['', 'NOASSERTION', 'NONE']);

function normalizeSupplierOrLicense(v: string): string {
  return UNSET_LICENSE.has(v) ? '' : v;
}

function purlFromExternalRefs(pkg: Record<string, unknown>): string {
  if (!Array.isArray(pkg.externalRefs)) return '';
  for (const ref of pkg.externalRefs) {
    if (isPlainObject(ref) && ref.referenceType === 'purl' && typeof ref.referenceLocator === 'string') {
      return ref.referenceLocator;
    }
  }
  return '';
}

function toComponent(raw: unknown): NComponent | undefined {
  if (!isPlainObject(raw)) return undefined;
  const licenseConcluded = normalizeSupplierOrLicense(str(raw.licenseConcluded));
  const licenseDeclared = normalizeSupplierOrLicense(str(raw.licenseDeclared));
  const licenses = Array.from(new Set([licenseConcluded, licenseDeclared].filter((l) => l !== '')));
  return {
    ref: str(raw.SPDXID),
    name: str(raw.name),
    version: str(raw.versionInfo),
    type: '',
    purl: purlFromExternalRefs(raw),
    supplier: normalizeSupplierOrLicense(str(raw.supplier)),
    licenses,
    licenseDeclared: licenses.length > 0,
    copyright: normalizeSupplierOrLicense(str(raw.copyrightText)),
    description: str(raw.description) || str(raw.summary),
  };
}

function extractMetadata(doc: Record<string, unknown>, componentsByRef: Map<string, NComponent>): NMetadata {
  const md = emptyMetadata();
  md.documentName = str(doc.name);
  md.namespace = str(doc.documentNamespace);
  const ci = doc.creationInfo;
  if (isPlainObject(ci)) {
    md.timestamp = str(ci.created);
    if (Array.isArray(ci.creators)) {
      const toolLine = ci.creators.find((c) => typeof c === 'string' && c.startsWith('Tool:'));
      if (typeof toolLine === 'string') {
        const rest = toolLine.slice('Tool:'.length).trim();
        const at = rest.lastIndexOf('-');
        if (at > 0) {
          md.toolName = rest.slice(0, at).trim();
          md.toolVersion = rest.slice(at + 1).trim();
        } else {
          md.toolName = rest;
        }
      }
    }
  }
  if (Array.isArray(doc.documentDescribes) && doc.documentDescribes.length > 0) {
    const ref = doc.documentDescribes[0];
    if (typeof ref === 'string') {
      md.primaryComponentRef = ref;
      md.primaryComponentName = componentsByRef.get(ref)?.name ?? '';
    }
  }
  return md;
}

function extractDependencies(doc: Record<string, unknown>): NDependencyEdge[] {
  if (!Array.isArray(doc.relationships)) return [];
  const edges = new Map<string, Set<string>>();
  const addEdge = (from: string, to: string) => {
    if (!from || !to) return;
    if (!edges.has(from)) edges.set(from, new Set());
    edges.get(from)!.add(to);
  };
  for (const raw of doc.relationships) {
    if (!isPlainObject(raw)) continue;
    const a = str(raw.spdxElementId);
    const b = str(raw.relatedSpdxElement);
    const type = str(raw.relationshipType);
    if (type === 'DEPENDS_ON') {
      addEdge(a, b);
    } else if (type === 'DEPENDENCY_OF') {
      // "a DEPENDENCY_OF b" reads as: a is a dependency of b, i.e. b depends on a.
      addEdge(b, a);
    }
  }
  return Array.from(edges.entries()).map(([ref, dependsOn]) => ({ ref, dependsOn: Array.from(dependsOn) }));
}

export function parseSpdxJson(text: string, formatHint: string): NormalizedSbomData {
  const detection = detectFormat(text, formatHint || 'spdx-json');
  if (!detection.ok) return failedSbom(detection.error, detection);
  if (detection.format !== 'spdx') {
    return failedSbom(`document is not SPDX (detected: ${detection.format})`, detection);
  }
  if (detection.encoding !== 'json') {
    return failedSbom(`SPDX ${detection.encoding} is not supported by ParseSpdx — only spdx-json (use DetectFormat first)`, detection);
  }
  const doc = detection.parsed;
  if (!isPlainObject(doc)) return failedSbom('SPDX document did not parse as an object', detection);

  const packages = Array.isArray(doc.packages) ? doc.packages : [];
  const components: NComponent[] = [];
  const componentsByRef = new Map<string, NComponent>();
  for (const raw of packages) {
    const c = toComponent(raw);
    if (c) {
      components.push(c);
      if (c.ref) componentsByRef.set(c.ref, c);
    }
  }

  const metadata = extractMetadata(doc, componentsByRef);
  const dependencies = extractDependencies(doc);

  return {
    ok: true,
    error: '',
    format: { ok: true, error: '', format: detection.format, encoding: detection.encoding, specVersion: detection.specVersion, detected: true },
    metadata,
    components,
    dependencies,
    // SPDX 2.x has no standard vulnerability field — always empty, never fabricated.
    vulnerabilities: [],
    truncated: false,
  };
}
