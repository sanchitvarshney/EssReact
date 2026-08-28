import { mscGuardGet, mscGuardPost } from "./mscguardApi";
import type { EmployeeGatepassRow } from "../types/mscguardTypes";

export async function fetchGatepassList(q: string): Promise<EmployeeGatepassRow[]> {
  const query = q.trim() ? `?q=${encodeURIComponent(q.trim())}` : "";
  const data = await mscGuardGet<{ rows: EmployeeGatepassRow[] }>(`/api/admin/gatepass${query}`);
  return data.rows;
}

export interface GatepassDetailData {
  gp: EmployeeGatepassRow;
  materials: unknown[];
}

export function fetchGatepassDetail(gpRef: string): Promise<GatepassDetailData> {
  return mscGuardGet<GatepassDetailData>(`/api/admin/pending/gatepass/${encodeURIComponent(gpRef)}`);
}

export function reassignGatepassTl(gpRef: string, tlCode: string, tlName: string, tlEmail: string): Promise<unknown> {
  return mscGuardPost(`/api/hr/gatepass/${encodeURIComponent(gpRef)}/reassign-tl`, {
    tl_code: tlCode,
    tl_name: tlName,
    tl_email: tlEmail,
  });
}

export function reassignGatepassManager(gpRef: string, managerName: string, managerEmail: string): Promise<unknown> {
  return mscGuardPost(`/api/hr/gatepass/${encodeURIComponent(gpRef)}/reassign-manager`, {
    manager_name: managerName,
    manager_email: managerEmail,
  });
}

export function resendGatepassApproval(gpRef: string, role: "tl" | "manager" | "hr"): Promise<unknown> {
  return mscGuardPost(`/api/hr/gatepass/${encodeURIComponent(gpRef)}/resend/${role}`);
}
