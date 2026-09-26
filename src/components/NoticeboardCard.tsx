import React, { useEffect, useState } from "react";
import {
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
import cricketAds from "../assets/img/cricket-ads.gif";

const MIN_AUTOPLAY_MS = 3000;
const MAX_AUTOPLAY_MS = 5000;
const randomAutoplayMs = () => Math.floor(Math.random() * (MAX_AUTOPLAY_MS - MIN_AUTOPLAY_MS + 1)) + MIN_AUTOPLAY_MS;

// Each entry is a full slide's content. Kept as plain JSX (not the old title/message/author
// shape) since announcements here are one-off designed blocks, not a uniform feed.
const slides: React.ReactNode[] = [
  <Box sx={{ width: "100%", maxWidth: 420, mx: "auto" }}>
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ mb: 1.25, textAlign: "center", lineHeight: 1.7 }}
    >
      🎉 We've also launched the new ESS
      app on the Play Store, packed with many new features — we hope
      it helps you navigate more easily and get things done faster.
    </Typography>

    <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ mb: 1.25 }}>
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
      <Typography variant="body2" fontWeight={700} sx={{ mb: 1.5, color: "#0d918b" }}>
        🔹 Download Android App QR Code
      </Typography>
      <Box component="img" src={qrCode} alt="QR" sx={{ width: 160, mx: "auto", display: "block" }} />
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1.25 }}>
        Thank you for being a valued part of our team!
      </Typography>
    </Box>

    <Typography variant="body2" fontWeight={600} sx={{ mt: 1.5, textAlign: "center" }}>
      — HR Team
    </Typography>
  </Box>,

  <Box sx={{ width: "100%", maxWidth: 420, mx: "auto" }}>
    <Box
      component="img"
      src={cricketAds}
      alt="Cricket tournament"
      sx={{ width: "100%", maxWidth: 320, mx: "auto", display: "block", borderRadius: 2, mb: 1.5 }}
    />
    <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", lineHeight: 1.7 }}>
      🏏 Get ready! Our cricket tournament kicks off on the 1st.
      Start forming your teams and stay tuned for the schedule.
    </Typography>
    <Typography variant="body2" fontWeight={600} sx={{ mt: 1.5, textAlign: "center" }}>
      — HR Team
    </Typography>
  </Box>,
];

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
  // A fresh random 3-5s duration is picked every time we land on a slide, so each one gets its
  // own timer (not a fixed interval) - also drives the progress bar's animation length below.
  const [slideDuration, setSlideDuration] = useState(randomAutoplayMs);
  const hasMultiple = slides.length > 1;

  const prevNotice = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };
  const nextNotice = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  useEffect(() => {
    if (!isPlaying || !hasMultiple) return;
    const ms = randomAutoplayMs();
    setSlideDuration(ms);
    const timer = setTimeout(nextNotice, ms);
    return () => clearTimeout(timer);
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
        <Box key={current} sx={{ width: "100%", animation: `${fadeIn} 0.35s ease` }}>
          {slides[current]}
        </Box>
      </CardContent>

      {hasMultiple && (
        <Stack direction="row" spacing={0.75} justifyContent="center" sx={{ mb: 1 }}>
          {slides.map((_, i) => (
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
              animation: `${shrink} ${slideDuration}ms linear`,
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
            {isPlaying ? <PauseIcon fontSize="medium" /> : <PlayArrowIcon fontSize="medium" />}
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
    </Card>
  );
};

export default NoticeboardCard;
