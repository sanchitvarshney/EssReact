// Same defensive normalization as mscguardAuth.ts — if the env var is ever
// set without a scheme (e.g. "vms.mscapi.live" instead of
// "https://vms.mscapi.live"), a plain fetch() silently treats it as a
// RELATIVE path and resolves against the CURRENT page's own origin instead
// of the real API host. Forcing a scheme here means that failure mode can't
// happen again regardless of how the env var ends up set at deploy time.
function normalizeBaseUrl(raw: string | undefined): string {
  const value = (raw || "").trim().replace(/\/+$/, "");
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

const BASE_URL = normalizeBaseUrl(import.meta.env.VITE_GATEPASS_API_BASE_URL);

export interface PreregEntry {
  visitorName: string;
  mobile: string;
  email: string;
}

export interface SubmitPreregPayload {
  visitorName: string;
  mobileNumber: string;
  emailAddress?: string;
  companyName?: string;
  homeAddress?: string;
  vehicleNo?: string;
  purpose: string;
  personToMeet: string;
  deptName: string;
}

class VisitorInviteApiError extends Error {
  code?: string;
  constructor(message: string, code?: string) {
    super(message);
    this.code = code;
  }
}

async function parseJsonOrThrow(res: Response) {
  const body = await res.json().catch(() => null);
  if (!res.ok || !body || body.status !== "success") {
    throw new VisitorInviteApiError(
      body?.message || "Something went wrong. Please try again.",
      body?.code
    );
  }
  return body;
}

export async function fetchPreregEntry(token: string): Promise<PreregEntry> {
  const res = await fetch(`${BASE_URL}/api/visitors/invite/${encodeURIComponent(token)}`, {
    headers: { Accept: "application/json" },
  });
  const body = await parseJsonOrThrow(res);
  return body.data as PreregEntry;
}

export async function submitPreregistration(
  token: string,
  payload: SubmitPreregPayload
): Promise<{ visitRef: string; visitorName: string }> {
  const res = await fetch(`${BASE_URL}/api/visitors/invite/${encodeURIComponent(token)}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const body = await parseJsonOrThrow(res);
  return body.data as { visitRef: string; visitorName: string };
}

export { VisitorInviteApiError };
