import { Skeleton } from "@mui/material";

const AttendencePageSkeleton = () => (
  <div className="h-[calc(100vh-78px)] flex flex-col overflow-hidden px-3 py-4 w-full">

    {/* Page header */}
    <div className="flex items-center gap-2 mb-3 flex-shrink-0">
      <Skeleton variant="rectangular" width={4} height={28} sx={{ borderRadius: 4 }} />
      <Skeleton variant="circular" width={22} height={22} />
      <Skeleton variant="text" width={120} height={26} sx={{ borderRadius: 1 }} />
    </div>

    {/* Attendance summary table */}
    <div className="flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
     
      {[...Array(2)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0">
          {[160, 100, 90, 90, 80, 80, 80].map((w, j) => (
            <Skeleton key={j} variant="text" width={w} height={16} sx={{ borderRadius: 1 }} />
          ))}
        </div>
      ))}
    </div>

    {/* Toolbar: legend pills + view toggle */}
    <div className="flex-shrink-0 mt-3 bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-2.5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            width={72}
            height={26}
            sx={{ borderRadius: 99, flexShrink: 0 }}
          />
        ))}
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} variant="rectangular" width={78} height={32} sx={{ borderRadius: "10px" }} />
        ))}
      </div>
    </div>

    {/* Date nav + stat chips */}
    <div className="flex-shrink-0 mt-3 flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-2">
        {[32, 56, 32].map((w, i) => (
          <Skeleton key={i} variant="rectangular" width={w} height={32} sx={{ borderRadius: 99 }} />
        ))}
        <Skeleton variant="text" width={110} height={26} sx={{ ml: 0.5, borderRadius: 1 }} />
      </div>
      <div className="flex items-center gap-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} variant="rectangular" width={96} height={40} sx={{ borderRadius: "12px" }} />
        ))}
      </div>
    </div>

    {/* Calendar */}
    <div className="flex-1 mt-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-0">
      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 border-b border-gray-100 flex-shrink-0">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="flex justify-center py-2.5">
            <Skeleton variant="text" width={28} height={14} sx={{ borderRadius: 1 }} />
          </div>
        ))}
      </div>
      {/* Calendar cells — 5 rows × 7 cols */}
      <div className="grid grid-cols-7 flex-1" style={{ gridTemplateRows: "repeat(5, 1fr)" }}>
        {[...Array(35)].map((_, i) => (
          <div
            key={i}
            className="border-b border-r border-gray-50 p-2 flex flex-col gap-1.5"
            style={{ borderRight: (i + 1) % 7 === 0 ? "none" : undefined, borderBottom: i >= 28 ? "none" : undefined }}
          >
            <Skeleton variant="circular" width={22} height={22} />
            {i % 4 === 0 && (
              <Skeleton variant="rectangular" height={15} sx={{ borderRadius: "4px" }} />
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default AttendencePageSkeleton;
