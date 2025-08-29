// import {
//   Avatar,
//   Card,
//   CardContent,
//   Chip,
//   Divider,
//   ListItem,
//   ListItemAvatar,
//   ListItemText,
//   Typography,
//   Paper,
// } from "@mui/material";

// // import { postCardData } from "../../staticData/postdata";
// import celebrateIcon from "../../assets/confetti.png";

// interface PostAnniversaryCardProps {
//   post: any;
// }

// const PostAnniversaryCard = ({ post }: PostAnniversaryCardProps) => {
//   return (
//     <Card
//       elevation={0}
//       sx={{
//         maxWidth: "1050px",
//         borderRadius: 3,
//         boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
//         background: "#ffffff",
//         border: "1px solid #f0f0f0",
//       }}
//     >
//       <CardContent>
//         <ListItem className="hover:bg-gray-50 flex  justify-start items-start  transition-colors rounded-lg relative">
//           <ListItemAvatar>
//             <Avatar
//               src={celebrateIcon}
//               className="text-white font-semibold  "
//               sx={{
//                 backgroundColor: "#2eacb3",
//                 width: 48,
//                 height: 48,
//                 objectFit: "cover",
//               }}
//             />
//           </ListItemAvatar>
//           <ListItemText primary={post?.authorName} />
//           <Chip
//             label={post?.timeAgo}
//             size="small"
//             sx={{
//               position: { xs: "absolute", sm: "static" },
//               top: { xs: 8, sm: "auto" },
//               right: { xs: 8, sm: "auto" },
//               ml: { xs: 0, sm: "auto" },
//               backgroundColor: "#e6f4ea",
//               color: "#388e3c",
//               fontWeight: 600,
//             }}
//           />
//         </ListItem>
//         <Divider sx={{ my: 2 }} />

//         <Paper
//           elevation={2}
//           sx={{
//             borderRadius: 4,
//             overflow: "hidden",
//           }}
//         >
//           <div
//             className="flex flex-col justify-center items-center p-8"
//             style={{
//               width: "100%",
//               // height: "300px",

//               background: "linear-gradient(135deg,#ff8a00,#e52e71)",
//             }}
//           >
//             <Typography
//               variant="h5"
//               sx={{ fontWeight: 600, color: "#fff", textAlign: "justify" }}
//             >
//               Happy {post?.type === "anniversary" ? "Anniversary" : "Birthday"}{" "}
//               {post?.name}
//             </Typography>
//             <Typography
//               variant="subtitle1"
//               sx={{ color: "#fff", my: 3, textAlign: "justify" }}
//             >
//               {post?.description}
//             </Typography>
//           </div>
//         </Paper>
//       </CardContent>
//     </Card>
//   );
// };

// export default PostAnniversaryCard;

import {
  Avatar,
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

import { Fragment, memo, useEffect, useState, type FC } from "react";

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

interface PostAnniversaryCardProps {
  post: any;
}

const PostAnniversaryCard: FC<PostAnniversaryCardProps> = ({ post }) => {
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
    setIsLike(true);
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

  return (
    <Card
      elevation={0}
      sx={{
        // maxWidth: "1050px",
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

        <Paper
          elevation={2}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <div
            className="flex flex-col justify-start items-center p-8"
            style={{
              width: "100%",
              // height: "300px",

              background:
                post?.type === "wokanv"
                  ? "linear-gradient(135deg,#00c6ff,#0072ff)"
                  : "linear-gradient(135deg,#ff8a00,#e52e71)",
            }}
          >
            <div className="flex  justify-center items-center gap-4 ">
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  fontSize: "5rem",

                  pointerEvents: "none",
                  userSelect: "none",
                }}
              >
                {post?.name.charAt(0).toUpperCase()}
              </Avatar>
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, color: "#fff", textAlign: "justify" }}
              >
                Happy {post?.type === "wokanv" ? "Anniversary" : "Birthday"}{" "}
                {post?.name}
              </Typography>
            </div>
            <Typography
              variant="subtitle1"
              sx={{ color: "#fff", my: 3, textAlign: "justify" }}
            >
              {post?.description.split("\n").map((line: any, index: any) => (
                <Fragment key={index}>
                  {line}
                  <br />
                </Fragment>
              ))}
            </Typography>
          </div>
        </Paper>

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
                sx={{ color: isLike ? "green" : "#000", fontSize: 24 }}
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
            {post?.likes?.length > 0 && (
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
                    : post?.likes?.length || 0
                } Likes`}</span>
              </div>
            )}
            {post?.comments?.length > 0 && (
              <div className=" cursor-pointer" onClick={handleOpenCommentView}>
                <span className="select-none text-sm border-b-1 border-gray-500">{`${
                  commentData?.data?.total_comments
                    ? commentData?.data?.total_comments
                    : post?.comments?.length || 0
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

export default memo(PostAnniversaryCard);
