import React, { useMemo, useRef, useState } from "react";
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
import PauseIcon from "@mui/icons-material/Pause";
import qrCode from "../assets/img/essDownload.png";

const MIN_AUTOPLAY_MS = 3000;
const MAX_AUTOPLAY_MS = 5000;
const randomAutoplayMs = () => Math.floor(Math.random() * (MAX_AUTOPLAY_MS - MIN_AUTOPLAY_MS + 1)) + MIN_AUTOPLAY_MS;


const slides: React.ReactNode[] = [
  <Box sx={{ width: "100%", maxWidth: 420, mx: "auto" }}>
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ mb: 1.25, textAlign: "start", lineHeight: 1.7 }}
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
        border: "1px dashed rgba(0,160,160,0.4)",
        borderRadius: 2,
        p: 2.25,
        textAlign: "center",
        bgcolor: "rgba(0,160,160,0.03)",
      }}
    >
      <Typography variant="body2" fontWeight={700} sx={{ mb: 1.5, color: "#007f86" }}>
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
];

const BRAND = "#007f86";

const slideInFromRight = keyframes`
  from { opacity: 0; transform: translateX(24px); }
  to { opacity: 1; transform: translateX(0); }
`;

const slideInFromLeft = keyframes`
  from { opacity: 0; transform: translateX(-24px); }
  to { opacity: 1; transform: translateX(0); }
`;

const fill = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

const SWIPE_THRESHOLD_PX = 40;

const arrowSx = (side: "left" | "right", visible: boolean) => ({
  position: "absolute" as const,
  top: "50%",
  [side]: 8,
  zIndex: 2,
  width: 36,
  height: 36,
  color: BRAND,
  bgcolor: "rgba(255,255,255,0.92)",
  border: "1px solid rgba(0,160,160,0.2)",
  boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
  backdropFilter: "blur(4px)",
  opacity: visible ? 1 : 0,
  transform: `translateY(-50%) translateX(${visible ? 0 : side === "left" ? -8 : 8}px)`,
  transition: "opacity 0.25s ease, transform 0.25s ease, background-color 0.2s ease",
  "&:hover": { bgcolor: BRAND, color: "#fff" },
  "&:focus-visible": { opacity: 1, transform: "translateY(-50%)" },
});

const NoticeboardCard: React.FC = () => {
  const [current, setCurrent] = useState<number>(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const theme = useTheme();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down("sm"));
  const isTouch = useMediaQuery("(hover: none)");

  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // A fresh random duration for every slide change.
  const slideDuration = useMemo(randomAutoplayMs, [current]);
  const hasMultiple = slides.length > 1;
  const isPaused =  isHovered;
  const showArrows = hasMultiple && (isHovered || isTouch);

  const prevNotice = () => {
    setDirection("prev");
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };
  const nextNotice = () => {
    setDirection("next");
    setCurrent((prev) => (prev + 1) % slides.length);
  };
  const goTo = (i: number) => {
    if (i === current) return;
    setDirection(i > current ? "next" : "prev");
    setCurrent(i);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!hasMultiple) return;
    if (e.key === "ArrowLeft") prevNotice();
    if (e.key === "ArrowRight") nextNotice();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || !hasMultiple) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (dx > SWIPE_THRESHOLD_PX) prevNotice();
    else if (dx < -SWIPE_THRESHOLD_PX) nextNotice();
  };

  return (
    <Card
      elevation={0}
      sx={{
        maxWidth: "100%",
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        backgroundColor: "#ffffff",
        overflow: "hidden",
        border: isSmallDevice ? "none" : "1px solid rgba(0,160,160,0.15)",
        boxShadow: isSmallDevice ? "none" : "0 4px 20px rgba(0,160,160,0.08)",
        transition: "box-shadow 0.3s ease",
        "&:hover": isSmallDevice ? {} : { boxShadow: "0 8px 28px rgba(0,160,160,0.14)" },
      }}
    >
      {!isSmallDevice && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            py: 1,
            background: "linear-gradient(90deg, rgba(0,160,160,0.1), rgba(0,160,160,0.04))",
          }}
        >
          <Typography variant="subtitle1" fontWeight={700} sx={{ color: "#134e4a" }}>
            📌 Announcements
          </Typography>
          {hasMultiple && (
            <Typography
              variant="caption"
              fontWeight={600}
              sx={{
                color: BRAND,
                bgcolor: "rgba(0,160,160,0.1)",
                px: 1,
                py: 0.25,
                borderRadius: 5,
              }}
            >
              {current + 1} / {slides.length}
            </Typography>
          )}
        </Box>
      )}

      {hasMultiple && (
        <Box sx={{ height: 3, bgcolor: "rgba(0,160,160,0.12)", overflow: "hidden" }}>
          <Box
            key={current}
            onAnimationEnd={nextNotice}
            sx={{
              height: "100%",
              bgcolor: BRAND,
              transformOrigin: "left",
              animation: `${fill} ${slideDuration}ms linear forwards`,
              animationPlayState: isPaused ? "paused" : "running",
              opacity:  0.35,
              transition: "opacity 0.2s ease",
            }}
          />
        </Box>
      )}

      <CardContent
        role="region"
        aria-roledescription="carousel"
        aria-label="Announcements"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsHovered(false);
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        sx={{
          position: "relative",
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: hasMultiple ? (isSmallDevice ? 5 : 7) : isSmallDevice ? 2 : 4,
          py: 2,
          outline: "none",
          overflow: "hidden",
        }}
      >
        {hasMultiple && (
          <Tooltip title="Previous" placement="right">
            <IconButton
              aria-label="Previous announcement"
              onClick={prevNotice}
              size="small"
              sx={arrowSx("left", showArrows)}
            >
              <ArrowBackIosNewIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        )}

        <Box
          key={current}
          sx={{
            width: "100%",
            animation: `${direction === "next" ? slideInFromRight : slideInFromLeft} 0.4s cubic-bezier(0.22, 1, 0.36, 1)`,
          }}
        >
          {slides[current]}
        </Box>

        {hasMultiple && (
          <Tooltip title="Next" placement="left">
            <IconButton
              aria-label="Next announcement"
              onClick={nextNotice}
              size="small"
              sx={arrowSx("right", showArrows)}
            >
              <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        )}

        {hasMultiple && isHovered && !isTouch && (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              px: 1,
              py: 0.25,
              borderRadius: 5,
              bgcolor: "rgba(0,0,0,0.55)",
              color: "#fff",
              fontSize: 11,
              fontWeight: 600,
              pointerEvents: "none",
            }}
          >
            <PauseIcon sx={{ fontSize: 12 }} /> Paused
          </Box>
        )}
      </CardContent>

      {hasMultiple && (
        <CardActions sx={{ justifyContent: "center", gap: 1.5, pt: 0, pb: 1.5 }}>
          <Stack direction="row" spacing={0.75} alignItems="center">
            {slides.map((_, i) => (
              <Box
                key={i}
                component="button"
                aria-label={`Go to announcement ${i + 1}`}
                aria-current={i === current}
                onClick={() => goTo(i)}
                sx={{
                  width: i === current ? 22 : 8,
                  height: 8,
                  p: 0,
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  bgcolor: i === current ? BRAND : "rgba(0,160,160,0.25)",
                  "&:hover": { bgcolor: i === current ? BRAND : "rgba(0,160,160,0.5)" },
                }}
              />
            ))}
          </Stack>
      
        </CardActions>
      )}
    </Card>
  );
};

export default NoticeboardCard;
