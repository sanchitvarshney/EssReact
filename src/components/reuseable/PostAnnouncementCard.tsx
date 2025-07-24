import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Paper,
  IconButton,
  Popover,
} from "@mui/material";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import SendIcon from "@mui/icons-material/Send";

import { memo, useEffect, useState, type FC } from "react";

import VirtualizedCommentList from "./VirtualizedCommentList";
import { Input } from "../ui/input";

import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import AddCommentIcon from "@mui/icons-material/AddComment";
import likeicon from "../../assets/heart.png";
import {
  useSendCommentMutation,
  useSendLikeMutation,
} from "../../services/vibe";
import { useToast } from "../../hooks/useToast";
import { useAuth } from "../../contextapi/AuthContext";

interface PostAnnouncementCardProps {
  post: any;
}

const PostAnnouncementCard: FC<PostAnnouncementCardProps> = ({ post }) => {
  const { showToast } = useToast();
  const { user } = useAuth();
  const [isCommentView, setIsCommentView] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [anchorElComment, setAnchorElComment] = useState<null | HTMLElement>(
    null
  );
  const [anchorElEmoji, setAnchorElEmoji] = useState<null | HTMLElement>(null);
  const [commentText, setCommentText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [sendComment, { data: commentData }] = useSendCommentMutation();
  const [sendLike, { data: likeData, isSuccess }] = useSendLikeMutation();

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
    const payload = {
      comment: commentText,
      post_key: key,
    };

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
    const payload = {
      post_key: key,
    };
    sendLike(payload)
      .then((res) => {
        if (res?.data?.status === "error") {
          showToast(res?.data?.message, "error");
          setCommentText("");
        }
        if (res?.data?.status === "success") {
          showToast(res?.data?.message, "success");
        }
      })
      .catch((err) => {
        showToast(err?.data?.message, "error");
      });
  };
  //@ts-ignore
  const userid: any = user?.id;
  useEffect(() => {
    if(!post || !post?.likes) return;
    const liked = post?.likes?.some((item: any) => item?.userId === userid);

    setIsLike(liked);
  }, [post, userid, isSuccess]);

  const handleEmojiClick = (emojiData: { emoji: string }) => {
    setCommentText(commentText + emojiData.emoji);
  };

  return (
    <Card
      elevation={0}
      sx={{
        maxWidth: "1050px",
        borderRadius: 3,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        background: "#ffffff",
        border: "1px solid #f0f0f0",
      }}
    >
      <CardContent>
        <ListItem className="hover:bg-gray-50 flex  justify-start items-start  transition-colors rounded-lg relative">
          <ListItemAvatar>
            <Avatar
              className="text-white font-semibold "
              sx={{
                backgroundColor: "#2eacb3",
                width: 48,
                height: 48,
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              {post?.authorName.charAt(0)}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography
                variant="subtitle1"
                className="font-medium text-gray-800"
              >
                {post?.authorName}
              </Typography>
            }
            secondary={
              <Typography variant="body2" className="text-gray-600">
                {post?.authorRole}
              </Typography>
            }
          />
          <Chip
            label={post?.timeAgo}
            size="small"
            sx={{
              position: { xs: "absolute", sm: "static" },
              top: { xs: 8, sm: "auto" },
              right: { xs: 8, sm: "auto" },
              ml: { xs: 0, sm: "auto" },
              backgroundColor: "#e6f4ea",
              color: "#388e3c",
              fontWeight: 600,
            }}
          />
        </ListItem>
        <Divider sx={{ my: 2 }} />

        <Typography
          variant="body1"
          sx={{
            lineHeight: 1.6,
            color: "#2c3e50",
            mb: 2,
            border: "none",
            px: 2,
          }}
          dangerouslySetInnerHTML={{ __html: post?.description }}
        />
        {/* {post?.description} */}
        {/* </Typography> */}

        {post?.images.length > 0 && (
          <Box mb={3}>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                // px: 2,
              }}
            >
              {post?.images.map((image: any, index: number) => (
                <Box
                  key={index}
                  sx={{
                    width:
                      post?.images.length === 1
                        ? { xs: "100%", sm: "100%" }
                        : post?.images.length === 2
                        ? { xs: "100%", sm: "calc(50% - 8px)" }
                        : post?.images.length === 3
                        ? { xs: "100%", sm: "calc(33.33% - 8px)" }
                        : { xs: "calc(50% - 8px)", sm: "calc(25% - 8px)" },
                    minWidth: post?.images.length === 1 ? "250px" : "200px",
                  }}
                >
                  <Paper
                    elevation={2}
                    sx={{
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={image}
                      alt={`Attachment ${index + 1}`}
                      style={{
                        width: "100%",
                        height: post?.images.length === 1 ? "300px" : "120px",
                        objectFit: "fill",
                      }}
                    />
                  </Paper>
                </Box>
              ))}
            </Box>
          </Box>
        )}
        <div className="flex   justify-between items-center px-2 mt-2">
          <div className="flex gap-2">
            <IconButton
              sx={{
                "&:hover": {
                  background: "rgba(52, 159, 195, 0.23)",
                },
              }}
              onClick={() => handleLike(post?.postKey)}
            >
              <ThumbUpIcon
                sx={{ color: isLike ? "red" : "#000", fontSize: 24 }}
              />
            </IconButton>
            <IconButton
              sx={{
                "&:hover": {
                  background: "rgba(52, 159, 195, 0.23)",
                },
              }}
              onClick={() => setShowInput(!showInput)}
            >
              <AddCommentIcon sx={{ color: "#000", fontSize: 24 }} />
            </IconButton>
          </div>
          <div className="">
            {(post?.likes.length > 0 ) && (
              <div
                className="flex items-center space-x-2 cursor-pointer "
                onClick={handleOpenLikeView}
              >
                <Avatar
                  src={likeicon}
                  alt="likes"
                  variant="square"
                  sx={{ objectFit: "contain", width: 26, height: 26 }}
                />
                <span className="select-none text-sm  border-b-1 border-gray-500">{`${
                  likeData?.data?.total_likes
                    ? likeData?.data?.total_likes
                    : post?.likes.length || 0
                } Likes`}</span>
              </div>
            )}
            {(post?.comments.length > 0 ) && (
              <div className=" cursor-pointer" onClick={handleOpenCommentView}>
                <span className="select-none text-sm border-b-1 border-gray-500">{`${
                  commentData?.data?.total_comments
                    ? commentData?.data?.total_comments
                    : post?.comments.length || 0
                } Comments`}</span>
              </div>
            )}
          </div>
        </div>

        {!showInput && (
          <>
            <Divider sx={{ my: 2 }} />
            <div className="mt-3 flex justify-between">
              <div className="flex-[0.8] ">
                <Input
                  placeholder="Write your comment"
                  className="rounded-[20px]  "
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <IconButton
                  onClick={(e) => {
                    setAnchorElEmoji(e.currentTarget);
                    setShowEmojiPicker(!showEmojiPicker);
                  }}
                >
                  <EmojiEmotionsIcon />
                </IconButton>
                <IconButton onClick={() => handleComment(post?.postKey)}>
                  <SendIcon />
                </IconButton>
              </div>
            </div>
          </>
        )}
      </CardContent>

      <Popover
        elevation={2}
        open={isCommentView}
        anchorEl={anchorElComment || null}
        onClose={() => setIsCommentView(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        disableAutoFocus
        disableEnforceFocus
        PaperProps={{
          style: {
            transformOrigin: "bottom",
            position: "relative",
            borderRadius: "6px",
            overflow: "visible",
            boxShadow: "3px",
          },
          sx: {
            mt: 2,
            width: 400,

            // zIndex: 1600,
          },
        }}
      >
        <VirtualizedCommentList data={post?.comments} />
      </Popover>
      <Popover
        elevation={2}
        open={isLikeView}
        anchorEl={anchorElLike || null}
        onClose={() => setIsLikeView(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        disableAutoFocus
        disableEnforceFocus
        PaperProps={{
          style: {
            transformOrigin: "bottom",
            position: "relative",
            borderRadius: "6px",
            overflow: "visible",
            boxShadow: "3px",
          },
          sx: {
            mt: 2,
            width: 350,

            // zIndex: 1600,
          },
        }}
      >
        <VirtualizedCommentList data={post?.likes} hight={300} />
      </Popover>

      <Popover
        open={showEmojiPicker}
        anchorEl={anchorElEmoji}
        onClose={() => setShowEmojiPicker(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        sx={{ mt: 0 }}
      >
        <EmojiPicker
          theme={Theme.DARK}
          emojiStyle={EmojiStyle.GOOGLE}
          onEmojiClick={handleEmojiClick}
        />
      </Popover>
    </Card>
  );
};

export default memo(PostAnnouncementCard);
