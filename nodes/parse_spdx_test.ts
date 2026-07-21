import { SbomDocument } from '../gen/messages_pb';
import { parseSpdx } from './parse_spdx';
import { testContext } from './testdata/testContext';
import { SPDX_SAMPLE, SPDX_TAG_VALUE_SAMPLE, CYCLONEDX_SAMPLE } from './testdata/fixtures';

describe('ParseSpdx', () => {
  it('parses a full SPDX JSON document into the normalized structure (hand-derived oracle)', () => {
    const input = new SbomDocument();
    input.setText(SPDX_SAMPLE);
    const result = parseSpdx(testContext, input);

    expect(result.getOk()).toBe(true);
    expect(result.getFormat()!.getFormat()).toBe('spdx');
    expect(result.getFormat()!.getSpecVersion()).toBe('SPDX-2.3');

    const components = result.getComponentsList();
    expect(components).toHaveLength(3);
    const byRef = new Map(components.map((c) => [c.getRef(), c]));

    const app = byRef.get('SPDXRef-Package-app')!;
    expect(app.getLicenseDeclared()).toBe(false);
    expect(app.getLicensesList()).toEqual([]);
    expect(app.getPurl()).toBe('');
    expect(app.getCopyright()).toBe('');

    const requests = byRef.get('SPDXRef-Package-requests')!;
    expect(requests.getLicensesList()).toEqual(['Apache-2.0']);
    expect(requests.getLicenseDeclared()).toBe(true);
    expect(requests.getPurl()).toBe('pkg:pypi/requests@2.31.0');
    expect(requests.getSupplier()).toBe('Organization: Python Software Foundation');
    expect(requests.getCopyright()).toBe('Copyright requests contributors');

    const flask = byRef.get('SPDXRef-Package-flask')!;
    expect(flask.getLicensesList()).toEqual(['BSD-3-Clause']);
    expect(flask.getPurl()).toBe('pkg:pypi/flask@3.0.0');

    const metadata = result.getMetadata()!;
    expect(metadata.getToolName()).toBe('syft');
    expect(metadata.getToolVersion()).toBe('0.90.0');
    expect(metadata.getTimestamp()).toBe('2024-02-01T08:30:00Z');
    expect(metadata.getPrimaryComponentRef()).toBe('SPDXRef-Package-app');
    expect(metadata.getPrimaryComponentName()).toBe('my-app');
    expect(metadata.getDocumentName()).toBe('my-spdx-doc');
    expect(metadata.getNamespace()).toBe('https://example.com/spdx/my-doc-1234');

    // DESCRIBES is not a dependency edge; only the two DEPENDS_ON relationships collapse
    // into one edge (app -> {requests, flask}).
    expect(result.getDependenciesList()).toHaveLength(1);
    const edge = result.getDependenciesList()[0];
    expect(edge.getRef()).toBe('SPDXRef-Package-app');
    expect(edge.getDependsOnList().slice().sort()).toEqual(['SPDXRef-Package-flask', 'SPDXRef-Package-requests']);

    // SPDX 2.x has no vulnerability field — never fabricated.
    expect(result.getVulnerabilitiesList()).toHaveLength(0);
  });

  it('rejects SPDX tag-value with a structured error naming the unsupported encoding', () => {
    const input = new SbomDocument();
    input.setText(SPDX_TAG_VALUE_SAMPLE);
    const result = parseSpdx(testContext, input);
    expect(result.getOk()).toBe(false);
    expect(result.getError()).toMatch(/tag-value/);
  });

  it('rejects a CycloneDX document with a structured error rather than silently misparsing it', () => {
    const input = new SbomDocument();
    input.setText(CYCLONEDX_SAMPLE);
    const result = parseSpdx(testContext, input);
    expect(result.getOk()).toBe(false);
    expect(result.getComponentsList()).toHaveLength(0);
  });
});
