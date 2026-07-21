import { SbomDocument } from '../gen/messages_pb';
import { detectFormat } from './detect_format';
import { testContext } from './testdata/testContext';
import { CYCLONEDX_SAMPLE, SPDX_SAMPLE, SPDX_TAG_VALUE_SAMPLE, NOT_JSON_NOT_TAG_VALUE, UNKNOWN_JSON_SHAPE, deeplyNestedJson, oversizedText } from './testdata/fixtures';

describe('DetectFormat', () => {
  it('detects CycloneDX JSON and its declared spec version', () => {
    const input = new SbomDocument();
    input.setText(CYCLONEDX_SAMPLE);
    const result = detectFormat(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getDetected()).toBe(true);
    expect(result.getFormat()).toBe('cyclonedx');
    expect(result.getEncoding()).toBe('json');
    expect(result.getSpecVersion()).toBe('1.5');
  });

  it('detects SPDX JSON and its declared spec version', () => {
    const input = new SbomDocument();
    input.setText(SPDX_SAMPLE);
    const result = detectFormat(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getDetected()).toBe(true);
    expect(result.getFormat()).toBe('spdx');
    expect(result.getEncoding()).toBe('json');
    expect(result.getSpecVersion()).toBe('SPDX-2.3');
  });

  it('detects SPDX tag-value encoding', () => {
    const input = new SbomDocument();
    input.setText(SPDX_TAG_VALUE_SAMPLE);
    const result = detectFormat(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getDetected()).toBe(true);
    expect(result.getFormat()).toBe('spdx');
    expect(result.getEncoding()).toBe('tag-value');
    expect(result.getSpecVersion()).toBe('SPDX-2.3');
  });

  it('reports detected=false for a JSON document matching neither format', () => {
    const input = new SbomDocument();
    input.setText(UNKNOWN_JSON_SHAPE);
    const result = detectFormat(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getDetected()).toBe(false);
    expect(result.getFormat()).toBe('unknown');
  });

  it('reports detected=false, not a crash, for text that is neither JSON nor tag-value', () => {
    const input = new SbomDocument();
    input.setText(NOT_JSON_NOT_TAG_VALUE);
    const result = detectFormat(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getDetected()).toBe(false);
    expect(result.getFormat()).toBe('unknown');
    expect(result.getEncoding()).toBe('unknown');
  });

  it('honors an explicit format_hint and rejects a mismatched document', () => {
    const input = new SbomDocument();
    input.setText(CYCLONEDX_SAMPLE);
    input.setFormatHint('spdx-json');
    const result = detectFormat(testContext, input);
    expect(result.getOk()).toBe(false);
    expect(result.getError().length).toBeGreaterThan(0);
  });

  it('rejects a document past the nesting-depth guard with a structured error, not a crash', () => {
    const input = new SbomDocument();
    input.setText(deeplyNestedJson(5000));
    const result = detectFormat(testContext, input);
    expect(result.getOk()).toBe(false);
    expect(result.getError()).toMatch(/nesting/);
  });

  it('rejects oversized input with a structured error, not a crash', () => {
    const input = new SbomDocument();
    input.setText(oversizedText(3_000_001));
    const result = detectFormat(testContext, input);
    expect(result.getOk()).toBe(false);
    expect(result.getError()).toMatch(/byte limit/);
  });

  it('is deterministic across repeated invocations', () => {
    const input = new SbomDocument();
    input.setText(CYCLONEDX_SAMPLE);
    const r1 = detectFormat(testContext, input);
    const r2 = detectFormat(testContext, input);
    expect(r1.getFormat()).toBe(r2.getFormat());
    expect(r1.getSpecVersion()).toBe(r2.getSpecVersion());
  });
});
