import { useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import CircularProgress from "@mui/material/CircularProgress";
import {
  requestSelfRegisterLink,
  SelfRegisterApiError,
  type SelfRegisterMode,
} from "../services/visitorSelfRegisterApi";

// Same brand tokens as GatepassRequestPage.tsx (/gp/int/emp) and
// VisitorInvitePage.tsx (/gp/int/invite/:token) — this is the third page in
// that family, the entry point BEFORE a visitor has a token: they prove
// they own an email (or a mobile we already have an email on file for),
// and land on VisitorInvitePage from the link we send them.
const PRIMARY = "#018c85";
const ACCENT = "#2eacb3";
const ACCENT_DISABLED = "#a8d9db";

const inputClass =
  "underline-input w-full border-0 border-b-[1.5px] border-[#e2e2e2] px-0.5 py-2 text-base bg-transparent text-[#111] focus:outline-none focus:border-b-[#2eacb3]";
const labelClass = "block text-[12.5px] font-bold text-[#1a1a2e] mb-1.5";

function ModeToggle({ mode, onChange }: { mode: SelfRegisterMode; onChange: (m: SelfRegisterMode) => void }) {
  const opt = (m: SelfRegisterMode, label: string) => (
    <button
      type="button"
      onClick={() => onChange(m)}
      className="flex-1 py-3 rounded-xl text-[13.5px] font-bold border-[1.5px] transition-colors"
      style={
        mode === m
          ? { background: ACCENT, borderColor: ACCENT, color: "#fff" }
          : { background: "#fff", borderColor: "#e2e2e2", color: "#555" }
      }
    >
      {label}
    </button>
  );
  return (
    <div className="flex gap-3">
      {opt("email", "Email ID")}
      {opt("mobile", "Mobile Number")}
    </div>
  );
}

const VisitorSelfRegisterEntryPage = () => {
  const isMobileOrTablet = useMediaQuery("(max-width:1024px)");

  const [mode, setMode] = useState<SelfRegisterMode>("email");
  const [value, setValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const ready =
    mode === "email" ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) : /^\d{7,15}$/.test(value.trim());

  const handleSubmit = async () => {
    if (!ready) return;
    setSubmitting(true);
    setError(null);
    try {
      const message = await requestSelfRegisterLink(mode, value.trim());
      setSuccessMessage(message);
    } catch (e) {
      setError(e instanceof SelfRegisterApiError ? e.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isMobileOrTablet) {
    return (
      <div className="h-screen w-full flex items-center justify-center px-6 bg-white">
        <p className="text-red-600 text-center text-base font-semibold">
          This page is only available on mobile and tablet devices. Please open it on your phone or tablet.
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-white flex flex-col overflow-hidden">
      {/* Topbar */}
      <div className="flex items-center justify-between px-[18px] py-4 flex-shrink-0" style={{ background: PRIMARY, color: "#fff" }}>
        <span className="text-[16px] font-bold tracking-wide">Visitor Registration</span>
        <span className="w-9 h-9 rounded-full bg-white flex items-center justify-center flex-shrink-0 overflow-hidden">
          <img src="/msc-48x48.png" alt="mscorpres" className="w-6 h-6 object-contain" />
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-[26px] pb-5">
        {successMessage ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="text-5xl mb-4">📩</div>
            <h1 className="text-[19px] font-extrabold text-[#111] mb-2">Check Your Email</h1>
            <p className="text-[13px] text-[#767676] leading-relaxed">{successMessage}</p>
            <p className="text-[12px] text-[#999] leading-relaxed mt-4">
              Didn't get it? Check your spam folder, or try again in a minute.
            </p>
          </div>
        ) : (
          <div>
            <h1 className="text-[19px] font-extrabold text-[#111] mb-1.5 leading-tight">
              Register your visit
            </h1>
            <p className="text-[13px] text-[#767676] leading-relaxed mb-6">
              Enter your email or mobile number — we'll send you a link to fill in the rest of your details.
            </p>

            <div className="mb-6">
              <ModeToggle mode={mode} onChange={(m) => { setMode(m); setValue(""); setError(null); }} />
            </div>

            {mode === "email" ? (
              <div className="mb-2">
                <label className={labelClass}>Email ID *</label>
                <input
                  type="email"
                  className={inputClass}
                  placeholder="you@example.com"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  maxLength={80}
                />
              </div>
            ) : (
              <div className="mb-2">
                <label className={labelClass}>Mobile Number *</label>
                <input
                  className={inputClass}
                  placeholder="10-digit mobile"
                  value={value}
                  onChange={(e) => setValue(e.target.value.replace(/\D/g, ""))}
                  maxLength={15}
                />
                <p className="text-[11px] text-[#999] mt-2 leading-snug">
                  Works only if you've visited before — the link goes to the email already on file.
                  First-time visitor? Use the Email option instead.
                </p>
              </div>
            )}

            {error && (
              <div className="text-[13px] mt-4 px-3 py-2.5 rounded-md bg-[#fdeeea] text-[#a8362b]">{error}</div>
            )}
          </div>
        )}
      </div>

      {!successMessage && (
        <div className="flex-shrink-0 bg-white px-5 py-4" style={{ boxShadow: "0 -2px 10px rgba(0,0,0,0.08)" }}>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!ready || submitting}
            className="w-full py-[15px] rounded-full text-white text-[15px] font-bold flex items-center justify-center gap-2"
            style={{ background: ready && !submitting ? ACCENT : ACCENT_DISABLED }}
          >
            {submitting && <CircularProgress size={16} color="inherit" />}
            {submitting ? "Sending..." : "Send Verification Link"}
          </button>
        </div>
      )}
    </div>
  );
};

export default VisitorSelfRegisterEntryPage;
