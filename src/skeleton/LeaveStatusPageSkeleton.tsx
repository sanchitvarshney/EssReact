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


    {/* ── Table card ── */}
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col flex-1 overflow-hidden">


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
