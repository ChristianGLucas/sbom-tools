import { SbomDocument } from '../gen/messages_pb';
import { parseCycloneDX } from './parse_cyclone_dx';
import { testContext } from './testdata/testContext';
import { CYCLONEDX_SAMPLE, SPDX_SAMPLE, NOT_JSON_NOT_TAG_VALUE } from './testdata/fixtures';

describe('ParseCycloneDX', () => {
  it('parses a full CycloneDX document into the normalized structure (hand-derived oracle)', () => {
    const input = new SbomDocument();
    input.setText(CYCLONEDX_SAMPLE);
    const result = parseCycloneDX(testContext, input);

    expect(result.getOk()).toBe(true);
    expect(result.getFormat()!.getFormat()).toBe('cyclonedx');
    expect(result.getFormat()!.getSpecVersion()).toBe('1.5');

    // metadata.component (app-1) is not itself in `components` -> appended, so 5 total.
    const components = result.getComponentsList();
    expect(components).toHaveLength(5);
    const byRef = new Map(components.map((c) => [c.getRef(), c]));
    expect(byRef.get('pkg:npm/left-pad@1.3.0')!.getLicensesList()).toEqual(['MIT']);
    expect(byRef.get('pkg:npm/lodash@4.17.21')!.getLicensesList()).toEqual(['MIT']);
    expect(byRef.get('pkg:maven/org.apache.commons/commons-lang3@3.12.0')!.getLicensesList()).toEqual(['Apache-2.0']);
    expect(byRef.get('pkg:npm/mystery-pkg@0.0.1')!.getLicenseDeclared()).toBe(false);
    expect(byRef.get('app-1')!.getLicenseDeclared()).toBe(false);
    expect(byRef.get('pkg:npm/left-pad@1.3.0')!.getSupplier()).toBe('npm community');

    const metadata = result.getMetadata()!;
    expect(metadata.getToolName()).toBe('cyclonedx-cli');
    expect(metadata.getToolVersion()).toBe('0.25.0');
    expect(metadata.getTimestamp()).toBe('2024-01-15T10:00:00Z');
    expect(metadata.getPrimaryComponentRef()).toBe('app-1');
    expect(metadata.getPrimaryComponentName()).toBe('my-app');
    expect(metadata.getDocumentName()).toBe('urn:uuid:3e671687-395b-41f5-a30f-a58921a69b79');

    expect(result.getDependenciesList()).toHaveLength(3);
    const appEdge = result.getDependenciesList().find((d) => d.getRef() === 'app-1')!;
    expect(appEdge.getDependsOnList().slice().sort()).toEqual(['pkg:npm/left-pad@1.3.0', 'pkg:npm/lodash@4.17.21'].sort());

    expect(result.getVulnerabilitiesList()).toHaveLength(1);
    const vuln = result.getVulnerabilitiesList()[0];
    expect(vuln.getId()).toBe('CVE-2020-8203');
    expect(vuln.getSource()).toBe('NVD');
    expect(vuln.getRatingsList()[0].getScore()).toBeCloseTo(7.4);
    expect(vuln.getRatingsList()[0].getSeverity()).toBe('high');
    expect(vuln.getAffectsList()).toEqual(['pkg:npm/lodash@4.17.21']);

    expect(result.getTruncated()).toBe(false);
  });

  it('rejects an SPDX document with a structured error rather than silently misparsing it', () => {
    const input = new SbomDocument();
    input.setText(SPDX_SAMPLE);
    const result = parseCycloneDX(testContext, input);
    expect(result.getOk()).toBe(false);
    expect(result.getError().length).toBeGreaterThan(0);
    expect(result.getComponentsList()).toHaveLength(0);
  });

  it('rejects malformed input with a structured error, not a crash', () => {
    const input = new SbomDocument();
    input.setText(NOT_JSON_NOT_TAG_VALUE);
    const result = parseCycloneDX(testContext, input);
    expect(result.getOk()).toBe(false);
    expect(result.getError().length).toBeGreaterThan(0);
  });
});
