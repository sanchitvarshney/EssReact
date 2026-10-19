import { useEffect } from "react";
import { Avatar } from "@mui/material";
import { useLeaveListMutation } from "../../services/Leave";
import DashCard from "./DashCard";

const AbsentTodayCard = () => {
  const [leaveList, { data }] = useLeaveListMutation();

  useEffect(() => {
    leaveList();
  }, []);

  const list: any[] = Array.isArray(data?.data) ? data.data : [];

  return (
    <DashCard
      title="Today's Absences"
      className="h-full"
      action={
        list.length > 0 && (
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: "#e0f6f6", color: "#007f86" }}
          >
            {list.length}
          </span>
        )
      }
    >
      {list.length === 0 ? (
        <p className="text-xs text-gray-400 py-8 text-center">Everyone is in today.</p>
      ) : (
        <div className="space-y-1 px-2 -mx-2">
          {list.map((e, i) => (
            <div key={i} className="flex items-center gap-2.5 py-1.5 px-2 -mx-2 rounded-xl row-hover">
              <Avatar
                src={e.emp_photo && !String(e.emp_photo).includes("undefined") ? e.emp_photo : undefined}
                sx={{ width: 28, height: 28, fontSize: 12, bgcolor: "#9aa0a6" }}
              >
                {e.emp_name?.charAt(0)}
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-800 truncate">{e.emp_name}</p>
                <p className="text-[10px] text-gray-400 truncate">
                  {e.leave_type} • {e.date_from}
                  {e.will_return ? ` • Returns ${e.will_return}` : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashCard>
  );
};

export default AbsentTodayCard;
