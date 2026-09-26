import { useEffect, useState } from "react";
import { Button, CircularProgress, IconButton, MenuItem, TextField, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useApplyLoanMutation, usePreviewLoanMutation } from "../../services/loan";
import { useToast } from "../../hooks/useToast";

const rupees = (n: number | string) => `₹${Math.round(Number(n) || 0).toLocaleString("en-IN")}`;
const monthLabel = (ym?: string) => (ym ? new Date(`${ym}-01T00:00:00`).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "");

/** Apply for one loan type. The server recomputes eligibility, limits and the EMI on every preview and on apply. */
const LoanApplyDrawer = ({
  type,
  purposes,
  onClose,
  onApplied,
}: {
  type: any;
  purposes: { code: string; label: string }[];
  onClose: () => void;
  onApplied: () => void;
}) => {
  const { showToast } = useToast();
  const [amount, setAmount] = useState("");
  const [tenure, setTenure] = useState<number>(type.tenure_options?.[type.tenure_options.length - 1] ?? 1);
  const [purpose, setPurpose] = useState("");
  const [remark, setRemark] = useState("");
  const [preview, setPreview] = useState<any | null>(null);

  const [previewLoan, { isLoading: previewing }] = usePreviewLoanMutation();
  const [applyLoan, { isLoading: applying }] = useApplyLoanMutation();

  useEffect(() => {
    const value = Number(amount);
    if (!(value > 0) || !tenure) { setPreview(null); return; }
    const timer = setTimeout(async () => {
      const res: any = await previewLoan({ loan_type: type.type, amount: value, tenure_months: tenure });
      setPreview(res?.data?.success ? res.data.data : null);
    }, 400);
    return () => clearTimeout(timer);
  }, [amount, tenure]);

  const handleApply = async () => {
    if (!purpose) return showToast("Choose a purpose", "error");
    if (purpose === "OTHER" && remark.trim().length < 5) return showToast("Describe the purpose in a few words", "error");
    const res: any = await applyLoan({
      loan_type: type.type, amount: Number(amount), tenure_months: tenure, purpose, remark: remark.trim() || undefined,
    });
    if (res?.error) return showToast(res.error?.data?.message || "Could not submit the request", "error");
    if (res?.data?.success === false) return showToast(res.data.message || "Could not submit the request", "error");
    showToast(res?.data?.message || "Request submitted", "success");
    onApplied();
  };

  return (
    <div className="w-full h-full p-5 flex flex-col gap-4 overflow-y-auto">
      <div className="flex items-center justify-between">
        <Typography variant="h6" className="font-bold">Apply for {type.label}</Typography>
        <IconButton size="small" onClick={onClose}><CloseIcon fontSize="small" /></IconButton>
      </div>

      <div className="text-xs text-gray-500 bg-[#f0fdfe] border border-[#00a0a0]/20 rounded-xl px-3 py-2">
        You can request {rupees(type.min_amount)} to {rupees(type.max_amount)} over up to {type.max_tenure_months} month
        {type.max_tenure_months === 1 ? "" : "s"}.
      </div>

      <TextField
        label="Amount (₹)" value={amount} size="small" fullWidth
        onChange={(e) => setAmount(e.target.value.replace(/\D/g, "").slice(0, 9))}
        inputProps={{ inputMode: "numeric" }}
      />

      <TextField select label="Repayment period" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} size="small" fullWidth>
        {(type.tenure_options || []).map((m: number) => (
          <MenuItem key={m} value={m}>{m} month{m === 1 ? "" : "s"}</MenuItem>
        ))}
      </TextField>

      <TextField select label="Purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} size="small" fullWidth>
        {purposes.map((p) => <MenuItem key={p.code} value={p.code}>{p.label}</MenuItem>)}
      </TextField>

      <TextField
        label={purpose === "OTHER" ? "Describe the purpose" : "Remark (optional)"} value={remark} multiline minRows={2} size="small" fullWidth
        onChange={(e) => setRemark(e.target.value.slice(0, 200))}
      />

      {previewing && !preview ? (
        <div className="flex items-center gap-2 text-xs text-gray-400"><CircularProgress size={14} /> Working out your EMI…</div>
      ) : preview ? (
        <div className={`rounded-xl border px-4 py-3 text-sm ${preview.valid ? "border-[#00a0a0]/30 bg-[#f0fdfe]" : "border-red-200 bg-red-50"}`}>
          {preview.errors?.length ? (
            <ul className="list-disc pl-4 text-red-700 text-xs space-y-1">
              {preview.errors.map((e: string) => <li key={e}>{e}</li>)}
            </ul>
          ) : null}
          {preview.emi_amount != null && (
            <div className={`grid grid-cols-2 gap-x-4 gap-y-1 ${preview.errors?.length ? "mt-2" : ""}`}>
              <span className="text-gray-500">Monthly EMI</span><span className="text-right font-bold tabular-nums">{rupees(preview.emi_amount)}</span>
              <span className="text-gray-500">Total interest</span><span className="text-right tabular-nums">{rupees(preview.total_interest)}</span>
              <span className="text-gray-500">Total payable</span><span className="text-right tabular-nums">{rupees(preview.total_payable)}</span>
              <span className="text-gray-500">First deduction</span><span className="text-right">{monthLabel(preview.first_emi_month)}</span>
            </div>
          )}
        </div>
      ) : null}

      <Button
        variant="contained" disabled={applying || !preview?.valid} onClick={handleApply}
        sx={{ bgcolor: "#00a0a0", "&:hover": { bgcolor: "#007f86" }, mt: 1 }}
      >
        {applying ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "Submit request"}
      </Button>
      <Typography variant="caption" className="text-gray-400">
        Your request goes to your manager first, then to management for the final decision.
      </Typography>
    </div>
  );
};

export default LoanApplyDrawer;
