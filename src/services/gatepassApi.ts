// Same defensive normalization as visitorInviteApi.ts/mscguardAuth.ts — see
// those for why: a scheme-less env value gets silently treated as a
// relative path by fetch() instead of the real API host.
function normalizeBaseUrl(raw: string | undefined): string {
  const value = (raw || "").trim().replace(/\/+$/, "");
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

const BASE_URL = normalizeBaseUrl(import.meta.env.VITE_GATEPASS_API_BASE_URL);

export interface ApproverInfo {
  name: string;
  code: string | null;
  email: string;
  mobile: string | null;
}

export interface EmployeeLookupData {
  empCode: string;
  empName: string;
  department: string;
  designation: string;
  email: string;
  mobile: string;
  final: {
    manager: ApproverInfo | null;
    hr: ApproverInfo | null;
  };
  managerConfigured: boolean;
  hrConfigured: boolean;
}

export interface TlOption {
  code: string;
  name: string;
  email: string;
}

export interface SubmitGatepassPayload {
  employee_code: string;
  employee_name: string;
  department: string;
  employee_email: string;
  tl_code: string;
  tl_name: string;
  tl_email: string;
  gatepass_subtype: "half_day" | "full_day";
  will_return: "yes" | "no";
  exit_date: string;
  exit_time: string;
  return_date?: string;
  return_time?: string;
  reason: string;
}

class GatepassApiError extends Error {
  code?: string;
  constructor(message: string, code?: string) {
    super(message);
    this.code = code;
  }
}

async function parseJsonOrThrow(res: Response) {
  const body = await res.json().catch(() => null);
  if (!res.ok || !body || body.status !== "success") {
    throw new GatepassApiError(
      body?.message || "Something went wrong. Please try again.",
      body?.code
    );
  }
  return body;
}

/** @param dob "DD-MM" (day-month only, zero-padded) — HRMS never stores/returns
 *  a year for DOB, removed on their side for the employee's privacy. */
export async function lookupEmployee(
  empCode: string,
  dob: string
): Promise<EmployeeLookupData> {
  const res = await fetch(
    `${BASE_URL}/gatepass/employee-lookup?empCode=${encodeURIComponent(
      empCode
    )}&dob=${encodeURIComponent(dob)}`,
    { headers: { Accept: "application/json" } }
  );
  const body = await parseJsonOrThrow(res);
  return body.data as EmployeeLookupData;
}

export async function getTlOptions(): Promise<TlOption[]> {
  const res = await fetch(`${BASE_URL}/gatepass/tl-options`, {
    headers: { Accept: "application/json" },
  });
  const body = await parseJsonOrThrow(res);
  return (body.data || []) as TlOption[];
}

export async function submitEmployeeGatepass(
  payload: SubmitGatepassPayload
): Promise<{ gpRef: string }> {
  const res = await fetch(`${BASE_URL}/gatepass/new/employee`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const body = await parseJsonOrThrow(res);
  return body.data as { gpRef: string };
}

export { GatepassApiError };
