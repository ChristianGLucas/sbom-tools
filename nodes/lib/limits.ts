// Input-surface bounds shared by every node. Kept generous enough for real-world
// SBOMs (which can legitimately list thousands of transitive components) but
// well clear of Axiom's ~4 MiB node transport cap on both input and output.

// Raw SBOM text, in bytes (UTF-8).
export const MAX_TEXT_BYTES = 3_000_000;

// Components/packages processed and returned. A document that declares more is
// truncated (not rejected) — `truncated: true` signals this to the caller.
export const MAX_COMPONENTS = 5000;

// Pre-parse JSON nesting-depth guard. V8's JSON.parse recursion on pathologically
// deep input can exhaust the call stack; this bound is checked with a linear scan
// BEFORE JSON.parse ever runs, so it can't be bypassed by the parser itself.
export const MAX_NESTING_DEPTH = 1000;

// SPDX license expression length bound (a standalone, much smaller input).
export const MAX_EXPRESSION_LENGTH = 10_000;

export function byteLength(text: string): number {
  return Buffer.byteLength(text, 'utf8');
}
