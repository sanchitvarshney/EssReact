import { Skeleton } from "@mui/material";

const LeaveStatusPageSkeleton = () => (
  <div className="h-[calc(100vh-78px)] flex flex-col overflow-hidden px-3 py-4 w-full gap-4">

    {/* ── Page header ── */}
    <div className="flex items-center gap-2 flex-shrink-0">
      <Skeleton variant="rectangular" width={4} height={28} sx={{ borderRadius: 4 }} />
      <Skeleton variant="circular" width={20} height={20} />
      <Skeleton variant="text" width={140} height={26} sx={{ borderRadius: 1 }} />
      <Skeleton variant="rectangular" width={28} height={20} sx={{ borderRadius: 99 }} />
    </div>

    {/* ── Stats row — 4 cards ── */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-shrink-0">
      {[
        { bg: "#f8fafc", border: "#e2e8f0" },
        { bg: "#f0fdf4", border: "#bbf7d0" },
        { bg: "#fffbeb", border: "#fde68a" },
        { bg: "#fef2f2", border: "#fecaca" },
      ].map((s, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-2xl px-4 py-3 border"
          style={{ backgroundColor: s.bg, borderColor: s.border }}
        >
          <Skeleton variant="rectangular" width={32} height={32} sx={{ borderRadius: "10px", flexShrink: 0 }} />
          <div className="flex flex-col gap-1">
            <Skeleton variant="text" width={50} height={12} sx={{ borderRadius: 1 }} />
            <Skeleton variant="text" width={28} height={22} sx={{ borderRadius: 1 }} />
          </div>
        </div>
      ))}
    </div>

    {/* ── Table card ── */}
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col flex-1 overflow-hidden">

      {/* Sub-header: title + filter chips */}
      <div className="flex flex-col gap-2 px-5 py-3 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center justify-between">
          <Skeleton variant="text" width={150} height={20} sx={{ borderRadius: 1 }} />
          <Skeleton variant="text" width={90} height={16} sx={{ borderRadius: 1 }} />
        </div>
        {/* Filter chips row */}
        <div className="flex items-center gap-2">
          <Skeleton variant="circular" width={14} height={14} />
          {[44, 80, 64, 72, 68].map((w, i) => (
            <Skeleton key={i} variant="rectangular" width={w} height={24} sx={{ borderRadius: 99, flexShrink: 0 }} />
          ))}
        </div>
      </div>

      {/* Table header — light bg matching real table */}
      <div className="flex items-center bg-[#f8fafc] border-b-2 border-[#e2e8f0] px-4 py-2.5 flex-shrink-0">
        {[90, 60, 120, 90, 100, 76, 80, 28].map((w, i) => (
          <div key={i} className="flex-1 px-2">
            <Skeleton variant="text" width={w} height={14} sx={{ borderRadius: 1 }} />
          </div>
        ))}
      </div>

      {/* Table rows */}
      <div className="flex flex-col divide-y divide-gray-50 overflow-hidden">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex items-center px-4 py-3">

            {/* Leave type — dot + name */}
            <div className="flex-1 px-2 flex items-center gap-2">
              <Skeleton variant="circular" width={8} height={8} />
              <Skeleton variant="text" width={80} height={14} sx={{ borderRadius: 1 }} />
            </div>

            {/* Duration pill */}
            <div className="flex-1 px-2">
              <Skeleton variant="rectangular" width={48} height={20} sx={{ borderRadius: 99 }} />
            </div>

            {/* Date range */}
            <div className="flex-1 px-2">
              <Skeleton variant="text" width={120} height={14} sx={{ borderRadius: 1 }} />
            </div>

            {/* Requested on */}
            <div className="flex-1 px-2">
              <Skeleton variant="text" width={80} height={14} sx={{ borderRadius: 1 }} />
            </div>

            {/* Reporting to */}
            <div className="flex-1 px-2">
              <Skeleton variant="text" width={90} height={14} sx={{ borderRadius: 1 }} />
            </div>

            {/* Status chip */}
            <div className="flex-1 px-2">
              <Skeleton variant="rectangular" width={72} height={22} sx={{ borderRadius: 99 }} />
            </div>

            {/* Remark */}
            <div className="flex-1 px-2">
              <Skeleton variant="text" width={70} height={14} sx={{ borderRadius: 1 }} />
            </div>

            {/* Action icon */}
            <div className="flex-1 px-2 flex justify-center">
              <Skeleton variant="circular" width={26} height={26} />
            </div>

          </div>
        ))}
      </div>
    </div>
  </div>
);

export default LeaveStatusPageSkeleton;
