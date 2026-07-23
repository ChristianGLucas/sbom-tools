# sbom-tools

Deterministic, SBOM-SEMANTIC parsing and inspection of Software Bill of Materials
documents — the two dominant formats, **CycloneDX** (JSON) and **SPDX** (JSON, plus
tag-value for format detection only). Built for the [Axiom](https://axiomide.com)
marketplace, handle `christiangeorgelucas`.

Distinct from generic JSON tooling (`dataformat-tools`, `json-schema-tools`): this
package understands CycloneDX/SPDX structure and pulls out exactly what a
security/supply-chain agent needs.

## Use it from your agent or app

Every node in this package is a **live, auto-scaling API endpoint** on the
[Axiom](https://axiomide.com) marketplace — call it from an AI agent or your own
code, with nothing to self-host.

**📦 See it on the marketplace:**
https://dev.axiomide.com/marketplace/christiangeorgelucas/sbom-tools@0.1.0

**Hook it up to an AI agent (MCP).** Add Axiom's hosted MCP server to any MCP
client and every node becomes a typed tool your agent can call — search the
catalog, inspect a schema, and invoke it directly.

```bash
# Claude Code
claude mcp add --transport http axiom https://api.axiomide.com/mcp \
  --header "Authorization: Bearer $AXIOM_API_KEY"
```

Claude Desktop, Cursor, or any config-based client:

```json
{
  "mcpServers": {
    "axiom": {
      "type": "http",
      "url": "https://api.axiomide.com/mcp",
      "headers": { "Authorization": "Bearer YOUR_AXIOM_API_KEY" }
    }
  }
}
```

**Call it from the CLI.**

```bash
axiom invoke christiangeorgelucas/sbom-tools/DetectFormat --input '{ ... }'
```

**Call it over HTTP.**

```bash
curl -X POST https://api.axiomide.com/invocations/v1/nodes/christiangeorgelucas/sbom-tools/0.1.0/DetectFormat \
  -H "Authorization: Bearer $AXIOM_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```

> Input/output schema for each node is on the marketplace page above, or via
> `axiom inspect node christiangeorgelucas/sbom-tools/DetectFormat`.

### Get started free

Install the CLI:

```bash
# macOS / Linux — Homebrew
brew install axiomide/tap/axiom

# macOS / Linux — install script
curl -fsSL https://raw.githubusercontent.com/AxiomIDE/axiom-releases/main/install.sh | sh
```

**Windows:** download the `windows/amd64` `.zip` from the
[releases page](https://github.com/AxiomIDE/axiom-releases/releases), unzip it,
and put `axiom.exe` on your `PATH`.

Then `axiom version` to verify, `axiom login` (GitHub or Google) to authenticate,
and create an API key under **Console → API Keys**. Docs and sign-up at
**[axiomide.com](https://axiomide.com)**.

## Nodes

- **DetectFormat** — detect SBOM format (CycloneDX vs SPDX), encoding (JSON vs
  SPDX tag-value), and declared spec version.
- **ParseCycloneDX** — parse a CycloneDX JSON SBOM into a normalized structure
  (metadata, components, dependency graph, VEX vulnerabilities).
- **ParseSpdx** — parse an SPDX JSON SBOM into the same normalized structure.
- **ListComponents** — list every component/package (name, version, type, PURL,
  supplier, licenses).
- **ExtractPurls** — extract every component's Package URL.
- **ExtractLicenses** — per-component resolved license set.
- **ListDistinctLicenses** — the license-audit node: every distinct license used
  anywhere in the SBOM.
- **ParseLicenseExpression** — parse a standalone SPDX license expression (e.g.
  `(MIT OR Apache-2.0) AND BSD-3-Clause`) via `spdx-expression-parse`.
- **FindMissingLicenses** — flag components with no usable license declared (the
  compliance-gap node).
- **ExtractDependencyGraph** — the dependency graph as ref -> depends_on edges.
- **ExtractVulnerabilities** — declared vulnerabilities from CycloneDX VEX data.
- **ExtractMetadata** — document-level metadata, taken verbatim (tool, timestamp
  as declared, primary component).
- **Summarize** — component/license/ecosystem/vulnerability count breakdowns.
- **FilterByEcosystem** — every component of one PURL-type ecosystem (npm, maven,
  pypi, cargo, golang, ...).
- **ValidateStructure** — basic structural correctness for the detected format.

## Design

All CycloneDX/SPDX domain knowledge is this package's own code — `@cyclonedx/
cyclonedx-library` was evaluated and found to be generation/serialization-oriented,
not a parser of arbitrary existing SBOM JSON, so JSON is parsed and interpreted
directly (the same pattern `k8s-manifest-tools` uses for Kubernetes YAML).
`spdx-expression-parse` (MIT) is used only for the one node that parses SPDX
license-expression grammar.

The SBOM is always caller-supplied text — no network, no vulnerability-database
lookups, no wall-clock, no randomness; every field is read verbatim from the
document, never generated. Input is bounded (3 MiB text, a pre-parse JSON
nesting-depth guard, and a 5000-component cap) and a malformed or oversized
document returns a structured error instead of a crash.

## License

MIT — Copyright (c) 2026 Christian George Lucas.
