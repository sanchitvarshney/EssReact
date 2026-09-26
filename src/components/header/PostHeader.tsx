import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Box,
  Avatar,
} from "@mui/material";
import { useState, type FC } from "react";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CloseIcon from "@mui/icons-material/Close";
import EditNoteIcon from "@mui/icons-material/EditNote";
import FilterListIcon from "@mui/icons-material/FilterList";
import CreateNewPostPage from "../../pages/CreateNewPostPage";
import { useAuth } from "../../contextapi/AuthContext";

const postOption = [
  { label: "All Posts", value: "all" },
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

  const { user } = useAuth();
  const u: any = user ?? {};
  const active = postFilter || "all";

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_1px_4px_rgba(16,24,40,0.05)] p-4">
      {/* Composer */}
      <div className="flex items-center gap-3">
        <Avatar src={u.imgUrl} alt={u.name} sx={{ width: 42, height: 42, bgcolor: "#00a0a0" }}>
          {u.name?.charAt(0)}
        </Avatar>
        <button
          onClick={() => setIsNewPost(true)}
          className="flex-1 text-left text-sm text-gray-400 bg-[#f1f7f7] hover:bg-[#e0f6f6] hover:text-[#007f86] transition-colors rounded-full px-5 py-3 cursor-pointer"
        >
          Share something with the team, {u.name?.split(" ")[0] || "there"}…
        </button>
        <button
          onClick={() => setIsNewPost(true)}
          aria-label="Create post"
          className="hidden sm:flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#00a0a0] to-[#007f86] shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        >
          <EditNoteIcon sx={{ fontSize: 16 }} /> Post
        </button>
      </div>

      {/* Filter chips */}
      <div className="flex items-center gap-2 mt-4 overflow-x-auto custom-scrollbar-for-menu pb-1">
        <FilterListIcon sx={{ fontSize: 16, color: "#9ca3af", flexShrink: 0 }} />
        {postOption.map(({ label, value }) => {
          const on = active === value;
          return (
            <button
              key={value}
              onClick={() => {
                if (!on) setFilter(value);
              }}
              className={`flex-shrink-0 text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                on
                  ? "text-white bg-gradient-to-r from-[#00a0a0] to-[#007f86] shadow-sm"
                  : "text-gray-500 bg-gray-50 hover:bg-[#e0f6f6] hover:text-[#007f86]"
              }`}
            >
              {label}
            </button>
          );
        })}
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
            <AssignmentIcon sx={{ color: "#00a0a0" }} />
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
