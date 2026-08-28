// Shared TypeScript types for the MsCGuard admin web app (GatePass system).

export type McGuardRole = "Admin" | "HR";

export interface McGuardSession {
  token: string;
  refreshToken: string;
  userCode: string;
  userName: string;
  fullName: string;
  userRole: McGuardRole;
  userEmail: string | null;
}

export interface ApiEnvelope<T> {
  status: "success" | "error";
  success: boolean;
  message?: string;
  data?: T;
}

// ── Dashboard: /api/admin/reports/summary ──────────────────────────────────
export interface ReportTypeSummary {
  total: number;
  byStatus: Record<string, number>;
  byDepartment: Record<string, number>;
}

export type ReportSummary = Record<string, ReportTypeSummary>;

export interface DashboardSummaryData {
  summary: ReportSummary;
  totalRows: number;
}

// ── Dashboard: /api/admin/pending ───────────────────────────────────────────
export type PendingRowType =
  | "employee_gatepass"
  | "material_gatepass"
  | "material_in"
  | "return_inward"
  | "returnable_out";

export interface PendingRow {
  type: PendingRowType;
  ref: string;
  title: string;
  personName: string;
  department: string | null;
  status: string;
  createdAt: number;
  actionable: boolean;
}

// ── Reports: /api/admin/reports/rows ────────────────────────────────────────
export interface ReportRow {
  type: string;
  ref: string;
  personName: string;
  department: string | null;
  status: string;
  createdAt: number;
}

// ── Gate Pass Approvals: /api/admin/gatepass, /api/admin/pending/gatepass ──
export interface EmployeeGatepassRow {
  gp_ref: string;
  employee_code: string;
  employee_name: string;
  department: string | null;
  tl_status: string | null;
  tl_name: string | null;
  manager_status: string | null;
  manager_name: string | null;
  hr_status: string | null;
  hr_name: string | null;
  status: string;
  created_at: number;
  [key: string]: unknown;
}

// ── Material Approvals: /api/material-entries, /api/admin/material-chains ──
export interface MaterialEntry {
  entryRef: string;
  passNumber: string | null;
  flowDirection: "In" | "Out";
  materialCategory: string | null;
  requestedBy: string;
  deptName: string | null;
  supplierName: string | null;
  itemDescription: string;
  itemQty: number;
  qtyUnit: string | null;
  status: string | null;
  entryTime: number;
  approvedBy: string | null;
}

// Shared by Material Chain levels and Employee Hierarchy levels. `role` is
// restricted to TL/Manager/HR in the UI. `employeeCode` is the field the
// Employee Code lookup fills — it round-trips for Emp Hierarchy (stored as
// approver_code there) but is client-side-only for Material Chains (no such
// column on that table, so it's just dropped before saving).
export type ApprovalRole = "TL" | "Manager" | "HR";

export interface MaterialChainLevel {
  level: number;
  role: string;
  name: string;
  email: string;
  mobile: string;
  employeeCode?: string;
}

// MaterialChainModel.getAll/getById return raw Prisma rows (snake_case) —
// unlike create/update, whose input body IS camelCase (see MaterialChainInput
// in mscguardMaterial.ts). Two different shapes for the same entity, by design
// on the backend side.
export interface MaterialChain {
  id: number;
  chain_name: string;
  material_type: string | null;
  min_amount: number;
  max_amount: number | null;
  is_default: boolean;
  description: string | null;
  level_count: number;
}

// ── Pre-Approvals: /api/admin/pre-approved ──────────────────────────────────
export interface PreApprovedVisitor {
  ref: string;
  visitorName: string;
  mobile: string;
  email: string | null;
  company: string | null;
  purpose: string;
  personToMeet: string;
  deptName: string;
  expectedDate: string;
  expectedTime: string;
  approvedByName: string;
  otp: string;
  status: string;
}

// ── Attendance / Employee Codes: /api/admin/daily-staff, /api/daily-staff ──
export interface DailyStaffListItem {
  ref: string;
  empCode: string;
  name: string;
  mobile: string;
  email: string | null;
  department: string | null;
  designation: string | null;
  isActive: boolean;
  isInsideNow: boolean;
}

export interface AttendanceRecord {
  ref: string;
  staff_ref: string;
  entry_date: string;
  in_time: number;
  out_time: number | null;
  duration_sec: number | null;
  name: string | null;
  mobile: string | null;
  department: string | null;
}

// ── Employee/Manager Hierarchy: /api/admin/emp-hierarchy ───────────────────
export interface HierarchyEmployee {
  emp_code: string;
  full_name: string;
  department: string | null;
  email: string | null;
  level_count: number;
}

export interface EmployeeBasic {
  emp_code: string;
  full_name: string;
  department: string | null;
  email: string | null;
}

// ── /api/employees/search (camelCase — a different shape than EmployeeBasic
// above, which comes from a different endpoint) ─────────────────────────────
export interface EmployeeSearchResult {
  employeeCode: string;
  fullName: string;
  department: string | null;
  phone: string | null;
}

// ── Guard Accounts: /api/admin/guards ───────────────────────────────────────
export interface Guard {
  userCode: string;
  username: string;
  fullName: string;
  email: string | null;
  mobile: string | null;
  gateNumber: string | null;
  managerMobile: string | null;
  isActive: boolean;
  createdAt: number | null;
}

export interface GuardActivityEvent {
  kind: "account" | "gatepass" | "material" | "attendance";
  action: string;
  detail: string | null;
  actorName?: string;
  createdAt: number | null;
}

// ── App Settings: /api/settings/face-recognition ────────────────────────────
export interface FaceRecognitionSettings {
  enabled: boolean;
  threshold: number; // 0–1
}
