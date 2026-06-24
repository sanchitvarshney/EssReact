import { Skeleton } from "@mui/material";

const PeripheralPageSkeleton = () => {
  return (
    <div className="h-[calc(100vh-90px)] flex flex-col overflow-hidden px-3 py-4 w-full">

      {/* Page header */}
      <div className="flex items-center gap-2 mb-3 flex-shrink-0">
        <Skeleton variant="rectangular" animation="wave" width={4} height={28} sx={{ borderRadius: 99 }} />
        <Skeleton variant="circular" animation="wave" width={20} height={20} />
        <Skeleton variant="text" animation="wave" width={120} height={28} />
        <Skeleton variant="rectangular" animation="wave" width={52} height={22} sx={{ borderRadius: 99 }} />
      </div>

      {/* Device tabs */}
      <div className="flex gap-2 mb-3 flex-shrink-0">
        {[100, 130].map((w, i) => (
          <Skeleton key={i} variant="rectangular" animation="wave" width={w} height={30} sx={{ borderRadius: 12 }} />
        ))}
      </div>

      {/* Main two-column grid */}
      <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-4 min-h-0">

        {/* Left: image gallery card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
          {/* Main image area */}
          <div className="flex-1 flex items-center justify-center bg-gray-50 p-6">
            <Skeleton
              variant="rectangular"
              animation="wave"
              width="70%"
              height={220}
              sx={{ borderRadius: 12 }}
            />
          </div>

          {/* Thumbnails strip */}
          <div className="border-t border-gray-100 px-4 py-3 flex items-center gap-2">
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                animation="wave"
                width={44}
                height={44}
                sx={{ borderRadius: 8, flexShrink: 0 }}
              />
            ))}
          </div>
        </div>

        {/* Right: details card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden min-h-0">
          {/* Gradient top bar */}
          <div className="h-1 rounded-t-2xl bg-gradient-to-r from-[#b2ebf2] to-[#e0f7fa]" />

          <div className="p-5 flex flex-col gap-5">
            {/* Title block */}
            <div>
              <Skeleton variant="rectangular" animation="wave" width={72} height={20} sx={{ borderRadius: 99, mb: 1 }} />
              <Skeleton variant="text" animation="wave" width="65%" height={30} />
              <Skeleton variant="text" animation="wave" width="45%" height={20} sx={{ mt: 0.5 }} />
            </div>

            {/* Info rows box */}
            <div className="flex flex-col gap-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 items-center">
                  <Skeleton variant="circular" animation="wave" width={15} height={15} sx={{ flexShrink: 0 }} />
                  <Skeleton variant="text" animation="wave" width={70} height={16} sx={{ flexShrink: 0 }} />
                  <Skeleton variant="text" animation="wave" width="50%" height={16} />
                </div>
              ))}
            </div>

            {/* Description box */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Skeleton variant="circular" animation="wave" width={15} height={15} />
                <Skeleton variant="text" animation="wave" width={90} height={14} />
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col gap-2">
                <Skeleton variant="text" animation="wave" width="100%" height={14} />
                <Skeleton variant="text" animation="wave" width="90%" height={14} />
                <Skeleton variant="text" animation="wave" width="95%" height={14} />
                <Skeleton variant="text" animation="wave" width="70%" height={14} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeripheralPageSkeleton;
