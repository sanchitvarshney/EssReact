import {  Skeleton,  } from "@mui/material";

const EmployeeProfilePageSkeleton = () => {
  return (
    <div className="w-full h-[calc(100vh-140px)] overflow-hidden  p-4">
      {/* Header Skeleton */}
      <div className="w-full sm:w-[80%] px-4 py-6 m-auto flex justify-between">
        <div className="flex items-center gap-x-15 gap-y-8 flex-wrap">
          <div>
            <Skeleton variant="circular" width={140} height={140} />
          </div>
          <div className="space-y-3">
            <Skeleton variant="text" width={250} height={32} />
            <Skeleton variant="text" width={200} height={20} />
            <Skeleton variant="text" width={180} height={20} />
          </div>
        </div>
      </div>

      <Skeleton
        animation="wave"
        height={2}
        width="100%"
        style={{ marginBottom: 6 }}
      />
      <div className="flex justify-center">

   
      <div className="w-100 grid grid-cols-3  place-items-center">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} variant="rounded" width={100} height={40} />
        ))}
      </div>
         </div>

      <div className="w-full px-4 py-6">
        <Skeleton variant="text" width={220} height={30} sx={{ mb: 2 }} />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pl-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              height={40}
              sx={{ borderRadius: 2 }}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default EmployeeProfilePageSkeleton;
