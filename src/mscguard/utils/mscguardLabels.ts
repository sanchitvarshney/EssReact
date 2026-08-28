// Mirrors the backend's utils/statusLabels.js humanizeGpStatus() exactly, so
// status text matches what the (still-live) EJS pages show during migration.

const STATUS_LABELS: Record<string, string> = {
  pending_tl_manager: "Pending from Team Leader & Manager",
  pending_manager: "Pending from Manager",
  pending_hr: "Pending from HR",
  approved_guard: "Approved — Ready for Gate",
  approved: "Approved",
  rejected: "Rejected",
  exited: "Exited",
  returned: "Returned",
  pending: "Pending",
  force_approved: "Force Approved",
};

export function humanizeGpStatus(status: string | null | undefined): string {
  if (!status) return "—";
  if (STATUS_LABELS[status]) return STATUS_LABELS[status];

  const levelMatch = status.match(/^pending_level_(\d+)$/);
  if (levelMatch) return `Pending — Level ${levelMatch[1]} Approval`;

  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const REPORT_TYPE_LABELS: Record<string, string> = {
  employee_gatepass: "Employee Gate Pass",
  material_gatepass: "Material Gate Pass",
  material_in: "Material In",
  material_out: "Material Out",
  return_inward: "Return Inward",
  returnable_out: "Returnable Out",
};

export function humanizeReportType(type: string): string {
  return REPORT_TYPE_LABELS[type] || humanizeGpStatus(type);
}
