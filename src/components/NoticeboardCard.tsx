import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  CardActions,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Stop } from "@mui/icons-material";
import qrCode from "../assets/img/essDownload.jpeg";
// import StopIcon from '@mui/icons-material/Stop';
const dummyData: any = [
  // {
  //   title: "Tomorrow is a Holiday!",
  //   message:
  //     "Let us make a promise that we would not let the hard sacrifices of our brave freedom fighters go in vain. We would word hard to make our country the best in the world. Happy Republic Day 2021!",
  //   author: "HR Team",
  //   date: "Jan 14th, 2021",
  //   time: "10:30 AM",
  //   avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
  // },
  // {
  //   title: "Tomorrow is a Holiday!",
  //   message:
  //     "Let us make a promise that we would not let the hard sacrifices of our brave freedom fighters go in vain. We would word hard to make our country the best in the world. Happy Republic Day 2021!",
  //   author: "Manager",
  //   date: "Jan 11th, 2021",
  //   time: "10:30 AM",
  //   avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
  // },
  // {
  //   title: "Tomorrow is a Holiday!",
  //   message:
  //     "Let us make a promise that we would not let the hard sacrifices of our brave freedom fighters go in vain. We would word hard to make our country the best in the world. Happy Republic Day 2021!",
  //   author: "Developer Team",
  //   date: "Jan 13th, 2021",
  //   time: "10:30 AM",
  //   avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
  // },
];
const NoticeboardCard: React.FC = () => {
  const [current, setCurrent] = useState<number>(0);
  const theme = useTheme();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down("sm"));

  const [isPaused, setIsPaused] = useState(true);

  const prevNotice = () => {
    setCurrent((prev) => (prev - 1 + dummyData.length) % dummyData.length);
  };
  const nextNotice = () => {
    setCurrent((prev) => (prev + 1) % dummyData.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPaused) {
        nextNotice();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, current]);

  return (
    <Card
      elevation={isSmallDevice ? 0 : 2}
      sx={{
        maxWidth: "100%",
        minHeight: "60vh",
        p: isSmallDevice ? 0 : 2,
        borderRadius: 3,
        backgroundColor: "#ffffff",
      }}
    >
      {!isSmallDevice && (
        <>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            textAlign={"center"}
            sx={{ borderBottom: "2px solid #0d918b", py: 1 }}
          >
            📌 Announcement's
          </Typography>
          {/* <Divider sx={{ my: 1, background }} /> */}
        </>
      )}

      {dummyData.length === 0 ? (
        <div className=" py-2  flex justify-center items-center px-4">
          <div className="max-w-xl text-sm text-gray-700">
            {/* <h2 className="text-lg font-semibold mb-2"> HR Notice Board</h2> */}
            <p className="mb-3">
              We're excited to introduce a refreshed look and improved
              experience on the ESS portal. We hope it helps you navigate more
              easily and get things done faster.
            </p>
            <ul className="list-none list-inside space-y-1 text-sm text-gray-700">
              <li>🔹 We'd love to hear your feedback and suggestions.</li>
              <li>
                🔹 Prefer the old version? You can still access it{" "}
                <a
                  href="https://ess-old.mscorpres.com"
                  className="text-blue-600 underline"
                  target="_blank"
                >
                  here
                </a>{" "}
                OR{" "}
                <a
                  href="https://ess-old.mscorpres.com"
                  className="text-blue-600 underline"
                  target="_blank"
                >
                  https://ess-old.mscorpres.com
                </a>
                .
              </li>
              <li>
                {" "}
                <strong>🔹 Download Android App QR Code</strong>
                <div className="flex justify-center">
                  <img src={qrCode} alt="QR" className="w-40 " /></div> <br />
                Thank you for being a valued part of our team!
              </li>
            </ul>

            <p className="mt-4 font-medium">— HR Team</p>
          </div>
        </div>
      ) : (
        <CardContent sx={{ px: 0 }}>
          <div className="h-[38vh] overflow-y-auto will-change-transform ">
            <Typography variant="subtitle1" fontWeight={600}>
              {dummyData[current]?.title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              mt={1}
              textAlign={"justify"}
            >
              {dummyData[current].message}
            </Typography>

            <Box display="flex" alignItems="center" mt={3}>
              <Avatar
                src={dummyData[current].avatarUrl}
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: "#2eacb3",
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              />
              <Box ml={1}>
                <Typography variant="body2" fontWeight={500}>
                  {dummyData[current].author}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {dummyData[current].date} • {dummyData[current].time}
                </Typography>
              </Box>
            </Box>
          </div>
        </CardContent>
      )}

      {dummyData.length === 0 ? null : (
        <CardActions sx={{ justifyContent: "center" }}>
          <Box sx={{ display: "flex", gap: 3, alignItems: "flex-end" }}>
            <IconButton
              onClick={prevNotice}
              sx={{ color: "#0d918b", "&:hover": { bgcolor: "#e8e6e6ff" } }}
            >
              <ArrowBackIosNewIcon fontSize="medium" />
            </IconButton>
            <IconButton
              onClick={() => setIsPaused(!isPaused)}
              sx={{
                color: isPaused ? "red" : "#f0a800",
                "&:hover": { bgcolor: "#e8e6e6ff" },
              }}
            >
              {isPaused ? (
                <Stop fontSize="medium" />
              ) : (
                <PlayArrowIcon fontSize="medium" />
              )}
            </IconButton>
            {/* sx={{ color: "gray", "&:hover": { color: "red" } }} */}
            <IconButton
              onClick={nextNotice}
              sx={{ color: "#0d918b", "&:hover": { bgcolor: "#e8e6e6ff" } }}
            >
              <ArrowForwardIosIcon fontSize="medium" />
            </IconButton>
          </Box>
        </CardActions>
      )}
    </Card>
  );
};

export default NoticeboardCard;
