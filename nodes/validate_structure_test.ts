import { SbomDocument } from '../gen/messages_pb';
import { validateStructure } from './validate_structure';
import { testContext } from './testdata/testContext';
import { CYCLONEDX_SAMPLE, SPDX_SAMPLE, SPDX_TAG_VALUE_SAMPLE, NOT_JSON_NOT_TAG_VALUE } from './testdata/fixtures';

describe('ValidateStructure', () => {
  it('validates the well-formed CycloneDX sample with no issues', () => {
    const input = new SbomDocument();
    input.setText(CYCLONEDX_SAMPLE);
    const result = validateStructure(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getFormat()).toBe('cyclonedx');
    expect(result.getValid()).toBe(true);
    expect(result.getIssuesList()).toEqual([]);
  });

  it('validates the well-formed SPDX sample with no issues', () => {
    const input = new SbomDocument();
    input.setText(SPDX_SAMPLE);
    const result = validateStructure(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getFormat()).toBe('spdx');
    expect(result.getValid()).toBe(true);
    expect(result.getIssuesList()).toEqual([]);
  });

  it('flags a CycloneDX dependency edge that references an unknown bom-ref', () => {
    const broken = JSON.stringify({
      bomFormat: 'CycloneDX',
      specVersion: '1.5',
      components: [{ 'bom-ref': 'a', type: 'library', name: 'a' }],
      dependencies: [{ ref: 'a', dependsOn: ['does-not-exist'] }],
    });
    const input = new SbomDocument();
    input.setText(broken);
    const result = validateStructure(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getValid()).toBe(false);
    expect(result.getIssuesList().some((i) => i.includes('does-not-exist'))).toBe(true);
  });

  it('flags an SPDX package missing its required name field', () => {
    const broken = JSON.stringify({
      spdxVersion: 'SPDX-2.3',
      dataLicense: 'CC0-1.0',
      SPDXID: 'SPDXRef-DOCUMENT',
      name: 'doc',
      packages: [{ SPDXID: 'SPDXRef-Package-x' }],
    });
    const input = new SbomDocument();
    input.setText(broken);
    const result = validateStructure(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getValid()).toBe(false);
    expect(result.getIssuesList().some((i) => i.includes('name'))).toBe(true);
  });

  it('reports unsupported (not invalid) for SPDX tag-value, since structural validation only covers JSON', () => {
    const input = new SbomDocument();
    input.setText(SPDX_TAG_VALUE_SAMPLE);
    const result = validateStructure(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getFormat()).toBe('spdx');
    expect(result.getValid()).toBe(false);
    expect(result.getIssuesList()[0]).toMatch(/tag-value/);
  });

  it('reports valid=false for a document matching no supported format', () => {
    const input = new SbomDocument();
    input.setText(NOT_JSON_NOT_TAG_VALUE);
    const result = validateStructure(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getValid()).toBe(false);
    expect(result.getFormat()).toBe('unknown');
  });
});
