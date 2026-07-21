// package: christiangeorgelucas.sbom_tools
// file: messages.proto

import * as jspb from "google-protobuf";

export class SbomDocument extends jspb.Message {
  getText(): string;
  setText(value: string): void;

  getFormatHint(): string;
  setFormatHint(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SbomDocument.AsObject;
  static toObject(includeInstance: boolean, msg: SbomDocument): SbomDocument.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SbomDocument, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SbomDocument;
  static deserializeBinaryFromReader(message: SbomDocument, reader: jspb.BinaryReader): SbomDocument;
}

export namespace SbomDocument {
  export type AsObject = {
    text: string,
    formatHint: string,
  }
}

export class Component extends jspb.Message {
  getRef(): string;
  setRef(value: string): void;

  getName(): string;
  setName(value: string): void;

  getVersion(): string;
  setVersion(value: string): void;

  getType(): string;
  setType(value: string): void;

  getPurl(): string;
  setPurl(value: string): void;

  getSupplier(): string;
  setSupplier(value: string): void;

  clearLicensesList(): void;
  getLicensesList(): Array<string>;
  setLicensesList(value: Array<string>): void;
  addLicenses(value: string, index?: number): string;

  getLicenseDeclared(): boolean;
  setLicenseDeclared(value: boolean): void;

  getCopyright(): string;
  setCopyright(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Component.AsObject;
  static toObject(includeInstance: boolean, msg: Component): Component.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Component, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Component;
  static deserializeBinaryFromReader(message: Component, reader: jspb.BinaryReader): Component;
}

export namespace Component {
  export type AsObject = {
    ref: string,
    name: string,
    version: string,
    type: string,
    purl: string,
    supplier: string,
    licensesList: Array<string>,
    licenseDeclared: boolean,
    copyright: string,
    description: string,
  }
}

export class DependencyEdge extends jspb.Message {
  getRef(): string;
  setRef(value: string): void;

  clearDependsOnList(): void;
  getDependsOnList(): Array<string>;
  setDependsOnList(value: Array<string>): void;
  addDependsOn(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DependencyEdge.AsObject;
  static toObject(includeInstance: boolean, msg: DependencyEdge): DependencyEdge.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DependencyEdge, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DependencyEdge;
  static deserializeBinaryFromReader(message: DependencyEdge, reader: jspb.BinaryReader): DependencyEdge;
}

export namespace DependencyEdge {
  export type AsObject = {
    ref: string,
    dependsOnList: Array<string>,
  }
}

export class VulnerabilityRating extends jspb.Message {
  getSource(): string;
  setSource(value: string): void;

  getSeverity(): string;
  setSeverity(value: string): void;

  getScore(): number;
  setScore(value: number): void;

  getMethod(): string;
  setMethod(value: string): void;

  getVector(): string;
  setVector(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VulnerabilityRating.AsObject;
  static toObject(includeInstance: boolean, msg: VulnerabilityRating): VulnerabilityRating.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: VulnerabilityRating, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VulnerabilityRating;
  static deserializeBinaryFromReader(message: VulnerabilityRating, reader: jspb.BinaryReader): VulnerabilityRating;
}

export namespace VulnerabilityRating {
  export type AsObject = {
    source: string,
    severity: string,
    score: number,
    method: string,
    vector: string,
  }
}

export class Vulnerability extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getSource(): string;
  setSource(value: string): void;

  clearRatingsList(): void;
  getRatingsList(): Array<VulnerabilityRating>;
  setRatingsList(value: Array<VulnerabilityRating>): void;
  addRatings(value?: VulnerabilityRating, index?: number): VulnerabilityRating;

  clearAffectsList(): void;
  getAffectsList(): Array<string>;
  setAffectsList(value: Array<string>): void;
  addAffects(value: string, index?: number): string;

  getDescription(): string;
  setDescription(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Vulnerability.AsObject;
  static toObject(includeInstance: boolean, msg: Vulnerability): Vulnerability.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Vulnerability, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Vulnerability;
  static deserializeBinaryFromReader(message: Vulnerability, reader: jspb.BinaryReader): Vulnerability;
}

export namespace Vulnerability {
  export type AsObject = {
    id: string,
    source: string,
    ratingsList: Array<VulnerabilityRating.AsObject>,
    affectsList: Array<string>,
    description: string,
  }
}

export class SbomMetadata extends jspb.Message {
  getToolName(): string;
  setToolName(value: string): void;

