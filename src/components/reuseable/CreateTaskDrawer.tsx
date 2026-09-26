import { useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  Button,
  CircularProgress,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import dayjs, { type Dayjs } from "dayjs";
import { useCreateTaskMutation, useSearchAssigneesMutation } from "../../services/tasks";
import { useToast } from "../../hooks/useToast";

const PRIORITIES = ["Critical", "High", "Medium", "Low"];

const CreateTaskDrawer = ({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) => {
  const { showToast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [assignee, setAssignee] = useState<any>(null);
  const [assigneeOptions, setAssigneeOptions] = useState<any[]>([]);
  const [deadlineDate, setDeadlineDate] = useState<Dayjs | null>(null);
  const [deadlineTime, setDeadlineTime] = useState<Dayjs | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const searchTimer = useRef<any>(null);

  const [searchAssignees, { isLoading: searching }] = useSearchAssigneesMutation();
  const [createTask, { isLoading: creating }] = useCreateTaskMutation();

  const handleSearch = (q: string) => {
    clearTimeout(searchTimer.current);
    if (q.trim().length < 2) { setAssigneeOptions([]); return; }
    searchTimer.current = setTimeout(async () => {
      const res: any = await searchAssignees(q.trim());
      if (res?.data?.success) setAssigneeOptions(res.data.data || []);
    }, 300);
  };
  useEffect(() => () => clearTimeout(searchTimer.current), []);

  const handleSubmit = async () => {
    if (title.trim().length < 3) return showToast("Title must be at least 3 characters", "error");
    if (!assignee) return showToast("Choose who to assign this task to", "error");

    const fd = new FormData();
    fd.append("title", title.trim());
    fd.append("description", description.trim());
    fd.append("priority", priority);
    fd.append("assigned_to", assignee.empCode || assignee.emp_code);
    if (deadlineDate) fd.append("deadline_date", deadlineDate.format("YYYY-MM-DD"));
    if (deadlineTime) fd.append("deadline_time", deadlineTime.format("HH:mm"));
    if (file) fd.append("attachment", file);

    const res: any = await createTask(fd);
    if (res?.error) {
      showToast(res.error?.data?.message || "Could not create the task", "error");
      return;
    }
    if (res?.data?.success === false) {
      showToast(res.data.message || "Could not create the task", "error");
      return;
    }
    showToast("Task assigned", "success");
    onCreated();
  };

  return (
    <div className="w-full h-full p-5 flex flex-col gap-4 overflow-y-auto">
      <div className="flex items-center justify-between">
        <Typography variant="h6" className="font-bold">Assign a Task</Typography>
        <IconButton size="small" onClick={onClose}><CloseIcon fontSize="small" /></IconButton>
      </div>

      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value.slice(0, 400))}
        fullWidth
        size="small"
      />
      <TextField
        label="Details (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value.slice(0, 2000))}
        fullWidth
        multiline
        minRows={3}
        size="small"
      />
      <TextField
        select
        label="Priority"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        fullWidth
        size="small"
      >
        {PRIORITIES.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
      </TextField>

      <Autocomplete
        options={assigneeOptions}
        loading={searching}
        value={assignee}
        onChange={(_, v) => setAssignee(v)}
        onInputChange={(_, v, reason) => { if (reason === "input") handleSearch(v); }}
 
        filterOptions={(x) => x}
        noOptionsText={searching ? "Searching..." : "Type at least 2 characters"}
        getOptionLabel={(o: any) => o?.text || o?.name || ""}
        isOptionEqualToValue={(o: any, v: any) => (o?.empCode || o?.emp_code) === (v?.empCode || v?.emp_code)}
        renderOption={(props, option: any) => (
          <li {...props} key={option.empCode || option.emp_code}>
            <div className="flex flex-col">
              <span className="text-sm">{option.text}</span>
              {(option.designation || option.department) && (
                <span className="text-xs text-gray-400">{[option.designation, option.department].filter(Boolean).join(" - ")}</span>
              )}
            </div>
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Assign to"
            size="small"
            placeholder="Type a name or employee code"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {searching ? <CircularProgress size={16} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="flex gap-3">
          <MobileDatePicker
            label="Deadline date (optional)"
            value={deadlineDate}
            minDate={dayjs()}
            onChange={(v) => setDeadlineDate(v)}
            slotProps={{ textField: { size: "small", fullWidth: true } }}
          />
          <MobileTimePicker
            label="Deadline time (optional)"
            value={deadlineTime}
            onChange={(v) => setDeadlineTime(v)}
            slotProps={{ textField: { size: "small", fullWidth: true } }}
          />
        </div>
      </LocalizationProvider>
      <Typography variant="caption" className="text-gray-400 -mt-2">
        Leave the deadline blank - whoever you assign it to can add it themselves when they start working.
      </Typography>

      <div>
        <Button size="small" variant="outlined" onClick={() => fileRef.current?.click()}>
          {file ? file.name : "Attach a file (optional)"}
        </Button>
        <input
          ref={fileRef}
          type="file"
          hidden
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>

      <Button
        variant="contained"
        disabled={creating}
        onClick={handleSubmit}
        sx={{ bgcolor: "#2eacb3", "&:hover": { bgcolor: "#1e8a8f" }, mt: 1 }}
      >
        {creating ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "Assign Task"}
      </Button>
    </div>
  );
};

export default CreateTaskDrawer;
