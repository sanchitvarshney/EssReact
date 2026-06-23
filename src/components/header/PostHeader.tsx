import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import { useState, type FC } from "react";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CloseIcon from "@mui/icons-material/Close";
import EditNoteIcon from "@mui/icons-material/EditNote";
import FilterListIcon from "@mui/icons-material/FilterList";
import CreateNewPostPage from "../../pages/CreateNewPostPage";
import CustomTextInput from "../reuseable/CustomTextInput";

const postOption = [
  { label: "All Posts", value: "" },
  { label: "Anniversary", value: "WOKANV" },
  { label: "Birthday", value: "BIRTHDAY" },
  { label: "New Hire", value: "NEWHIRES" },
  { label: "Announcement", value: "ANNOUNCEMNT" },
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

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-start gap-3">
        {/* Filter */}
        <div className="flex flex-col gap-1.5 flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <FilterListIcon sx={{ fontSize: 13, color: "#9ca3af" }} />
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Filter
            </span>
          </div>
          <div className="w-36">
            <CustomTextInput
              field={{
                value: postFilter,
                onChange: (e: any) => setFilter(e),
              }}
              // label="All Posts"
              select={true}
              options={postOption}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="w-px self-stretch bg-gray-100 mx-1" />

        {/* Compose area */}
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <EditNoteIcon sx={{ fontSize: 13, color: "#9ca3af" }} />
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Create Post
            </span>
          </div>
          <div
            className="border border-dashed border-gray-200 rounded-xl px-3 py-2.5 cursor-text hover:border-[#2eacb3] hover:bg-[#f0fdfe] transition-all duration-200 group"
            onClick={() => setIsNewPost(true)}
          >
            <p className="text-sm text-gray-400 group-hover:text-gray-500 leading-relaxed select-none">
              Write what's in your mind, beneficial for others...
            </p>
          </div>
        </div>
      </div>

      <Dialog
        open={isNewPost}
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
            boxShadow: "20px 25px -5px rgba(102, 102, 102, 0.4)",
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
              Create Post
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
    </div>
  );
};

export default PostHeader;
