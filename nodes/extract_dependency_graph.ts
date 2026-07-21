import { SbomDocument, ExtractDependencyGraphResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseSbom } from './lib/parse';
import { dependencyToMsg } from './lib/mappers';

/**
 * Extract the dependency graph as ref -> depends_on edges, from CycloneDX's
 * `dependencies` array or SPDX's DEPENDS_ON/DEPENDENCY_OF relationships (the
 * latter's direction is normalized to match CycloneDX's "depends on" sense).
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractDependencyGraph(ax: AxiomContext, input: SbomDocument): ExtractDependencyGraphResult {
  const parsed = parseSbom(input.getText(), input.getFormatHint());
  const out = new ExtractDependencyGraphResult();
  out.setOk(parsed.ok);
  out.setError(parsed.error);
  if (parsed.ok) {
    out.setEdgesList(parsed.dependencies.map(dependencyToMsg));
  }
  return out;
}
