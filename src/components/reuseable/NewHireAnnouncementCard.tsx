import CommentIcon from "@mui/icons-material/Comment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Typography,
} from "@mui/material";

const NewHireAnnouncementCard = () => {
  const postDate = new Date("2025-03-10T16:14:00");
  return (
    <Card
      sx={{
        maxWidth: "800px",

        borderRadius: 3,
        boxShadow: 4,
        background: "#ffffff",
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <CalendarTodayIcon fontSize="small" sx={{ color: "#4caf50" }} />
          <Typography variant="body2" color="textSecondary">
            {postDate.toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </Typography>
          <AccessTimeIcon fontSize="small" sx={{ ml: 2, color: "#4caf50" }} />
          <Typography variant="body2" color="textSecondary">
            {postDate.toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
          <Chip
            label="3 months ago"
            size="small"
            sx={{
              ml: "auto",
              backgroundColor: "#e6f4ea",
              color: "#388e3c",
              fontWeight: 600,
            }}
          />
        </Box>

        <Typography variant="h5" fontWeight={700} mb={2}>
          Warm Welcome To Name
        </Typography>

        <Box
          display="flex"
          alignItems="flex-start"
          flexWrap="wrap"
          gap={3}
          mb={3}
        >
          <Avatar
            src="https://images.unsplash.com/photo-1559192823-e1d8e87def54?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Ambuj Singh"
            sx={{ width: 120, height: 120, border: "3px solid #ccc" }}
          />
          <Typography variant="body1" color="text.primary" sx={{ flex: 1 }}>
            Dear Team,
            <br />
            <br />
            Greetings!
            <br />
            <br />
            We are thrilled to announce the newest addition to our MSCorpress
            Family, Name, who has joined us Date as a <strong>
              Lead Role
            </strong>{" "}
            in our prestigious Department.
            <br />
            <br />
            Please join us in giving a warm welcome to name as he embarks on
            this exciting journey with us.
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Interests */}
        <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
          Talking about his Interests 😊
          <br />
          <br />
          {/* Ambuj enjoys playing <strong>cricket</strong> and listening to <strong>music</strong>. He has also been
            recognized for his excellence by receiving the <em>Best Employee of the Month</em> award at his previous
            workplace. */}
          Interests
          <br />
          <br />
          Please give him a warm welcome to the team!
        </Typography>

        {/* Footer Info */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={3}
        >
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ color: "#26a69a", fontWeight: 600 }}
            >
              Posted By: postedName
            </Typography>
            {/* <Typography variant="caption" color="textSecondary">
                null - null
              </Typography> */}
          </Box>
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            sx={{ cursor: "pointer", color: "#2979ff" }}
          >
            <CommentIcon fontSize="small" />
            <Typography variant="body2">Comment</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default NewHireAnnouncementCard;
