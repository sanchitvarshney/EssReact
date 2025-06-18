import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import DynamicIcon from "../reuseable/DynamicIcon";
import {
  profileOption,
  type profileOptionType,
} from "../../staticData/profileoption";

const ProfileDropDown = () => {
  return (
    <div className="w-full p-4">
      <List
        sx={{
          display: "flex",
          gap: 2,
          flexDirection: "column",
        }}
      >
        {profileOption.map((item: profileOptionType) => (
          <ListItem
            disablePadding
            key={item.id}
            className="hover:bg-gray-600/10 px-1"
          >
            <ListItemIcon>
              <DynamicIcon name={item.icon} size="medium" />
            </ListItemIcon>
            <ListItemText sx={{ userSelect: "none" }} primary={item.name} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ProfileDropDown;
