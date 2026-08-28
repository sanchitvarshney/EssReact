import { mscGuardGet } from "./mscguardApi";

// Backed by BACKEND's existing GET /api/employees/:code (EmployeeController.getByCode /
// EmployeeModel.getByCode) — already used for hierarchy/gatepass lookups, reused here
// for the Pre-Approval form's "Person to Meet" emp-code auto-fill.
export interface EmployeeLookupResult {
  employeeCode: string;
  fullName: string;
  email: string | null;
  department: string | null;
  designation: string | null;
  managerName: string | null;
  managerEmail: string | null;
  hrEmail: string | null;
  phone: string | null;
}

export function lookupEmployeeByCode(code: string): Promise<EmployeeLookupResult> {
  return mscGuardGet<EmployeeLookupResult>(`/api/employees/${encodeURIComponent(code)}`);
}
