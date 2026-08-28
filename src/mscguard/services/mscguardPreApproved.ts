import { mscGuardGet, mscGuardPost } from "./mscguardApi";
import type { PreApprovedVisitor } from "../types/mscguardTypes";

export async function searchPreApproved(search: string): Promise<PreApprovedVisitor[]> {
  const data = await mscGuardGet<{ visitors: PreApprovedVisitor[] }>(
    `/api/admin/pre-approved?search=${encodeURIComponent(search)}`
  );
  return data.visitors;
}

export interface CreatePreApprovedInput {
  visitorName: string;
  mobile: string;
  email?: string;
  company?: string;
  purpose: string;
  personToMeet: string;
  deptName: string;
  expectedDate: string;
  expectedTime: string;
  approvedByName: string;
  remarks?: string;
}

export function createPreApproved(
  input: CreatePreApprovedInput
): Promise<{ ref: string; visitorName: string; otp: string; emailSent: boolean }> {
  return mscGuardPost("/api/admin/pre-approved", input);
}