  getToolVersion(): string;
  setToolVersion(value: string): void;

  getTimestamp(): string;
  setTimestamp(value: string): void;

  getPrimaryComponentRef(): string;
  setPrimaryComponentRef(value: string): void;

  getPrimaryComponentName(): string;
  setPrimaryComponentName(value: string): void;

  getDocumentName(): string;
  setDocumentName(value: string): void;

  getNamespace(): string;
  setNamespace(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SbomMetadata.AsObject;
  static toObject(includeInstance: boolean, msg: SbomMetadata): SbomMetadata.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SbomMetadata, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SbomMetadata;
  static deserializeBinaryFromReader(message: SbomMetadata, reader: jspb.BinaryReader): SbomMetadata;
}

export namespace SbomMetadata {
  export type AsObject = {
    toolName: string,
    toolVersion: string,
    timestamp: string,
    primaryComponentRef: string,
    primaryComponentName: string,
    documentName: string,
    namespace: string,
  }
}

export class DetectFormatResult extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  getFormat(): string;
  setFormat(value: string): void;

  getEncoding(): string;
  setEncoding(value: string): void;

  getSpecVersion(): string;
  setSpecVersion(value: string): void;

  getDetected(): boolean;
  setDetected(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DetectFormatResult.AsObject;
  static toObject(includeInstance: boolean, msg: DetectFormatResult): DetectFormatResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DetectFormatResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DetectFormatResult;
  static deserializeBinaryFromReader(message: DetectFormatResult, reader: jspb.BinaryReader): DetectFormatResult;
}

export namespace DetectFormatResult {
  export type AsObject = {
    ok: boolean,
    error: string,
    format: string,
    encoding: string,
    specVersion: string,
    detected: boolean,
  }
}

export class NormalizedSbom extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  hasFormat(): boolean;
  clearFormat(): void;
  getFormat(): DetectFormatResult | undefined;
  setFormat(value?: DetectFormatResult): void;

  hasMetadata(): boolean;
  clearMetadata(): void;
  getMetadata(): SbomMetadata | undefined;
  setMetadata(value?: SbomMetadata): void;

  clearComponentsList(): void;
  getComponentsList(): Array<Component>;
  setComponentsList(value: Array<Component>): void;
  addComponents(value?: Component, index?: number): Component;

  clearDependenciesList(): void;
  getDependenciesList(): Array<DependencyEdge>;
  setDependenciesList(value: Array<DependencyEdge>): void;
  addDependencies(value?: DependencyEdge, index?: number): DependencyEdge;

  clearVulnerabilitiesList(): void;
  getVulnerabilitiesList(): Array<Vulnerability>;
  setVulnerabilitiesList(value: Array<Vulnerability>): void;
  addVulnerabilities(value?: Vulnerability, index?: number): Vulnerability;

  getTruncated(): boolean;
  setTruncated(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NormalizedSbom.AsObject;
  static toObject(includeInstance: boolean, msg: NormalizedSbom): NormalizedSbom.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: NormalizedSbom, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NormalizedSbom;
  static deserializeBinaryFromReader(message: NormalizedSbom, reader: jspb.BinaryReader): NormalizedSbom;
}

export namespace NormalizedSbom {
  export type AsObject = {
    ok: boolean,
    error: string,
    format?: DetectFormatResult.AsObject,
    metadata?: SbomMetadata.AsObject,
    componentsList: Array<Component.AsObject>,
    dependenciesList: Array<DependencyEdge.AsObject>,
    vulnerabilitiesList: Array<Vulnerability.AsObject>,
    truncated: boolean,
  }
}

export class ListComponentsResult extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  clearComponentsList(): void;
  getComponentsList(): Array<Component>;
  setComponentsList(value: Array<Component>): void;
  addComponents(value?: Component, index?: number): Component;

  getCount(): number;
  setCount(value: number): void;

