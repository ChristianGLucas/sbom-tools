import { SbomDocument, ValidateStructureResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { validateStructure as validateStructureImpl } from './lib/validate';

/**
 * Validate basic structural correctness for the detected format — required
 * top-level fields present (bomFormat/specVersion for CycloneDX;
 * spdxVersion/dataLicense/SPDXID for SPDX), components/packages array
 * well-formed, dependency/relationship refs resolve to known component refs.
 * Returns valid=false with a list of specific issues rather than throwing;
 * unrelated to and does not replace full JSON-schema validation.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function validateStructure(ax: AxiomContext, input: SbomDocument): ValidateStructureResult {
  const outcome = validateStructureImpl(input.getText(), input.getFormatHint());
  const out = new ValidateStructureResult();
  out.setOk(outcome.ok);
  out.setError(outcome.error);
  out.setValid(outcome.valid);
  out.setFormat(outcome.format);
  out.setIssuesList(outcome.issues);
  return out;
}
