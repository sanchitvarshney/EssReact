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
} from "@mui/material";

import ComponentIconWithtitle from "./ComponentIconWithtitle";
import { Input } from "../ui/input";
import AttachmentIcon from "@mui/icons-material/Attachment";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import SendIcon from "@mui/icons-material/Send";
import { postCardData } from "../../staticData/postdata";
import celebrateIcon from "../../assets/confetti.png";

interface PostAnniversaryCardProps {
  authorName: string;

  timeAgo?: string;
}

const PostAnniversaryCard = ({
  authorName,

  timeAgo = "3 months ago",
}: PostAnniversaryCardProps) => {
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
              src={celebrateIcon}
              className="text-white font-semibold "
              sx={{
                backgroundColor: "#2eacb3",
                width: 48,
                height: 48,
              }}
            />
          </ListItemAvatar>
          <ListItemText
            primary={
              <p className="text-[16px] ">
                <span className="text-[16px] font-bold">
                  Mscorpres Automation
                </span>{" "}
                wishes
                <span className="text-[16px] font-bold text-[#2eacb3]">
                  {" "}
                  {authorName}
                </span>{" "}
                a very Happy work Anniversary.
              </p>
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

        <Paper
          elevation={2}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            backgroundImage:
              "linear-gradient(to right,rgb(66, 138, 153),rgb(92, 178, 199))",
          }}
        >
          <div
            className="flex justify-start items-center px-12"
            style={{
              width: "100%",
              height: "300px",
            }}
          >
            <Avatar
              sx={{
                width: 140,
                height: 140,
                fontSize: "5rem",
                backgroundColor: "#2eacb3",
              }}
            >
              {authorName.charAt(0).toUpperCase()}
            </Avatar>
            <div className="ml-4 ">
              <Typography variant="h4">Happy Anniversary!</Typography>
              <Typography variant="h6">
                Join us in sending him/her lots of best wishes on this secial
                day!
              </Typography>
            </div>
          </div>
        </Paper>

        <div className="flex justify-between flex-wrap px-5 mt-3">
          {postCardData.map((item) => (
            <ComponentIconWithtitle
              key={item.title}
              icon={item.icon}
              title={item.title}
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
              <AttachmentIcon />
            </IconButton>
            <IconButton>
              <EmojiEmotionsIcon />
            </IconButton>
            <IconButton>
              <SendIcon />
            </IconButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostAnniversaryCard;