  getTruncated(): boolean;
  setTruncated(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListComponentsResult.AsObject;
  static toObject(includeInstance: boolean, msg: ListComponentsResult): ListComponentsResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListComponentsResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListComponentsResult;
  static deserializeBinaryFromReader(message: ListComponentsResult, reader: jspb.BinaryReader): ListComponentsResult;
}

export namespace ListComponentsResult {
  export type AsObject = {
    ok: boolean,
    error: string,
    componentsList: Array<Component.AsObject>,
    count: number,
    truncated: boolean,
  }
}

export class ComponentPurl extends jspb.Message {
  getRef(): string;
  setRef(value: string): void;

  getName(): string;
  setName(value: string): void;

  getPurl(): string;
  setPurl(value: string): void;

  getHasPurl(): boolean;
  setHasPurl(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ComponentPurl.AsObject;
  static toObject(includeInstance: boolean, msg: ComponentPurl): ComponentPurl.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ComponentPurl, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ComponentPurl;
  static deserializeBinaryFromReader(message: ComponentPurl, reader: jspb.BinaryReader): ComponentPurl;
}

export namespace ComponentPurl {
  export type AsObject = {
    ref: string,
    name: string,
    purl: string,
    hasPurl: boolean,
  }
}

export class ExtractPurlsResult extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  clearPurlsList(): void;
  getPurlsList(): Array<ComponentPurl>;
  setPurlsList(value: Array<ComponentPurl>): void;
  addPurls(value?: ComponentPurl, index?: number): ComponentPurl;

  getCount(): number;
  setCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractPurlsResult.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractPurlsResult): ExtractPurlsResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractPurlsResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractPurlsResult;
  static deserializeBinaryFromReader(message: ExtractPurlsResult, reader: jspb.BinaryReader): ExtractPurlsResult;
}

export namespace ExtractPurlsResult {
  export type AsObject = {
    ok: boolean,
    error: string,
    purlsList: Array<ComponentPurl.AsObject>,
    count: number,
  }
}

export class ComponentLicenses extends jspb.Message {
  getRef(): string;
  setRef(value: string): void;

  getName(): string;
  setName(value: string): void;

  clearLicensesList(): void;
  getLicensesList(): Array<string>;
  setLicensesList(value: Array<string>): void;
  addLicenses(value: string, index?: number): string;

  getDeclared(): boolean;
  setDeclared(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ComponentLicenses.AsObject;
  static toObject(includeInstance: boolean, msg: ComponentLicenses): ComponentLicenses.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ComponentLicenses, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ComponentLicenses;
  static deserializeBinaryFromReader(message: ComponentLicenses, reader: jspb.BinaryReader): ComponentLicenses;
}

export namespace ComponentLicenses {
  export type AsObject = {
    ref: string,
    name: string,
    licensesList: Array<string>,
    declared: boolean,
  }
}

export class ExtractLicensesResult extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  clearEntriesList(): void;
  getEntriesList(): Array<ComponentLicenses>;
  setEntriesList(value: Array<ComponentLicenses>): void;
  addEntries(value?: ComponentLicenses, index?: number): ComponentLicenses;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractLicensesResult.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractLicensesResult): ExtractLicensesResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractLicensesResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractLicensesResult;
  static deserializeBinaryFromReader(message: ExtractLicensesResult, reader: jspb.BinaryReader): ExtractLicensesResult;
}

export namespace ExtractLicensesResult {
  export type AsObject = {
    ok: boolean,
    error: string,
    entriesList: Array<ComponentLicenses.AsObject>,
  }
}

export class ListDistinctLicensesResult extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  clearLicensesList(): void;
  getLicensesList(): Array<string>;
  setLicensesList(value: Array<string>): void;
  addLicenses(value: string, index?: number): string;

