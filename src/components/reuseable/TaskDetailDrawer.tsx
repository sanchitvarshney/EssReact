import { useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import dayjs, { type Dayjs } from "dayjs";
import { useToast } from "../../hooks/useToast";
import {
  useAddSubtaskMutation,
  useCloseTaskMutation,
  useCompleteTaskMutation,
  useEditTaskMutation,
  useForwardTaskMutation,
  useGetTaskDetailMutation,
  useGetTaskTimelineMutation,
  usePostCommentMutation,
  useReassignTaskMutation,
  useReopenTaskMutation,
  useSearchAssigneesMutation,
  useSetEtaMutation,
  useStartTaskMutation,
  useSurrenderTaskMutation,
  useTakebackTaskMutation,
  useToggleSubtaskMutation,
  useWithdrawTaskMutation,
} from "../../services/tasks";
import ConfirmationModal from "./ConfirmationModal";
import { deadlineText, PRIORITY_COLOR, STATUS_COLOR, statusLabel } from "../../utils/taskBoxUtils";

const PRIORITIES = ["Critical", "High", "Medium", "Low"];

/** Small "type a reason and confirm" form used by surrender / reopen / withdraw / take-back. */
const ReasonForm = ({
  title, hint, confirmLabel, required = true, message, busy, onConfirm, onCancel,
}: {
  title: string; hint: string; confirmLabel: string; required?: boolean; message?: string;
  busy: boolean; onConfirm: (reason: string) => void; onCancel: () => void;
}) => {
  const [text, setText] = useState("");
  return (
    <div className="border border-gray-100 rounded-xl p-3 flex flex-col gap-2 bg-gray-50">
      <Typography variant="subtitle2" className="font-semibold">{title}</Typography>
      {message && <Typography variant="caption" className="text-gray-500">{message}</Typography>}
      <TextField
        size="small"
        label={hint}
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, 300))}
        multiline
        minRows={2}
      />
      <div className="flex gap-2 justify-end">
        <Button size="small" onClick={onCancel} disabled={busy}>Cancel</Button>
        <Button
          size="small"
          variant="contained"
          disabled={busy || (required && !text.trim())}
          onClick={() => onConfirm(text.trim())}
        >
          {busy ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : confirmLabel}
        </Button>
      </div>
    </div>
  );
};

/** Assignee search + optional note, used by Forward / Reassign. */
const AssigneePickForm = ({
  title, confirmLabel, busy, onConfirm, onCancel,
}: { title: string; confirmLabel: string; busy: boolean; onConfirm: (empCode: string, note: string) => void; onCancel: () => void }) => {
  const [options, setOptions] = useState<any[]>([]);
  const [picked, setPicked] = useState<any>(null);
  const [note, setNote] = useState("");
  const [searchAssignees, { isLoading: searching }] = useSearchAssigneesMutation();
  const timer = useRef<any>(null);

  const handleSearch = (q: string) => {
    clearTimeout(timer.current);
    if (q.trim().length < 2) { setOptions([]); return; }
    timer.current = setTimeout(async () => {
      const res: any = await searchAssignees(q.trim());
      if (res?.data?.success) setOptions(res.data.data || []);
    }, 300);
  };

  return (
    <div className="border border-gray-100 rounded-xl p-3 flex flex-col gap-2 bg-gray-50">
      <Typography variant="subtitle2" className="font-semibold">{title}</Typography>
      <Autocomplete
        options={options}
        loading={searching}
        value={picked}
        onChange={(_, v) => setPicked(v)}
        onInputChange={(_, v, reason) => { if (reason === "input") handleSearch(v); }}
        // Server already filtered these (assignee-search?q=) - don't let MUI's own client-side
        // filter re-narrow (and often empty out) the list on top of that.
        filterOptions={(x) => x}
        noOptionsText={searching ? "Searching..." : "Type at least 2 characters"}
        getOptionLabel={(o: any) => o?.text || ""}
        renderOption={(props, option: any) => (
          <li {...props} key={option.empCode}>
            <div className="flex flex-col">
              <span className="text-sm">{option.text}</span>
              {(option.designation || option.department) && (
                <span className="text-xs text-gray-400">{[option.designation, option.department].filter(Boolean).join(" - ")}</span>
              )}
            </div>
          </li>
        )}
        renderInput={(p) => <TextField {...p} size="small" label="Search employee" />}
      />
      <TextField size="small" label="Note (optional)" value={note} onChange={(e) => setNote(e.target.value.slice(0, 200))} />
      <div className="flex gap-2 justify-end">
        <Button size="small" onClick={onCancel} disabled={busy}>Cancel</Button>
        <Button size="small" variant="contained" disabled={busy || !picked} onClick={() => onConfirm(picked.empCode, note)}>
          {busy ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : confirmLabel}
        </Button>
      </div>
    </div>
  );
};

