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
import { useOnFeedBackMutation } from "../../services/vibe";

const ProfileDropDown = ({ close }: { close: any }) => {
  const navigation = useNavigate();
  const [open, setOpen] = useState(false);
  const { signOut, user } = useAuth();
  const [onFeedBack] = useOnFeedBackMutation();
  const [selected, setSelected] = useState<string | null>(null);

  const handleOptionClick = (item: profileOptionType) => {
    if (item.id === "logout") {
      setOpen(true);
    } else {
      navigation(item.path);
      close();
    }
  };
  const handleLogout = () => {
    if (selected) {
      setSelected(null);
      onFeedBack({
        feedback: selected,
        //@ts-ignore
        empcode: user?.id,
      });

      signOut();

      return;
    }
    signOut();
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
            onClick={() => {
              handleOptionClick(item);
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
      <SignOutModal
        openSign={open}
        close={() => {
          setOpen(false);
          close();
        }}
        aggree={handleLogout}
        setSelected={setSelected}
        selected={selected}
      />
    </div>
  );
};

export default ProfileDropDown;
