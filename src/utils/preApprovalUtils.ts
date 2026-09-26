/** "9661697474" -> "966-169-7474"; anything that isn't exactly 10 digits passes through unchanged. */
export const formatMobile = (mobile: string) => {
  const digits = (mobile || "").replace(/\D/g, "");
  return digits.length === 10 ? `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}` : mobile;
};

/** The same wording the Android app shares, so a visitor gets one consistent message. */
export const otpShareMessage = (p: { visitorName: string; expectedDate: string; expectedTime: string; otp: string }) =>
  `Hi ${p.visitorName}, here is your Gate Pass OTP for your visit on ${p.expectedDate} at ${p.expectedTime}: ${p.otp}\n\n` +
  "Please show this OTP to the security guard at the gate.";

export const copyText = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

export const PRE_APPROVAL_STATUS: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "#16a34a" },
  used: { label: "Used", color: "#1e88e5" },
  cancelled: { label: "Cancelled", color: "#dc2626" },
  expired: { label: "Expired", color: "#f59e0b" },
};
