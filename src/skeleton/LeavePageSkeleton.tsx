import { Skeleton } from "@mui/material";

const LeavePageSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton
          key={i}
          animation="wave"
          variant="rounded"
          width="100%"
          height={200}
          sx={{ borderRadius: 3 }}
        />
      ))}
    </div>
  );
};

export default LeavePageSkeleton;
