import { SbomDocument } from '../gen/messages_pb';
import { extractVulnerabilities } from './extract_vulnerabilities';
import { testContext } from './testdata/testContext';
import { CYCLONEDX_SAMPLE, SPDX_SAMPLE } from './testdata/fixtures';

describe('ExtractVulnerabilities', () => {
  it('extracts the declared CVE with its rating and affected component', () => {
    const input = new SbomDocument();
    input.setText(CYCLONEDX_SAMPLE);
    const result = extractVulnerabilities(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getCount()).toBe(1);
    const v = result.getVulnerabilitiesList()[0];
    expect(v.getId()).toBe('CVE-2020-8203');
    expect(v.getSource()).toBe('NVD');
    expect(v.getDescription()).toBe('Prototype pollution in lodash');
    expect(v.getRatingsList()).toHaveLength(1);
    expect(v.getRatingsList()[0].getMethod()).toBe('CVSSv3');
    expect(v.getRatingsList()[0].getVector()).toBe('AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H');
    expect(v.getAffectsList()).toEqual(['pkg:npm/lodash@4.17.21']);
  });

  it('is always empty for SPDX input — never fabricated', () => {
    const input = new SbomDocument();
    input.setText(SPDX_SAMPLE);
    const result = extractVulnerabilities(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getCount()).toBe(0);
    expect(result.getVulnerabilitiesList()).toHaveLength(0);
  });
});
