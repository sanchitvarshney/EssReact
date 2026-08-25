import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Stack,
  Tooltip,
  useTheme,
  useMediaQuery,
  CardActions,
} from "@mui/material";
import { keyframes } from "@emotion/react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import qrCode from "../assets/img/essDownload.png";

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

const AUTOPLAY_MS = 5000;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shrink = keyframes`
  from { width: 100%; }
  to { width: 0%; }
`;

const NoticeboardCard: React.FC = () => {
  const [current, setCurrent] = useState<number>(0);
  const theme = useTheme();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down("sm"));

  const [isPlaying, setIsPlaying] = useState(true);
  const hasMultiple = dummyData.length > 1;

  const prevNotice = () => {
    setCurrent((prev) => (prev - 1 + dummyData.length) % dummyData.length);
  };
  const nextNotice = () => {
    setCurrent((prev) => (prev + 1) % dummyData.length);
  };

  useEffect(() => {
    if (!isPlaying || !hasMultiple) return;
    const interval = setInterval(nextNotice, AUTOPLAY_MS);
    return () => clearInterval(interval);
  }, [isPlaying, current, hasMultiple]);

  return (
    <Card
      elevation={isSmallDevice ? 0 : 2}
      sx={{
        maxWidth: "100%",
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        p: isSmallDevice ? 0 : 0,
        borderRadius: 3,
        backgroundColor: "#ffffff",
        overflow: "hidden",
        border: isSmallDevice ? "none" : "1px solid #f0f0f0",
      }}
    >
      {!isSmallDevice && (
        <Box
          sx={{
            background:
              "linear-gradient(90deg, rgba(13,145,139,0.08), rgba(46,172,179,0.08))",
            borderBottom: "2px solid #0d918b",
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            textAlign={"center"}
            sx={{ py: 1 }}
          >
            📌 Announcement's
          </Typography>
        </Box>
      )}

      {dummyData.length === 0 ? (
        <CardContent
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: isSmallDevice ? 2 : 4,
            py: 1.25,
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 420, animation: `${fadeIn} 0.4s ease` }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1.25, textAlign: "center", lineHeight: 1.7 }}
            >
              We're excited to introduce a refreshed look and improved
              experience on the ESS portal. We hope it helps you navigate more
              easily and get things done faster.
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              alignItems="flex-start"
              sx={{ mb: 1.25 }}
            >
              <Typography variant="body2" color="text.secondary">
                🔹 We'd love to hear your feedback and suggestions.
              </Typography>
            </Stack>

            <Box
              sx={{
                border: "1px dashed rgba(13,145,139,0.4)",
                borderRadius: 2,
                p: 2.25,
                textAlign: "center",
                bgcolor: "rgba(13,145,139,0.03)",
              }}
            >
              <Typography
                variant="body2"
                fontWeight={700}
                sx={{ mb: 1.5, color: "#0d918b" }}
              >
                🔹 Download Android App QR Code
              </Typography>
              <Box
                component="img"
                src={qrCode}
                alt="QR"
                sx={{ width: 160, mx: "auto", display: "block" }}
              />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1.25 }}
              >
                Thank you for being a valued part of our team!
              </Typography>
            </Box>

            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ mt: 1.5, textAlign: "center" }}
            >
              — HR Team
            </Typography>
          </Box>
        </CardContent>
      ) : (
        <>
          <CardContent sx={{ flex: 1, px: isSmallDevice ? 2 : 3, pt: 2.5 }}>
            <Box key={current} sx={{ animation: `${fadeIn} 0.35s ease` }}>
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
                    width: 36,
                    height: 36,
                    backgroundColor: "#2eacb3",
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                />
                <Box ml={1.5}>
                  <Typography variant="body2" fontWeight={500}>
                    {dummyData[current].author}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {dummyData[current].date} • {dummyData[current].time}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>

          {hasMultiple && (
            <Stack
              direction="row"
              spacing={0.75}
              justifyContent="center"
              sx={{ mb: 1 }}
            >
              {dummyData.map((_: unknown, i: number) => (
                <Box
                  key={i}
                  component="button"
                  aria-label={`Go to announcement ${i + 1}`}
                  onClick={() => setCurrent(i)}
                  sx={{
                    width: i === current ? 18 : 6,
                    height: 6,
                    p: 0,
                    border: "none",
                    borderRadius: 3,
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                    bgcolor: i === current ? "#0d918b" : "rgba(13,145,139,0.25)",
                  }}
                />
              ))}
            </Stack>
          )}

          {isPlaying && hasMultiple && (
            <Box
              sx={{
                height: 3,
                bgcolor: "rgba(13,145,139,0.12)",
                mx: 3,
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <Box
                key={current}
                sx={{
                  height: "100%",
                  bgcolor: "#0d918b",
                  animation: `${shrink} ${AUTOPLAY_MS}ms linear`,
                }}
              />
            </Box>
          )}

          <CardActions sx={{ justifyContent: "center", pb: 2 }}>
            <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
              <Tooltip title="Previous">
                <span>
                  <IconButton
                    onClick={prevNotice}
                    disabled={!hasMultiple}
                    sx={{
                      color: "#0d918b",
                      "&:hover": { bgcolor: "rgba(13,145,139,0.1)" },
                    }}
                  >
                    <ArrowBackIosNewIcon fontSize="medium" />
                  </IconButton>
                </span>
              </Tooltip>
              <IconButton
                onClick={() => setIsPlaying((p) => !p)}
                sx={{
                  color: "#fff",
                  bgcolor: "#0d918b",
                  "&:hover": { bgcolor: "#0b7b76" },
                }}
              >
                {isPlaying ? (
                  <PauseIcon fontSize="medium" />
                ) : (
                  <PlayArrowIcon fontSize="medium" />
                )}
              </IconButton>
              <Tooltip title="Next">
                <span>
                  <IconButton
                    onClick={nextNotice}
                    disabled={!hasMultiple}
                    sx={{
                      color: "#0d918b",
                      "&:hover": { bgcolor: "rgba(13,145,139,0.1)" },
                    }}
                  >
                    <ArrowForwardIosIcon fontSize="medium" />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          </CardActions>
        </>
      )}
    </Card>
  );
};

export default NoticeboardCard;
