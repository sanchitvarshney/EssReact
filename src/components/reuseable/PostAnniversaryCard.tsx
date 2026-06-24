import {
  Avatar,
  Chip,
  Typography,
  IconButton,
  Popover,
} from "@mui/material";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import SendIcon from "@mui/icons-material/Send";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import AddCommentIcon from "@mui/icons-material/AddComment";
import CloseIcon from "@mui/icons-material/Close";

import { Fragment, memo, useEffect, useState, type FC } from "react";

import VirtualizedCommentList from "./VirtualizedCommentList";
import { Input } from "../ui/input";
import likeicon from "../../assets/heart.png";
import {
  useSendCommentMutation,
  useSendLikeMutation,
} from "../../services/vibe";
import { useToast } from "../../hooks/useToast";
import { useAuth } from "../../contextapi/AuthContext";

interface PostAnniversaryCardProps {
  post: any;
}

const PostAnniversaryCard: FC<PostAnniversaryCardProps> = ({ post }) => {
  const { showToast } = useToast();
  const { user } = useAuth();
  const [isCommentView, setIsCommentView] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [anchorElComment, setAnchorElComment] = useState<null | HTMLElement>(null);
  const [anchorElEmoji, setAnchorElEmoji] = useState<null | HTMLElement>(null);
  const [commentText, setCommentText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [sendComment, { data: commentData }] = useSendCommentMutation();
  const [sendLike, { data: likeData }] = useSendLikeMutation();

  const [isLikeView, setIsLikeView] = useState(false);
  const [isLike, setIsLike] = useState(false);
  const [anchorElLike, setAnchorElLike] = useState<null | HTMLElement>(null);

  const handleOpenCommentView = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElComment(event.currentTarget);
    setIsCommentView(true);
  };
  const handleOpenLikeView = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElLike(event.currentTarget);
    setIsLikeView(true);
  };

  const handleComment = (key: string) => {
    if (commentText.trim() === "") {
      showToast("Comment cannot be empty", "error");
      return;
    }
    const payload = { comment: commentText, post_key: key };
    sendComment(payload)
      .then((res) => {
        if (res?.data?.status === "error") {
          showToast(res?.data?.message, "error");
          setCommentText("");
        }
        if (res?.data?.status === "success") {
          showToast(res?.data?.message, "success");
          setCommentText("");
        }
      })
      .catch((err) => {
        showToast(err?.data?.message, "error");
      });
  };

  const handleLike = (key: string) => {
    setIsLike(true);
    const payload = { post_key: key };
    sendLike(payload)
      .then((res) => {
        if (res?.data?.status === "error") {
          showToast(res?.data?.message, "error");
        }
      })
      .catch((err) => {
        setIsLike(false);
        showToast(err?.data?.message, "error");
      });
  };

  //@ts-ignore
  const userid: any = user?.id;

  useEffect(() => {
    if (!post?.likes || !userid) return;
    const liked = post.likes.some((like: any) => like?.userId === userid);
    setIsLike(liked);
  }, [post?.likes, userid]);

  const handleEmojiClick = (emojiData: { emoji: string }) => {
    setCommentText(commentText + emojiData.emoji);
  };

  const isAnniversary = post?.type === "wokanv";
  const totalLikes = likeData?.data?.total_likes ?? post?.likes?.length ?? 0;
  const totalComments = commentData?.data?.total_comments ?? post?.comments?.length ?? 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Author header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <Avatar
          sx={{
            width: 44,
            height: 44,
            bgcolor: "#2eacb3",
            fontWeight: 700,
            fontSize: 16,
            pointerEvents: "none",
            userSelect: "none",
            flexShrink: 0,
          }}
        >
          {post?.authorName?.charAt(0)}
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 text-sm leading-tight truncate">
            {post?.authorName}
          </p>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{post?.authorRole}</p>
        </div>
        <Chip
          label={post?.timeAgo}
          size="small"
          sx={{
            bgcolor: "#dcfce7",
            color: "#15803d",
            fontWeight: 600,
            fontSize: 11,
            height: 22,
            flexShrink: 0,
            "& .MuiChip-label": { px: 1.5 },
          }}
        />
      </div>

      {/* Celebration banner */}
      <div
        className="mx-4 mb-3 rounded-xl overflow-hidden"
        style={{
          background: isAnniversary
            ? "linear-gradient(135deg, #00c6ff, #0072ff)"
            : "linear-gradient(135deg, #ff8a00, #e52e71)",
        }}
      >
        <div className="flex flex-col items-center gap-4 p-6">
          <div className="flex items-center gap-4">
            <Avatar
              sx={{
                width: 72,
                height: 72,
                fontSize: "2.5rem",
                fontWeight: 700,
                bgcolor: "rgba(255,255,255,0.25)",
                color: "#fff",
                border: "3px solid rgba(255,255,255,0.5)",
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              {post?.name?.charAt(0)?.toUpperCase()}
            </Avatar>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: "#fff", lineHeight: 1.3 }}
            >
              Happy {isAnniversary ? "Anniversary" : "Birthday"},{" "}
              {post?.name}! 🎉
            </Typography>
          </div>

          {post?.description && (
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255,255,255,0.9)",
                textAlign: "center",
                lineHeight: 1.7,
                maxWidth: 480,
              }}
            >
              {post.description.split("\n").map((line: string, index: number) => (
                <Fragment key={index}>
                  {line}
                  <br />
                </Fragment>
              ))}
            </Typography>
          )}
        </div>
      </div>

      {/* Counts row */}
      {(totalLikes > 0 || totalComments > 0) && (
        <div className="flex items-center justify-end gap-4 px-4 py-2">
          {totalLikes > 0 && (
            <button
              onClick={handleOpenLikeView}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              <img src={likeicon} alt="likes" className="w-4 h-4 object-contain" />
              <span>{totalLikes} Likes</span>
            </button>
          )}
          {totalComments > 0 && (
            <button
              onClick={handleOpenCommentView}
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              {totalComments} Comments
            </button>
          )}
        </div>
      )}

      <div className="h-px bg-gray-100 mx-4" />

      {/* Action bar */}
      <div className="flex items-center gap-1 px-2 py-1.5">
        <button
          onClick={() => handleLike(post?.postKey)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex-1 justify-center ${
            isLike
              ? "text-green-600 bg-green-50 hover:bg-green-100"
              : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          <ThumbUpIcon sx={{ fontSize: 18 }} />
          Like
        </button>
        <button
          onClick={() => setShowInput(!showInput)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all duration-200 flex-1 justify-center"
        >
          <AddCommentIcon sx={{ fontSize: 18 }} />
          Comment
        </button>
      </div>

      {/* Comment input */}
      {!showInput && (
        <>
          <div className="h-px bg-gray-100 mx-4" />
          <div className="px-4 py-3 flex items-center gap-2">
            <Input
              placeholder="Write a comment..."
              className="flex-1 rounded-full bg-gray-50 border-gray-200 text-sm"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleComment(post?.postKey);
              }}
            />
            <IconButton
              size="small"
              onClick={(e) => {
                setAnchorElEmoji(e.currentTarget);
                setShowEmojiPicker(!showEmojiPicker);
              }}
              sx={{
                color: "#9ca3af",
                "&:hover": { color: "#f59e0b", bgcolor: "#fef9c3" },
                transition: "all 0.15s",
              }}
            >
              <EmojiEmotionsIcon sx={{ fontSize: 20 }} />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => handleComment(post?.postKey)}
              sx={{
                color: "#2eacb3",
                "&:hover": { bgcolor: "#e0f7fa" },
                transition: "all 0.15s",
              }}
            >
              <SendIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </div>
        </>
      )}

      {/* Comments popover */}
      <Popover
        open={isCommentView}
        anchorEl={anchorElComment}
        onClose={() => setIsCommentView(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        disableAutoFocus
        disableEnforceFocus
        PaperProps={{
          sx: {
            borderRadius: "16px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            width: 380,
            overflow: "hidden",
          },
        }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <AddCommentIcon sx={{ fontSize: 16, color: "#2eacb3" }} />
            <span className="font-semibold text-gray-800 text-sm">Comments</span>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "#e0f7fa", color: "#0097a7" }}
            >
              {totalComments}
            </span>
          </div>
          <IconButton
            size="small"
            onClick={() => setIsCommentView(false)}
            sx={{ color: "#9ca3af", "&:hover": { bgcolor: "#f3f4f6" } }}
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </div>
        <VirtualizedCommentList data={post?.comments} />
      </Popover>

      {/* Likes popover */}
      <Popover
        open={isLikeView}
        anchorEl={anchorElLike}
        onClose={() => setIsLikeView(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        disableAutoFocus
        disableEnforceFocus
        PaperProps={{
          sx: {
            borderRadius: "16px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            width: 320,
            overflow: "hidden",
          },
        }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <img src={likeicon} alt="likes" className="w-4 h-4 object-contain" />
            <span className="font-semibold text-gray-800 text-sm">Likes</span>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "#dcfce7", color: "#15803d" }}
            >
              {totalLikes}
            </span>
          </div>
          <IconButton
            size="small"
            onClick={() => setIsLikeView(false)}
            sx={{ color: "#9ca3af", "&:hover": { bgcolor: "#f3f4f6" } }}
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </div>
        <VirtualizedCommentList data={post?.likes} hight={300} />
      </Popover>

      {/* Emoji picker popover */}
      <Popover
        open={showEmojiPicker}
        anchorEl={anchorElEmoji}
        onClose={() => setShowEmojiPicker(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            overflow: "hidden",
          },
        }}
      >
        <EmojiPicker
          theme={Theme.DARK}
          emojiStyle={EmojiStyle.GOOGLE}
          onEmojiClick={handleEmojiClick}
        />
      </Popover>
    </div>
  );
};

export default memo(PostAnniversaryCard);
