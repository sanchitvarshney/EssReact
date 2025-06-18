import { Typography } from "@mui/material";

import NotificationContent from "../NotificationContent";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const ProfileDropDown = () => {
  return (
    <>
      <div className="w-full flex justify-between items-center p-3 border-b-1 border-gray-700/40">
        <Typography sx={{ fontSize: 19, fontWeight: 600 }}>
          Notifications
        </Typography>
        <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
          See All <ArrowForwardIcon sx={{ fontSize: 16 }} />
        </Typography>
      </div>
      <NotificationContent title={"name"} message={"hii"} time={"9:23 am"} />
    </>
  );
};

export default ProfileDropDown;
