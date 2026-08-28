import { mscGuardGet, mscGuardPost, mscGuardPut, mscGuardDelete } from "./mscguardApi";
import type { MaterialChain, MaterialChainLevel, MaterialEntry } from "../types/mscguardTypes";

export async function fetchMaterialEntries(): Promise<MaterialEntry[]> {
  const data = await mscGuardGet<{ entries: MaterialEntry[] }>("/api/material-entries");
  return data.entries;
}

export function reassignMaterialEntry(entryRef: string, name: string, email: string): Promise<unknown> {
  return mscGuardPost(`/api/hr/material-in/${encodeURIComponent(entryRef)}/reassign`, { name, email });
}

export function resendMaterialEntry(entryRef: string): Promise<unknown> {
  return mscGuardPost(`/api/hr/material-in/${encodeURIComponent(entryRef)}/resend`);
}

export async function fetchMaterialChains(): Promise<MaterialChain[]> {
  const data = await mscGuardGet<{ chains: MaterialChain[] }>("/api/admin/material-chains");
  return data.chains;
}

export function fetchMaterialChain(id: number): Promise<{ chain: MaterialChain; levels: MaterialChainLevel[] }> {
  return mscGuardGet(`/api/admin/material-chains/${id}`);
}

export interface MaterialChainInput {
  chainName: string;
  materialType: string | null;
  minAmount: number;
  maxAmount: number | null;
  isDefault: boolean;
  description: string | null;
  levels: MaterialChainLevel[];
}

export function createMaterialChain(input: MaterialChainInput): Promise<{ id: number }> {
  return mscGuardPost("/api/admin/material-chains", input);
}

export function updateMaterialChain(id: number, input: MaterialChainInput): Promise<{ id: number }> {
  return mscGuardPut(`/api/admin/material-chains/${id}`, input);
}

export function deleteMaterialChain(id: number): Promise<{ id: number }> {
  return mscGuardDelete(`/api/admin/material-chains/${id}`);
}
