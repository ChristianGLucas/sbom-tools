import { SbomDocument } from '../gen/messages_pb';
import { listComponents } from './list_components';
import { testContext } from './testdata/testContext';
import { CYCLONEDX_SAMPLE, SPDX_SAMPLE, NOT_JSON_NOT_TAG_VALUE } from './testdata/fixtures';

describe('ListComponents', () => {
  it('lists all 5 components from the CycloneDX sample (auto-detected)', () => {
    const input = new SbomDocument();
    input.setText(CYCLONEDX_SAMPLE);
    const result = listComponents(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getCount()).toBe(5);
    expect(result.getComponentsList()).toHaveLength(5);
    expect(result.getTruncated()).toBe(false);
    expect(result.getComponentsList().map((c) => c.getName()).sort()).toEqual(
      ['commons-lang3', 'left-pad', 'lodash', 'my-app', 'mystery-pkg'].sort(),
    );
  });

  it('lists all 3 components from the SPDX sample (auto-detected)', () => {
    const input = new SbomDocument();
    input.setText(SPDX_SAMPLE);
    const result = listComponents(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getCount()).toBe(3);
    expect(result.getComponentsList().map((c) => c.getName()).sort()).toEqual(['flask', 'my-app', 'requests']);
  });

  it('returns a structured error for a document matching neither format', () => {
    const input = new SbomDocument();
    input.setText(NOT_JSON_NOT_TAG_VALUE);
    const result = listComponents(testContext, input);
    expect(result.getOk()).toBe(false);
    expect(result.getComponentsList()).toHaveLength(0);
  });

  it('is deterministic across repeated invocations', () => {
    const input = new SbomDocument();
    input.setText(CYCLONEDX_SAMPLE);
    const r1 = listComponents(testContext, input);
    const r2 = listComponents(testContext, input);
    expect(r1.getComponentsList().map((c) => c.getRef())).toEqual(r2.getComponentsList().map((c) => c.getRef()));
  });
});
