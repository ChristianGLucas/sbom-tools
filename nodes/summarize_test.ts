import { SbomDocument } from '../gen/messages_pb';
import { summarize } from './summarize';
import { testContext } from './testdata/testContext';
import { CYCLONEDX_SAMPLE, SPDX_SAMPLE } from './testdata/fixtures';

describe('Summarize', () => {
  it('summarizes the CycloneDX sample by type, license, and ecosystem (hand-derived oracle)', () => {
    const input = new SbomDocument();
    input.setText(CYCLONEDX_SAMPLE);
    const result = summarize(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getComponentCount()).toBe(5);

    const byType = new Map(result.getByTypeList().map((e) => [e.getKey(), e.getCount()]));
    expect(byType.get('library')).toBe(4);
    expect(byType.get('application')).toBe(1);

    const byLicense = new Map(result.getByLicenseList().map((e) => [e.getKey(), e.getCount()]));
    expect(byLicense.get('MIT')).toBe(2);
    expect(byLicense.get('Apache-2.0')).toBe(1);

    const byEcosystem = new Map(result.getByEcosystemList().map((e) => [e.getKey(), e.getCount()]));
    expect(byEcosystem.get('npm')).toBe(3);
    expect(byEcosystem.get('maven')).toBe(1);

    expect(result.getVulnerabilityCount()).toBe(1);
    expect(result.getDependencyEdgeCount()).toBe(3);
  });

  it('summarizes the SPDX sample (components with no type contribute nothing to by_type)', () => {
    const input = new SbomDocument();
    input.setText(SPDX_SAMPLE);
    const result = summarize(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getComponentCount()).toBe(3);
    expect(result.getByTypeList()).toHaveLength(0);

    const byLicense = new Map(result.getByLicenseList().map((e) => [e.getKey(), e.getCount()]));
    expect(byLicense.get('Apache-2.0')).toBe(1);
    expect(byLicense.get('BSD-3-Clause')).toBe(1);

    const byEcosystem = new Map(result.getByEcosystemList().map((e) => [e.getKey(), e.getCount()]));
    expect(byEcosystem.get('pypi')).toBe(2);

    expect(result.getVulnerabilityCount()).toBe(0);
    expect(result.getDependencyEdgeCount()).toBe(1);
  });
});
