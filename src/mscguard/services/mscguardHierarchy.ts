import { mscGuardGet, mscGuardPut, mscGuardDelete } from "./mscguardApi";
import type { EmployeeBasic, EmployeeSearchResult, HierarchyEmployee, MaterialChainLevel } from "../types/mscguardTypes";

export async function fetchHierarchyEmployees(): Promise<HierarchyEmployee[]> {
  const data = await mscGuardGet<{ employees: HierarchyEmployee[] }>("/api/admin/emp-hierarchy");
  return data.employees;
}

// Raw shape /api/admin/emp-hierarchy/:empCode actually returns for each level
// (a passthrough of the tbl_emp_hierarchy row — snake_case approver_code).
interface RawHierarchyLevel {
  level: number;
  role: string;
  name: string | null;
  approver_code: string | null;
  email: string;
  mobile: string | null;
}

export async function fetchHierarchyDetail(
  empCode: string
): Promise<{ employee: EmployeeBasic; levels: MaterialChainLevel[] }> {
  const data = await mscGuardGet<{ employee: EmployeeBasic; levels: RawHierarchyLevel[] }>(
    `/api/admin/emp-hierarchy/${encodeURIComponent(empCode)}`
  );
  return {
    employee: data.employee,
    levels: data.levels.map((lv) => ({
      level: lv.level,
      role: lv.role,
      name: lv.name || "",
      email: lv.email,
      mobile: lv.mobile || "",
      employeeCode: lv.approver_code || "",
    })),
  };
}

export function saveHierarchy(empCode: string, levels: MaterialChainLevel[]): Promise<{ empCode: string }> {
  const payload = levels.map((lv) => ({
    level: lv.level,
    role: lv.role,
    name: lv.name,
    approverCode: lv.employeeCode || "",
    email: lv.email,
    mobile: lv.mobile,
  }));
  return mscGuardPut(`/api/admin/emp-hierarchy/${encodeURIComponent(empCode)}`, { levels: payload });
}

export function deleteHierarchy(empCode: string): Promise<{ empCode: string }> {
  return mscGuardDelete(`/api/admin/emp-hierarchy/${encodeURIComponent(empCode)}`);
}

export async function searchEmployees(search: string): Promise<EmployeeSearchResult[]> {
  const data = await mscGuardGet<EmployeeSearchResult[]>(`/api/employees/search?search=${encodeURIComponent(search)}`);
  return data;
}

export interface EmployeeLookupResult {
  employeeCode: string;
  fullName: string;
  email: string | null;
  department: string | null;
  designation: string | null;
  phone: string | null;
}

/** GET /api/employees/:code — exact-code lookup used by every Employee Code
 *  field (Tab / focus-out triggers this) to auto-fill Name/Department/
 *  Designation. Returns null rather than throwing when the code doesn't
 *  match anything, so callers can just leave the form blank on a miss. */
export async function lookupEmployeeByCode(code: string): Promise<EmployeeLookupResult | null> {
  try {
    return await mscGuardGet<EmployeeLookupResult>(`/api/employees/${encodeURIComponent(code)}`);
  } catch {
    return null;
  }
}
