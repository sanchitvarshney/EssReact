import { useEffect, useMemo, useState } from "react";
import { Button, CircularProgress, IconButton, MenuItem, TextField, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import dayjs, { type Dayjs } from "dayjs";
import { useApplyGatepassMutation, useGetGatepassOptionsMutation } from "../../services/gatepassSelf";
import { useToast } from "../../hooks/useToast";

const REASON_MIN = 20;
const REASON_MAX = 500;

const Segmented = ({ value, options, onChange }: { value: string; options: [string, string][]; onChange: (v: string) => void }) => (
  <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-1">
    {options.map(([k, label]) => (
      <button
        key={k} type="button" onClick={() => onChange(k)}
        className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${value === k ? "bg-white text-[#007f86] shadow-sm" : "text-gray-500"}`}
      >
        {label}
      </button>
    ))}
  </div>
);

const GatepassApplyDrawer = ({ onClose, onApplied }: { onClose: () => void; onApplied: () => void }) => {
  const { showToast } = useToast();
  const [opts, setOpts] = useState<any | null>(null);
  const [subtype, setSubtype] = useState<"half_day" | "full_day">("half_day");
  const [willReturn, setWillReturn] = useState<"yes" | "no">("yes");
  const [exitDate, setExitDate] = useState<Dayjs>(dayjs());
  const [exitTime, setExitTime] = useState<Dayjs | null>(null);
  const [returnDate, setReturnDate] = useState<Dayjs | null>(null);
  const [returnTime, setReturnTime] = useState<Dayjs | null>(null);
  const [tlCode, setTlCode] = useState("");
  const [reason, setReason] = useState("");
  const [agreed, setAgreed] = useState(false);

  const [getOptions, { isLoading: loadingOpts }] = useGetGatepassOptionsMutation();
  const [applyGatepass, { isLoading: applying }] = useApplyGatepassMutation();

  useEffect(() => {
    (async () => {
      const res: any = await getOptions();
      if (res?.data?.code === 200) setOpts(res.data.data);
      else showToast(res?.data?.message || "Could not load the gate pass form", "error");
    })();
  }, []);

  // A full-day pass is always for today.
  useEffect(() => { if (subtype === "full_day") setExitDate(dayjs()); }, [subtype]);

  const chainReady = !!opts?.managerConfigured && !!opts?.hrConfigured;
  const exitsToday = exitDate.isSame(dayjs(), "day");
  const minExitTime = useMemo(() => (exitsToday ? dayjs().add(10, "minute").second(0).millisecond(0) : undefined), [exitsToday]);

  const handleSubmit = async () => {
    if (!tlCode) return showToast("Select a Team Leader", "error");
    if (!exitTime) return showToast("Set the exit time", "error");
    if (willReturn === "yes" && (!returnDate || !returnTime)) return showToast("Set the return date and time", "error");
    if (reason.trim().length < REASON_MIN) return showToast(`Give a reason of at least ${REASON_MIN} characters`, "error");
    if (!agreed) return showToast("Please accept the declaration", "error");

    const res: any = await applyGatepass({
      tl_code: tlCode,
      gatepass_subtype: subtype,
      will_return: willReturn,
      exit_date: exitDate.format("YYYY-MM-DD"),
      exit_time: exitTime.format("HH:mm"),
      ...(willReturn === "yes" ? { return_date: returnDate!.format("YYYY-MM-DD"), return_time: returnTime!.format("HH:mm") } : {}),
      reason: reason.trim(),
    });
    if (res?.error) return showToast(res.error?.data?.message || "Could not submit the gate pass", "error");
    if (res?.data?.code !== 200) return showToast(res?.data?.message || "Could not submit the gate pass", "error");
    showToast(res.data.message || "Gate pass sent for approval", "success");
    onApplied();
  };

  return (
    <div className="w-full h-full p-5 flex flex-col gap-4 overflow-y-auto">
      <div className="flex items-center justify-between">
        <Typography variant="h6" className="font-bold">New gate pass</Typography>
        <IconButton size="small" onClick={onClose}><CloseIcon fontSize="small" /></IconButton>
      </div>

      {loadingOpts && !opts ? (
        <div className="flex-1 flex items-center justify-center"><CircularProgress sx={{ color: "#2eacb3" }} /></div>
      ) : !opts ? null : (
        <>
          <div className="text-xs text-gray-600 bg-[#f0fdfe] border border-[#2eacb3]/20 rounded-xl px-3 py-2.5 leading-relaxed">
            <p className="font-semibold text-gray-800">{opts.employee.empName} · {opts.employee.empCode}</p>
            <p>{[opts.employee.designation, opts.employee.department].filter(Boolean).join(" · ")}</p>
            <p className="mt-1">
              Approvals: Team Leader and Manager{opts.manager ? ` (${opts.manager.name})` : ""}, then HR{opts.hr ? ` (${opts.hr.name})` : ""}.
            </p>
          </div>

          {!chainReady && (
            <div className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
              {!opts.managerConfigured && !opts.hrConfigured ? "Your Manager and HR are" : !opts.managerConfigured ? "Your Manager is" : "Your HR contact is"} not
              set up in HRMS yet, so a gate pass can't be raised. Please contact HR.
            </div>
          )}

          <TextField select label="Team Leader" value={tlCode} onChange={(e) => setTlCode(e.target.value)} size="small" fullWidth disabled={!chainReady}>
            {opts.tlOptions.map((t: any) => <MenuItem key={t.code} value={t.code}>{t.name}</MenuItem>)}
          </TextField>

          <div>
            <p className="text-xs font-bold text-gray-600 mb-1.5">Type</p>
            <Segmented value={subtype} onChange={(v) => setSubtype(v as any)} options={[["half_day", "Half day"], ["full_day", "Full day"]]} />
          </div>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="flex gap-3">
              <MobileDatePicker
                label="Exit date" value={exitDate} minDate={dayjs()} disabled={subtype === "full_day" || !chainReady}
                onChange={(v) => v && setExitDate(v)}
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />
              <MobileTimePicker
                label="Exit time" value={exitTime} minTime={minExitTime} disabled={!chainReady}
                onChange={(v) => setExitTime(v)}
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />
            </div>

            <div>
              <p className="text-xs font-bold text-gray-600 mb-1.5">Will you come back?</p>
              <Segmented value={willReturn} onChange={(v) => setWillReturn(v as any)} options={[["yes", "Yes, I'll return"], ["no", "No, I'm leaving for the day"]]} />
            </div>

            {willReturn === "yes" && (
              <div className="flex gap-3">
                <MobileDatePicker
                  label="Return date" value={returnDate} minDate={exitDate} disabled={!chainReady}
                  onChange={(v) => setReturnDate(v)}
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                />
                <MobileTimePicker
                  label="Return time" value={returnTime} disabled={!chainReady}
                  onChange={(v) => setReturnTime(v)}
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                />
              </div>
            )}
          </LocalizationProvider>

          <TextField
            label="Reason" value={reason} multiline minRows={3} size="small" fullWidth disabled={!chainReady}
            onChange={(e) => setReason(e.target.value.slice(0, REASON_MAX))}
            helperText={`${reason.trim().length}/${REASON_MAX} · at least ${REASON_MIN} characters`}
          />

          <label className="flex items-start gap-2.5 cursor-pointer">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="w-4 h-4 mt-0.5 flex-shrink-0 accent-[#2eacb3]" />
            <span className="text-[12px] text-gray-500 leading-relaxed">
              I have read the company's rules book and I am aware of the charges and penalties for a late return, and that other
              issues may arise. The above information is correct to the best of my knowledge.
            </span>
          </label>

          <Button
            variant="contained" disabled={applying || !chainReady} onClick={handleSubmit}
            sx={{ bgcolor: "#2eacb3", "&:hover": { bgcolor: "#1e8a8f" } }}
          >
            {applying ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "Send for approval"}
          </Button>
          <Typography variant="caption" className="text-gray-400">
            Your Team Leader and Manager are emailed to review this request.
          </Typography>
        </>
      )}
    </div>
  );
};

export default GatepassApplyDrawer;
