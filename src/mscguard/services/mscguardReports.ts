import { mscGuardGet, mscGuardDownload } from "./mscguardApi";
import type { ReportRow } from "../types/mscguardTypes";

export interface ReportRowFilters {
  type?: string;
  from?: number;
  to?: number;
  q?: string;
}

function buildQuery(filters: ReportRowFilters): string {
  const params = new URLSearchParams();
  if (filters.type) params.set("type", filters.type);
  if (filters.from) params.set("from", String(filters.from));
  if (filters.to) params.set("to", String(filters.to));
  if (filters.q) params.set("q", filters.q);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function fetchReportRows(filters: ReportRowFilters): Promise<{ rows: ReportRow[]; totalRows: number }> {
  return mscGuardGet(`/api/admin/reports/rows${buildQuery(filters)}`);
}

export function downloadReportCsv(filters: Omit<ReportRowFilters, "q">): Promise<void> {
  return mscGuardDownload(`/api/admin/reports/export.csv${buildQuery(filters)}`, `gatepass-report-${Date.now()}.csv`);
}

export function downloadReportPdf(filters: Omit<ReportRowFilters, "q">): Promise<void> {
  return mscGuardDownload(`/api/admin/reports/export.pdf${buildQuery(filters)}`, `gatepass-report-${Date.now()}.pdf`);
}
