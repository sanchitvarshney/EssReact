import { Skeleton } from "@mui/material";

const EmployeeProfilePageSkeleton = () => (
  <div className="max-w-4xl mx-auto flex flex-col gap-4">

    {/* Profile banner card */}
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Cover strip */}
      <Skeleton
        variant="rectangular"
        height={112}
        sx={{ borderRadius: 0, transform: "none" }}
      />

      <div className="px-5 sm:px-8 pb-5">
        {/* Avatar overlapping cover */}
        <div className="-mt-10 mb-3">
          <Skeleton
            variant="circular"
            width={80}
            height={80}
            sx={{ border: "4px solid #fff", flexShrink: 0 }}
          />
        </div>

        {/* Name + ID */}
        <div className="flex items-center gap-2 mb-2">
          <Skeleton variant="text" width={180} height={28} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={64} height={20} sx={{ borderRadius: 99 }} />
        </div>

        {/* Role + dept pills */}
        <div className="flex gap-2">
          <Skeleton variant="rectangular" width={90} height={20} sx={{ borderRadius: 99 }} />
          <Skeleton variant="rectangular" width={110} height={20} sx={{ borderRadius: 99 }} />
        </div>
      </div>
    </div>

    {/* Tab switcher */}
    <div className="flex justify-center">
      <div className="flex items-center gap-1 p-1 bg-gray-50 border border-gray-200 rounded-2xl">
        {[110, 100, 150].map((w, i) => (
          <Skeleton key={i} variant="rectangular" width={w} height={38} sx={{ borderRadius: "10px" }} />
        ))}
      </div>
    </div>

    {/* Content — matches EmployeeInformationPage card layout */}
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Section header */}
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-50">
        <Skeleton variant="rectangular" width={4} height={20} sx={{ borderRadius: 4 }} />
        <Skeleton variant="circular" width={16} height={16} />
        <Skeleton variant="text" width={140} height={18} sx={{ borderRadius: 1 }} />
      </div>
      {/* Field grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-5 p-5">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1">
            <Skeleton variant="text" width={72} height={12} sx={{ borderRadius: 1 }} />
            <Skeleton variant="text" width={130} height={18} sx={{ borderRadius: 1 }} />
          </div>
        ))}
      </div>
    </div>

    {/* Second section card */}
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-50">
        <Skeleton variant="rectangular" width={4} height={20} sx={{ borderRadius: 4 }} />
        <Skeleton variant="circular" width={16} height={16} />
        <Skeleton variant="text" width={160} height={18} sx={{ borderRadius: 1 }} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-5 p-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1">
            <Skeleton variant="text" width={72} height={12} sx={{ borderRadius: 1 }} />
            <Skeleton variant="text" width={130} height={18} sx={{ borderRadius: 1 }} />
          </div>
        ))}
      </div>
    </div>

  </div>
);

export default EmployeeProfilePageSkeleton;
