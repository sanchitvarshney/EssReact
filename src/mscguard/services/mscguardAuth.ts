// Auth for the MsCGuard admin web app. Reuses the GatePass backend's existing
// generic POST /api/auth/login (same one the Android app uses) — no separate
// login endpoint exists or is needed. Access is restricted to Admin/HR roles
// here in the client, and again server-side by every /api/admin & /api/hr
// route's own auth(['Admin','HR']) middleware.

import type { ApiEnvelope, McGuardSession } from "../types/mscguardTypes";

const BASE_URL = import.meta.env.VITE_GATEPASS_API_BASE_URL;
const SESSION_KEY = "mscguard_session";

export class McGuardAuthError extends Error {}

interface LoginResponseData {
  token: string;
  refreshToken: string;
  userCode: string;
  userName: string;
  fullName: string;
  userRole: string;
  userEmail: string | null;
}

export async function loginMscGuard(username: string, password: string): Promise<McGuardSession> {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const body = (await res.json().catch(() => null)) as ApiEnvelope<LoginResponseData> | null;

  if (!body || !body.success || !body.data) {
    throw new McGuardAuthError(body?.message || "Invalid username or password.");
  }
  if (body.data.userRole !== "Admin" && body.data.userRole !== "HR") {
    throw new McGuardAuthError("This account does not have access to the MsCGuard admin portal.");
  }

  const session: McGuardSession = {
    token: body.data.token,
    refreshToken: body.data.refreshToken,
    userCode: body.data.userCode,
    userName: body.data.userName,
    fullName: body.data.fullName,
    userRole: body.data.userRole,
    userEmail: body.data.userEmail,
  };
  saveMscGuardSession(session);
  return session;
}

export function saveMscGuardSession(session: McGuardSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getMscGuardSession(): McGuardSession | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as McGuardSession;
  } catch {
    return null;
  }
}

export function logoutMscGuard(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function mscGuardAuthHeader(): Record<string, string> {
  const session = getMscGuardSession();
  return session ? { Authorization: `Bearer ${session.token}` } : {};
}

export { BASE_URL as MSCGUARD_API_BASE_URL };
