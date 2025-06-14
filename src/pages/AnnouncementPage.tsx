import { Box } from "@mui/material";
import NewHireAnnouncementCard from "../components/reuseable/NewHireAnnouncementCard";

const AnnouncementPage = () => {
  return (
    <Box className=" h-[calc(100vh-65px)] overflow-auto px-4 md:px-10 py-6 space-y-6">
      <NewHireAnnouncementCard />
      <NewHireAnnouncementCard />
 
    </Box>
  );
};

export default AnnouncementPage;
