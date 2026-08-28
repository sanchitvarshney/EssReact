// Shared fetch helper for every MsCGuard service file — one place that
// attaches the Bearer token and unwraps the {status,success,data} envelope
// every GatePass backend JSON endpoint uses.

import { mscGuardAuthHeader, MSCGUARD_API_BASE_URL } from "./mscguardAuth";
import type { ApiEnvelope } from "../types/mscguardTypes";

export class McGuardApiError extends Error {}

async function unwrap<T>(res: Response): Promise<T> {
  const body = (await res.json().catch(() => null)) as ApiEnvelope<T> | null;
  if (!res.ok || !body || !body.success) {
    throw new McGuardApiError(body?.message || "Something went wrong. Please try again.");
  }
  return body.data as T;
}

export function mscGuardGet<T>(path: string): Promise<T> {
  return fetch(`${MSCGUARD_API_BASE_URL}${path}`, {
    headers: { Accept: "application/json", ...mscGuardAuthHeader() },
  }).then(unwrap<T>);
}

export function mscGuardPost<T>(path: string, body?: unknown): Promise<T> {
  return fetch(`${MSCGUARD_API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...mscGuardAuthHeader(),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  }).then(unwrap<T>);
}

export function mscGuardPut<T>(path: string, body?: unknown): Promise<T> {
  return fetch(`${MSCGUARD_API_BASE_URL}${path}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...mscGuardAuthHeader(),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  }).then(unwrap<T>);
}

export function mscGuardDelete<T>(path: string): Promise<T> {
  return fetch(`${MSCGUARD_API_BASE_URL}${path}`, {
    method: "DELETE",
    headers: { Accept: "application/json", ...mscGuardAuthHeader() },
  }).then(unwrap<T>);
}

/** Downloads an authenticated file endpoint (CSV/PDF) — a plain <a href> can't
 *  carry the Bearer header, so this fetches as a Blob and triggers the save
 *  via a temporary object URL instead. */
export async function mscGuardDownload(path: string, filename: string): Promise<void> {
  const res = await fetch(`${MSCGUARD_API_BASE_URL}${path}`, {
    headers: mscGuardAuthHeader(),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as ApiEnvelope<unknown> | null;
    throw new McGuardApiError(body?.message || "Download failed. Please try again.");
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
