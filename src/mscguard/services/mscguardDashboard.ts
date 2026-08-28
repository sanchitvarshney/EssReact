// Dashboard data for MsCGuard — both endpoints already exist on the GatePass
// backend (built earlier for a different consumer), reused as-is: no new
// backend work was needed for this page.

import { mscGuardGet } from "./mscguardApi";
import type { DashboardSummaryData, PendingRow } from "../types/mscguardTypes";

/** GET /api/admin/reports/summary — counts by type/status/department. No from/to = all time. */
export function fetchDashboardSummary(from?: number, to?: number): Promise<DashboardSummaryData> {
  const params = new URLSearchParams();
  if (from) params.set("from", String(from));
  if (to) params.set("to", String(to));
  const qs = params.toString();
  return mscGuardGet<DashboardSummaryData>(`/api/admin/reports/summary${qs ? `?${qs}` : ""}`);
}

/** GET /api/admin/pending — unified pending list across gatepass/material/return-inward. */
export async function fetchPendingList(): Promise<PendingRow[]> {
  const data = await mscGuardGet<{ rows: PendingRow[] }>("/api/admin/pending");
  return data.rows;
}
