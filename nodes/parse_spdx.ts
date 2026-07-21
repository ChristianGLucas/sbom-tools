import { SbomDocument, NormalizedSbom } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseSpdxJson } from './lib/spdx';
import { normalizedSbomToMsg } from './lib/mappers';

/**
 * Parse an SPDX JSON SBOM into the same normalized structure as ParseCycloneDX:
 * metadata (creator tool, created timestamp as declared, document
 * name/namespace, primary/described package), packages as components (with
 * PURL pulled from externalRefs), and the dependency graph derived from
 * DEPENDS_ON/DEPENDENCY_OF relationships. SPDX 2.x carries no vulnerability
 * data, so vulnerabilities is always empty. SPDX tag-value input returns a
 * structured error naming the unsupported encoding (use DetectFormat first to
 * check encoding).
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function parseSpdx(ax: AxiomContext, input: SbomDocument): NormalizedSbom {
  const result = parseSpdxJson(input.getText(), input.getFormatHint());
  return normalizedSbomToMsg(result);
}
