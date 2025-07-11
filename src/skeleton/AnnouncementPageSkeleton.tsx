import { Box, Skeleton, Card, ButtonGroup } from "@mui/material";

const AnnouncementPageSkeleton = () => {
  return (
    <Box className=" overflow-hidden p-6 gap-4 grid sm:grid-cols-[2fr_1fr] grid-cols-1 md:grid-cols-[2fr_1fr] lg:grid-cols-[3fr_1fr]">
      {/* Left/Main Section */}
      <div className="flex flex-col gap-4">
        {/* Sticky PostHeader Skeleton */}
        <div className="sticky top-[-30px] z-10">
          <Box
            sx={{
              p: 2,
              border: "1px solid #ffffff",
              borderRadius: 2,
              backgroundColor: "#ffffff",
              mb: 1,
            }}
          >
            <div className="flex items-center justify-between">
              <Skeleton
                variant="rounded"
                animation="wave"
                height={10}
                width={200}
                className="rounded-lg"
              />
         
            </div>

            <Box
              display="flex"
              justifyContent={"space-between"}
              gap={2}
              flexDirection={{ xs: "column", sm: "row" }}
              marginTop={2}
            >
              <div className="w-40 sm:w-60 flex flex-col justify-start items-start gap-1 ">
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  height={40}
                  className="w-full rounded-lg"
                />
              </div>

              <ButtonGroup
                variant="outlined"
                aria-label="Basic button group"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                {[...Array(4)].map((_, index) => (
                  <Skeleton
                    key={index}
                    variant="rectangular"
                    animation="wave"
                    height={30}
                    className="w-10 rounded-lg"
                  />
                ))}
              </ButtonGroup>
            </Box>
          </Box>
        </div>

        <Card
          elevation={0}
          sx={{
            maxWidth: "1050px",
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            background: "#ffffff",
            border: "1px solid #f0f0f0",
            mb: 2,
            height: "60vh"
          }}
          className="w-full"
        >
          <Box p={2} mt={4}>
            <Box display="flex" alignItems="center" gap={2}>
              <Skeleton variant="circular" width={48} height={48} />
              <Box flex={1}>
                <Skeleton variant="text" width={120} height={24} />
                <Skeleton variant="text" width={80} height={18} />
              </Box>
              <Skeleton variant="rounded" width={80} height={28} />
            </Box>
            <Skeleton
              variant="rectangular"
              height={18}
              width="100%"
              sx={{ my: 2 }}
            />
            <Skeleton
              variant="rectangular"
              height={120}
              width="100%"
              sx={{ mb: 2 }}
            />
            <Box display="flex" gap={2}>
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} variant="rounded" width={60} height={28} />
              ))}
            </Box>
            <Skeleton
              variant="rectangular"
              height={36}
              width="100%"
              sx={{ mt: 2 }}
            />
          </Box>
        </Card>
      </div>
      {/* Right/Sidebar Section */}
      <div className="flex flex-col items-center sm:gap-4 hidden sm:flex">
        {/* NoticeboardCard Skeleton */}
        <Card
          elevation={2}
          sx={{
            maxWidth: 350,
            p: 2,
            borderRadius: 3,
            backgroundColor: "#ffffff",
            mb: 2,
          }}
          className="w-full"
        >
          <Skeleton variant="text" width={120} height={28} />
          <Skeleton
            variant="rectangular"
            width={300}
            height={24}
            sx={{ my: 1 }}
          />
          <Skeleton
            variant="rectangular"
            width={300}
            height={48}
            sx={{ my: 1 }}
          />
          <Box display="flex" alignItems="center" gap={2} mt={2}>
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="text" width={80} height={18} />
          </Box>
        </Card>
        {/* MilestonesAndEventsCard Skeleton */}
        <Card
          elevation={2}
          sx={{
            maxWidth: 350,
            p: 2,
            borderRadius: 3,
            backgroundColor: "#ffffff",
          }}
          className="w-full"
        >
          <Skeleton variant="text" width={180} height={28} />
          {[...Array(4)].map((_, i) => (
            <Box key={i} display="flex" alignItems="center" gap={2} mt={2}>
              <Skeleton variant="circular" width={45} height={45} />
              <Box>
                <Skeleton variant="text" width={80} height={18} />
                <Skeleton variant="text" width={60} height={14} />
              </Box>
            </Box>
          ))}
          <Skeleton
            variant="rectangular"
            width={100}
            height={24}
            sx={{ mt: 2 }}
          />
        </Card>
      </div>
    </Box>
  );
};

export default AnnouncementPageSkeleton;
