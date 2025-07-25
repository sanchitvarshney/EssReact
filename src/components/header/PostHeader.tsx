import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { useState, type FC } from "react";

import AssignmentIcon from "@mui/icons-material/Assignment";

import CloseIcon from "@mui/icons-material/Close";

import CreateNewPostPage from "../../pages/CreateNewPostPage";

import CustomTextInput from "../reuseable/CustomTextInput";
import { CustomButton } from "../ui/CustomButton";

const postOption = [
  { label: "All Post", value: "" },
  { label: "Anniversary Post", value: "WOKANV" },
  { label: "Birthday Post", value: "BIRTHDAY" },
  { label: "New Hire Post", value: "NEWHIRES" },
  { label: "Announcement Post", value: "ANNOUNCEMNT" },
  { label: "Event", value: "EVENT" },
  { label: "Promotion", value: "PROMOTION" },
];

type PostHeaderProps = {
  setFilter: (e: string) => void;
  postFilter: string;
};
const PostHeader: FC<PostHeaderProps> = ({ setFilter, postFilter }) => {
  const [isNewPost, setIsNewPost] = useState<boolean>(false);

  const handleNewPost = () => {
   
    setIsNewPost(true);
  };

  return (
    <Box
      sx={{
        p: 2,

        borderRadius: 1,

        mb: 1,
        boxShadow: 0,
      }}
      className=" bg-gradient-to-br from-[#ffffff] to-[#fff] shadow-lg border border-[#2eacb3] "
    >
      <div className="flex items-center justify-between">
        <Typography variant="h6" fontWeight={600}>
          Create a Post
        </Typography>
        {/* <div className="block sm:hidden">
          <CustomToolTip title={"Notice And Birthdays"} placement={"bottom"}>
            <IconButton onClick={() => setIsNoticeView(true)}>
              <Note sx={{ color: "#000" }} />
            </IconButton>
          </CustomToolTip>
        </div> */}
      </div>

      <Box
        display="flex"
        justifyContent={"space-between"}
        gap={2}
        flexDirection={{ xs: "column", sm: "row" }}
        marginTop={2}
      >
        <div className="w-40 sm:w-60 flex flex-col justify-start items-start gap-1 ">
          <CustomTextInput
            // isDisabled={true}
            field={{
              value: postFilter,
              onChange: (e: any) => {
                setFilter(e);
              },
            }}
            label={"Select Filter"}
            select={true}
            options={postOption}
          />
        </div>

        <CustomButton
          onClick={() => handleNewPost()}
          className=" cursor-pointer bg-[#000] text-[#fff] rounded-[2px] cursor-pointer hover:bg-[#4a4949]"
        >
          <AssignmentIcon sx={{ fontSize: 26, color: "#fff", mr: 1 }} />
          Create Post
        </CustomButton>
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
              {`Create Post`}
            </Typography>
          </Box>
          <IconButton onClick={() => setIsNewPost(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <CreateNewPostPage closeModal={() => setIsNewPost(false)} />
        </DialogContent>
      </Dialog>

      {/* <Dialog
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
            <MilestonesAndEventsCard title={""} data={undefined} />
          </div>
        </DialogContent>
      </Dialog> */}
    </Box>
  );
};

export default PostHeader;
