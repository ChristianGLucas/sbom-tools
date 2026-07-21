import { FilterByEcosystemRequest, ListComponentsResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseSbom } from './lib/parse';
import { ecosystemFromPurl } from './lib/purl';
import { componentToMsg } from './lib/mappers';

/**
 * Extract every component belonging to one ecosystem, matched against the
 * PURL type segment (e.g. "npm", "maven", "golang", "pypi", "cargo")
 * case-insensitively. A component with no PURL never matches any ecosystem
 * filter.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function filterByEcosystem(ax: AxiomContext, input: FilterByEcosystemRequest): ListComponentsResult {
  const parsed = parseSbom(input.getText(), input.getFormatHint());
  const out = new ListComponentsResult();
  out.setOk(parsed.ok);
  out.setError(parsed.error);
  if (!parsed.ok) return out;

  const wanted = (input.getEcosystem() || '').trim().toLowerCase();
  const matched = wanted ? parsed.components.filter((c) => ecosystemFromPurl(c.purl) === wanted) : [];
  out.setComponentsList(matched.map(componentToMsg));
  out.setCount(matched.length);
  out.setTruncated(parsed.truncated);
  return out;
}
