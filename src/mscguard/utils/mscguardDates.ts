// Shared timestamp formatter for MsCGuard pages. Every backend timestamp
// here is epoch-ms except a couple of date-only ISO strings (e.g.
// Attendance's entry_date field) — dateTime() accepts either.
//
// Standard display format across the whole web app: DD-MM-YYYY HH:mm:ss
// (relative time), e.g. "27-08-2026 21:52:36 (2 hours ago)".

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function toKolkata(ms: number): Date {
  // Render as if in Asia/Kolkata (UTC+5:30) regardless of the viewer's own timezone.
  return new Date(ms + 5.5 * 60 * 60 * 1000);
}

function toMillis(value: number | string): number | null {
  if (typeof value === "number") return value || null;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function timeAgo(ms: number): string {
  const diffSec = Math.round((Date.now() - ms) / 1000);
  const future = diffSec < 0;
  const abs = Math.abs(diffSec);

  if (abs < 60) return future ? "in a few seconds" : "just now";

  let value: number;
  let unit: string;
  if (abs < 3600) {
    value = Math.floor(abs / 60);
    unit = value === 1 ? "minute" : "minutes";
  } else if (abs < 86400) {
    value = Math.floor(abs / 3600);
    unit = value === 1 ? "hour" : "hours";
  } else if (abs < 2592000) {
    value = Math.floor(abs / 86400);
    unit = value === 1 ? "day" : "days";
  } else if (abs < 31536000) {
    value = Math.floor(abs / 2592000);
    unit = value === 1 ? "month" : "months";
  } else {
    value = Math.floor(abs / 31536000);
    unit = value === 1 ? "year" : "years";
  }

  return future ? `in ${value} ${unit}` : `${value} ${unit} ago`;
}

export const Dates = {
  /** DD-MM-YYYY HH:mm:ss (relative time) — the one timestamp format every
   *  page in the app uses. Accepts epoch-ms (the norm) or an ISO date
   *  string. Handles both past and future values ("in 3 days" etc.) since
   *  some fields (Pre-Approval expiry, scheduled visits) are forward-dated. */
  dateTime(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === "") return "—";
    const ms = toMillis(value);
    if (ms === null) return "—";
    const d = toKolkata(ms);
    const datePart = `${pad(d.getUTCDate())}-${pad(d.getUTCMonth() + 1)}-${d.getUTCFullYear()}`;
    const timePart = `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
    return `${datePart} ${timePart} (${timeAgo(ms)})`;
  },

  timeAgo(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === "") return "—";
    const ms = toMillis(value);
    return ms === null ? "—" : timeAgo(ms);
  },

  /** DD-MM-YYYY (relative time) — for genuine calendar-date-only fields
   *  (SQL DATE columns, serialized as UTC midnight) that have no real
   *  time-of-day component. Deliberately skips the Kolkata shift dateTime()
   *  applies: that shift is only valid for real instants, and would turn an
   *  honest "no time recorded" into a fabricated "05:30:00". */
  dateOnly(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === "") return "—";
    const ms = toMillis(value);
    if (ms === null) return "—";
    const d = new Date(ms);
    const datePart = `${pad(d.getUTCDate())}-${pad(d.getUTCMonth() + 1)}-${d.getUTCFullYear()}`;
    return `${datePart} (${timeAgo(ms)})`;
  },
};
