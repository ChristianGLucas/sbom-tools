import { detectFormat } from './detect';
import { parseCycloneDx } from './cyclonedx';
import { parseSpdxJson } from './spdx';
import { NormalizedSbomData, failedSbom } from './types';

// The shared auto-detecting parse entry point used by every node that accepts
// any SBOM format (as opposed to ParseCycloneDX/ParseSpdx, which are explicit
// about which format they expect). Detects once, then dispatches.
export function parseSbom(text: string, formatHint: string): NormalizedSbomData {
  const detection = detectFormat(text, formatHint);
  if (!detection.ok) return failedSbom(detection.error, detection);

  if (detection.format === 'cyclonedx') {
    return parseCycloneDx(text, 'cyclonedx-json');
  }
  if (detection.format === 'spdx' && detection.encoding === 'json') {
    return parseSpdxJson(text, 'spdx-json');
  }
  if (detection.format === 'spdx' && detection.encoding === 'tag-value') {
    return failedSbom('SPDX tag-value documents are detected but not parsed by this package — only spdx-json is supported', detection);
  }
  return failedSbom('could not detect a supported SBOM format (expected CycloneDX JSON or SPDX JSON)', detection);
}
