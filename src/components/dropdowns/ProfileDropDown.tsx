import {
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import DynamicIcon from "../reuseable/DynamicIcon";
import {
  profileOption,
  type profileOptionType,
} from "../../staticData/profileoption";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contextapi/AuthContext";
import ConfirmationModal from "../reuseable/ConfirmationModal";
import { useState } from "react";

const ProfileDropDown = ({ close }: { close: any }) => {
  const navigation = useNavigate();
  const [open, setOpen] = useState(false);
  const { signOut } = useAuth();

  const handleOptionClick = (item: profileOptionType) => {
    if (item.id === "logout") {
      setOpen(true);
     
    } else {
      navigation(item.path);
      close();
    }
  };

  return (
    <div className="w-full p-4 border-t-4 border-[#1e8a8f]">
      <List
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {profileOption.map((item: profileOptionType) => (
          <ListItem
            disablePadding
            key={item.id}
            className="hover:bg-gray-600/10 "
          >
            <IconButton
              onClick={() => handleOptionClick(item)}
              sx={{
                borderRadius: 0,
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <ListItemIcon>
                <DynamicIcon name={item.icon} size="medium" />
              </ListItemIcon>
              <ListItemText sx={{ userSelect: "none" }} primary={item.name} />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <ConfirmationModal
        open={open}
        close={() =>  {setOpen(false)
          close()
        }}
     
        aggree={() => signOut()}
        title={"Are you sure you want to logout?"}
        description="Logging out will end your current session and return you to the login screen."
      />
    </div>
  );
};

export default ProfileDropDown;