  getCount(): number;
  setCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListDistinctLicensesResult.AsObject;
  static toObject(includeInstance: boolean, msg: ListDistinctLicensesResult): ListDistinctLicensesResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListDistinctLicensesResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListDistinctLicensesResult;
  static deserializeBinaryFromReader(message: ListDistinctLicensesResult, reader: jspb.BinaryReader): ListDistinctLicensesResult;
}

export namespace ListDistinctLicensesResult {
  export type AsObject = {
    ok: boolean,
    error: string,
    licensesList: Array<string>,
    count: number,
  }
}

export class LicenseExpressionRequest extends jspb.Message {
  getExpression(): string;
  setExpression(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LicenseExpressionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: LicenseExpressionRequest): LicenseExpressionRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: LicenseExpressionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LicenseExpressionRequest;
  static deserializeBinaryFromReader(message: LicenseExpressionRequest, reader: jspb.BinaryReader): LicenseExpressionRequest;
}

export namespace LicenseExpressionRequest {
  export type AsObject = {
    expression: string,
  }
}

export class ParseLicenseExpressionResult extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  clearLicenseIdsList(): void;
  getLicenseIdsList(): Array<string>;
  setLicenseIdsList(value: Array<string>): void;
  addLicenseIds(value: string, index?: number): string;

  clearExceptionIdsList(): void;
  getExceptionIdsList(): Array<string>;
  setExceptionIdsList(value: Array<string>): void;
  addExceptionIds(value: string, index?: number): string;

  getAstJson(): string;
  setAstJson(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ParseLicenseExpressionResult.AsObject;
  static toObject(includeInstance: boolean, msg: ParseLicenseExpressionResult): ParseLicenseExpressionResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ParseLicenseExpressionResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ParseLicenseExpressionResult;
  static deserializeBinaryFromReader(message: ParseLicenseExpressionResult, reader: jspb.BinaryReader): ParseLicenseExpressionResult;
}

export namespace ParseLicenseExpressionResult {
  export type AsObject = {
    ok: boolean,
    error: string,
    licenseIdsList: Array<string>,
    exceptionIdsList: Array<string>,
    astJson: string,
  }
}

export class FindMissingLicensesResult extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  clearComponentsList(): void;
  getComponentsList(): Array<Component>;
  setComponentsList(value: Array<Component>): void;
  addComponents(value?: Component, index?: number): Component;

  getCount(): number;
  setCount(value: number): void;

  getTotalComponents(): number;
  setTotalComponents(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FindMissingLicensesResult.AsObject;
  static toObject(includeInstance: boolean, msg: FindMissingLicensesResult): FindMissingLicensesResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FindMissingLicensesResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FindMissingLicensesResult;
  static deserializeBinaryFromReader(message: FindMissingLicensesResult, reader: jspb.BinaryReader): FindMissingLicensesResult;
}

export namespace FindMissingLicensesResult {
  export type AsObject = {
    ok: boolean,
    error: string,
    componentsList: Array<Component.AsObject>,
    count: number,
    totalComponents: number,
  }
}

export class ExtractDependencyGraphResult extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  clearEdgesList(): void;
  getEdgesList(): Array<DependencyEdge>;
  setEdgesList(value: Array<DependencyEdge>): void;
  addEdges(value?: DependencyEdge, index?: number): DependencyEdge;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractDependencyGraphResult.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractDependencyGraphResult): ExtractDependencyGraphResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractDependencyGraphResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractDependencyGraphResult;
  static deserializeBinaryFromReader(message: ExtractDependencyGraphResult, reader: jspb.BinaryReader): ExtractDependencyGraphResult;
}

export namespace ExtractDependencyGraphResult {
  export type AsObject = {
    ok: boolean,
    error: string,
    edgesList: Array<DependencyEdge.AsObject>,
  }
}

export class ExtractVulnerabilitiesResult extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  clearVulnerabilitiesList(): void;
  getVulnerabilitiesList(): Array<Vulnerability>;
  setVulnerabilitiesList(value: Array<Vulnerability>): void;
  addVulnerabilities(value?: Vulnerability, index?: number): Vulnerability;

  getCount(): number;
  setCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractVulnerabilitiesResult.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractVulnerabilitiesResult): ExtractVulnerabilitiesResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractVulnerabilitiesResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractVulnerabilitiesResult;
  static deserializeBinaryFromReader(message: ExtractVulnerabilitiesResult, reader: jspb.BinaryReader): ExtractVulnerabilitiesResult;
}

export namespace ExtractVulnerabilitiesResult {
  export type AsObject = {
    ok: boolean,
    error: string,
    vulnerabilitiesList: Array<Vulnerability.AsObject>,
    count: number,
  }
}

