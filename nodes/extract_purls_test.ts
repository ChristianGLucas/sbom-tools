import { SbomDocument } from '../gen/messages_pb';
import { extractPurls } from './extract_purls';
import { testContext } from './testdata/testContext';
import { CYCLONEDX_SAMPLE, SPDX_SAMPLE, NOT_JSON_NOT_TAG_VALUE } from './testdata/fixtures';

describe('ExtractPurls', () => {
  it('extracts every PURL from the CycloneDX sample, flagging the one component with none', () => {
    const input = new SbomDocument();
    input.setText(CYCLONEDX_SAMPLE);
    const result = extractPurls(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getCount()).toBe(5);
    const byName = new Map(result.getPurlsList().map((p) => [p.getName(), p]));
    expect(byName.get('left-pad')!.getPurl()).toBe('pkg:npm/left-pad@1.3.0');
    expect(byName.get('left-pad')!.getHasPurl()).toBe(true);
    expect(byName.get('my-app')!.getHasPurl()).toBe(false);
    expect(byName.get('my-app')!.getPurl()).toBe('');
  });

  it('extracts PURLs pulled from SPDX externalRefs, flagging the package with none', () => {
    const input = new SbomDocument();
    input.setText(SPDX_SAMPLE);
    const result = extractPurls(testContext, input);
    expect(result.getOk()).toBe(true);
    const byName = new Map(result.getPurlsList().map((p) => [p.getName(), p]));
    expect(byName.get('requests')!.getPurl()).toBe('pkg:pypi/requests@2.31.0');
    expect(byName.get('flask')!.getPurl()).toBe('pkg:pypi/flask@3.0.0');
    expect(byName.get('my-app')!.getHasPurl()).toBe(false);
  });

  it('returns a structured error for unparseable input', () => {
    const input = new SbomDocument();
    input.setText(NOT_JSON_NOT_TAG_VALUE);
    const result = extractPurls(testContext, input);
    expect(result.getOk()).toBe(false);
    expect(result.getPurlsList()).toHaveLength(0);
  });
});
