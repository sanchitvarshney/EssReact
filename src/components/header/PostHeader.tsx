import {
  Box,
  ButtonGroup,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useState } from "react";
import CustomToolTip from "../reuseable/CustomToolTip";
import CampaignIcon from "@mui/icons-material/Campaign";
import CelebrationIcon from "@mui/icons-material/Celebration";
import CakeIcon from "@mui/icons-material/Cake";

import PersonAddIcon from "@mui/icons-material/PersonAdd";
const postOption = [
  { label: "All Post", value: "all" },
  { label: "Anniversary Post", value: "anniversary" },
  { label: "Birthday Post", value: "birth" },
  { label: "New Hire Post", value: "new" },
  { label: "New Hire Post", value: "announcement" },
];

const PostHeader = () => {
  const [postType, setPostType] = useState("announcement");

  return (
    <Box
      sx={{
        p: 2,
        border: "1px solid #ffffff",
        borderRadius: 2,
        backgroundColor: "#f9fafb",
        mb: 1,
      }}
    >
      <Typography variant="h6" fontWeight={600} mb={2}>
        Create a Post
      </Typography>

      <Box
        display="flex"
        justifyContent={"space-between"}
        gap={2}
        flexDirection={{ xs: "column", sm: "row" }}
      >
        <Select
          value={postType}
          onChange={(e) => setPostType(e.target.value)}
          size="small"
          sx={{
            minWidth: 200,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#000",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#2eacb3",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#2eacb3",
            },
          }}
        >
          {postOption.map((type) => (
            <MenuItem key={type.value} value={type.value} >
              {type.label}
            </MenuItem>
          ))}
        </Select>

        <ButtonGroup variant="outlined" aria-label="Basic button group">
          <CustomToolTip title={"Annoucement"} placement={"bottom"}>
            <IconButton>
              <CampaignIcon sx={{ fontSize: 26, color: "#000" }} />
            </IconButton>
          </CustomToolTip>
          <CustomToolTip title={"BirthDay"} placement={"bottom"}>
            <IconButton>
              <CakeIcon sx={{ fontSize: 26, color: "#000" }} />
            </IconButton>
          </CustomToolTip>
          <CustomToolTip title={"Anniversary"} placement={"bottom"}>
            <IconButton>
              <CelebrationIcon sx={{ fontSize: 26, color: "#000" }} />
            </IconButton>
          </CustomToolTip>
          <CustomToolTip title={"New Hire"} placement={"bottom"}>
            <IconButton>
              <PersonAddIcon sx={{ fontSize: 26, color: "#000" }} />
            </IconButton>
          </CustomToolTip>
        </ButtonGroup>
      </Box>
    </Box>
  );
};

export default PostHeader;
