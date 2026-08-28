import { mscGuardGet, mscGuardPost, mscGuardPut } from "./mscguardApi";
import type { Guard, GuardActivityEvent } from "../types/mscguardTypes";

export function fetchGuards(search = ""): Promise<Guard[]> {
  const qs = search ? `?search=${encodeURIComponent(search)}` : "";
  return mscGuardGet<{ guards: Guard[] }>(`/api/admin/guards${qs}`).then((d) => d.guards);
}

export function fetchGuard(userCode: string): Promise<Guard> {
  return mscGuardGet<Guard>(`/api/admin/guards/${encodeURIComponent(userCode)}`);
}

export interface RegisterGuardInput {
  username: string;
  password: string;
  fullName: string;
  email?: string;
  mobile?: string;
  gateNumber?: string;
  managerMobile?: string;
}

export function registerGuard(input: RegisterGuardInput): Promise<Guard> {
  return mscGuardPost<Guard>("/api/admin/guards", input);
}

export interface UpdateGuardInput {
  fullName?: string;
  email?: string;
  mobile?: string;
  gateNumber?: string;
  managerMobile?: string;
}

export function updateGuard(userCode: string, input: UpdateGuardInput): Promise<Guard> {
  return mscGuardPut<Guard>(`/api/admin/guards/${encodeURIComponent(userCode)}`, input);
}

export function resetGuardPassword(userCode: string, newPassword: string): Promise<{ userCode: string }> {
  return mscGuardPost(`/api/admin/guards/${encodeURIComponent(userCode)}/reset-password`, { newPassword });
}

export function blockGuard(userCode: string): Promise<{ userCode: string; isActive: boolean }> {
  return mscGuardPost(`/api/admin/guards/${encodeURIComponent(userCode)}/block`);
}

export function unblockGuard(userCode: string): Promise<{ userCode: string; isActive: boolean }> {
  return mscGuardPost(`/api/admin/guards/${encodeURIComponent(userCode)}/unblock`);
}

export function forceLogoutGuard(userCode: string): Promise<{ userCode: string }> {
  return mscGuardPost(`/api/admin/guards/${encodeURIComponent(userCode)}/force-logout`);
}

export function fetchGuardActivity(userCode: string): Promise<GuardActivityEvent[]> {
  return mscGuardGet<{ events: GuardActivityEvent[] }>(`/api/admin/guards/${encodeURIComponent(userCode)}/activity`).then(
    (d) => d.events
  );
}
