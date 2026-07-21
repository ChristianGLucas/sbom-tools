import { LicenseExpressionRequest } from '../gen/messages_pb';
import { parseLicenseExpression } from './parse_license_expression';
import { testContext } from './testdata/testContext';

describe('ParseLicenseExpression', () => {
  it('parses a compound expression into its distinct license IDs (independent oracle: spdx-expression-parse)', () => {
    const input = new LicenseExpressionRequest();
    input.setExpression('(MIT OR Apache-2.0) AND BSD-3-Clause');
    const result = parseLicenseExpression(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getLicenseIdsList()).toEqual(['Apache-2.0', 'BSD-3-Clause', 'MIT']);
    expect(result.getExceptionIdsList()).toEqual([]);
    const ast = JSON.parse(result.getAstJson());
    expect(ast.conjunction).toBe('and');
  });

  it('parses a WITH exception clause into exception_ids', () => {
    const input = new LicenseExpressionRequest();
    input.setExpression('GPL-2.0-only WITH Classpath-exception-2.0');
    const result = parseLicenseExpression(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getLicenseIdsList()).toEqual(['GPL-2.0-only']);
    expect(result.getExceptionIdsList()).toEqual(['Classpath-exception-2.0']);
  });

  it('parses a bare single-license expression', () => {
    const input = new LicenseExpressionRequest();
    input.setExpression('MIT');
    const result = parseLicenseExpression(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getLicenseIdsList()).toEqual(['MIT']);
  });

  it('rejects an unknown license identifier with a structured error, not a crash', () => {
    const input = new LicenseExpressionRequest();
    input.setExpression('NOT-A-REAL-LICENSE-XYZ');
    const result = parseLicenseExpression(testContext, input);
    expect(result.getOk()).toBe(false);
    expect(result.getError().length).toBeGreaterThan(0);
  });

  it('rejects syntactically malformed input (unbalanced parens) with a structured error, not a crash', () => {
    const input = new LicenseExpressionRequest();
    input.setExpression('MIT AND (');
    const result = parseLicenseExpression(testContext, input);
    expect(result.getOk()).toBe(false);
    expect(result.getError().length).toBeGreaterThan(0);
  });

  it('rejects an empty expression', () => {
    const input = new LicenseExpressionRequest();
    input.setExpression('');
    const result = parseLicenseExpression(testContext, input);
    expect(result.getOk()).toBe(false);
  });
});
