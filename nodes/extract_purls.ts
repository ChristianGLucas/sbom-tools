import { SbomDocument, ExtractPurlsResult, ComponentPurl } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseSbom } from './lib/parse';

/**
 * Extract every component's Package URL (PURL) — the key cross-ecosystem
 * identifier for supply-chain correlation. Components with no PURL declared
 * come back with has_purl=false and an empty purl rather than being silently
 * dropped.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractPurls(ax: AxiomContext, input: SbomDocument): ExtractPurlsResult {
  const parsed = parseSbom(input.getText(), input.getFormatHint());
  const out = new ExtractPurlsResult();
  out.setOk(parsed.ok);
  out.setError(parsed.error);
  if (parsed.ok) {
    out.setPurlsList(
      parsed.components.map((c) => {
        const p = new ComponentPurl();
        p.setRef(c.ref);
        p.setName(c.name);
        p.setPurl(c.purl);
        p.setHasPurl(c.purl.length > 0);
        return p;
      }),
    );
    out.setCount(parsed.components.length);
  }
  return out;
}
