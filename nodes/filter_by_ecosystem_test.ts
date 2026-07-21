import { FilterByEcosystemRequest } from '../gen/messages_pb';
import { filterByEcosystem } from './filter_by_ecosystem';
import { testContext } from './testdata/testContext';
import { CYCLONEDX_SAMPLE, SPDX_SAMPLE } from './testdata/fixtures';

describe('FilterByEcosystem', () => {
  it('filters the CycloneDX sample to its 3 npm components (case-insensitive)', () => {
    const input = new FilterByEcosystemRequest();
    input.setText(CYCLONEDX_SAMPLE);
    input.setEcosystem('NPM');
    const result = filterByEcosystem(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getCount()).toBe(3);
    expect(result.getComponentsList().map((c) => c.getName()).sort()).toEqual(['left-pad', 'lodash', 'mystery-pkg']);
  });

  it('filters the CycloneDX sample to its 1 maven component', () => {
    const input = new FilterByEcosystemRequest();
    input.setText(CYCLONEDX_SAMPLE);
    input.setEcosystem('maven');
    const result = filterByEcosystem(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getCount()).toBe(1);
    expect(result.getComponentsList()[0].getName()).toBe('commons-lang3');
  });

  it('filters the SPDX sample to its 2 pypi components, excluding the no-PURL primary component', () => {
    const input = new FilterByEcosystemRequest();
    input.setText(SPDX_SAMPLE);
    input.setEcosystem('pypi');
    const result = filterByEcosystem(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getCount()).toBe(2);
    expect(result.getComponentsList().map((c) => c.getName()).sort()).toEqual(['flask', 'requests']);
  });

  it('returns zero matches for an ecosystem not present in the document', () => {
    const input = new FilterByEcosystemRequest();
    input.setText(CYCLONEDX_SAMPLE);
    input.setEcosystem('cargo');
    const result = filterByEcosystem(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getCount()).toBe(0);
  });
});
