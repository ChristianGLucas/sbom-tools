// Hand-authored, spec-accurate SBOM fixtures used across the node test suite.
// Each fixture's expected extraction is worked out BY HAND in the test files
// (the independent oracle) — never derived by round-tripping this package's
// own parser through itself.

export const CYCLONEDX_SAMPLE = JSON.stringify({
  bomFormat: 'CycloneDX',
  specVersion: '1.5',
  serialNumber: 'urn:uuid:3e671687-395b-41f5-a30f-a58921a69b79',
  version: 1,
  metadata: {
    timestamp: '2024-01-15T10:00:00Z',
    tools: { components: [{ type: 'application', name: 'cyclonedx-cli', version: '0.25.0' }] },
    component: { 'bom-ref': 'app-1', type: 'application', name: 'my-app', version: '2.0.0' },
  },
  components: [
    {
      'bom-ref': 'pkg:npm/left-pad@1.3.0',
      type: 'library',
      name: 'left-pad',
      version: '1.3.0',
      purl: 'pkg:npm/left-pad@1.3.0',
      supplier: { name: 'npm community' },
      licenses: [{ license: { id: 'MIT' } }],
      copyright: 'Copyright left-pad contributors',
    },
    {
      'bom-ref': 'pkg:npm/lodash@4.17.21',
      type: 'library',
      name: 'lodash',
      version: '4.17.21',
      purl: 'pkg:npm/lodash@4.17.21',
      licenses: [{ expression: 'MIT' }],
    },
    {
      'bom-ref': 'pkg:maven/org.apache.commons/commons-lang3@3.12.0',
      type: 'library',
      name: 'commons-lang3',
      version: '3.12.0',
      purl: 'pkg:maven/org.apache.commons/commons-lang3@3.12.0',
      licenses: [{ license: { id: 'Apache-2.0' } }],
    },
    {
      'bom-ref': 'pkg:npm/mystery-pkg@0.0.1',
      type: 'library',
      name: 'mystery-pkg',
      version: '0.0.1',
      purl: 'pkg:npm/mystery-pkg@0.0.1',
    },
  ],
  dependencies: [
    { ref: 'app-1', dependsOn: ['pkg:npm/left-pad@1.3.0', 'pkg:npm/lodash@4.17.21'] },
    { ref: 'pkg:npm/lodash@4.17.21', dependsOn: ['pkg:npm/mystery-pkg@0.0.1'] },
    { ref: 'pkg:maven/org.apache.commons/commons-lang3@3.12.0', dependsOn: [] },
  ],
  vulnerabilities: [
    {
      id: 'CVE-2020-8203',
      source: { name: 'NVD' },
      ratings: [{ source: { name: 'NVD' }, score: 7.4, severity: 'high', method: 'CVSSv3', vector: 'AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H' }],
      affects: [{ ref: 'pkg:npm/lodash@4.17.21' }],
      description: 'Prototype pollution in lodash',
    },
  ],
});

export const SPDX_SAMPLE = JSON.stringify({
  spdxVersion: 'SPDX-2.3',
  dataLicense: 'CC0-1.0',
  SPDXID: 'SPDXRef-DOCUMENT',
  name: 'my-spdx-doc',
  documentNamespace: 'https://example.com/spdx/my-doc-1234',
  creationInfo: {
    created: '2024-02-01T08:30:00Z',
    creators: ['Tool: syft-0.90.0', 'Organization: Example Corp'],
  },
  documentDescribes: ['SPDXRef-Package-app'],
  packages: [
    {
      SPDXID: 'SPDXRef-Package-app',
      name: 'my-app',
      versionInfo: '2.0.0',
      downloadLocation: 'NOASSERTION',
      licenseConcluded: 'NOASSERTION',
      licenseDeclared: 'NOASSERTION',
      copyrightText: 'NOASSERTION',
    },
    {
      SPDXID: 'SPDXRef-Package-requests',
      name: 'requests',
      versionInfo: '2.31.0',
      downloadLocation: 'https://pypi.org/project/requests/',
      licenseConcluded: 'Apache-2.0',
      licenseDeclared: 'Apache-2.0',
      copyrightText: 'Copyright requests contributors',
      supplier: 'Organization: Python Software Foundation',
      externalRefs: [{ referenceCategory: 'PACKAGE-MANAGER', referenceType: 'purl', referenceLocator: 'pkg:pypi/requests@2.31.0' }],
    },
    {
      SPDXID: 'SPDXRef-Package-flask',
      name: 'flask',
      versionInfo: '3.0.0',
      licenseConcluded: 'BSD-3-Clause',
      licenseDeclared: 'NOASSERTION',
      externalRefs: [{ referenceCategory: 'PACKAGE-MANAGER', referenceType: 'purl', referenceLocator: 'pkg:pypi/flask@3.0.0' }],
    },
  ],
  relationships: [
    { spdxElementId: 'SPDXRef-DOCUMENT', relatedSpdxElement: 'SPDXRef-Package-app', relationshipType: 'DESCRIBES' },
    { spdxElementId: 'SPDXRef-Package-app', relatedSpdxElement: 'SPDXRef-Package-requests', relationshipType: 'DEPENDS_ON' },
    { spdxElementId: 'SPDXRef-Package-app', relatedSpdxElement: 'SPDXRef-Package-flask', relationshipType: 'DEPENDS_ON' },
  ],
});

export const SPDX_TAG_VALUE_SAMPLE = [
  'SPDXVersion: SPDX-2.3',
  'DataLicense: CC0-1.0',
  'SPDXID: SPDXRef-DOCUMENT',
  'DocumentName: my-spdx-doc',
  'DocumentNamespace: https://example.com/spdx/my-doc-1234',
  'Creator: Tool: syft-0.90.0',
  'Created: 2024-02-01T08:30:00Z',
].join('\n');

export const NOT_JSON_NOT_TAG_VALUE = 'this is neither JSON nor an SPDX tag-value document';

export const UNKNOWN_JSON_SHAPE = JSON.stringify({ foo: 'bar', baz: 42 });

export function deeplyNestedJson(depth: number): string {
  return '['.repeat(depth) + ']'.repeat(depth);
}

export function oversizedText(bytes: number): string {
  return 'x'.repeat(bytes);
}
