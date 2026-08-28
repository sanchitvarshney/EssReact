// Live-as-you-type input formatters/validators — wired into every free-text
// form field on the visitor-registration pages (VisitorInvitePage,
// VisitorSelfRegisterEntryPage, PreApprovals). Deliberately NOT applied to
// any field whose value comes from a dropdown/master/API (Purpose, ID Type,
// Person-to-Meet-via-employee-lookup, Department) — those are already
// constrained by their source list, not free-typed.
//
// Mirrors the equivalent Android utils (util/Validators.kt,
// util/TextFormatters.kt) in spirit, kept simpler here (charset filtering
// only, no Title Case) — ask for the same polish if wanted.

import type { ClipboardEvent, KeyboardEvent } from "react";

/** Letters, spaces and dots only — person names, "Person to Meet". */
export function formatNameInput(raw: string): string {
  return raw.replace(/[^A-Za-z. ]/g, "");
}

/** Same charset as names — company/vendor names typed freely (not from a master/dropdown). */
export function formatCompanyInput(raw: string): string {
  return raw.replace(/[^A-Za-z. ]/g, "");
}

/** Restricts keystrokes to characters a valid email can contain; lowercased as typed. */
export function formatEmailInput(raw: string): string {
  return raw.replace(/[^A-Za-z0-9_.@-]/g, "").toLowerCase();
}

export function isValidEmail(value: string): boolean {
  return /^[A-Za-z0-9_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value.trim());
}

/** Letters/digits only, forced uppercase — vehicle registration numbers. */
export function formatVehicleInput(raw: string): string {
  return raw.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
}

/** Letters, digits, dot, hyphen, comma, plus, apostrophe, space — addresses. */
export function formatAddressInput(raw: string): string {
  return raw.replace(/[^A-Za-z0-9.\-,+' ]/g, "");
}

/** Digits only, capped at 10 — as typed. */
export function formatMobileInput(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 10);
}

/** Indian mobile: 10 digits, first digit 6-9. */
export function isValidMobile(value: string): boolean {
  return /^[6-9]\d{9}$/.test(value.trim());
}

// ── Block-at-entry guards ───────────────────────────────────────────────────
// A disallowed character must never be typeable in the first place — letting
// it appear and then stripping it in onChange reads as "I typed it, then it
// vanished" (confusing: did I lose data?). onKeyDown intercepts the
// keystroke before it ever reaches the input, so it simply never appears.
// Paste/drag-drop/IME don't go through onKeyDown, so onPaste is handled
// separately (rewriting the pasted text before it's inserted, same
// never-appears principle) and the field's existing onChange formatter stays
// as a last-resort net for anything that still slips through.

/** True for a keystroke that shouldn't be charset-filtered at all — navigation,
 *  editing, and OS-level shortcuts (copy/paste/select-all/undo) must pass through. */
function isControlKeystroke(e: KeyboardEvent<HTMLInputElement>): boolean {
  return e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey;
}

/** onKeyDown handler that blocks any single printable keystroke outside `allowed`. */
function makeKeyDownGuard(allowed: RegExp) {
  return (e: KeyboardEvent<HTMLInputElement>) => {
    if (isControlKeystroke(e)) return;
    if (!allowed.test(e.key)) e.preventDefault();
  };
}

/** onPaste handler that inserts only the allowed characters from the clipboard,
 *  respecting cursor/selection, instead of pasting-then-stripping. */
function makePasteGuard(allowed: RegExp, transform: (s: string) => string = (s) => s) {
  return (e: ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text");
    const filtered = transform(Array.from(text).filter((ch) => allowed.test(ch)).join(""));
    e.preventDefault();
    const input = e.currentTarget;
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
    nativeSetter?.call(input, input.value.slice(0, start) + filtered + input.value.slice(end));
    input.dispatchEvent(new Event("input", { bubbles: true }));
    requestAnimationFrame(() => {
      input.setSelectionRange(start + filtered.length, start + filtered.length);
    });
  };
}

const NAME_CHAR = /[A-Za-z. ]/;
const EMAIL_CHAR = /[A-Za-z0-9_.@-]/;
const VEHICLE_CHAR = /[A-Za-z0-9]/;
const ADDRESS_CHAR = /[A-Za-z0-9.\-,+' ]/;
const DIGIT_CHAR = /[0-9]/;

/** Spread onto an <input> alongside its onChange formatter: `{...nameGuard} onChange={...}` */
export const nameGuard = { onKeyDown: makeKeyDownGuard(NAME_CHAR), onPaste: makePasteGuard(NAME_CHAR) };
export const companyGuard = nameGuard;
export const emailGuard = { onKeyDown: makeKeyDownGuard(EMAIL_CHAR), onPaste: makePasteGuard(EMAIL_CHAR, (s) => s.toLowerCase()) };
export const vehicleGuard = { onKeyDown: makeKeyDownGuard(VEHICLE_CHAR), onPaste: makePasteGuard(VEHICLE_CHAR, (s) => s.toUpperCase()) };
export const addressGuard = { onKeyDown: makeKeyDownGuard(ADDRESS_CHAR), onPaste: makePasteGuard(ADDRESS_CHAR) };
export const mobileGuard = { onKeyDown: makeKeyDownGuard(DIGIT_CHAR), onPaste: makePasteGuard(DIGIT_CHAR) };
