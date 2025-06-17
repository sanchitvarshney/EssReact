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
} from "@mui/material";
import { CustomButton } from "../ui/CustomButton";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import AddCommentIcon from '@mui/icons-material/AddComment';


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

 
  return (
  
    <Card
      elevation={0}
      sx={{
        maxWidth: "800px",
        borderRadius: 3,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        background: "#ffffff",
        border: "1px solid #f0f0f0",
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <ListItem className="hover:bg-gray-50 flex flex-col sm:flex-row justify-start items-start sm:items-center transition-colors rounded-lg relative">
          <ListItemAvatar>
            <Avatar
              className="text-white font-semibold"
              sx={{
                backgroundColor: "#4caf50",
                width: 48,
                height: 48,
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
                    minWidth: images.length === 1 ? "300px" : "200px",
                  }}
                >
                  <Paper
                    elevation={2}
                    sx={{
                      borderRadius: 2,
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
            <CustomButton className="mt-10 mr-4 bg-gray-900 text-white text-[18px] hover:bg-gray-900/80">
            
              <ThumbUpIcon sx={{marginRight:1}}/> Like
            </CustomButton>
               <CustomButton className="mt-10 bg-gray-900 font-[] text-white text-[18px] hover:bg-gray-900/80">
            
              <AddCommentIcon sx={{marginRight:1}}/> comment
            </CustomButton>
          </Box>
        )}
      </CardContent>
      <Box></Box>
    </Card>
   
  );
};

export default PostAnnouncementCard;
