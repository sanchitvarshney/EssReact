import { Skeleton } from "@mui/material";

const LeaveStatusPageSkeleton = () => {
  return (
    <div className="h-[calc(100vh-90px)] flex flex-col overflow-hidden px-3 py-4 w-full">
      {/* Page header skeleton */}
      <div className="flex items-center gap-2 mb-4">
        <Skeleton variant="rounded" width={4} height={28} />
        <Skeleton variant="text" width={160} height={28} />
      </div>

      {/* Card skeleton */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col flex-1 overflow-hidden">
        {/* Card header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Skeleton variant="text" width={140} height={22} />
            <Skeleton
              variant="rounded"
              width={24}
              height={20}
              sx={{ borderRadius: 99 }}
            />
          </div>
          <Skeleton variant="text" width={110} height={18} />
        </div>

        {/* Table header */}
        <div className="flex gap-0 border-b border-gray-100 bg-[#1e293b] px-4 py-3">
          {[140, 160, 140, 120, 90, 100, 60].map((w, i) => (
            <div key={i} className="flex-1 px-2">
              <Skeleton
                variant="text"
                width={w}
                height={16}
                sx={{ bgcolor: "rgba(255,255,255,0.15)" }}
              />
            </div>
          ))}
        </div>

        {/* Table rows */}
        <div className="flex flex-col divide-y divide-gray-50 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center px-4 py-3 gap-0">
              <div className="flex-1 px-2 flex flex-col gap-1">
                <Skeleton variant="text" width={100} height={16} />
                <Skeleton
                  variant="rounded"
                  width={60}
                  height={18}
                  sx={{ borderRadius: 99 }}
                />
              </div>
              <div className="flex-1 px-2">
                <Skeleton variant="text" width={130} height={16} />
              </div>
              <div className="flex-1 px-2">
                <Skeleton variant="text" width={110} height={16} />
              </div>
              <div className="flex-1 px-2">
                <Skeleton variant="text" width={90} height={16} />
              </div>
              <div className="flex-1 px-2">
                <Skeleton
                  variant="rounded"
                  width={76}
                  height={24}
                  sx={{ borderRadius: 99 }}
                />
              </div>
              <div className="flex-1 px-2">
                <Skeleton variant="text" width={80} height={16} />
              </div>
              <div className="flex-1 px-2 flex justify-center">
                <Skeleton variant="circular" width={28} height={28} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaveStatusPageSkeleton;
