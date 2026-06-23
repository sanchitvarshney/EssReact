import React, { memo } from "react";
import { Avatar } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import EmptyData from "./reuseable/EmptyData";

interface MilestonesAndEventsCardProps {
  title: string;
  data: any;
  expanded: boolean;
  onChange: () => void;
}

const MilestonesAndEventsCard: React.FC<MilestonesAndEventsCardProps> = ({
  title,
  data,
  expanded,
  onChange,
}) => {
  const count = Array.isArray(data) ? data.length : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={onChange}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors duration-150 text-left"
      >
        <span className="font-semibold text-gray-800 text-sm">{title}</span>
        <div className="flex items-center gap-2">
          {count > 0 && (
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "#e0f7fa", color: "#0097a7" }}
            >
              {count}
            </span>
          )}
          {expanded ? (
            <ExpandLessIcon sx={{ fontSize: 18, color: "#9ca3af" }} />
          ) : (
            <ExpandMoreIcon sx={{ fontSize: 18, color: "#9ca3af" }} />
          )}
        </div>
      </button>

      {/* Collapsible content */}
      {expanded && (
        <div className="border-t border-gray-100">
          {!data?.length ? (
            <div className="flex items-center justify-center py-4">
              <EmptyData width="w-[90px]" height="h-auto" />
            </div>
          ) : (
            <div className="divide-y divide-gray-50 max-h-60 overflow-y-auto custom-scrollbar-for-menu">
              {data.map((milestone: any, index: number) => (
                <div
                  key={milestone.time || index}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors duration-100"
                >
                  <Avatar
                    src={
                      milestone.photo && !milestone.photo.includes("undefined")
                        ? milestone.photo
                        : undefined
                    }
                    sx={{
                      width: 36,
                      height: 36,
                      backgroundColor: "#2eacb3",
                      fontSize: 14,
                      fontWeight: 700,
                      flexShrink: 0,
                      pointerEvents: "none",
                      userSelect: "none",
                    }}
                  >
                    {milestone?.name?.charAt(0)}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate leading-tight">
                      {milestone.name}
                    </p>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <span className="text-xs text-gray-400 truncate">
                        {milestone.department}
                      </span>
                      <span
                        className="text-[11px] font-semibold flex-shrink-0"
                        style={{ color: "#2eacb3" }}
                      >
                        {milestone.date}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(MilestonesAndEventsCard);
