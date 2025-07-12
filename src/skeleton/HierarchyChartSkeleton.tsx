import { Box, Skeleton } from "@mui/material";

const HierarchyChartSkeleton = () => {
  return (
    <>
      {/* Header with zoom controls skeleton */}
      <div className="w-full h-15 flex justify-between items-center p-4">
        <div className="flex gap-2" />

        <div className="flex gap-2 items-center shadow-lg p-2 rounded-lg ">
          <Skeleton variant="text" animation="wave" width={40} height={40} />
          <Skeleton variant="text" animation="wave" width={40} height={40} />
          <Skeleton variant="text" animation="wave" width={40} height={40} />
        </div>
      </div>

      {/* Main chart area skeleton */}
      <div className="overflow-hidden w-full  flex flex-col items-center justify-center mt-20">
        <div style={{ height: "100%" }}>
          {/* Root node skeleton */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
            <Box
              sx={{
                borderRadius: 3,
                minWidth: 280,
                maxWidth: 320,
                p: 2,
                boxShadow: 6,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Skeleton
                  variant="circular"
                  animation="wave"
                  width={48}
                  height={48}
                />
                <Box sx={{ flex: 1 }}>
                  <Skeleton
                    variant="text"
                    animation="wave"
                    width="70%"
                    height={24}
                    sx={{ mb: 1 }}
                  />
                  <Skeleton
                    variant="text"
                    animation="wave"
                    width="50%"
                    height={20}
                    sx={{ mb: 1 }}
                  />
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Skeleton
                      variant="rectangular"
                      animation="wave"
                      width={60}
                      height={22}
                      sx={{ borderRadius: 1 }}
                    />
                    <Skeleton
                      variant="rectangular"
                      animation="wave"
                      width={80}
                      height={22}
                      sx={{ borderRadius: 1 }}
                    />
                    <Skeleton
                      variant="rectangular"
                      animation="wave"
                      width={100}
                      height={20}
                      sx={{ borderRadius: 1 }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Tree structure skeleton */}
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Box sx={{ position: "relative" }}>
              {/* First level children */}
              <Box sx={{ display: "flex", gap: 4, mb: 4 }}>
                {[1, 2, 3].map((item) => (
                  <Box key={item} sx={{ textAlign: "center" }}>
                    <Box
                      sx={{
                        // background: "#1e293b",
                        borderRadius: 3,
                        minWidth: 200,
                        maxWidth: 240,
                        p: 2,
                        boxShadow: 6,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Skeleton
                          variant="circular"
                          animation="wave"
                          width={40}
                          height={40}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Skeleton
                            variant="text"
                            animation="wave"
                            width="80%"
                            height={20}
                            sx={{ mb: 0.5 }}
                          />
                          <Skeleton
                            variant="text"
                            animation="wave"
                            width="60%"
                            height={16}
                            sx={{ mb: 1 }}
                          />
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Skeleton
                              variant="rectangular"
                              animation="wave"
                              width={50}
                              height={18}
                              sx={{ borderRadius: 1 }}
                            />
                            <Skeleton
                              variant="rectangular"
                              animation="wave"
                              width={70}
                              height={18}
                              sx={{ borderRadius: 1 }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </div>
      </div>
    </>
  );
};

export default HierarchyChartSkeleton;
