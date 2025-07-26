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
  onCreatePost: (payload: any) => Promise<{ success: boolean }>;
};
const PostHeader: FC<PostHeaderProps> = ({
  setFilter,
  postFilter,
  onCreatePost,
}) => {
  const [isNewPost, setIsNewPost] = useState<boolean>(false);

  const handleNewPost = () => {
    setIsNewPost(true);
  };

  return (
    <Box
      sx={{
        p: 2,

        borderRadius: 0,
        // display: "flex",
        // justifyContent: "space-between",
        // alignItems: "center",

        mb: 1,
        boxShadow: 0,
      }}
      className=" bg-gradient-to-br from-[#ffffff] to-[#fff] shadow-lg border border-[#2eacb3] "
    >
      <div className="flex items-center justify-between gap-6">
        <div className="flex  flex-col gap-2">
          <Typography variant="h6" fontWeight={600}>
            Create a Post
          </Typography>
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
        </div>

        <label className="w-full flex flex-col justify-center border-2 border-dashed border-gray-300 rounded-sm p-2 cursor-text hover:border-[#2eacb3] hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 transition-all duration-300 text-center group">
          <textarea
            placeholder="Write what's in your mind, beneficial for others..."
            className="bg-transparent outline-none resize-none text-start text-gray-700 placeholder:text-gray-400"
            rows={3}
            readOnly
            onClick={() => handleNewPost()}
          />
        </label>
      </div>

      {/* <Box
        display="flex"
        justifyContent={"space-between"}
        gap={2}
        flexDirection={{ xs: "column", sm: "row" }}
        marginTop={2}
      > */}

      {/* </Box> */}

      <Dialog
        open={isNewPost}
        // onClose={() => setIsNewPost(false)}
        fullWidth
        maxWidth="md"
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0)",
            backdropFilter: "blur(5px)",
            WebkitBackdropFilter: "blur(5px)",
          },
        }}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: " 20px 25px -5px rgba(102, 102, 102, 0.4)",
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
          <CreateNewPostPage
            closeModal={() => setIsNewPost(false)}
            onCreatePost={onCreatePost}
          />
        </DialogContent>
      </Dialog>

    
    </Box>
  );
};

export default PostHeader;
