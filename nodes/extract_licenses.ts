import { SbomDocument, ExtractLicensesResult, ComponentLicenses } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseSbom } from './lib/parse';

/**
 * Extract the resolved license set (identifiers/expressions) declared for
 * every component individually, plus whether any usable license information
 * was found for it at all.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractLicenses(ax: AxiomContext, input: SbomDocument): ExtractLicensesResult {
  const parsed = parseSbom(input.getText(), input.getFormatHint());
  const out = new ExtractLicensesResult();
  out.setOk(parsed.ok);
  out.setError(parsed.error);
  if (parsed.ok) {
    out.setEntriesList(
      parsed.components.map((c) => {
        const e = new ComponentLicenses();
        e.setRef(c.ref);
        e.setName(c.name);
        e.setLicensesList(c.licenses);
        e.setDeclared(c.licenseDeclared);
        return e;
      }),
    );
  }
  return out;
}
