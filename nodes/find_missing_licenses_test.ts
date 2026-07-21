import { SbomDocument } from '../gen/messages_pb';
import { findMissingLicenses } from './find_missing_licenses';
import { testContext } from './testdata/testContext';
import { CYCLONEDX_SAMPLE, SPDX_SAMPLE } from './testdata/fixtures';

describe('FindMissingLicenses', () => {
  it('flags mystery-pkg and the primary app component as missing a license (CycloneDX)', () => {
    const input = new SbomDocument();
    input.setText(CYCLONEDX_SAMPLE);
    const result = findMissingLicenses(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getTotalComponents()).toBe(5);
    expect(result.getCount()).toBe(2);
    expect(result.getComponentsList().map((c) => c.getName()).sort()).toEqual(['my-app', 'mystery-pkg']);
  });

  it('flags only the NOASSERTION package as missing a license (SPDX)', () => {
    const input = new SbomDocument();
    input.setText(SPDX_SAMPLE);
    const result = findMissingLicenses(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getTotalComponents()).toBe(3);
    expect(result.getCount()).toBe(1);
    expect(result.getComponentsList()[0].getName()).toBe('my-app');
  });
});
