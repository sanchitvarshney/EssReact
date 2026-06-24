import type { FC } from "react";

type LeaveCardPropsType = {
  title: string;
  currentValue: string | number;
  img: any;
  credited: string | number;
  annualAllotment: string | number;
};

const LeaveCard: FC<LeaveCardPropsType> = ({
  title,
  currentValue,
  img,
  credited,
  annualAllotment,
}) => {
  const available = parseFloat(String(currentValue)) || 0;
  const isLow = available < 2;
  const isMed = available >= 2 && available < 5;

  const accentColor = isLow ? "#ef4444" : isMed ? "#f59e0b" : "#2eacb3";
  const bgColor = isLow ? "#fef2f2" : isMed ? "#fffbeb" : "#e0f7fa";
  const badgeBg = isLow ? "#fecaca" : isMed ? "#fde68a" : "#99f6e4";
  const badgeColor = isLow ? "#b91c1c" : isMed ? "#92400e" : "#0f766e";
  const badgeText = isLow ? "Low" : isMed ? "Moderate" : "Good";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Card header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <img
          src={img}
          alt={title}
          className="w-9 h-9 object-contain flex-shrink-0"
        />
        <span className="font-bold text-gray-800 text-sm leading-snug">
          {title}
        </span>
      </div>

      {/* Available balance — large number */}
      <div
        className="flex items-center justify-between px-4 py-4"
        style={{ backgroundColor: bgColor }}
      >
        <div>
          <p
            className="text-[10px] font-bold uppercase tracking-wider mb-0.5"
            style={{ color: accentColor }}
          >
            Available
          </p>
          <p
            className="text-3xl font-bold leading-none"
            style={{ color: accentColor }}
          >
            {available}
            <span className="text-sm font-normal ml-1.5 opacity-75">days</span>
          </p>
        </div>
        <span
          className="text-[11px] font-bold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: badgeBg, color: badgeColor }}
        >
          {badgeText}
        </span>
      </div>

      {/* Stats */}
      <div className="px-4 py-3 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Credited last month</span>
          <span className="text-xs font-semibold text-gray-700">
            {credited}
          </span>
        </div>
        <div className="h-px bg-gray-100" />
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Annual Allotment</span>
          <span className="text-xs font-semibold text-gray-700">
            {annualAllotment}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LeaveCard;
