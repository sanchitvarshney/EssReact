import { Skeleton } from "@mui/material";

const ROWS = 4;

const AssetVerificationSkeleton = () => {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-100">
      <div className="flex items-center gap-4 px-4 py-3 bg-gray-50 border-b border-gray-100">
        {[40, 140, 90, 90, 120, 80, 110, 70, 150, 160].map((w, i) => (
          <Skeleton
            key={i}
            variant="text"
            animation="wave"
            width={w}
            height={16}
            sx={{ flexShrink: 0 }}
          />
        ))}
      </div>

      {Array.from({ length: ROWS }).map((_, row) => (
        <div
          key={row}
          className="flex items-center gap-4 px-4 py-3 border-b border-gray-50 last:border-b-0"
        >
          <Skeleton
            variant="rectangular"
            animation="wave"
            width={40}
            height={40}
            sx={{ borderRadius: 2, flexShrink: 0 }}
          />
          <Skeleton variant="text" animation="wave" width={140} height={16} />
          <Skeleton variant="text" animation="wave" width={90} height={16} />
          <Skeleton variant="text" animation="wave" width={90} height={16} />
          <Skeleton variant="text" animation="wave" width={120} height={16} />
          <Skeleton
            variant="rectangular"
            animation="wave"
            width={70}
            height={22}
            sx={{ borderRadius: 99 }}
          />
          <Skeleton variant="text" animation="wave" width={110} height={16} />
          <Skeleton
            variant="rectangular"
            animation="wave"
            width={60}
            height={26}
            sx={{ borderRadius: 8 }}
          />
          <Skeleton
            variant="rectangular"
            animation="wave"
            width={150}
            height={26}
            sx={{ borderRadius: 8 }}
          />
          <Skeleton
            variant="rectangular"
            animation="wave"
            width={160}
            height={36}
            sx={{ borderRadius: 8 }}
          />
        </div>
      ))}
    </div>
  );
};

export default AssetVerificationSkeleton;
