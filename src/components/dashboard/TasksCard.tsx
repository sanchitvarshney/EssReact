import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useGetMyTasksMutation } from "../../services/tasks";
import { STATUS_COLOR, statusLabel } from "../../utils/taskBoxUtils";
import DashCard from "./DashCard";
import { DASH_PRIMARY } from "./DashboardRail";

const TasksCard = () => {
  const navigate = useNavigate();
  const [getMyTasks, { isLoading }] = useGetMyTasksMutation();
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    getMyTasks({ filter: "active" })
      .unwrap()
      .then((res: any) => setTasks(res?.data?.tasks ?? []))
      .catch(() => setTasks([]));
  }, []);

  return (
    <DashCard
      title="Tasks"
      className="h-full"
      action={
        <button
          onClick={() => navigate("/task-box")}
          className="text-[11px] font-medium cursor-pointer"
          style={{ color: DASH_PRIMARY }}
        >
          View all
        </button>
      }
    >
      <div className="max-h-[230px] overflow-y-auto custom-scrollbar-for-menu divide-y divide-gray-50">
        {isLoading ? (
          <p className="text-xs text-gray-400 py-8 text-center">Loading tasks…</p>
        ) : tasks.length === 0 ? (
          <p className="text-xs text-gray-400 py-8 text-center">
            No pending tasks — you're all caught up.
          </p>
        ) : (
          tasks.map((t) => {
            const color = STATUS_COLOR[t.status] || "#607d8b";
            const due = t.due_fmt || t.deadline_date_fmt;
            return (
              <button
                key={t.id}
                onClick={() => navigate("/task-box")}
                className="w-full grid grid-cols-[auto_1fr_auto] gap-x-3 gap-y-0.5 py-2.5 text-left cursor-pointer hover:bg-gray-50"
              >
                <span className="text-[11px] font-medium text-gray-400">#{t.id}</span>
                <span className="text-xs text-gray-800 truncate">{t.title}</span>
                <span className="text-[10px] text-gray-400 text-right">
                  {due ? dayjs(due).format("DD MMM YYYY") : "--"}
                </span>
                <span />
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit"
                  style={{ backgroundColor: `${color}1a`, color }}
                >
                  {statusLabel(t.status)}
                </span>
                <span />
              </button>
            );
          })
        )}
      </div>
    </DashCard>
  );
};

export default TasksCard;