export class ExtractMetadataResult extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  hasMetadata(): boolean;
  clearMetadata(): void;
  getMetadata(): SbomMetadata | undefined;
  setMetadata(value?: SbomMetadata): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractMetadataResult.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractMetadataResult): ExtractMetadataResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractMetadataResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractMetadataResult;
  static deserializeBinaryFromReader(message: ExtractMetadataResult, reader: jspb.BinaryReader): ExtractMetadataResult;
}

export namespace ExtractMetadataResult {
  export type AsObject = {
    ok: boolean,
    error: string,
    metadata?: SbomMetadata.AsObject,
  }
}

export class CountEntry extends jspb.Message {
  getKey(): string;
  setKey(value: string): void;

  getCount(): number;
  setCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CountEntry.AsObject;
  static toObject(includeInstance: boolean, msg: CountEntry): CountEntry.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CountEntry, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CountEntry;
  static deserializeBinaryFromReader(message: CountEntry, reader: jspb.BinaryReader): CountEntry;
}

export namespace CountEntry {
  export type AsObject = {
    key: string,
    count: number,
  }
}

export class SummarizeResult extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  getComponentCount(): number;
  setComponentCount(value: number): void;

  clearByTypeList(): void;
  getByTypeList(): Array<CountEntry>;
  setByTypeList(value: Array<CountEntry>): void;
  addByType(value?: CountEntry, index?: number): CountEntry;

  clearByLicenseList(): void;
  getByLicenseList(): Array<CountEntry>;
  setByLicenseList(value: Array<CountEntry>): void;
  addByLicense(value?: CountEntry, index?: number): CountEntry;

  clearByEcosystemList(): void;
  getByEcosystemList(): Array<CountEntry>;
  setByEcosystemList(value: Array<CountEntry>): void;
  addByEcosystem(value?: CountEntry, index?: number): CountEntry;

  getVulnerabilityCount(): number;
  setVulnerabilityCount(value: number): void;

  getDependencyEdgeCount(): number;
  setDependencyEdgeCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SummarizeResult.AsObject;
  static toObject(includeInstance: boolean, msg: SummarizeResult): SummarizeResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SummarizeResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SummarizeResult;
  static deserializeBinaryFromReader(message: SummarizeResult, reader: jspb.BinaryReader): SummarizeResult;
}

export namespace SummarizeResult {
  export type AsObject = {
    ok: boolean,
    error: string,
    componentCount: number,
    byTypeList: Array<CountEntry.AsObject>,
    byLicenseList: Array<CountEntry.AsObject>,
    byEcosystemList: Array<CountEntry.AsObject>,
    vulnerabilityCount: number,
    dependencyEdgeCount: number,
  }
}

export class FilterByEcosystemRequest extends jspb.Message {
  getText(): string;
  setText(value: string): void;

  getFormatHint(): string;
  setFormatHint(value: string): void;

  getEcosystem(): string;
  setEcosystem(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FilterByEcosystemRequest.AsObject;
  static toObject(includeInstance: boolean, msg: FilterByEcosystemRequest): FilterByEcosystemRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FilterByEcosystemRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FilterByEcosystemRequest;
  static deserializeBinaryFromReader(message: FilterByEcosystemRequest, reader: jspb.BinaryReader): FilterByEcosystemRequest;
}

export namespace FilterByEcosystemRequest {
  export type AsObject = {
    text: string,
    formatHint: string,
    ecosystem: string,
  }
}

export class ValidateStructureResult extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  getValid(): boolean;
  setValid(value: boolean): void;

  getFormat(): string;
  setFormat(value: string): void;

  clearIssuesList(): void;
  getIssuesList(): Array<string>;
  setIssuesList(value: Array<string>): void;
  addIssues(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ValidateStructureResult.AsObject;
  static toObject(includeInstance: boolean, msg: ValidateStructureResult): ValidateStructureResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ValidateStructureResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ValidateStructureResult;
  static deserializeBinaryFromReader(message: ValidateStructureResult, reader: jspb.BinaryReader): ValidateStructureResult;
}

export namespace ValidateStructureResult {
  export type AsObject = {
    ok: boolean,
    error: string,
    valid: boolean,
    format: string,
    issuesList: Array<string>,
  }
}

