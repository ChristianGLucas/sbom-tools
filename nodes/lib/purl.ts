// A Package URL is "pkg:<type>/<namespace>/<name>@<version>?<qualifiers>#<subpath>"
// (https://github.com/package-url/purl-spec). We only need the `type` segment —
// the ecosystem — extracted generically (no hardcoded ecosystem enum, since new
// PURL types are added to the spec over time and any of them should filter cleanly).
const PURL_TYPE_RE = /^pkg:([A-Za-z0-9.+-]+)\//;

export function ecosystemFromPurl(purl: string): string {
  if (!purl) return '';
  const m = PURL_TYPE_RE.exec(purl);
  return m ? m[1].toLowerCase() : '';
}
