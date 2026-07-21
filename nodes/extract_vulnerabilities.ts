import { SbomDocument, ExtractVulnerabilitiesResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseSbom } from './lib/parse';
import { vulnerabilityToMsg } from './lib/mappers';

/**
 * Extract declared vulnerabilities from a CycloneDX SBOM's VEX data: id,
 * source, CVSS-style ratings, affected component refs, and description.
 * Always empty for SPDX input (SPDX 2.x has no vulnerability field) — never
 * fabricated.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractVulnerabilities(ax: AxiomContext, input: SbomDocument): ExtractVulnerabilitiesResult {
  const parsed = parseSbom(input.getText(), input.getFormatHint());
  const out = new ExtractVulnerabilitiesResult();
  out.setOk(parsed.ok);
  out.setError(parsed.error);
  if (parsed.ok) {
    out.setVulnerabilitiesList(parsed.vulnerabilities.map(vulnerabilityToMsg));
    out.setCount(parsed.vulnerabilities.length);
  }
  return out;
}
