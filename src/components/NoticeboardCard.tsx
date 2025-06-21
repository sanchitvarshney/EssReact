import React, { useState } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
const dummyData = [
  {
    title: "Tomorrow is a Holiday!",
    message:
      "Let us make a promise that we would not let the hard sacrifices of our brave freedom fighters go in vain. We would word hard to make our country the best in the world. Happy Republic Day 2021!",
    author: "HR Team",
    date: "Jan 14th, 2021",
    time: "10:30 AM",
    avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    title: "Tomorrow is a Holiday!",
    message:
      "Let us make a promise that we would not let the hard sacrifices of our brave freedom fighters go in vain. We would word hard to make our country the best in the world. Happy Republic Day 2021!",
    author: "Manager",
    date: "Jan 11th, 2021",
    time: "10:30 AM",
    avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    title: "Tomorrow is a Holiday!",
    message:
      "Let us make a promise that we would not let the hard sacrifices of our brave freedom fighters go in vain. We would word hard to make our country the best in the world. Happy Republic Day 2021!",
    author: "Developer Team",
    date: "Jan 13th, 2021",
    time: "10:30 AM",
    avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
  },
];
const NoticeboardCard: React.FC = () => {
  const [current, setCurrent] = useState<number>(0);

  const prevNotice = () => {
    
    setCurrent((prev) => (prev - 1 + dummyData.length) % dummyData.length);
  };
  const nextNotice = () => {
    setCurrent((prev) => (prev + 1) % dummyData.length);
  };
  return (
    <Card
      elevation={2}
      sx={{
        maxWidth: 350,
        p: 2,
        borderRadius: 3,
        backgroundColor: "#ffffff",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1" fontWeight="bold">
          Notice board
        </Typography>
        <Box>
          <IconButton size="small" onClick={prevNotice}>
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={nextNotice}>
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <CardContent sx={{ px: 0 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          {dummyData[current].title}
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          {dummyData[current].message}
        </Typography>

        <Box display="flex" alignItems="center" mt={3}>
          <Avatar src={dummyData[current].avatarUrl} sx={{ width: 32, height: 32,backgroundColor:"#2eacb3" }} />
          <Box ml={1}>
            <Typography variant="body2" fontWeight={500}>
              {dummyData[current].author}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {dummyData[current].date} • {dummyData[current].time}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default NoticeboardCard;
