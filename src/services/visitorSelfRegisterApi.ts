// Same defensive normalization as visitorInviteApi.ts/mscguardAuth.ts — see
// those for why: a scheme-less env value gets silently treated as a
// relative path by fetch() instead of the real API host.
function normalizeBaseUrl(raw: string | undefined): string {
  const value = (raw || "").trim().replace(/\/+$/, "");
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

const BASE_URL = normalizeBaseUrl(import.meta.env.VITE_GATEPASS_API_BASE_URL);

export type SelfRegisterMode = "email" | "mobile";

class SelfRegisterApiError extends Error {}

/**
 * Public, unauthenticated entry point — a visitor starts their OWN
 * pre-registration (no guard needs to send them a link first). Backed by
 * VisitorController.selfRegisterLink. The mobile path only works for a
 * RETURNING visitor who already has an email on file from a past visit
 * (no SMS gateway exists in this system) — a brand-new visitor must use
 * the email path.
 */
export async function requestSelfRegisterLink(
  mode: SelfRegisterMode,
  value: string
): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/visitors/self-register-link`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(mode === "email" ? { mode, email: value } : { mode, mobile: value }),
  });
  const body = await res.json().catch(() => null);
  if (!res.ok || !body || body.success !== true) {
    throw new SelfRegisterApiError(body?.message || "Something went wrong. Please try again.");
  }
  return body.message as string;
}

export { SelfRegisterApiError };
