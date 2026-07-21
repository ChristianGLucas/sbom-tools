import { LicenseExpressionRequest, ParseLicenseExpressionResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseLicenseExpression as parseLicenseExpressionImpl } from './lib/licenseExpr';

/**
 * Parse a standalone SPDX license expression (e.g. "(MIT OR Apache-2.0) AND
 * BSD-3-Clause") into its structured form via spdx-expression-parse: every
 * distinct license ID referenced, every distinct exception ID (the "WITH
 * <exception>" clause), and the full parsed AST as JSON for exact fidelity. A
 * syntactically invalid expression returns a structured error.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function parseLicenseExpression(ax: AxiomContext, input: LicenseExpressionRequest): ParseLicenseExpressionResult {
  const outcome = parseLicenseExpressionImpl(input.getExpression());
  const out = new ParseLicenseExpressionResult();
  out.setOk(outcome.ok);
  out.setError(outcome.error);
  out.setLicenseIdsList(outcome.licenseIds);
  out.setExceptionIdsList(outcome.exceptionIds);
  out.setAstJson(outcome.astJson);
  return out;
}
