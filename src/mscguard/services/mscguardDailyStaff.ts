import { mscGuardGet, mscGuardPost } from "./mscguardApi";
import type { AttendanceRecord, DailyStaffListItem } from "../types/mscguardTypes";

export async function fetchDepartments(): Promise<string[]> {
  const data = await mscGuardGet<{ departments: string[] }>("/api/admin/daily-staff/departments");
  return data.departments;
}

export interface AttendanceFilters {
  date?: string;
  staffRef?: string;
  department?: string;
  search?: string;
}

export async function fetchAttendance(filters: AttendanceFilters): Promise<AttendanceRecord[]> {
  const params = new URLSearchParams();
  if (filters.date) params.set("date", filters.date);
  if (filters.staffRef) params.set("staffRef", filters.staffRef);
  if (filters.department) params.set("department", filters.department);
  if (filters.search) params.set("search", filters.search);
  const qs = params.toString();
  const data = await mscGuardGet<{ records: AttendanceRecord[] }>(
    `/api/admin/daily-staff/attendance${qs ? `?${qs}` : ""}`
  );
  return data.records;
}

export interface StaffListFilters {
  search?: string;
  department?: string;
  limit?: number;
  offset?: number;
}

export async function fetchStaffList(filters: StaffListFilters = {}): Promise<{ staff: DailyStaffListItem[]; total: number }> {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.department) params.set("department", filters.department);
  params.set("limit", String(filters.limit ?? 50));
  params.set("offset", String(filters.offset ?? 0));
  return mscGuardGet(`/api/daily-staff/list?${params.toString()}`);
}

export interface CreateStaffInput {
  name: string;
  mobile: string;
  email?: string;
  department: string;
}

export function createStaff(input: CreateStaffInput): Promise<{ ref: string; passcode: string }> {
  return mscGuardPost("/api/admin/daily-staff", input);
}

export function toggleStaff(ref: string): Promise<{ ref: string; isActive: boolean }> {
  return mscGuardPost(`/api/admin/daily-staff/${encodeURIComponent(ref)}/toggle`);
}

export function resetStaffPasscode(ref: string): Promise<{ ref: string; passcode: string }> {
  return mscGuardPost(`/api/admin/daily-staff/${encodeURIComponent(ref)}/reset-passcode`);
}
