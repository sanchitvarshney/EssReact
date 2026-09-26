import { Chip } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import { deadlineText, PRIORITY_COLOR, STATUS_COLOR, statusLabel } from "../../utils/taskBoxUtils";




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
