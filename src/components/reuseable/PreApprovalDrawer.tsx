import { useState } from "react";
import { Button, CircularProgress, IconButton, MenuItem, TextField, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import dayjs, { type Dayjs } from "dayjs";
import { useCreatePreApprovalMutation } from "../../services/visitorPreApproval";
import { useToast } from "../../hooks/useToast";
import { copyText, otpShareMessage } from "../../utils/preApprovalUtils";

// Same purposes as the Gate Pass guard app's visitor registration and the Android app, so a pre-approval
// reads the same whichever client created it.
const PURPOSES = ["Meeting", "Interview", "Delivery", "Maintenance", "Audit", "Personal", "Official", "Contractor Work"];
const PAST_TOLERANCE_MINUTES = 3; // a visitor can be pre-approved for right now, but not for the past
const REMARKS_MAX = 100;
const EMAIL_RE = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const REMARKS_DISALLOWED = /[^A-Za-z0-9 .,:;'"?[\]()\-+&%$#@!*/]/g;

const PreApprovalDrawer = ({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) => {
  const { showToast } = useToast();
  const [visitorName, setVisitorName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [purpose, setPurpose] = useState("");
  const [expectedDate, setExpectedDate] = useState<Dayjs>(dayjs());
  // Default to "now" so the pre-approval is valid as soon as the form opens.
  const [expectedTime, setExpectedTime] = useState<Dayjs | null>(() => dayjs());
  const [remarks, setRemarks] = useState("");
  const [created, setCreated] = useState<{ ref: string; otp: string; visitorName: string; emailSent: boolean; whatsappSent: boolean; date: string; time: string } | null>(null);

  const [createPreApproval, { isLoading }] = useCreatePreApprovalMutation();

  const timeTooEarly = (date: Dayjs, time: Dayjs) =>
    date.hour(time.hour()).minute(time.minute()).second(0).isBefore(dayjs().subtract(PAST_TOLERANCE_MINUTES, "minute"));

  const tooEarly = !!expectedTime && timeTooEarly(expectedDate, expectedTime);

  const handleSubmit = async () => {
    if (!visitorName.trim()) return showToast("Enter the visitor's name", "error");
    if (mobile.length !== 10) return showToast("Enter a 10 digit mobile number", "error");
    if (email.trim() && !EMAIL_RE.test(email.trim())) return showToast("Enter a valid email or leave it blank", "error");
    if (!purpose) return showToast("Choose a purpose", "error");
    if (!expectedTime) return showToast("Set the expected time", "error");
    if (timeTooEarly(expectedDate, expectedTime)) return showToast(`The expected time can't be more than ${PAST_TOLERANCE_MINUTES} minutes in the past`, "error");

    const res: any = await createPreApproval({
      visitorName: visitorName.trim(),
      mobile,
      email: email.trim() || undefined,
      company: company.trim() || undefined,
      purpose,
      expectedDate: expectedDate.format("YYYY-MM-DD"),
      expectedTime: expectedTime.format("HH:mm"),
      remarks: remarks.trim() || undefined,
    });
    if (res?.error) return showToast(res.error?.data?.message || "Could not create the pre-approval", "error");
    if (!res?.data?.success) return showToast(res?.data?.message || "Could not create the pre-approval", "error");
    const d = res.data.data;
    setCreated({ ...d, date: expectedDate.format("DD MMM YYYY"), time: expectedTime.format("hh:mm A") });
    onCreated();
  };

  if (created) {
    return (
      <div className="w-full h-full p-5 flex flex-col gap-4 overflow-y-auto">
        <div className="flex items-center justify-between">
          <Typography variant="h6" className="font-bold">Visitor pre-approved</Typography>
          <IconButton size="small" onClick={onClose}><CloseIcon fontSize="small" /></IconButton>
        </div>
        <div className="flex flex-col items-center text-center gap-2 py-4">
          <CheckCircleIcon sx={{ fontSize: 48, color: "#00a0a0" }} />
          <p className="text-sm text-gray-600">
            {created.emailSent ? "The OTP has been emailed to the visitor. " : "Share this OTP with your visitor for gate entry. "}
            {created.whatsappSent ? "It was also sent on WhatsApp. " : ""}
          </p>
          <p className="text-xs text-gray-400">Reference {created.ref}</p>
          <div className="w-full rounded-2xl bg-[#00a0a0]/10 py-5 text-4xl font-black tracking-[0.4em] text-[#007f86] pl-[0.4em]">{created.otp}</div>
          <Button
            startIcon={<ContentCopyIcon />} size="small" variant="outlined"
            onClick={async () => {
              const ok = await copyText(otpShareMessage({ visitorName: created.visitorName, expectedDate: created.date, expectedTime: created.time, otp: created.otp }));
              showToast(ok ? "Message copied" : "Could not copy", ok ? "success" : "error");
            }}
          >
            Copy message for the visitor
          </Button>
        </div>
        <Button variant="contained" onClick={onClose} sx={{ bgcolor: "#00a0a0", "&:hover": { bgcolor: "#007f86" } }}>Done</Button>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-5 flex flex-col gap-4 overflow-y-auto">
      <div className="flex items-center justify-between">
        <Typography variant="h6" className="font-bold">Pre-approve a visitor</Typography>
        <IconButton size="small" onClick={onClose}><CloseIcon fontSize="small" /></IconButton>
      </div>

      <TextField label="Visitor name *" value={visitorName} size="small" fullWidth onChange={(e) => setVisitorName(e.target.value.slice(0, 100))} />
      <TextField
        label="Mobile *" value={mobile} size="small" fullWidth inputProps={{ inputMode: "numeric" }}
        onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
      />
      <TextField label="Email (the OTP is emailed to the visitor)" value={email} size="small" fullWidth onChange={(e) => setEmail(e.target.value.slice(0, 120))} />
      <TextField label="Company" value={company} size="small" fullWidth onChange={(e) => setCompany(e.target.value.slice(0, 100))} />
      <TextField select label="Purpose *" value={purpose} onChange={(e) => setPurpose(e.target.value)} size="small" fullWidth>
        {PURPOSES.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
      </TextField>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="flex gap-3">
          <MobileDatePicker
            label="Expected date *" value={expectedDate} minDate={dayjs()} format="DD-MM-YYYY"
            onChange={(v) => v && setExpectedDate(v)}
            slotProps={{ textField: { size: "small", fullWidth: true } }}
          />
          <MobileTimePicker
            label="Expected time *" value={expectedTime}
            onChange={(v) => setExpectedTime(v)}
            slotProps={{
              textField: {
                size: "small",
                fullWidth: true,
                error: tooEarly,
                helperText: tooEarly ? "Pick a time from now onwards" : undefined,
              },
            }}
          />
        </div>
      </LocalizationProvider>

      <TextField
        label="Remarks" value={remarks} size="small" fullWidth multiline minRows={2}
        onChange={(e) => setRemarks(e.target.value.replace(REMARKS_DISALLOWED, "").slice(0, REMARKS_MAX))}
        helperText={`${remarks.length}/${REMARKS_MAX}`}
      />

      <Button
        variant="contained" disabled={isLoading} onClick={handleSubmit}
        sx={{ bgcolor: "#00a0a0", "&:hover": { bgcolor: "#007f86" } }}
      >
        {isLoading ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "Create pre-approval"}
      </Button>
      <Typography variant="caption" className="text-gray-400">
        The visitor shows the OTP to the guard at the gate. It stays valid for 2 hours after the expected time.
      </Typography>
    </div>
  );
};

export default PreApprovalDrawer;
