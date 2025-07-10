import { Box, Skeleton } from "@mui/material";

const AttendencePageSkeleton = () => {
  return (
    <Box className="w-full px-4 py-2 overflow-hidden" >
    
      <Skeleton
        variant="rectangular"
        height={80}
        sx={{ mb: 2, borderRadius: 2 }}
      />

      <Box className="w-full flex justify-between flex-wrap gap-y-5 gap-x-1 py-3 px-4 overflow-hidden">
        <Box className="flex gap-x-8 gap-y-2 flex-wrap">
          {[...Array(9)].map((_, i) => (
            <Box key={i} className="flex items-center space-x-1 mb-1">
              <Skeleton variant="circular" width={12} height={12} />
              <Skeleton variant="text" width={60} height={20} />
            </Box>
          ))}
        </Box>
        <Skeleton variant="rectangular" width={120} height={40} />
      </Box>
      {/* Button group and summary cards skeleton */}
      <Box className="w-full">
        <Box className="flex flex-wrap justify-between items-center p-2  space-y-2">
          <Box className="flex flex-wrap">
            <Skeleton
              variant="rectangular"
              width={180}
              height={36}
              sx={{ borderRadius: 1 }}
            />
          </Box>
          <Skeleton variant="text" width={120} height={36} />
          <Box className="flex items-center flex-wrap gap-x-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                width={90}
                height={60}
                sx={{ borderRadius: 2, mr: 1 }}
              />
            ))}
          </Box>
        </Box>
      
         <Skeleton variant="rectangular" width={"100%"} height={60} sx={{mb:2, borderRadius:2}} />
      
        <Box className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-7 overflow-hidden gap-4">
          {[...Array(14)].map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              width={150}
              height={140}
              sx={{ borderRadius: 2, mr: 1 }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default AttendencePageSkeleton;
