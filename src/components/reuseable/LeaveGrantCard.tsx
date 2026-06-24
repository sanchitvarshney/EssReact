import { Avatar, Chip } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import type { FC } from "react";

interface LeaveGrantCardPropsType {
  open?: any;
  maxWidth: any;
  isView: boolean;
  data: any;
}

const LeaveGrantCard: FC<LeaveGrantCardPropsType> = ({ open, maxWidth, isView, data }) => {
  const days = data?.totalday || data?.totalDuration;

  return (
    <div
      style={{ maxWidth }}
      className={`bg-white min-h-[210px] max-h-[220px] rounded-2xl border border-gray-100 overflow-hidden ${
        !isView ? "shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200" : ""
      }`}
    >
      {/* Top accent */}
      <div className="h-1 bg-gradient-to-r from-[#2eacb3] to-[#00d4e4]" />

      <div className="p-4">
        {/* Duration + "ago" chip */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <AccessTimeIcon sx={{ fontSize: 14, color: "#94a3b8" }} />
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
              Duration
            </span>
            <span className="text-sm font-bold text-[#2eacb3]">{days}</span>
          </div>
          <Chip
            label={data?.regago}
            size="small"
            sx={{
              backgroundColor: "#f0fdf4",
              color: "#16a34a",
              fontWeight: 600,
              fontSize: 10,
              height: 20,
              border: "1px solid #bbf7d0",
              "& .MuiChip-label": { px: 1 },
            }}
          />
        </div>

        {/* Employee */}
        <div className="flex items-center gap-3 mb-3">
          <Avatar
            src={data?.photo}
            alt={data?.empname}
            sx={{
              width: isView ? 52 : 44,
              height: isView ? 52 : 44,
              border: "2.5px solid #e0f7fa",
              backgroundColor: "#2eacb3",
              pointerEvents: "none",
              userSelect: "none",
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            {data?.empname?.charAt(0)}
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-bold text-gray-800 truncate">{data?.empname}</span>
              <span className="text-[10px] font-mono font-semibold text-[#0097a7] bg-[#e0f7fa] px-1.5 py-0.5 rounded-md">
                {data?.empcode}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-0.5 truncate">{data?.designation}</div>
            <div className="text-xs text-gray-400 truncate">{data?.department}</div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-50 mb-3" />

        {/* Leave type + date */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#2eacb3] flex-shrink-0" />
            <span className="text-xs font-semibold text-gray-600">{data?.leavetype} Leave</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <CalendarMonthIcon sx={{ fontSize: 12 }} />
            <span className="text-[11px]">{data?.regdate}</span>
          </div>
        </div>

        {/* View button — list mode only */}
        {!isView && (
          <button
            onClick={open}
            className="mt-3 w-full py-2 rounded-xl text-xs font-bold text-[#2eacb3] bg-[#e0f7fa] hover:bg-[#2eacb3] hover:text-white transition-all duration-200 cursor-pointer"
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );
};

export default LeaveGrantCard;
