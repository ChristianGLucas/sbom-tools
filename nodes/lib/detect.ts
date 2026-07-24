import { safeJsonParse, isPlainObject, maxJsonNestingDepth } from './jsonSafe';
import { NFormat, failedFormat } from './types';
import { MAX_NESTING_DEPTH } from './limits';

const SPDX_TAG_VALUE_RE = /^\s*SPDXVersion\s*:\s*(SPDX-\S+)/m;

export interface DetectOutcome extends NFormat {
  // The already-parsed JSON value, when encoding is "json" and parsing succeeded —
  // reused by the CycloneDX/SPDX parsers so the document is only parsed once.
  parsed?: unknown;
}

// Detects format + encoding + declared spec version. Never throws: a document
// that is too deeply nested, or matches neither format's shape, comes back
// with detected=false / format="unknown" rather than an exception.
export function detectFormat(text: string, formatHint: string): DetectOutcome {
  const hint = (formatHint || '').trim().toLowerCase();
  if (hint && !['cyclonedx-json', 'spdx-json', 'spdx-tag-value'].includes(hint)) {
    return { ...failedFormat(`unknown format_hint "${formatHint}"`), ok: false };
  }

  if (hint === 'spdx-tag-value') {
    const m = SPDX_TAG_VALUE_RE.exec(text);
    if (!m) {
      return { ...failedFormat('format_hint was spdx-tag-value but no SPDXVersion line found'), ok: false };
    }
    return { ok: true, error: '', format: 'spdx', encoding: 'tag-value', specVersion: m[1], detected: true };
  }

  // JSON-shaped formats (cyclonedx-json, spdx-json, or auto-detect) all need a
  // nesting-depth check before JSON.parse ever runs.
  if (hint !== 'spdx-tag-value') {
    const depth = maxJsonNestingDepth(text, MAX_NESTING_DEPTH);
    if (depth === -1) {
      return { ...failedFormat(`document nesting exceeds ${MAX_NESTING_DEPTH} levels`), ok: false };
    }
  }

  const parsedResult = safeJsonParse(text);
  if (parsedResult.ok && isPlainObject(parsedResult.value)) {
    const obj = parsedResult.value;
    if (typeof obj.bomFormat === 'string' && obj.bomFormat === 'CycloneDX') {
      if (hint && hint !== 'cyclonedx-json') {
        return { ...failedFormat(`format_hint was "${formatHint}" but document is CycloneDX JSON`), ok: false };
      }
      return {
        ok: true,
        error: '',
        format: 'cyclonedx',
        encoding: 'json',
        specVersion: typeof obj.specVersion === 'string' ? obj.specVersion : '',
        detected: true,
        parsed: obj,
      };
    }
    if (typeof obj.spdxVersion === 'string' && obj.spdxVersion.startsWith('SPDX-')) {
      if (hint && hint !== 'spdx-json') {
        return { ...failedFormat(`format_hint was "${formatHint}" but document is SPDX JSON`), ok: false };
      }
      return {
        ok: true,
        error: '',
        format: 'spdx',
        encoding: 'json',
        specVersion: obj.spdxVersion,
        detected: true,
        parsed: obj,
      };
    }
    if (hint === 'cyclonedx-json' || hint === 'spdx-json') {
      return { ...failedFormat(`format_hint was "${formatHint}" but document does not match that shape`), ok: false };
    }
    return { ok: true, error: '', format: 'unknown', encoding: 'json', specVersion: '', detected: false };
  }

  // Not valid JSON (or not a JSON object) — check for SPDX tag-value shape.
  const m = SPDX_TAG_VALUE_RE.exec(text);
  if (m) {
    if (hint && hint !== 'spdx-tag-value') {
      return { ...failedFormat(`format_hint was "${formatHint}" but document is SPDX tag-value`), ok: false };
    }
    return { ok: true, error: '', format: 'spdx', encoding: 'tag-value', specVersion: m[1], detected: true };
  }

  if (hint) {
    return { ...failedFormat(`format_hint was "${formatHint}" but document does not match that shape`), ok: false };
  }
  return { ok: true, error: '', format: 'unknown', encoding: 'unknown', specVersion: '', detected: false };
}
