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

import { useState } from "react";
import SignOutModal from "../SignOutModal";

const ProfileDropDown = ({ close }: { close: any }) => {
  const navigation = useNavigate();
  const [open, setOpen] = useState(false);
  const { signOut } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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
            className="hover:bg-gray-600/10 cursor-pointer"
              onClick={(e:any) => { handleOptionClick(item)
                setAnchorEl(e.currentTarget);
              }}
          >
            <IconButton
            
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
      <SignOutModal anchorEl={anchorEl}  openSign={open}
        close={() => {
          setOpen(false);
          close();
        }}
        aggree={() => signOut()}/>
    
    </div>
  );
};

export default ProfileDropDown;
