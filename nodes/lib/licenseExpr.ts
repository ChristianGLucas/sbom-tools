import parseExpression from 'spdx-expression-parse';

export interface LicenseExpressionOutcome {
  ok: boolean;
  error: string;
  licenseIds: string[];
  exceptionIds: string[];
  astJson: string;
}

type Node = parseExpression.Info;

function isLeaf(n: Node): n is parseExpression.LicenseInfo {
  return (n as parseExpression.LicenseInfo).license !== undefined;
}

function collect(n: Node, licenseIds: Set<string>, exceptionIds: Set<string>): void {
  if (isLeaf(n)) {
    licenseIds.add(n.license);
    if (n.exception) exceptionIds.add(n.exception);
    return;
  }
  collect(n.left, licenseIds, exceptionIds);
  collect(n.right, licenseIds, exceptionIds);
}

// Parses a standalone SPDX license expression via spdx-expression-parse (MIT),
// which validates every license/exception ID against the official SPDX lists
// (spdx-license-ids / spdx-exceptions) as part of parsing. Never throws — a
// syntactically or semantically invalid expression comes back as ok=false.
export function parseLicenseExpression(expression: string): LicenseExpressionOutcome {
  if (!expression || !expression.trim()) {
    return { ok: false, error: 'expression is empty', licenseIds: [], exceptionIds: [], astJson: '' };
  }
  try {
    const ast = parseExpression(expression);
    const licenseIds = new Set<string>();
    const exceptionIds = new Set<string>();
    collect(ast, licenseIds, exceptionIds);
    return {
      ok: true,
      error: '',
      licenseIds: Array.from(licenseIds).sort(),
      exceptionIds: Array.from(exceptionIds).sort(),
      astJson: JSON.stringify(ast),
    };
  } catch (e) {
    return { ok: false, error: `invalid SPDX license expression: ${(e as Error).message}`, licenseIds: [], exceptionIds: [], astJson: '' };
  }
}
