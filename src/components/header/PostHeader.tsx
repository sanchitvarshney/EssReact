import {
  Box,
  ButtonGroup,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useState, type FC } from "react";
import CustomToolTip from "../reuseable/CustomToolTip";
import CampaignIcon from "@mui/icons-material/Campaign";
import CelebrationIcon from "@mui/icons-material/Celebration";
import CakeIcon from "@mui/icons-material/Cake";
import AssignmentIcon from "@mui/icons-material/Assignment";

import CloseIcon from "@mui/icons-material/Close";

import PersonAddIcon from "@mui/icons-material/PersonAdd";

import CreateNewPostPage from "../../pages/CreateNewPostPage";

const postOption = [
  { label: "All Post", value: "all" },
  { label: "Anniversary Post", value: "anniversary" },
  { label: "Birthday Post", value: "birth" },
  { label: "New Hire Post", value: "new" },
  { label: "Announcement Post", value: "announcement" },
];


type PostHeaderProps = {
  setFilter:(e:string)=>void;
  postFilter:string
}
const PostHeader:FC<PostHeaderProps> = ({setFilter,postFilter}) => {
 
  const [isNewPost, setIsNewPost] = useState<boolean>(false);
  const [postType, setPostType] = useState("");

  const handleNewPost = (value: string) => {
  
    switch (value) {
      case "Anniversary":
        setPostType(value);
        setIsNewPost(true);
        break;
      case "Annoucement":
        setPostType(value);
        setIsNewPost(true);
        break;
      case "BirthDay":
        setPostType(value);
        setIsNewPost(true);
        break;
      case "New Hire":
        setPostType("Hire");
        setIsNewPost(true);
        break;

      default:
        break;
    }
    setIsNewPost(true);
  };

  return (
    <Box
      sx={{
        p: 2,
        border: "1px solid #ffffff",
        borderRadius: 2,
        backgroundColor: "#ffffff",
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
        <div className="flex flex-col justify-start items-start gap-1">
          <span className="text-lg font-semibold">Filter</span>
          <Select
            value={postFilter}
            onChange={(e) => setFilter(e.target.value)}
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
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </div>

        <ButtonGroup
          variant="outlined"
          aria-label="Basic button group"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <CustomToolTip title={"Annoucement"} placement={"bottom"}>
            <IconButton onClick={() => handleNewPost("Announcement")}>
              <CampaignIcon sx={{ fontSize: 26, color: "#000" }} />
            </IconButton>
          </CustomToolTip>
          <CustomToolTip title={"BirthDay"} placement={"bottom"}>
            <IconButton onClick={() => handleNewPost("BirthDay")}>
              <CakeIcon sx={{ fontSize: 26, color: "#000" }} />
            </IconButton>
          </CustomToolTip>
          <CustomToolTip title={"Anniversary"} placement={"bottom"}>
            <IconButton onClick={() => handleNewPost("Anniversary")}>
              <CelebrationIcon sx={{ fontSize: 26, color: "#000" }} />
            </IconButton>
          </CustomToolTip>
          <CustomToolTip title={"New Hire"} placement={"bottom"}>
            <IconButton onClick={() => handleNewPost("New Hire")}>
              <PersonAddIcon sx={{ fontSize: 26, color: "#000" }} />
            </IconButton>
          </CustomToolTip>
        </ButtonGroup>
      </Box>

      <Dialog
        open={isNewPost}
        onClose={() => setIsNewPost(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 1,
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <AssignmentIcon sx={{ color: "#2eacb3" }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {`New ${postType} Post`}
            </Typography>
          </Box>
          <IconButton onClick={() => setIsNewPost(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <CreateNewPostPage />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PostHeader;
