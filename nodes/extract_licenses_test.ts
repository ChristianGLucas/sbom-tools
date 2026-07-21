import { SbomDocument } from '../gen/messages_pb';
import { extractLicenses } from './extract_licenses';
import { testContext } from './testdata/testContext';
import { CYCLONEDX_SAMPLE, SPDX_SAMPLE } from './testdata/fixtures';

describe('ExtractLicenses', () => {
  it('extracts per-component licenses from the CycloneDX sample, including the expression form', () => {
    const input = new SbomDocument();
    input.setText(CYCLONEDX_SAMPLE);
    const result = extractLicenses(testContext, input);
    expect(result.getOk()).toBe(true);
    const byName = new Map(result.getEntriesList().map((e) => [e.getName(), e]));
    expect(byName.get('left-pad')!.getLicensesList()).toEqual(['MIT']);
    expect(byName.get('lodash')!.getLicensesList()).toEqual(['MIT']); // from `expression`, not `license.id`
    expect(byName.get('lodash')!.getDeclared()).toBe(true);
    expect(byName.get('mystery-pkg')!.getLicensesList()).toEqual([]);
    expect(byName.get('mystery-pkg')!.getDeclared()).toBe(false);
  });

  it('dedupes SPDX licenseConcluded/licenseDeclared when they agree, and filters NOASSERTION', () => {
    const input = new SbomDocument();
    input.setText(SPDX_SAMPLE);
    const result = extractLicenses(testContext, input);
    expect(result.getOk()).toBe(true);
    const byName = new Map(result.getEntriesList().map((e) => [e.getName(), e]));
    expect(byName.get('requests')!.getLicensesList()).toEqual(['Apache-2.0']);
    expect(byName.get('flask')!.getLicensesList()).toEqual(['BSD-3-Clause']);
    expect(byName.get('my-app')!.getDeclared()).toBe(false);
  });
});
