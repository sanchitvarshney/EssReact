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