const TaskDetailDrawer = ({ taskId, onClose, onChanged }: { taskId: number; onClose: () => void; onChanged: () => void }) => {
  const { showToast } = useToast();
  const [task, setTask] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [note, setNote] = useState("");
  const [dialog, setDialog] = useState<string>(""); // "" | forward | reassign | surrender | takeback | withdraw | reopen | eta | deadline | edit
  const [subText, setSubText] = useState("");
  const [commentText, setCommentText] = useState("");
  const [confirmClose, setConfirmClose] = useState(false);
  const [confirmComplete, setConfirmComplete] = useState(false);
  const [etaDate, setEtaDate] = useState<Dayjs | null>(null);
  const [etaTime, setEtaTime] = useState<Dayjs | null>(null);
  const [etaRemark, setEtaRemark] = useState("");
  const [etaSubmitted, setEtaSubmitted] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState("Medium");

  const [getTaskDetail, { isLoading: loadingDetail }] = useGetTaskDetailMutation();
  const [getTaskTimeline] = useGetTaskTimelineMutation();
  const [startTask, { isLoading: starting }] = useStartTaskMutation();
  const [completeTask, { isLoading: completing }] = useCompleteTaskMutation();
  const [closeTask, { isLoading: closing }] = useCloseTaskMutation();
  const [forwardTask, { isLoading: forwarding }] = useForwardTaskMutation();
  const [takebackTask, { isLoading: takingBack }] = useTakebackTaskMutation();
  const [surrenderTask, { isLoading: surrendering }] = useSurrenderTaskMutation();
  const [setEta, { isLoading: settingEta }] = useSetEtaMutation();
  const [reopenTask, { isLoading: reopening }] = useReopenTaskMutation();
  const [withdrawTask, { isLoading: withdrawing }] = useWithdrawTaskMutation();
  const [editTask, { isLoading: editing }] = useEditTaskMutation();
  const [reassignTask, { isLoading: reassigning }] = useReassignTaskMutation();
  const [addSubtask, { isLoading: addingSubtask }] = useAddSubtaskMutation();
  const [toggleSubtask] = useToggleSubtaskMutation();
  const [postComment, { isLoading: postingComment }] = usePostCommentMutation();

  const load = async () => {
    const [d, t]: any = await Promise.all([getTaskDetail(taskId), getTaskTimeline(taskId)]);
    if (d?.data?.success) setTask(d.data.data);
    else showToast(d?.data?.message || "Couldn't load this task", "error");
    if (t?.data?.success) setTimeline(t.data.data || []);
  };
  useEffect(() => { load(); }, [taskId]);

  const actions: string[] = task?.actions || [];

  const wrap = async (label: string, promise: Promise<any>, close = true) => {
    const res: any = await promise;
    if (res?.error) { showToast(res.error?.data?.message || "Something went wrong", "error"); return false; }
    if (res?.data?.success === false) { showToast(res.data.message || "Something went wrong", "error"); return false; }
    showToast(res?.data?.message || label, "success");
    setDialog("");
    if (close) { onChanged(); onClose(); } else { onChanged(); load(); }
    return true;
  };

  const fmtDate = (d?: string) => (d ? dayjs(d).format("DD MMM YYYY, hh:mm A") : "—");

  // Expected-time form, shared by "Expected time" and "Start Working" (which asks for the time first).
  // Date and time are required and must be in the future; starting asks only for those, no remark.
  const isStartFlow = dialog === "start";
  const etaAt = etaDate && etaTime
    ? etaDate.hour(etaTime.hour()).minute(etaTime.minute()).second(0)
    : null;
  const etaErrors = {
    date: !etaDate ? "Pick a date" : "",
    time: !etaTime ? "Pick a time" : etaAt && !etaAt.isAfter(dayjs()) ? "Time must be in the future" : "",
    remark: !isStartFlow && etaRemark.trim().length < 3 ? "Add a remark (at least 3 characters)" : "",
  };
  const etaValid = !etaErrors.date && !etaErrors.time && !etaErrors.remark;

  const openEtaForm = (mode: "eta" | "start") => {
    if (dialog === mode) { setDialog(""); return; }
    // Prefill with the current expected time when the task already has one.
    const existing = task?.eta_fmt ? dayjs(task.eta_fmt) : null;
    const prefill = existing?.isValid() && existing.isAfter(dayjs()) ? existing : null;
    setEtaDate(prefill);
    setEtaTime(prefill);
    setEtaRemark("");
    setEtaSubmitted(false);
    setDialog(mode);
  };

  const submitEta = async () => {
    setEtaSubmitted(true);
    if (!etaValid || !etaAt) return;
    const etaCall = setEta({
      id: task.id,
      expected_at: etaAt.format("YYYY-MM-DD HH:mm:ss"),
      ...(!isStartFlow ? { remark: etaRemark.trim() } : {}),
    });
    if (!isStartFlow) {
      wrap("Expected time saved", etaCall, false);
      return;
    }
    // Start flow: save the expected time first, then start - stop if saving the time fails.
    const res: any = await etaCall;
    if (res?.error || res?.data?.success === false) {
      showToast(res?.error?.data?.message || res?.data?.message || "Couldn't save the expected time", "error");
      return;
    }
    wrap("Task started", startTask({ id: task.id }), false);
  };

  if (loadingDetail && !task) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <CircularProgress sx={{ color: "#00a0a0" }} />
      </div>
    );
  }
  if (!task) return null;

  return (
    <div className="w-full h-full overflow-y-auto p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <Typography variant="h6" className="font-bold leading-tight">{task.title}</Typography>
          <Typography variant="caption" className="text-gray-400">{task.task_code}</Typography>
        </div>
        <IconButton size="small" onClick={onClose}><CloseIcon fontSize="small" /></IconButton>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Chip size="small" label={statusLabel(task.status)} sx={{ bgcolor: `${STATUS_COLOR[task.status] || "#607d8b"}1a`, color: STATUS_COLOR[task.status] || "#607d8b", fontWeight: 600 }} />
        <Chip size="small" variant="outlined" label={task.priority} sx={{ borderColor: PRIORITY_COLOR[task.priority] || "#999", color: PRIORITY_COLOR[task.priority] || "#999", fontWeight: 600 }} />
        {Number(task.is_overdue) === 1 && <Chip size="small" label="Overdue" color="error" />}
      </div>

      {task.description && <Typography variant="body2" className="text-gray-600 whitespace-pre-wrap">{task.description}</Typography>}

      <div className="grid grid-cols-2 gap-3 bg-gray-50 rounded-xl p-3">
        <div><Typography variant="caption" className="text-gray-400 block">Assigned by</Typography><Typography variant="body2">{task.assigned_by_name}</Typography></div>
        <div><Typography variant="caption" className="text-gray-400 block">Assigned to</Typography><Typography variant="body2">{task.assigned_to_name}</Typography></div>
        {task.status === "Forwarded" && (
          <div><Typography variant="caption" className="text-gray-400 block">Currently with</Typography><Typography variant="body2">{task.current_assignee_name}</Typography></div>
        )}
        <div><Typography variant="caption" className="text-gray-400 block">Deadline</Typography><Typography variant="body2">{deadlineText(task)}</Typography></div>
        {task.started_fmt && <div><Typography variant="caption" className="text-gray-400 block">Started</Typography><Typography variant="body2">{fmtDate(task.started_fmt)}</Typography></div>}
        {task.eta_fmt && <div><Typography variant="caption" className="text-gray-400 block">Expected by</Typography><Typography variant="body2">{fmtDate(task.eta_fmt)}</Typography></div>}
        {task.closed_fmt && <div><Typography variant="caption" className="text-gray-400 block">Closed</Typography><Typography variant="body2">{fmtDate(task.closed_fmt)}</Typography></div>}
      </div>
      {!task.expected_end_at && actions.includes("edit") && (
        <Typography variant="caption" className="text-orange-600">No deadline set yet - the assignee will add it before starting.</Typography>
      )}

      {/* ── Primary actions ─────────────────────────────────────────────── */}
      {actions.includes("start") && (
        <Button variant="contained" sx={{ bgcolor: "#00a0a0" }} disabled={starting} onClick={() => openEtaForm("start")}>
          {starting ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : "Start Working"}
        </Button>
      )}
      {(actions.includes("complete") || actions.includes("close")) && (
        <TextField size="small" label={actions.includes("complete") ? "What did you complete? (optional)" : "Closing note (optional)"} value={note} onChange={(e) => setNote(e.target.value.slice(0, 500))} multiline minRows={2} />
      )}
      {actions.includes("complete") && (
        <Button variant="contained" color="secondary" disabled={completing} onClick={() => setConfirmComplete(true)}>
          {completing ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : "Mark Complete"}
        </Button>
      )}
      {actions.includes("close") && (
        <Button variant="contained" sx={{ bgcolor: "#1B5E20" }} disabled={closing} onClick={() => setConfirmClose(true)}>
          {closing ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : "Close Task"}
        </Button>
      )}

      {/* ── Secondary actions ────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {actions.includes("eta") && (
          <Button size="small" variant="outlined" onClick={() => openEtaForm("eta")}>Expected time</Button>
        )}
        {actions.includes("forward") && <Button size="small" variant="outlined" onClick={() => setDialog(dialog === "forward" ? "" : "forward")}>Forward</Button>}
        {actions.includes("takeback") && (
          <Button size="small" variant="outlined" color="warning" onClick={() => setDialog(dialog === "takeback" ? "" : "takeback")}>Take back</Button>
        )}
        {actions.includes("reassign") && <Button size="small" variant="outlined" onClick={() => setDialog(dialog === "reassign" ? "" : "reassign")}>Reassign</Button>}
        {actions.includes("edit") && (
          <Button size="small" variant="outlined" onClick={() => { setEditTitle(task.title); setEditPriority(task.priority); setDialog(dialog === "edit" ? "" : "edit"); }}>Edit</Button>
        )}
        {actions.includes("reopen") && <Button size="small" variant="outlined" color="warning" onClick={() => setDialog(dialog === "reopen" ? "" : "reopen")}>Reopen</Button>}
        {actions.includes("surrender") && <Button size="small" variant="outlined" color="error" onClick={() => setDialog(dialog === "surrender" ? "" : "surrender")}>Surrender</Button>}
        {actions.includes("withdraw") && <Button size="small" variant="outlined" color="error" onClick={() => setDialog(dialog === "withdraw" ? "" : "withdraw")}>Withdraw</Button>}
      </div>

      {(dialog === "eta" || dialog === "start") && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="border border-gray-100 rounded-xl p-3 flex flex-col gap-2 bg-gray-50">
            <Typography variant="subtitle2" className="font-semibold">When do you expect to finish?</Typography>
            {isStartFlow && (
              <Typography variant="caption" className="text-gray-500">
                Set your expected finish time to start working on this task.
              </Typography>
            )}
            <div className="flex gap-2">
              <MobileDatePicker
                label="Date *" value={etaDate} minDate={dayjs()} onChange={setEtaDate}
                slotProps={{ textField: { size: "small", fullWidth: true, error: etaSubmitted && !!etaErrors.date, helperText: etaSubmitted ? etaErrors.date : "" } }}
              />
              <MobileTimePicker
                label="Time *" value={etaTime} onChange={setEtaTime}
                slotProps={{ textField: { size: "small", fullWidth: true, error: etaSubmitted && !!etaErrors.time, helperText: etaSubmitted ? etaErrors.time : "" } }}
              />
            </div>
            {!isStartFlow && (
              <TextField
                size="small" label="Remark *" placeholder="Why this time? e.g. waiting on API from backend team"
                value={etaRemark} onChange={(e) => setEtaRemark(e.target.value.slice(0, 500))}
                multiline minRows={2} fullWidth
                error={etaSubmitted && !!etaErrors.remark}
                helperText={etaSubmitted && etaErrors.remark ? etaErrors.remark : `${etaRemark.length}/500`}
              />
            )}
            <div className="flex gap-2 justify-end">
              <Button size="small" onClick={() => setDialog("")}>Cancel</Button>
              <Button
                size="small" variant="contained" disabled={settingEta || starting || (etaSubmitted && !etaValid)}
                onClick={submitEta}
                sx={isStartFlow ? { bgcolor: "#00a0a0" } : undefined}
              >
                {settingEta || starting
                  ? <CircularProgress size={16} sx={{ color: "#fff" }} />
                  : isStartFlow ? "Start Working" : "Save"}
              </Button>
            </div>
          </div>
        </LocalizationProvider>
      )}
      {dialog === "forward" && (
        <AssigneePickForm title="Forward this task to" confirmLabel="Forward" busy={forwarding} onCancel={() => setDialog("")}
          onConfirm={(empCode, n) => wrap("Task forwarded", forwardTask({ id: task.id, assigned_to: empCode, note: n }))} />
      )}
      {dialog === "reassign" && (
        <AssigneePickForm title="Reassign this task to" confirmLabel="Reassign" busy={reassigning} onCancel={() => setDialog("")}
          onConfirm={(empCode) => wrap("Task reassigned", reassignTask({ id: task.id, assigned_to: empCode }))} />
      )}
      {dialog === "takeback" && (
        <ReasonForm title="Take the task back?" hint="Note (optional)" confirmLabel="Take back" required={false} busy={takingBack}
          onCancel={() => setDialog("")} onConfirm={(r) => wrap("Task taken back", takebackTask({ id: task.id, reason: r }))} />
      )}
      {dialog === "surrender" && (
        <ReasonForm title="Surrender this task?" hint="Why? *" confirmLabel="Surrender" busy={surrendering}
          message="It goes back to whoever gave it to you." onCancel={() => setDialog("")}
          onConfirm={(r) => wrap("Task surrendered", surrenderTask({ id: task.id, reason: r }))} />
      )}
      {dialog === "withdraw" && (
        <ReasonForm title="Withdraw this task?" hint="Reason (optional)" confirmLabel="Withdraw" required={false} busy={withdrawing}
          message="The task will be closed for everyone working on it." onCancel={() => setDialog("")}
          onConfirm={(r) => wrap("Task withdrawn", withdrawTask({ id: task.id, reason: r }))} />
      )}
      {dialog === "reopen" && (
        <ReasonForm title="Reopen this task?" hint="Reason *" confirmLabel="Reopen" busy={reopening}
          message="The person it was assigned to is notified and picks up work on it again." onCancel={() => setDialog("")}
          onConfirm={(r) => wrap("Task reopened", reopenTask({ id: task.id, reason: r }))} />
      )}
      {dialog === "edit" && (
        <div className="border border-gray-100 rounded-xl p-3 flex flex-col gap-2 bg-gray-50">
          <Typography variant="subtitle2" className="font-semibold">Edit task</Typography>
          <TextField size="small" label="Title" value={editTitle} onChange={(e) => setEditTitle(e.target.value.slice(0, 400))} />
          <TextField select size="small" label="Priority" value={editPriority} onChange={(e) => setEditPriority(e.target.value)}>
            {PRIORITIES.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
          </TextField>
          <div className="flex gap-2 justify-end">
            <Button size="small" onClick={() => setDialog("")}>Cancel</Button>
            <Button size="small" variant="contained" disabled={editing || editTitle.trim().length < 3} onClick={() => wrap("Task updated", editTask({ id: task.id, title: editTitle.trim(), priority: editPriority }), false)}>
              {editing ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : "Save"}
            </Button>
          </div>
        </div>
      )}

      <Divider />

      {/* ── Sub-tasks ────────────────────────────────────────────────────── */}
      {(task.subtasks?.length > 0 || actions.includes("subtask")) && (
        <div className="flex flex-col gap-2">
          <Typography variant="subtitle2" className="font-semibold">
            Sub-tasks {task.subtasks?.length ? `(${task.subtasks.filter((s: any) => s.is_done === 1).length}/${task.subtasks.length})` : ""}
          </Typography>
          {task.subtasks?.map((s: any) => (
            <div key={s.id} className="flex items-center gap-2">
              <Checkbox
                size="small"
                checked={s.is_done === 1}
                disabled={!actions.includes("subtask")}
                onChange={async () => {
                  const res: any = await toggleSubtask({ id: task.id, sid: s.id });
                  if (res?.data?.success) load();
                }}
              />
              <Typography variant="body2" className={s.is_done === 1 ? "line-through text-gray-400" : ""}>{s.title}</Typography>
            </div>
          ))}
          {actions.includes("subtask") && (
            <div className="flex gap-2">
              <TextField size="small" fullWidth placeholder="Add a sub-task" value={subText} onChange={(e) => setSubText(e.target.value.slice(0, 100))} />
              <Button
                size="small" variant="contained" disabled={addingSubtask || subText.trim().length < 3}
                onClick={async () => {
                  const res: any = await addSubtask({ id: task.id, title: subText.trim() });
                  if (res?.data?.success) { setSubText(""); load(); }
                }}
              >Add</Button>
            </div>
          )}
        </div>
      )}

      <Divider />

      {/* ── Comments ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <Typography variant="subtitle2" className="font-semibold">Comments {task.comments?.length ? `(${task.comments.length})` : ""}</Typography>
        {task.comments?.map((c: any, i: number) => (
          <div key={i} className="bg-gray-50 rounded-xl p-2">
            <Typography variant="caption" className="text-gray-400 font-medium">{c.commenter_name || c.comment_by} - {fmtDate(c.at)}</Typography>
            <Typography variant="body2">{c.comment}</Typography>
          </div>
        ))}
        {actions.includes("comment") && (
          <div className="flex gap-2">
            <TextField size="small" fullWidth placeholder="Write a comment" value={commentText} onChange={(e) => setCommentText(e.target.value.slice(0, 500))} />
            <IconButton
              disabled={postingComment || !commentText.trim()}
              onClick={async () => {
                const res: any = await postComment({ id: task.id, comment: commentText.trim() });
                if (res?.data?.success) { setCommentText(""); load(); }
              }}
            ><SendIcon fontSize="small" sx={{ color: "#00a0a0" }} /></IconButton>
          </div>
        )}
      </div>

      {timeline.length > 0 && (
        <>
          <Divider />
          <div className="flex flex-col gap-2">
            <Typography variant="subtitle2" className="font-semibold">Activity timeline</Typography>
            {timeline.map((e: any, i: number) => (
              <div key={i} className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00a0a0] mt-1.5 flex-shrink-0" />
                <div>
                  <Typography variant="body2">{e.text || `${e.actor_name || "System"} ${e.action_type}`}</Typography>
                  <Typography variant="caption" className="text-gray-400">{fmtDate(e.at)}</Typography>
                  {e.remarks && <Typography variant="caption" className="text-gray-600 block">{e.remarks}</Typography>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <ConfirmationModal
        open={confirmClose}
        close={() => setConfirmClose(false)}
        title="Close this task?"
        description="Once closed, only the person who assigned it can reopen it - and only within the review window."
        aggree={() => { setConfirmClose(false); wrap("Task closed", closeTask({ id: task.id, notes: note.trim() })); }}
      />
      <ConfirmationModal
        open={confirmComplete}
        close={() => setConfirmComplete(false)}
        title="Mark as complete?"
        description="The person who assigned this task will be notified. They can still close it or reopen it later if more work is needed."
        aggree={() => { setConfirmComplete(false); wrap("Marked as completed", completeTask({ id: task.id, notes: note.trim() }), false); }}
      />
    </div>
  );
};

export default TaskDetailDrawer;
