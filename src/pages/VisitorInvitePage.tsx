import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import CircularProgress from "@mui/material/CircularProgress";
import { useToast } from "../hooks/useToast";
import {
  fetchPreregEntry,
  submitPreregistration,
  VisitorInviteApiError,
  type PreregEntry,
} from "../services/visitorInviteApi";

// Same brand tokens as GatepassRequestPage.tsx (/gp/int/emp) — this page is
// its sibling under /gp/int/invite, so it reads as one family rather than
// switching skins mid-journey (email → this form both live under ess.mscorpres.com).
const PRIMARY = "#018c85";
const ACCENT = "#2eacb3";
const ACCENT_DISABLED = "#a8d9db";

const inputClass =
  "underline-input w-full border-0 border-b-[1.5px] border-[#e2e2e2] px-0.5 py-2 text-base bg-transparent text-[#111] focus:outline-none focus:border-b-[#2eacb3] disabled:text-[#888] disabled:cursor-not-allowed";
const labelClass = "block text-[12.5px] font-bold text-[#1a1a2e] mb-1.5";

const PURPOSE_OPTIONS = [
  "Meeting",
  "Delivery",
  "Interview",
  "Vendor / Supplier",
  "Official Work",
  "Personal",
  "Maintenance",
  "Other",
];

const ID_TYPE_OPTIONS = ["Voter ID", "Passport", "Aadhar", "Driving Licence", "PAN"];

// Once the form loads, the visitor has this long to submit — mirrors the
// backend's FORM_FILL_MS (VisitorController.js). Server re-checks this on
// submit too, so this client-side countdown is UX only, not the real gate.
const FORM_FILL_SECONDS = 5 * 60;

function PillToggle({
  options,
  value,
  onChange,
  disabled = false,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex gap-2.5 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          disabled={disabled}
          onClick={() => onChange(opt)}
          className="px-4 py-2 rounded-full text-[13px] font-semibold border-[1.5px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={
            value === opt
              ? { background: ACCENT, borderColor: ACCENT, color: "#fff" }
              : { background: "#fff", borderColor: "#e2e2e2", color: "#555" }
          }
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start py-2.5 border-b border-[#f0f0f0] gap-4">
      <span className="text-[13px] text-[#767676] flex-shrink-0">{label}</span>
      <span className="text-[13px] font-semibold text-right text-[#111]">{value}</span>
    </div>
  );
}

