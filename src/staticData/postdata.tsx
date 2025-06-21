import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import AddCommentIcon from "@mui/icons-material/AddComment";
import ShareIcon from "@mui/icons-material/Share";
import BookmarkIcon from "@mui/icons-material/Bookmark";

export const postCardData = [
  {
    title: "Likes",
    icon: <ThumbUpIcon sx={{ color: "#000", fontSize: 20 }} />,
  },
  {
    title: "Comments",
    icon: <AddCommentIcon sx={{ color: "#000", fontSize: 20 }} />,
  },
  {
    title: "Share",
    icon: <ShareIcon sx={{ color: "#000", fontSize: 20 }} />,
  },
  {
    title: "Save",
    icon: <BookmarkIcon sx={{ color: "#000", fontSize: 20 }} />,
  },
];