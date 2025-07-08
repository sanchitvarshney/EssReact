import {
  Box,
  ButtonGroup,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  
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
import { Note } from "@mui/icons-material";
import NoticeboardCard from "../NoticeboardCard";
import EventNoteIcon from "@mui/icons-material/EventNote";
import MilestonesAndEventsCard from "../MilestonesAndEventsCard";
import CustomTextInput from "../reuseable/CustomTextInput";

const postOption = [
  { label: "All Post", value: "all" },
  { label: "Anniversary Post", value: "anniversary" },
  { label: "Birthday Post", value: "birth" },
  { label: "New Hire Post", value: "new" },
  { label: "Announcement Post", value: "announcement" },
];

type PostHeaderProps = {
  setFilter: (e: string) => void;
  postFilter: string;
};
const PostHeader: FC<PostHeaderProps> = ({ setFilter, postFilter }) => {
  const [isNewPost, setIsNewPost] = useState<boolean>(false);
  const [postType, setPostType] = useState("");
  const [isNoticeView, setIsNoticeView] = useState<boolean>(false);

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
      <div className="flex items-center justify-between">
        <Typography variant="h6" fontWeight={600}>
          Create a Post
        </Typography>
        <div className="block sm:hidden">
          <CustomToolTip title={"Notice And Birthdays"} placement={"bottom"}>
            <IconButton onClick={() => setIsNoticeView(true)}>
              <Note sx={{ color: "#000" }} />
            </IconButton>
          </CustomToolTip>
        </div>
      </div>

      <Box
        display="flex"
        justifyContent={"space-between"}
        gap={2}
        flexDirection={{ xs: "column", sm: "row" }}
        marginTop={2}
      >
        <div className="w-40 sm:w-60 flex flex-col justify-start items-start gap-1 ">
         
          <CustomTextInput field={{value:postFilter, onChange: (e: any) => setFilter(e.target.value)}} label={"Select Filter"} select={true} options={postOption}/>
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

      <Dialog
        open={isNoticeView}
        onClose={() => setIsNoticeView(false)}
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
            // pb: 1,
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <EventNoteIcon sx={{ color: "#2eacb3", mr: 1 }} />
            <Typography variant="h6" sx={{ fontSize: 18, fontWeight: 600 }}>
              Notice And Events
            </Typography>
          </Box>

          <IconButton onClick={() => setIsNoticeView(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          <div className="flex flex-col items-center my-2  gap-4 block sm:hidden">
            <NoticeboardCard />
            <MilestonesAndEventsCard />
          </div>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PostHeader;
