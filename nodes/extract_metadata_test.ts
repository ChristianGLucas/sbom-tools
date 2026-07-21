import { SbomDocument } from '../gen/messages_pb';
import { extractMetadata } from './extract_metadata';
import { testContext } from './testdata/testContext';
import { CYCLONEDX_SAMPLE, SPDX_SAMPLE } from './testdata/fixtures';

describe('ExtractMetadata', () => {
  it('extracts CycloneDX metadata verbatim (tool, timestamp, primary component)', () => {
    const input = new SbomDocument();
    input.setText(CYCLONEDX_SAMPLE);
    const result = extractMetadata(testContext, input);
    expect(result.getOk()).toBe(true);
    const md = result.getMetadata()!;
    expect(md.getToolName()).toBe('cyclonedx-cli');
    expect(md.getToolVersion()).toBe('0.25.0');
    expect(md.getTimestamp()).toBe('2024-01-15T10:00:00Z');
    expect(md.getPrimaryComponentRef()).toBe('app-1');
    expect(md.getPrimaryComponentName()).toBe('my-app');
    expect(md.getDocumentName()).toBe('urn:uuid:3e671687-395b-41f5-a30f-a58921a69b79');
  });

  it('extracts SPDX metadata verbatim (creator tool parsed from creationInfo.creators, namespace)', () => {
    const input = new SbomDocument();
    input.setText(SPDX_SAMPLE);
    const result = extractMetadata(testContext, input);
    expect(result.getOk()).toBe(true);
    const md = result.getMetadata()!;
    expect(md.getToolName()).toBe('syft');
    expect(md.getToolVersion()).toBe('0.90.0');
    expect(md.getTimestamp()).toBe('2024-02-01T08:30:00Z');
    expect(md.getDocumentName()).toBe('my-spdx-doc');
    expect(md.getNamespace()).toBe('https://example.com/spdx/my-doc-1234');
    expect(md.getPrimaryComponentRef()).toBe('SPDXRef-Package-app');
    expect(md.getPrimaryComponentName()).toBe('my-app');
  });
});
