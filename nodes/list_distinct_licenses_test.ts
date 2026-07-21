import { SbomDocument } from '../gen/messages_pb';
import { listDistinctLicenses } from './list_distinct_licenses';
import { testContext } from './testdata/testContext';
import { CYCLONEDX_SAMPLE, SPDX_SAMPLE } from './testdata/fixtures';

describe('ListDistinctLicenses', () => {
  it('returns the deduped, sorted distinct license set for CycloneDX (MIT twice -> once)', () => {
    const input = new SbomDocument();
    input.setText(CYCLONEDX_SAMPLE);
    const result = listDistinctLicenses(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getLicensesList()).toEqual(['Apache-2.0', 'MIT']);
    expect(result.getCount()).toBe(2);
  });

  it('returns the deduped, sorted distinct license set for SPDX', () => {
    const input = new SbomDocument();
    input.setText(SPDX_SAMPLE);
    const result = listDistinctLicenses(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getLicensesList()).toEqual(['Apache-2.0', 'BSD-3-Clause']);
    expect(result.getCount()).toBe(2);
  });
});
