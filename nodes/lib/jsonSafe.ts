import { MAX_NESTING_DEPTH } from './limits';

// Scan `text` for the maximum {}/[] nesting depth WITHOUT invoking a recursive
// parser — a flat linear scan that respects string literals (so brackets inside
// a JSON string value are never counted) and JSON's backslash-escaping rules.
// Returns the max depth reached, or -1 if depth exceeds `maxDepth` (scan stops
// immediately at that point — cheap on an adversarial input, not just a valid one).
export function maxJsonNestingDepth(text: string, maxDepth: number = MAX_NESTING_DEPTH): number {
  let depth = 0;
  let peak = 0;
  let inString = false;
  let escaped = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
      continue;
    }
    if (ch === '{' || ch === '[') {
      depth++;
      if (depth > peak) peak = depth;
      if (depth > maxDepth) return -1;
    } else if (ch === '}' || ch === ']') {
      if (depth > 0) depth--;
    }
  }
  return peak;
}

export interface SafeParseResult {
  ok: boolean;
  value: unknown;
  error: string;
}

// JSON.parse wrapped so a malformed document is always a structured result,
// never a thrown exception reaching the node boundary.
export function safeJsonParse(text: string): SafeParseResult {
  try {
    const value = JSON.parse(text);
    return { ok: true, value, error: '' };
  } catch (e) {
    return { ok: false, value: undefined, error: `invalid JSON: ${(e as Error).message}` };
  }
}

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
