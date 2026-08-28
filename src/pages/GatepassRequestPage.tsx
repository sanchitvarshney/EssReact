import { useEffect, useMemo, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import CircularProgress from "@mui/material/CircularProgress";
import dayjs, { type Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { useToast } from "../hooks/useToast";
import {
  lookupEmployee,
  getTlOptions,
  submitEmployeeGatepass,
  GatepassApiError,
  type EmployeeLookupData,
  type TlOption,
} from "../services/gatepassApi";

// ESS brand teal — PRIMARY matches the app's PWA/manifest theme_color
// (vite.config.ts), ACCENT matches the interactive-element teal already
// used on SignInScreen.tsx / CustomModalDatePicker.tsx (#2eacb3), so this
// page reads as part of ESS rather than borrowing a reference mock's skin.
const PRIMARY = "#018c85";
const ACCENT = "#2eacb3";
const ACCENT_DISABLED = "#a8d9db";

// No EARLIEST_DOB/LATEST_DOB (18+) bound anymore — HRMS's dob field is
// day-month only (no year, removed for privacy), so an age gate can't be
// enforced from it at all.

const inputClass =
  "underline-input w-full border-0 border-b-[1.5px] border-[#e2e2e2] px-0.5 py-2 text-base bg-transparent text-[#111] focus:outline-none focus:border-b-[#2eacb3] disabled:text-[#555]";

const labelClass = "block text-[12.5px] font-bold text-[#1a1a2e] mb-1.5";
const sectionLabelClass =
  "text-[11.5px] font-bold text-[#1a1a2e] uppercase tracking-wide mt-6 mb-3 first:mt-0";

const datePickerSlotProps = {
  textField: {
    fullWidth: true,
    variant: "standard" as const,
    sx: {
      "& .MuiInput-root": { fontSize: "16px" },
      "& .MuiInput-underline:before": { borderBottomColor: "#e2e2e2", borderBottomWidth: "1.5px" },
      "& .MuiInput-underline:hover:before": { borderBottomColor: "#e2e2e2 !important" },
      "& .MuiInput-underline:after": { borderBottomColor: ACCENT },
    },
  },
  layout: {
    sx: {
      "& .MuiPickersDay-root.Mui-selected": { backgroundColor: `${ACCENT} !important` },
      "& .MuiPickersYear-yearButton.Mui-selected": { backgroundColor: `${ACCENT} !important` },
      "& .MuiPickersMonth-monthButton.Mui-selected": { backgroundColor: `${ACCENT} !important` },
      "& .MuiPickersDay-today": { borderColor: ACCENT },
    },
  },
};

// Placeholder year used only to give day/month pickers a valid Dayjs object
// to render — never sent anywhere, never compared. Not a leap year, so Feb
// 29 isn't selectable here; DOB is day-month-only anyway (see dayMonthOnly).
const DUMMY_YEAR = 2001;

function AppDatePicker({
  label,
  value,
  onChange,
  minDate,
  maxDate,
  openTo = "day",
  dayMonthOnly = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  openTo?: "day" | "month" | "year";
  // When true: value/onChange exchange "DD-MM" (no year) instead of
  // "YYYY-MM-DD" — for HRMS's DOB field, which never stores/returns a year
  // (removed for the employee's privacy; verification is day+month only).
  dayMonthOnly?: boolean;
}) {
  const parsedValue = dayMonthOnly
    ? value && /^\d{2}-\d{2}$/.test(value)
      ? dayjs(`${DUMMY_YEAR}-${value.split("-")[1]}-${value.split("-")[0]}`)
      : null
    : value
    ? dayjs(value)
    : null;

  return (
    <MobileDatePicker
      label={label}
      value={parsedValue}
      onChange={(d) => {
        if (!d || !d.isValid()) return onChange("");
        onChange(dayMonthOnly ? d.format("DD-MM") : d.format("YYYY-MM-DD"));
      }}
      minDate={minDate}
      maxDate={maxDate}
      openTo={openTo}
      views={dayMonthOnly ? ["month", "day"] : ["year", "month", "day"]}
      closeOnSelect
      format={dayMonthOnly ? "DD/MM" : "DD/MM/YYYY"}
      slotProps={datePickerSlotProps}
    />
  );
}

// MUI's MobileTimePicker (clock-dial view) was unreliable — taps on the
// dial weren't registering a selection for some users. Replaced with a
// plain native <select>: on mobile this opens the OS's own time wheel
// (iOS/Android), which is a well-tested interaction with none of the
// custom touch/gesture handling that was failing above. 5-minute steps,
// values below `minTime` are simply left out of the list.
function AppTimePicker({
  value,
  onChange,
  minTime,
}: {
  value: string; // "HH:mm", 24hr
  onChange: (v: string) => void;
  minTime?: Dayjs;
}) {
  const options = useMemo(() => {
    const opts: { value: string; label: string }[] = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 5) {
        if (minTime) {
          const t = dayjs().hour(h).minute(m).second(0).millisecond(0);
          if (t.isBefore(minTime)) continue;
        }
        opts.push({
          value: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
          label: dayjs().hour(h).minute(m).format("hh:mm A"),
        });
      }
    }
    return opts;
    // minTime is a Dayjs instance recreated every render — key off its
    // millisecond value so this only rebuilds when the boundary actually moves.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minTime?.valueOf()]);

  return (
    <select className={inputClass} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">Select time</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function PillToggle({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-2.5 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className="px-4 py-2 rounded-full text-[13px] font-semibold border-[1.5px] transition-colors"
          style={
            value === opt.value
              ? { background: ACCENT, borderColor: ACCENT, color: "#fff" }
              : { background: "#fff", borderColor: "#e2e2e2", color: "#555" }
          }
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function ReviewRow({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className="flex justify-between items-start py-2.5 border-b border-[#f0f0f0] gap-4">
      <span className="text-[13px] text-[#767676] flex-shrink-0">{label}</span>
      <span
        className={`text-[13px] font-semibold text-right ${warn ? "text-[#d9483b]" : "text-[#111]"}`}
      >
        {value}
      </span>
    </div>
  );
}

// step 1 = identity verify · 2 = approval chain · 3 = leave details · 4 = review & submit
type Step = 1 | 2 | 3 | 4 | "success";
const STEP_LABELS: Record<number, string> = {
  2: "Approval Chain",
  3: "Leave Details",
  4: "Review & Submit",
};

const GatepassRequestPage = () => {
  const isMobileOrTablet = useMediaQuery("(max-width:1024px)");
  const { showToast } = useToast();

  const [step, setStep] = useState<Step>(1);

  // Step 1
  const [employeeCode, setEmployeeCode] = useState("");
  const [dob, setDob] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [lookupData, setLookupData] = useState<EmployeeLookupData | null>(null);

  // Step 2
  const [tlOptions, setTlOptions] = useState<TlOption[]>([]);
  const [tlCode, setTlCode] = useState("");

  // Step 3
  const [gatepassSubtype, setGatepassSubtype] = useState<"half_day" | "full_day" | "">("");
  const [willReturn, setWillReturn] = useState<"yes" | "no" | "">("");
  const [exitDate, setExitDate] = useState("");
  const [exitTime, setExitTime] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [reason, setReason] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [gpRef, setGpRef] = useState<string | null>(null);

  // Step 4 consent
  const [agreedRules, setAgreedRules] = useState(false);

  // Success screen "close tab" — window.close() only works on tabs opened
  // by script; a tab the employee navigated to directly (link/QR) can't be
  // closed this way and the browser silently no-ops. Try it, then fall back
  // to a plain "you can close this tab" message after a short delay.
  const [closeAttempted, setCloseAttempted] = useState(false);
  const handleCloseTab = () => {
    window.close();
    setTimeout(() => setCloseAttempted(true), 400);
  };

  useEffect(() => {
    if (step !== 2) return;
    getTlOptions()
      .then(setTlOptions)
      .catch(() => setTlOptions([]));
  }, [step]);

  const handleVerify = async () => {
    if (!employeeCode.trim() || !dob) {
      setLookupError("Enter your employee code and date of birth.");
      return;
    }
    setVerifying(true);
    setLookupError(null);
    try {
      const data = await lookupEmployee(employeeCode.trim(), dob);
      setLookupData(data);
      setStep(2);
    } catch (e) {
      const msg =
        e instanceof GatepassApiError
          ? e.message
          : "Could not reach the server. Please try again.";
      setLookupError(msg);
    } finally {
      setVerifying(false);
    }
  };

  const managerConfigured = !!lookupData?.managerConfigured;
  const hrConfigured = !!lookupData?.hrConfigured;
  const selectedTl = tlOptions.find((o) => o.code === tlCode) || null;

  const step2Ready = managerConfigured && hrConfigured && !!selectedTl;
  const step2Label = step2Ready
    ? "Next"
    : !managerConfigured || !hrConfigured
    ? "Approval chain not configured"
    : "Select a Team Leader first";

  const step3Ready =
    !!gatepassSubtype &&
    !!exitDate &&
    !!exitTime &&
    !!willReturn &&
    (willReturn === "no" || (!!returnDate && !!returnTime)) &&
    reason.trim().length >= 20 &&
    reason.trim().length <= 500;

  const today = dayjs().format("YYYY-MM-DD");
  const effectiveExitDate = gatepassSubtype === "full_day" ? today : exitDate;
  const isExitToday = effectiveExitDate === today;
  const exitMinTime = isExitToday
    ? dayjs().add(10, "minute").second(0).millisecond(0)
    : undefined;

  // Same-day return can't be before the exit time.
  const returnMinTime =
    willReturn === "yes" && returnDate === effectiveExitDate && exitTime
      ? dayjs()
          .hour(Number(exitTime.split(":")[0]))
          .minute(Number(exitTime.split(":")[1]))
          .second(0)
          .millisecond(0)
      : undefined;

  useEffect(() => {
    if (gatepassSubtype === "full_day") setExitDate(today);
  }, [gatepassSubtype]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async () => {
    if (!lookupData || !selectedTl || !agreedRules) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const result = await submitEmployeeGatepass({
        employee_code: lookupData.empCode,
        employee_name: lookupData.empName,
        department: lookupData.department,
        employee_email: lookupData.email,
        tl_code: selectedTl.code,
        tl_name: selectedTl.name,
        tl_email: selectedTl.email,
        gatepass_subtype: gatepassSubtype as "half_day" | "full_day",
        will_return: willReturn as "yes" | "no",
        exit_date: exitDate,
        exit_time: exitTime,
        return_date: willReturn === "yes" ? returnDate : undefined,
        return_time: willReturn === "yes" ? returnTime : undefined,
        reason,
      });
      setGpRef(result.gpRef);
      setStep("success");
    } catch (e) {
      const msg =
        e instanceof GatepassApiError
          ? e.message
          : "Could not submit your request. Please try again.";
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
          This page is only available on mobile and tablet devices. Please
          open it on your phone or tablet.
        </p>
      </div>
    );
  }

  const numericStep = typeof step === "number" ? step : 4;

  const canSubmit = agreedRules && !submitting;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="h-screen w-full bg-white flex flex-col overflow-hidden">
        {/* Topbar */}
        <div
          className="flex items-center justify-between px-[18px] py-4 flex-shrink-0"
          style={{ background: PRIMARY, color: "#fff" }}
        >
          <span className="text-[16px] font-bold tracking-wide">Employee Gatepass</span>
          <span className="w-9 h-9 rounded-full bg-white flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img src="/msc-48x48.png" alt="mscorpres" className="w-6 h-6 object-contain" />
          </span>
        </div>

        {/* Step progress (steps 2-4 only) */}
        {step !== 1 && step !== "success" && (
          <div className="px-5 pt-4 flex-shrink-0">
            <div className="flex gap-1.5 mb-2">
              {[2, 3, 4].map((s) => (
                <div
                  key={s}
                  className="h-1 flex-1 rounded-full"
                  style={{ background: numericStep >= s ? ACCENT : "#e2e2e2" }}
                />
              ))}
            </div>
            <p className="text-[11.5px] font-bold text-[#999] uppercase tracking-wide">
              Step {numericStep - 1} of 3 — {STEP_LABELS[numericStep]}
            </p>
          </div>
        )}

        {/* Scrollable body — footer below stays fixed */}
        <div className="flex-1 overflow-y-auto px-5 pt-[22px] pb-5">
          {step === "success" && gpRef && (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="text-5xl mb-4">✅</div>
              <h1 className="text-[19px] font-extrabold text-[#111] mb-2">Request Submitted</h1>
              <p className="text-[13px] text-[#767676] leading-relaxed">
                Your gatepass request (<span className="font-bold text-[#111]">{gpRef}</span>)
                has been submitted.<br/>Your Team Leader and Manager have both been notified for
                approval.
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

          {step === 1 && (
            <div>
              <div className="mb-[18px]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  stroke={PRIMARY}
                  className="w-8 h-8"
                >
                  <rect x="4" y="2" width="16" height="20" rx="3" />
                  <circle cx="12" cy="9" r="2.5" />
                  <path d="M8 17c0-2.2 1.8-3.5 4-3.5s4 1.3 4 3.5" />
                </svg>
              </div>
              <h1 className="text-[19px] font-extrabold text-[#111] mb-1.5 leading-tight">
                Let's verify it's you
              </h1>
              <p className="text-[13px] text-[#767676] leading-relaxed mb-6">
                Enter your employee code and date of birth to start a gate pass request.
              </p>

              <div className="mb-5">
                <label className={labelClass}>Employee Code</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="e.g. MS0014"
                  value={employeeCode}
                  onChange={(e) => setEmployeeCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                />
              </div>
              <div className="mb-5">
                <label className={labelClass}>Date of Birth (Day &amp; Month)</label>
                <AppDatePicker
                  label=""
                  value={dob}
                  onChange={setDob}
                  openTo="month"
                  dayMonthOnly
                />
              </div>

              {lookupError && (
                <div className="text-[13px] mb-4 px-3 py-2.5 rounded-md bg-[#fdeeea] text-[#a8362b]">
                  {lookupError}
                </div>
              )}
            </div>
          )}

          {step === 2 && lookupData && (
            <div>
              <h1 className="text-[19px] font-extrabold text-[#111] mb-1.5 leading-tight">
                Your approval chain
              </h1>
              <p className="text-[13px] text-[#767676] leading-relaxed mb-1">
                Confirm your details and pick your Team Leader.
              </p>

              <p className={sectionLabelClass}>Employee Details</p>
              <div className="mb-5">
                <label className={labelClass}>Full Name</label>
                <input className={inputClass} value={lookupData.empName} disabled />
              </div>
              <div className="mb-5">
                <label className={labelClass}>Designation</label>
                <input className={inputClass} value={lookupData.designation || "—"} disabled />
              </div>

              <p className={sectionLabelClass}>Approval Chain</p>
              <div className="mb-5">
                <label className={labelClass}>Team Leader</label>
                <select
                  className={inputClass}
                  value={tlCode}
                  onChange={(e) => setTlCode(e.target.value)}
                >
                  <option value="">
                    {tlOptions.length ? "Select your Team Leader" : "Loading..."}
                  </option>
                  {tlOptions.map((tl) => (
                    <option key={tl.code} value={tl.code}>
                      {tl.name}
                    </option>
                  ))}
                </select>
              </div>

              {(!managerConfigured || !hrConfigured) && (
                <div className="text-[13px] mb-4 px-3 py-2.5 rounded-md bg-[#fdeeea] text-[#a8362b]">
                  Your approval chain is incomplete — contact HR/Admin before submitting.
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div>
              <h1 className="text-[19px] font-extrabold text-[#111] mb-1.5 leading-tight">
                Leave details
              </h1>
              <p className="text-[13px] text-[#767676] leading-relaxed mb-1">
                Tell us when you're heading out and why.
              </p>

              <div className="mb-5 mt-4">
                <label className={labelClass}>Gatepass Type</label>
                <PillToggle
                  value={gatepassSubtype}
                  onChange={(v) => setGatepassSubtype(v as "half_day" | "full_day")}
                  options={[
                    { value: "half_day", label: "Half Day (2–4 hrs)" },
                    { value: "full_day", label: "Full Day" },
                  ]}
                />
              </div>

              <div className="flex gap-3.5 mb-5">
                {gatepassSubtype !== "full_day" && (
                  <div className="flex-1">
                    <label className={labelClass}>Expected Exit Date</label>
                    <AppDatePicker
                      label=""
                      value={exitDate}
                      onChange={setExitDate}
                      minDate={dayjs()}
                    />
                  </div>
                )}
                <div className="flex-1">
                  <label className={labelClass}>Expected Exit Time</label>
                  <AppTimePicker
                    value={exitTime}
                    onChange={setExitTime}
                    minTime={exitMinTime}
                  />
                </div>
              </div>

              <div className="mb-5">
                <label className={labelClass}>Will you return the same day?</label>
                <PillToggle
                  value={willReturn}
                  onChange={(v) => setWillReturn(v as "yes" | "no")}
                  options={[
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No" },
                  ]}
                />
              </div>

              {willReturn === "yes" && (
                <div className="flex gap-3.5 mb-5">
                  <div className="flex-1">
                    <label className={labelClass}>Expected Return Date</label>
                    <AppDatePicker
                      label=""
                      value={returnDate}
                      onChange={setReturnDate}
                      minDate={exitDate ? dayjs(exitDate) : dayjs()}
                    />
                  </div>
                  <div className="flex-1">
                    <label className={labelClass}>Expected Return Time</label>
                    <AppTimePicker
                      value={returnTime}
                      onChange={setReturnTime}
                      minTime={returnMinTime}
                    />
                  </div>
                </div>
              )}

              <div className="mb-5">
                <label className={labelClass}>Reason for Exit</label>
                <textarea
                  className={`${inputClass} resize-y min-h-[56px]`}
                  rows={2}
                  maxLength={500}
                  placeholder="Briefly explain the reason for exit (min 20 characters)"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
                <p
                  className={`text-[11px] mt-1 ${
                    reason.trim().length > 0 && reason.trim().length < 20
                      ? "text-[#d9483b]"
                      : "text-[#999]"
                  }`}
                >
                  {reason.length}/500 {reason.trim().length < 20 && "— minimum 20 characters"}
                </p>
              </div>
            </div>
          )}

          {step === 4 && lookupData && selectedTl && (
            <div>
              <h1 className="text-[19px] font-extrabold text-[#111] mb-1.5 leading-tight">
                Review &amp; submit
              </h1>
              <p className="text-[13px] text-[#767676] leading-relaxed mb-1">
                Check everything before sending it for approval.
              </p>

              {submitError && (
                <div className="text-[13px] mt-4 px-3 py-2.5 rounded-md bg-[#fdeeea] text-[#a8362b]">
                  {submitError}
                </div>
              )}

              <p className={sectionLabelClass}>Employee</p>
              <ReviewRow label="Name" value={lookupData.empName} />
              <ReviewRow label="Code" value={lookupData.empCode} />
              <ReviewRow label="Designation" value={lookupData.designation || "—"} />
              <ReviewRow label="Department" value={lookupData.department || "—"} />

              <p className={sectionLabelClass}>Approval Chain</p>
              <ReviewRow label="Team Leader" value={selectedTl.name} />
              <ReviewRow
                label="Manager"
                value={lookupData.final.manager ? lookupData.final.manager.name : "Not configured"}
                warn={!managerConfigured}
              />
              <ReviewRow
                label="HR"
                value={lookupData.final.hr ? lookupData.final.hr.name : "Not configured"}
                warn={!hrConfigured}
              />

              <p className={sectionLabelClass}>Leave Details</p>
              <ReviewRow
                label="Type"
                value={gatepassSubtype === "half_day" ? "Half Day (2–4 hrs)" : "Full Day"}
              />
              <ReviewRow
                label="Expected Exit"
                value={`${dayjs(exitDate).format("DD MMM YYYY")}, ${exitTime}`}
              />
              <ReviewRow label="Will Return" value={willReturn === "yes" ? "Yes" : "No"} />
              {willReturn === "yes" && (
                <ReviewRow
                  label="Expected Return"
                  value={`${dayjs(returnDate).format("DD MMM YYYY")}, ${returnTime}`}
                />
              )}

              
              <label className="mt-4 flex items-start gap-2.5 px-0.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedRules}
                  onChange={(e) => setAgreedRules(e.target.checked)}
                  className="w-4 h-4 mt-0.5 flex-shrink-0 accent-[#2eacb3]"
                />
                <span className="text-[12px] text-[#555] leading-relaxed">
                  I have read the company's rules book and I am aware of the charges and
                  penalties for a late return, and that other issues may arise. The above
                  information is correct to the best of my knowledge.
                </span>
              </label>

              <div className="mt-6 rounded-xl border border-[#ffe0b2] bg-[#fff8e1] p-4 text-left">
                <p className="text-[13px] text-[#8a6d3b] leading-relaxed">
                  ⚠️ By submitting, your Team Leader and Manager will be notified by email to
                  review this request.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Fixed footer — content above scrolls, this stays pinned */}
        {step !== "success" && (
          <div
            className="flex-shrink-0 bg-white px-5 py-4"
            style={{ boxShadow: "0 -2px 10px rgba(0,0,0,0.08)" }}
          >
            {step === 1 && (
              <button
                type="button"
                onClick={handleVerify}
                disabled={verifying}
                className="w-full py-[15px] rounded-full text-white text-[15px] font-bold flex items-center justify-center gap-2"
                style={{ background: verifying ? ACCENT_DISABLED : ACCENT }}
              >
                {verifying && <CircularProgress size={16} color="inherit" />}
                {verifying ? "Verifying..." : "Next"}
              </button>
            )}

            {step === 2 && (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-[15px] rounded-full text-[15px] font-bold border-[1.5px] border-[#e2e2e2] text-[#555]"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => step2Ready && setStep(3)}
                  disabled={!step2Ready}
                  className="flex-[2] py-[15px] rounded-full text-white text-[15px] font-bold"
                  style={{ background: step2Ready ? ACCENT : ACCENT_DISABLED }}
                >
                  {step2Label}
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 py-[15px] rounded-full text-[15px] font-bold border-[1.5px] border-[#e2e2e2] text-[#555]"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => step3Ready && setStep(4)}
                  disabled={!step3Ready}
                  className="flex-[2] py-[15px] rounded-full text-white text-[15px] font-bold"
                  style={{ background: step3Ready ? ACCENT : ACCENT_DISABLED }}
                >
                  Review
                </button>
              </div>
            )}

            {step === 4 && (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={submitting}
                  className="flex-1 py-[15px] rounded-full text-[15px] font-bold border-[1.5px] border-[#e2e2e2] text-[#555]"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="flex-[2] py-[15px] rounded-full text-white text-[15px] font-bold flex items-center justify-center gap-2"
                  style={{ background: canSubmit ? ACCENT : ACCENT_DISABLED }}
                >
                  {submitting && <CircularProgress size={16} color="inherit" />}
                  {submitting ? "Submitting..." : "Submit Gatepass Request"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </LocalizationProvider>
  );
};

export default GatepassRequestPage;
