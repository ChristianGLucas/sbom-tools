import { SbomDocument, FindMissingLicensesResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseSbom } from './lib/parse';
import { componentToMsg } from './lib/mappers';

/**
 * Flag every component with no usable license declared (absent, NOASSERTION,
 * or NONE) — the compliance-gap node. Returns the flagged components plus the
 * total component count for context.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function findMissingLicenses(ax: AxiomContext, input: SbomDocument): FindMissingLicensesResult {
  const parsed = parseSbom(input.getText(), input.getFormatHint());
  const out = new FindMissingLicensesResult();
  out.setOk(parsed.ok);
  out.setError(parsed.error);
  if (parsed.ok) {
    const missing = parsed.components.filter((c) => !c.licenseDeclared);
    out.setComponentsList(missing.map(componentToMsg));
    out.setCount(missing.length);
    out.setTotalComponents(parsed.components.length);
  }
  return out;
}
