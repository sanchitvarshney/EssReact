import { Avatar, Box, Typography } from "@mui/material";

const dummyData: any = [
  {
    title: "Tomorrow is a Holiday!",
    status: "Birthday",
    author: "HR Team",
    date: "Jan 14th, 2021",
    time: "10:30 AM",
    avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    title: "Tomorrow is a Holiday!",
    status: "Birthday",
    author: "Manager",
    date: "Jan 11th, 2021",
    time: "10:30 AM",
    avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    title: "Tomorrow is a Holiday!",
    status: "Birthday",
    author: "Developer Team",
    date: "Jan 13th, 2021",
    time: "10:30 AM",
    avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    title: "Tomorrow is a Holiday!",
    status: "Birthday",
    author: "Developer Team",
    date: "Jan 13th, 2021",
    time: "10:30 AM",
    avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    title: "Tomorrow is a Holiday!",
    status: "Birthday",
    author: "Developer Team",
    date: "Jan 13th, 2021",
    time: "10:30 AM",
    avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    title: "Tomorrow is a Holiday!",
    status: "Birthday",
    author: "Developer Team",
    date: "Jan 13th, 2021",
    time: "10:30 AM",
    avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
  },
];
const MilestonePage = () => {
  const displayedData = dummyData.slice(0, 4);

  return (
    <div className="w-full">
      <Typography variant="subtitle1" fontWeight={600}>
        Current Month's
      </Typography>
      {displayedData.map((milestone: any) => (
        <div key={milestone.time}>
          <Box display="flex" alignItems="center" mt={3}>
            <Avatar
              src={milestone.avatarUrl}
              sx={{ width: 45, height: 45, backgroundColor: "#2eacb3" }}
            />
            <Box ml={1}>
              <Typography variant="body2" fontWeight={500}>
                {milestone.author}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {milestone.status}
              </Typography>
            </Box>
          </Box>
        </div>
      ))}
      <div className="flex justify-center items-center mt-3">
        <span className="border-b-1 text-sm font-bold">View All</span>
      </div>
    </div>
  );
};

export default MilestonePage;
