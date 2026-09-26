import { useEffect, useRef, useState } from "react";
import { Button, CircularProgress, IconButton, MenuItem, TextField, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import dayjs, { type Dayjs } from "dayjs";
import { useGetClaimCategoriesMutation, useSubmitClaimMutation } from "../../services/reimbClaims";
import { useToast } from "../../hooks/useToast";

const MAX_FILES = 10;
const MAX_BYTES = 5 * 1024 * 1024;

const NewClaimDrawer = ({ onClose, onSubmitted }: { onClose: () => void; onSubmitted: () => void }) => {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState<Dayjs | null>(dayjs());
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const [getCategories, { isLoading: loadingCats }] = useGetClaimCategoriesMutation();
  const [submitClaim, { isLoading: submitting }] = useSubmitClaimMutation();

  useEffect(() => {
    (async () => {
      const res: any = await getCategories();
      if (res?.data?.success) setCategories(res.data.data || []);
      else showToast("Could not load claim categories", "error");
    })();
  }, []);

  const addFiles = (picked: FileList | null) => {
    if (!picked) return;
    const next = [...files];
    for (const f of Array.from(picked)) {
      if (f.size > MAX_BYTES) { showToast(`${f.name} is over 5 MB`, "error"); continue; }
      if (next.length >= MAX_FILES) { showToast(`You can attach up to ${MAX_FILES} files`, "error"); break; }
      next.push(f);
    }
    setFiles(next);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async () => {
    const value = Number(amount);
    if (!category) return showToast("Choose a category", "error");
    if (!(value > 0)) return showToast("Enter a valid amount", "error");
    if (!expenseDate) return showToast("Pick the expense date", "error");
    if (description.trim().length < 3) return showToast("Describe the expense", "error");

    const fd = new FormData();
    fd.append("category", category);
    fd.append("amount", String(value));
    fd.append("expense_date", expenseDate.format("YYYY-MM-DD"));
    fd.append("description", description.trim());
    files.forEach((f) => fd.append("receipt", f));

    const res: any = await submitClaim(fd);
    if (res?.error) return showToast(res.error?.data?.message || "Could not submit the claim", "error");
    if (res?.data?.success === false) return showToast(res.data.message || "Could not submit the claim", "error");
    showToast(res?.data?.message || "Claim submitted", "success");
    onSubmitted();
  };

  return (
    <div className="w-full h-full p-5 flex flex-col gap-4 overflow-y-auto">
      <div className="flex items-center justify-between">
        <Typography variant="h6" className="font-bold">New reimbursement claim</Typography>
        <IconButton size="small" onClick={onClose}><CloseIcon fontSize="small" /></IconButton>
      </div>

      <TextField
        select label="Category" value={category} onChange={(e) => setCategory(e.target.value)}
        size="small" fullWidth disabled={loadingCats}
      >
        {categories.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
      </TextField>

      <TextField
        label="Amount (₹)" value={amount} size="small" fullWidth
        onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, "").slice(0, 10))}
        inputProps={{ inputMode: "decimal" }}
      />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MobileDatePicker
          label="Expense date"
          value={expenseDate}
          minDate={dayjs().subtract(1, "month")}
          maxDate={dayjs()}
          onChange={(v) => setExpenseDate(v)}
          slotProps={{ textField: { size: "small", fullWidth: true } }}
        />
      </LocalizationProvider>
      <Typography variant="caption" className="text-gray-400 -mt-2">
        Expenses older than one month can't be claimed.
      </Typography>

      <TextField
        label="What was it for?" value={description} multiline minRows={3} size="small" fullWidth
        onChange={(e) => setDescription(e.target.value.slice(0, 500))}
      />

      <div className="flex flex-col gap-2">
        <div>
          <Button size="small" variant="outlined" startIcon={<AttachFileIcon />} onClick={() => fileRef.current?.click()}>
            Attach receipts
          </Button>
          <input
            ref={fileRef} type="file" hidden multiple accept="image/*,.pdf"
            onChange={(e) => addFiles(e.target.files)}
          />
          <span className="ml-2 text-xs text-gray-400">Images or PDF, up to {MAX_FILES} files, 5 MB each</span>
        </div>
        {files.map((f, i) => (
          <div key={`${f.name}-${i}`} className="flex items-center justify-between gap-2 text-sm bg-gray-50 rounded-lg px-3 py-1.5">
            <span className="truncate">{f.name}</span>
            <IconButton size="small" onClick={() => setFiles(files.filter((_, idx) => idx !== i))}><CloseIcon sx={{ fontSize: 16 }} /></IconButton>
          </div>
        ))}
      </div>

      <Button
        variant="contained" disabled={submitting} onClick={handleSubmit}
        sx={{ bgcolor: "#00a0a0", "&:hover": { bgcolor: "#007f86" }, mt: 1 }}
      >
        {submitting ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "Submit claim"}
      </Button>
    </div>
  );
};

export default NewClaimDrawer;
