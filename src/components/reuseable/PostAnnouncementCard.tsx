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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ComponentIconWithtitle from "./ComponentIconWithtitle";
import { Input } from "../ui/input";

import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import SendIcon from "@mui/icons-material/Send";
import { postCardData } from "../../staticData/postdata";
import DocView from "./DocView";

import { useState } from "react";

import VirtualizedCommentList from "./VirtualizedCommentList";

interface PostAnnouncementCardProps {
  postDate: Date;
  authorName: string;
  authorRole: string;
  description: string;
  images?: string[];
  timeAgo?: string;
}

const PostAnnouncementCard = ({
  authorName,
  authorRole,
  description,
  images = [],
  timeAgo = "3 months ago",
}: PostAnnouncementCardProps) => {
  const [isCommentView, setIsCommentView] = useState(false);

  const handleView = (id: string) => {
    if (id.toLowerCase() === "comments") setIsCommentView(true);
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
              {authorName.charAt(0)}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography
                variant="subtitle1"
                className="font-medium text-gray-800"
              >
                {authorName}
              </Typography>
            }
            secondary={
              <Typography variant="body2" className="text-gray-600">
                {authorRole}
              </Typography>
            }
          />
          <Chip
            label={timeAgo}
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

        <Box mb={3}>
          <Typography
            variant="body1"
            sx={{
              lineHeight: 1.6,
              color: "#2c3e50",

              border: "none",
            }}
          >
            {description}
          </Typography>
        </Box>

        {images.length > 0 && (
          <Box mb={3}>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                // px: 2,
              }}
            >
              {images.map((image, index) => (
                <Box
                  key={index}
                  sx={{
                    width:
                      images.length === 1
                        ? { xs: "100%", sm: "100%" }
                        : images.length === 2
                        ? { xs: "100%", sm: "calc(50% - 8px)" }
                        : images.length === 3
                        ? { xs: "100%", sm: "calc(33.33% - 8px)" }
                        : { xs: "calc(50% - 8px)", sm: "calc(25% - 8px)" },
                    minWidth: images.length === 1 ? "250px" : "200px",
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
                        height: images.length === 1 ? "300px" : "120px",
                        objectFit: "cover",
                      }}
                    />
                  </Paper>
                </Box>
              ))}
            </Box>
            <div className="flex   px-5 mt-3">
              {postCardData.map((item) => (
                <ComponentIconWithtitle
                  key={item.title}
                  icon={item.icon}
                  title={item.title}
                  view={() => handleView(item.title)}
                />
              ))}
            </div>
            <Divider sx={{ my: 2 }} />
            <div className="mt-3 flex justify-between">
              <div className="flex-[0.8] ">
                <Input
                  placeholder="Write your comment"
                  className="rounded-[20px]"
                />
              </div>
              <div className="flex items-center gap-2">
                <IconButton>
                  <EmojiEmotionsIcon />
                </IconButton>
                <IconButton>
                  <SendIcon />
                </IconButton>
              </div>
            </div>
          </Box>
        )}
      </CardContent>

      <DocView
        open={isCommentView}
        close={() => setIsCommentView(false)}
        vertical={"bottom"}
        horizontal={"center"}
        transformOrigin={"bottom"}
        width={600}
      >
        <div className="w-full  relative">
          <div className="w-full sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <div className="flex items-center justify-between px-6 py-4">
              <IconButton
                onClick={() => setIsCommentView(false)}
                sx={{
                  bgcolor: "rgba(46, 172, 179, 0.1)",
                  color: "#2eacb3",
                  width: 40,
                  height: 40,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    bgcolor: "rgba(46, 172, 179, 0.2)",
                    transform: "scale(1.05)",
                  },
                }}
              >
                <ArrowBackIcon sx={{ fontSize: 20 }} />
              </IconButton>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#1f2937",
                  fontSize: "1.125rem",
                  letterSpacing: "-0.025em",
                }}
              >
                Comments
                <span className="ml-2 text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  0
                </span>
              </Typography>
              <div className="w-10 h-10" />
            </div>
          </div>

          <VirtualizedCommentList data={[]} />
        </div>
      </DocView>
    </Card>
  );
};

export default PostAnnouncementCard;
