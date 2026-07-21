import { SbomDocument, ListDistinctLicensesResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseSbom } from './lib/parse';

/**
 * The license-audit node: every distinct license identifier/expression used
 * anywhere in the SBOM, deduplicated and sorted — the fastest way to answer
 * "what licenses does this dependency tree actually contain".
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function listDistinctLicenses(ax: AxiomContext, input: SbomDocument): ListDistinctLicensesResult {
  const parsed = parseSbom(input.getText(), input.getFormatHint());
  const out = new ListDistinctLicensesResult();
  out.setOk(parsed.ok);
  out.setError(parsed.error);
  if (parsed.ok) {
    const distinct = new Set<string>();
    for (const c of parsed.components) {
      for (const l of c.licenses) distinct.add(l);
    }
    const sorted = Array.from(distinct).sort();
    out.setLicensesList(sorted);
    out.setCount(sorted.length);
  }
  return out;
}
