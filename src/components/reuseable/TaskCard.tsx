import { Chip } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import dayjs from "dayjs";

export const STATUS_COLOR: Record<string, string> = {
  Assigned: "#607d8b",
  InProgress: "#1e88e5",
  Forwarded: "#1e88e5",
  Completed: "#8e24aa",
  PendingApproval: "#8e24aa",
  Closed: "#2e7d32",
  FinalClosed: "#2e7d32",
  Reopened: "#e53935",
  Withdrawn: "#757575",
  Surrendered: "#ef6c00",
};

export const PRIORITY_COLOR: Record<string, string> = {
  Critical: "#c62828",
  High: "#ef6c00",
  Medium: "#f9a825",
  Low: "#43a047",
};

export const statusLabel = (status?: string) => {
  if (!status) return "";
  if (status === "InProgress") return "In Progress";
  if (status === "PendingApproval") return "Pending Approval";
  if (status === "FinalClosed") return "Final Closed";
  return status;
};

export const deadlineText = (task: any) => {
  if (task.deadline_state === "TIME_MISSING") return `${dayjs(task.deadline_date_fmt || task.due_fmt).format("DD MMM YYYY")} - time not set`;
  if (task.deadline_state === "DATE_MISSING" || (!task.due_fmt && !task.deadline_date_fmt)) return "Not set yet";
  return task.due_fmt ? dayjs(task.due_fmt).format("DD MMM YYYY, hh:mm A") : "Not set yet";
};

const TaskCard = ({ task, onClick }: { task: any; onClick: () => void }) => {
  const overdue = Number(task.is_overdue) === 1;
  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-[#2eacb3]/40 transition-all cursor-pointer p-4 flex flex-col gap-2"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2">{task.title}</p>
        <Chip
          size="small"
          label={statusLabel(task.status)}
          sx={{ bgcolor: `${STATUS_COLOR[task.status] || "#607d8b"}1a`, color: STATUS_COLOR[task.status] || "#607d8b", fontWeight: 600, flexShrink: 0 }}
        />
      </div>
      <p className="text-xs text-gray-400 truncate">
        {task.assigned_by_name ? `From ${task.assigned_by_name}` : ""}
        {task.assigned_by_name && (task.assigned_to_name || task.assigned_to) ? "  •  " : ""}
        {task.assigned_to_name || task.assigned_to ? `To ${task.assigned_to_name || task.assigned_to}` : ""}
      </p>
      {task.status === "Forwarded" && task.current_assignee_name && (
        <p className="text-xs text-[#1e88e5] font-medium">With {task.current_assignee_name}</p>
      )}
      <div className="flex items-center gap-3 mt-1">
        <Chip
          size="small"
          variant="outlined"
          label={task.priority}
          sx={{ borderColor: PRIORITY_COLOR[task.priority] || "#999", color: PRIORITY_COLOR[task.priority] || "#999", fontWeight: 600, height: 22 }}
        />
        <div className={`flex items-center gap-1 text-xs ${overdue ? "text-red-600 font-semibold" : "text-gray-400"}`}>
          <EventIcon sx={{ fontSize: 14 }} />
          <span>{overdue ? "Overdue - " : ""}{deadlineText(task)}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
