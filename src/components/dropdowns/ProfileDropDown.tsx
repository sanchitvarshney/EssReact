import { IconButton, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import DynamicIcon from "../reuseable/DynamicIcon";
import {
  profileOption,
  type profileOptionType,
} from "../../staticData/profileoption";
import { useNavigate } from "react-router-dom";

const ProfileDropDown = ({close}:{close:any}) => {
  const navigation = useNavigate()
  return (
    <div className="w-full p-4">
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
            <IconButton onClick={()=> {
              navigation("manage-account") 
              close()}} sx={{borderRadius:0, "&:hover": {
              backgroundColor:"transparent"
            }}}>
            <ListItemIcon>
              <DynamicIcon name={item.icon} size="medium" />
            </ListItemIcon>
            <ListItemText sx={{ userSelect: "none" }} primary={item.name} />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ProfileDropDown;
