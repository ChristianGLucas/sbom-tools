// Plain-object normalized SBOM shapes, shared by the CycloneDX and SPDX parsers
// and by every node that needs a parsed document. Kept deliberately parallel to
// the proto messages in messages.proto — the mapper functions in mappers.ts do
// the plain-object -> protobuf translation at the node boundary.

export interface NComponent {
  ref: string;
  name: string;
  version: string;
  type: string;
  purl: string;
  supplier: string;
  licenses: string[];
  licenseDeclared: boolean;
  copyright: string;
  description: string;
}

export interface NDependencyEdge {
  ref: string;
  dependsOn: string[];
}

export interface NVulnerabilityRating {
  source: string;
  severity: string;
  score: number;
  method: string;
  vector: string;
}

export interface NVulnerability {
  id: string;
  source: string;
  ratings: NVulnerabilityRating[];
  affects: string[];
  description: string;
}

export interface NMetadata {
  toolName: string;
  toolVersion: string;
  timestamp: string;
  primaryComponentRef: string;
  primaryComponentName: string;
  documentName: string;
  namespace: string;
}

export interface NFormat {
  ok: boolean;
  error: string;
  format: string; // "cyclonedx" | "spdx" | "unknown"
  encoding: string; // "json" | "tag-value" | "unknown"
  specVersion: string;
  detected: boolean;
}

export interface NormalizedSbomData {
  ok: boolean;
  error: string;
  format: NFormat;
  metadata: NMetadata;
  components: NComponent[];
  dependencies: NDependencyEdge[];
  vulnerabilities: NVulnerability[];
  truncated: boolean;
}

export function emptyMetadata(): NMetadata {
  return {
    toolName: '',
    toolVersion: '',
    timestamp: '',
    primaryComponentRef: '',
    primaryComponentName: '',
    documentName: '',
    namespace: '',
  };
}

export function failedFormat(error: string): NFormat {
  return { ok: false, error, format: 'unknown', encoding: 'unknown', specVersion: '', detected: false };
}

export function failedSbom(error: string, format?: NFormat): NormalizedSbomData {
  return {
    ok: false,
    error,
    format: format ?? failedFormat(error),
    metadata: emptyMetadata(),
    components: [],
    dependencies: [],
    vulnerabilities: [],
    truncated: false,
  };
}
