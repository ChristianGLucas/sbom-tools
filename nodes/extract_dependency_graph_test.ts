import { SbomDocument } from '../gen/messages_pb';
import { extractDependencyGraph } from './extract_dependency_graph';
import { testContext } from './testdata/testContext';
import { CYCLONEDX_SAMPLE, SPDX_SAMPLE } from './testdata/fixtures';

describe('ExtractDependencyGraph', () => {
  it('extracts the CycloneDX dependencies array as ref -> depends_on edges', () => {
    const input = new SbomDocument();
    input.setText(CYCLONEDX_SAMPLE);
    const result = extractDependencyGraph(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getEdgesList()).toHaveLength(3);
    const byRef = new Map(result.getEdgesList().map((e) => [e.getRef(), e]));
    expect(byRef.get('app-1')!.getDependsOnList().slice().sort()).toEqual(
      ['pkg:npm/left-pad@1.3.0', 'pkg:npm/lodash@4.17.21'].sort(),
    );
    expect(byRef.get('pkg:npm/lodash@4.17.21')!.getDependsOnList()).toEqual(['pkg:npm/mystery-pkg@0.0.1']);
  });

  it('derives edges from SPDX DEPENDS_ON relationships, ignoring DESCRIBES', () => {
    const input = new SbomDocument();
    input.setText(SPDX_SAMPLE);
    const result = extractDependencyGraph(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getEdgesList()).toHaveLength(1);
    const edge = result.getEdgesList()[0];
    expect(edge.getRef()).toBe('SPDXRef-Package-app');
    expect(edge.getDependsOnList().slice().sort()).toEqual(['SPDXRef-Package-flask', 'SPDXRef-Package-requests']);
  });
});
