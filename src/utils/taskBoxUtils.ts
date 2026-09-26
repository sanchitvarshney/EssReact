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