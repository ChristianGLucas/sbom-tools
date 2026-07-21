import { SbomDocument, DetectFormatResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { detectFormat as detectFormatImpl } from './lib/detect';
import { formatToMsg } from './lib/mappers';

/**
 * Detect the SBOM format (CycloneDX vs SPDX), encoding (JSON vs SPDX tag-value),
 * and declared spec version of a document, without fully parsing it. `detected`
 * is false and format/encoding are "unknown" when the text matches neither
 * format's shape. Deterministic; never throws — a malformed or oversized
 * document returns ok=false with a structured error.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function detectFormat(ax: AxiomContext, input: SbomDocument): DetectFormatResult {
  const outcome = detectFormatImpl(input.getText(), input.getFormatHint());
  return formatToMsg(outcome);
}
