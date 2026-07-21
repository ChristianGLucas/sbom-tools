import {
  Component,
  DependencyEdge,
  Vulnerability,
  VulnerabilityRating,
  SbomMetadata,
  DetectFormatResult,
  NormalizedSbom,
  CountEntry,
} from '../../gen/messages_pb';
import { NComponent, NDependencyEdge, NVulnerability, NMetadata, NFormat, NormalizedSbomData } from './types';

export function componentToMsg(c: NComponent): Component {
  const m = new Component();
  m.setRef(c.ref);
  m.setName(c.name);
  m.setVersion(c.version);
  m.setType(c.type);
  m.setPurl(c.purl);
  m.setSupplier(c.supplier);
  m.setLicensesList(c.licenses);
  m.setLicenseDeclared(c.licenseDeclared);
  m.setCopyright(c.copyright);
  m.setDescription(c.description);
  return m;
}

export function dependencyToMsg(d: NDependencyEdge): DependencyEdge {
  const m = new DependencyEdge();
  m.setRef(d.ref);
  m.setDependsOnList(d.dependsOn);
  return m;
}

export function vulnerabilityToMsg(v: NVulnerability): Vulnerability {
  const m = new Vulnerability();
  m.setId(v.id);
  m.setSource(v.source);
  m.setRatingsList(
    v.ratings.map((r) => {
      const rm = new VulnerabilityRating();
      rm.setSource(r.source);
      rm.setSeverity(r.severity);
      rm.setScore(r.score);
      rm.setMethod(r.method);
      rm.setVector(r.vector);
      return rm;
    }),
  );
  m.setAffectsList(v.affects);
  m.setDescription(v.description);
  return m;
}

export function metadataToMsg(md: NMetadata): SbomMetadata {
  const m = new SbomMetadata();
  m.setToolName(md.toolName);
  m.setToolVersion(md.toolVersion);
  m.setTimestamp(md.timestamp);
  m.setPrimaryComponentRef(md.primaryComponentRef);
  m.setPrimaryComponentName(md.primaryComponentName);
  m.setDocumentName(md.documentName);
  m.setNamespace(md.namespace);
  return m;
}

export function formatToMsg(f: NFormat): DetectFormatResult {
  const m = new DetectFormatResult();
  m.setOk(f.ok);
  m.setError(f.error);
  m.setFormat(f.format);
  m.setEncoding(f.encoding);
  m.setSpecVersion(f.specVersion);
  m.setDetected(f.detected);
  return m;
}

export function normalizedSbomToMsg(n: NormalizedSbomData): NormalizedSbom {
  const m = new NormalizedSbom();
  m.setOk(n.ok);
  m.setError(n.error);
  m.setFormat(formatToMsg(n.format));
  m.setMetadata(metadataToMsg(n.metadata));
  m.setComponentsList(n.components.map(componentToMsg));
  m.setDependenciesList(n.dependencies.map(dependencyToMsg));
  m.setVulnerabilitiesList(n.vulnerabilities.map(vulnerabilityToMsg));
  m.setTruncated(n.truncated);
  return m;
}

export function countEntry(key: string, count: number): CountEntry {
  const m = new CountEntry();
  m.setKey(key);
  m.setCount(count);
  return m;
}
