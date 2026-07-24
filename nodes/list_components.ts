import { SbomDocument, ListComponentsResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseSbom } from './lib/parse';
import { componentToMsg } from './lib/mappers';

/**
 * List every component/package in the SBOM (name, version, type, PURL,
 * supplier, licenses), auto-detecting CycloneDX vs SPDX.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function listComponents(ax: AxiomContext, input: SbomDocument): ListComponentsResult {
  const parsed = parseSbom(input.getText(), input.getFormatHint());
  const out = new ListComponentsResult();
  out.setOk(parsed.ok);
  out.setError(parsed.error);
  if (parsed.ok) {
    out.setComponentsList(parsed.components.map(componentToMsg));
    out.setCount(parsed.components.length);
    out.setTruncated(parsed.truncated);
  }
  return out;
}
