import { DID_METHOD } from "./constants";

export function composeDid(type: string, network: string, extPK: string): string {
  return `did:${DID_METHOD}:${type}:${network}:${extPK}`;
}

export function parseDidUrl(didUrl: string): { method: string, type: string, network: string, extPK: string, query: string } {
  const splited = didUrl.split("?");
  return {
    query: splited.length > 1 ? splited[1] : "",
    ...parseDid(splited[0])
  }
}

export function parseDid(did: string): { method: string, type: string, network: string, extPK: string } {
  const splited = did.split(":");
  if (splited.length != 5) {
    throw new Error("EPIC DID not valid: " + did)
  }
  if (splited[1] != DID_METHOD) {
    throw new Error("EPIC method not valid: " + splited[1])
  }
  return {
    method: splited[1],
    type: splited[2],
    network: splited[3],
    extPK: splited[4]
  }
}
