import { SbomDocument, SummarizeResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseSbom } from './lib/parse';
import { ecosystemFromPurl } from './lib/purl';
import { countEntry } from './lib/mappers';

function tally(counts: Map<string, number>, key: string): void {
  if (!key) return;
  counts.set(key, (counts.get(key) ?? 0) + 1);
}

function toSortedEntries(counts: Map<string, number>) {
  return Array.from(counts.entries())
    .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))
    .map(([key, count]) => countEntry(key, count));
}

/**
 * Count and summarize an SBOM: total component count, breakdowns by component
 * type, by license, and by ecosystem (PURL type), plus vulnerability and
 * dependency-edge counts. The fast single-call overview node.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function summarize(ax: AxiomContext, input: SbomDocument): SummarizeResult {
  const parsed = parseSbom(input.getText(), input.getFormatHint());
  const out = new SummarizeResult();
  out.setOk(parsed.ok);
  out.setError(parsed.error);
  if (!parsed.ok) return out;

  const byType = new Map<string, number>();
  const byLicense = new Map<string, number>();
  const byEcosystem = new Map<string, number>();
  for (const c of parsed.components) {
    tally(byType, c.type);
    for (const l of c.licenses) tally(byLicense, l);
    tally(byEcosystem, ecosystemFromPurl(c.purl));
  }

  out.setComponentCount(parsed.components.length);
  out.setByTypeList(toSortedEntries(byType));
  out.setByLicenseList(toSortedEntries(byLicense));
  out.setByEcosystemList(toSortedEntries(byEcosystem));
  out.setVulnerabilityCount(parsed.vulnerabilities.length);
  out.setDependencyEdgeCount(parsed.dependencies.length);
  return out;
}
