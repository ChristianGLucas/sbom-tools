import { SbomDocument, NormalizedSbom } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseCycloneDx } from './lib/cyclonedx';
import { normalizedSbomToMsg } from './lib/mappers';

/**
 * Parse a CycloneDX JSON SBOM into a normalized structure: metadata (tool,
 * timestamp as declared, primary component), the full component list
 * (including nested sub-components, flattened), the dependency graph, and any
 * declared vulnerabilities (VEX). Rejects non-CycloneDX or malformed input
 * with a structured error rather than guessing.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function parseCycloneDX(ax: AxiomContext, input: SbomDocument): NormalizedSbom {
  const result = parseCycloneDx(input.getText(), input.getFormatHint());
  return normalizedSbomToMsg(result);
}