function formatMMSS(totalSeconds: number): string {
  const s = Math.max(0, totalSeconds);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

// step 1 = your details · 2 = visit details · 3 = review & submit
type Step = 1 | 2 | 3 | "success";
const STEP_LABELS: Record<number, string> = {
  1: "Your Details",
  2: "Visit Details",
  3: "Review & Submit",
};

const VisitorInvitePage = () => {
  const { token } = useParams<{ token: string }>();
  const isMobileOrTablet = useMediaQuery("(max-width:1024px)");
  const { showToast } = useToast();

  // "expired" is a hard stop — 5-minute fill window is over, either the
  // client countdown hit zero or the server rejected a late submit.
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error" | "expired">("loading");
  const [loadError, setLoadError] = useState<string | null>(null);

  const [step, setStep] = useState<Step>(1);

  // Step 1
  const [visitorName, setVisitorName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [nameLocked, setNameLocked] = useState(false);
  const [mobileLocked, setMobileLocked] = useState(false);
  const [emailLocked, setEmailLocked] = useState(false);

  // Step 2
  const [purpose, setPurpose] = useState("");
  const [personToMeet, setPersonToMeet] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [homeAddress, setHomeAddress] = useState("");

  // Step 2 — optional identity proof
  const [idType, setIdType] = useState("");
  const [idDocBase64, setIdDocBase64] = useState<string | null>(null);
  const [idDocFileName, setIdDocFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [visitRef, setVisitRef] = useState<string | null>(null);

  const [closeAttempted, setCloseAttempted] = useState(false);
  const handleCloseTab = () => {
    window.close();
    setTimeout(() => setCloseAttempted(true), 400);
  };

  // Hard 5-minute session timer, counted down from the server's
  // secondsRemaining at load time.
  const [secondsLeft, setSecondsLeft] = useState(FORM_FILL_SECONDS);

  useEffect(() => {
    if (!token) {
      setLoadState("error");
      setLoadError("This link is missing a registration code.");
      return;
    }
    fetchPreregEntry(token)
      .then((entry: PreregEntry) => {
        setVisitorName(entry.visitorName);
        setMobileNumber(entry.mobile);
        setEmailAddress(entry.email);
        setNameLocked(entry.nameLocked);
        setMobileLocked(entry.mobileLocked);
        setEmailLocked(entry.emailLocked);
        setSecondsLeft(entry.secondsRemaining);
        setLoadState("loaded");
      })
      .catch((e) => {
        const err = e instanceof VisitorInviteApiError ? e : null;
        if (err?.code === "FORM_EXPIRED") {
          setLoadState("expired");
          return;
        }
        setLoadError(err?.message || "Could not load this registration link.");
        setLoadState("error");
      });
  }, [token]);

  // Countdown ticks only while the form is actually being filled — stop
  // once submitted (success) so the success screen never gets clobbered.
  useEffect(() => {
    if (loadState !== "loaded" || step === "success") return;
    if (secondsLeft <= 0) {
      setLoadState("expired");
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [loadState, step, secondsLeft]);

  const step1Ready =
    (nameLocked || visitorName.trim().length > 0) && (mobileLocked || mobileNumber.trim().length > 0);
  const step2Ready = purpose.trim().length > 0 && personToMeet.trim().length > 0;

  const handleIdDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIdDocFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => setIdDocBase64(reader.result as string);
    reader.readAsDataURL(file);
  };

  const clearIdDoc = () => {
    setIdDocFileName(null);
    setIdDocBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!token || !step1Ready || !step2Ready) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const result = await submitPreregistration(token, {
        visitorName: visitorName.trim(),
        mobileNumber: mobileNumber.trim(),
        emailAddress: emailAddress.trim() || undefined,
        companyName: companyName.trim() || undefined,
        homeAddress: homeAddress.trim() || undefined,
        vehicleNo: vehicleNo.trim() || undefined,
        purpose,
        personToMeet: personToMeet.trim(),
        idType: idType || undefined,
        idDocumentBase64: idDocBase64 || undefined,
      });
      setVisitRef(result.visitRef);
      setStep("success");
    } catch (e) {
      const err = e instanceof VisitorInviteApiError ? e : null;
      if (err?.code === "FORM_EXPIRED") {
        setLoadState("expired");
        return;
      }
      const msg = err?.message || "Could not submit your details. Please try again.";
      setSubmitError(msg);
      showToast(msg, "error");
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

  const numericStep = typeof step === "number" ? step : 3;
  const timerWarning = loadState === "loaded" && step !== "success" && secondsLeft <= 60;

  return (
    <div className="h-screen w-full bg-white flex flex-col overflow-hidden">
      {/* Topbar */}
      <div className="flex items-center justify-between px-[18px] py-4 flex-shrink-0" style={{ background: PRIMARY, color: "#fff" }}>
        <div>
          <span className="text-[16px] font-bold tracking-wide block">Visitor Pre-Registration</span>
          {loadState === "loaded" && step !== "success" && (
            <span
              className="text-[11px] font-semibold block mt-0.5"
              style={{ color: timerWarning ? "#ffd3cc" : "rgba(255,255,255,0.75)" }}
            >
              Time allowed: {formatMMSS(secondsLeft)}
            </span>
          )}
        </div>
        <span className="w-9 h-9 rounded-full bg-white flex items-center justify-center flex-shrink-0 overflow-hidden">
          <img src="/msc-48x48.png" alt="mscorpres" className="w-6 h-6 object-contain" />
        </span>
      </div>

      {/* Step progress (loaded, non-success only) */}
      {loadState === "loaded" && step !== "success" && (
        <div className="px-5 pt-4 flex-shrink-0">
          <div className="flex gap-1.5 mb-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="h-1 flex-1 rounded-full" style={{ background: numericStep >= s ? ACCENT : "#e2e2e2" }} />
            ))}
          </div>
          <p className="text-[11.5px] font-bold text-[#999] uppercase tracking-wide">
            Step {numericStep} of 3 — {STEP_LABELS[numericStep]}
          </p>
        </div>
      )}

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-5 pt-[22px] pb-5">
        {loadState === "loading" && (
          <div className="h-full flex flex-col items-center justify-center">
            <CircularProgress size={28} style={{ color: ACCENT }} />
          </div>
        )}

        {loadState === "error" && (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h1 className="text-[19px] font-extrabold text-[#111] mb-2">Link Unavailable</h1>
            <p className="text-[13px] text-[#767676] leading-relaxed">{loadError}</p>
          </div>
        )}

        {loadState === "expired" && (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="text-5xl mb-4">⏱️</div>
            <h1 className="text-[19px] font-extrabold text-[#111] mb-2">Session Expired</h1>
            <p className="text-[13px] text-[#767676] leading-relaxed">
              Your 5-minute session has expired.
              <br />
              Please ask the guard at the gate for a new link.
            </p>
          </div>
        )}

        {loadState === "loaded" && step === "success" && visitRef && (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="text-5xl mb-4">✅</div>
            <h1 className="text-[19px] font-extrabold text-[#111] mb-2">Registration Submitted</h1>
            <p className="text-[13px] text-[#767676] leading-relaxed">
              Your visit (<span className="font-bold text-[#111]">{visitRef}</span>) has been pre-registered.
              <br />
              The guard at the gate will review it when you arrive.
            </p>
            {!closeAttempted ? (
              <p
                className="text-[16px] text-blue-600 font-bold leading-relaxed cursor-pointer"
                style={{ marginTop: 12 }}
                onClick={handleCloseTab}
              >
                CLOSE THIS APP
              </p>
            ) : (
              <p className="text-[13px] text-[#767676] leading-relaxed" style={{ marginTop: 12 }}>
                You can now close this tab.
              </p>
            )}
          </div>
        )}

        {loadState === "loaded" && step === 1 && (
          <div>
            <h1 className="text-[19px] font-extrabold text-[#111] mb-1.5 leading-tight">Your details</h1>
            <p className="text-[13px] text-[#767676] leading-relaxed mb-6">
              Fill in your details before arriving — this speeds up check-in at the gate.
            </p>

            <div className="mb-5">
              <label className={labelClass}>Full Name *</label>
              <input
                className={inputClass}
                maxLength={80}
                placeholder="Your full name"
                value={visitorName}
                disabled={nameLocked}
                onChange={(e) => setVisitorName(e.target.value)}
              />
            </div>
            <div className="mb-5">
              <label className={labelClass}>Mobile Number *</label>
              <input
                className={inputClass}
                maxLength={15}
                placeholder="10-digit mobile"
                value={mobileNumber}
                disabled={mobileLocked}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
            </div>
            <div className="mb-5">
              <label className={labelClass}>Email (optional)</label>
              <input
                type="email"
                className={inputClass}
                maxLength={80}
                placeholder="email@example.com"
                value={emailAddress}
                disabled={emailLocked}
                onChange={(e) => setEmailAddress(e.target.value)}
              />
            </div>
            <div className="mb-5">
              <label className={labelClass}>Company (optional)</label>
              <input className={inputClass} maxLength={80} placeholder="Your company" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>
          </div>
        )}

        {loadState === "loaded" && step === 2 && (
          <div>
            <h1 className="text-[19px] font-extrabold text-[#111] mb-1.5 leading-tight">Visit details</h1>
            <p className="text-[13px] text-[#767676] leading-relaxed mb-6">Who are you here to see, and why?</p>

            <div className="mb-5">
              <label className={labelClass}>Purpose of Visit *</label>
              <PillToggle options={PURPOSE_OPTIONS} value={purpose} onChange={setPurpose} />
            </div>
            <div className="mb-5">
              <label className={labelClass}>Person to Meet *</label>
              <input className={inputClass} maxLength={60} placeholder="Name of contact" value={personToMeet} onChange={(e) => setPersonToMeet(e.target.value)} />
              <p className="text-[11px] text-[#999] mt-1.5 leading-snug">
                The guard will confirm the exact contact at the gate.
              </p>
            </div>
            <div className="mb-5">
              <label className={labelClass}>Vehicle Number (optional)</label>
              <input className={inputClass} maxLength={20} placeholder="If arriving by vehicle" value={vehicleNo} onChange={(e) => setVehicleNo(e.target.value)} />
            </div>
            <div className="mb-5">
              <label className={labelClass}>Address (optional)</label>
              <input className={inputClass} maxLength={120} placeholder="City / address" value={homeAddress} onChange={(e) => setHomeAddress(e.target.value)} />
            </div>

            <div className="mt-8 pt-5 border-t border-[#f0f0f0]">
              <p className="text-[11.5px] font-bold text-[#1a1a2e] uppercase tracking-wide mb-1">
                Identity Proof (optional)
              </p>
              <p className="text-[11px] text-[#999] mb-3 leading-snug">
                Speeds up verification at the gate — you can skip this.
              </p>
              <div className="mb-3">
                <PillToggle options={ID_TYPE_OPTIONS} value={idType} onChange={setIdType} />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleIdDocChange}
              />
              {idDocFileName ? (
                <div className="flex items-center justify-between px-3 py-2.5 rounded-md bg-[#f0faf9] border-[1.5px] border-[#cdeceb]">
                  <span className="text-[12.5px] text-[#111] font-medium truncate mr-2">✓ {idDocFileName}</span>
                  <button type="button" onClick={clearIdDoc} className="text-[12px] font-bold text-[#a8362b] flex-shrink-0">
                    Remove
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 rounded-md text-[13px] font-semibold border-[1.5px] border-dashed"
                  style={{ borderColor: "#cdeceb", color: ACCENT }}
                >
                  📷 Upload ID Photo
                </button>
              )}
            </div>
          </div>
        )}

        {loadState === "loaded" && step === 3 && (
          <div>
            <h1 className="text-[19px] font-extrabold text-[#111] mb-1.5 leading-tight">Review &amp; submit</h1>
            <p className="text-[13px] text-[#767676] leading-relaxed mb-1">Check everything before sending it in.</p>

            {submitError && (
              <div className="text-[13px] mt-4 px-3 py-2.5 rounded-md bg-[#fdeeea] text-[#a8362b]">{submitError}</div>
            )}

            <p className="text-[11.5px] font-bold text-[#1a1a2e] uppercase tracking-wide mt-6 mb-3">Your Details</p>
            <ReviewRow label="Name" value={visitorName} />
            <ReviewRow label="Mobile" value={mobileNumber} />
            <ReviewRow label="Email" value={emailAddress || "—"} />
            <ReviewRow label="Company" value={companyName || "—"} />

            <p className="text-[11.5px] font-bold text-[#1a1a2e] uppercase tracking-wide mt-6 mb-3">Visit Details</p>
            <ReviewRow label="Purpose" value={purpose} />
            <ReviewRow label="Person to Meet" value={personToMeet} />
            <ReviewRow label="Vehicle No." value={vehicleNo || "—"} />
            <ReviewRow label="Address" value={homeAddress || "—"} />
            {idType && <ReviewRow label="ID Type" value={idType} />}
            {idDocFileName && <ReviewRow label="ID Photo" value="Uploaded ✓" />}
          </div>
        )}
      </div>

      {/* Fixed footer */}
      {loadState === "loaded" && step !== "success" && (
        <div className="flex-shrink-0 bg-white px-5 py-4" style={{ boxShadow: "0 -2px 10px rgba(0,0,0,0.08)" }}>
          {step === 1 && (
            <button
              type="button"
              onClick={() => step1Ready && setStep(2)}
              disabled={!step1Ready}
              className="w-full py-[15px] rounded-full text-white text-[15px] font-bold"
              style={{ background: step1Ready ? ACCENT : ACCENT_DISABLED }}
            >
              Next
            </button>
          )}

          {step === 2 && (
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="flex-1 py-[15px] rounded-full text-[15px] font-bold border-[1.5px] border-[#e2e2e2] text-[#555]">
                Back
              </button>
              <button
                type="button"
                onClick={() => step2Ready && setStep(3)}
                disabled={!step2Ready}
                className="flex-[2] py-[15px] rounded-full text-white text-[15px] font-bold"
                style={{ background: step2Ready ? ACCENT : ACCENT_DISABLED }}
              >
                Review
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(2)} disabled={submitting} className="flex-1 py-[15px] rounded-full text-[15px] font-bold border-[1.5px] border-[#e2e2e2] text-[#555]">
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-[2] py-[15px] rounded-full text-white text-[15px] font-bold flex items-center justify-center gap-2"
                style={{ background: submitting ? ACCENT_DISABLED : ACCENT }}
              >
                {submitting && <CircularProgress size={16} color="inherit" />}
                {submitting ? "Submitting..." : "Submit Registration"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VisitorInvitePage;
