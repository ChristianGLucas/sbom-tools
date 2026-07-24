// Pre-parse JSON nesting-depth guard. V8's JSON.parse recursion on pathologically
// deep input can exhaust the call stack; this bound is checked with a linear scan
// BEFORE JSON.parse ever runs, so it can't be bypassed by the parser itself.
// (Payload byte size and element counts are the platform's concern, not this
// node's — this is the one genuine crash-prevention guard, kept for that
// reason.)
export const MAX_NESTING_DEPTH = 1000;

export function byteLength(text: string): number {
  return Buffer.byteLength(text, 'utf8');
}
