import { useState } from "react";
import { Box } from "@mui/material";
import CampaignIcon from "@mui/icons-material/Campaign";
import useMediaQuery from "@mui/material/useMediaQuery";
import { keyframes, useTheme } from "@mui/material/styles";
import { FYI_MESSAGES, type FyiMessageType } from "../../content/fyiMessages";

const getScrollKeyframes = (fromX: string, toX: string) => keyframes`
  0%   { transform: translateX(${fromX}); }
  100% { transform: translateX(${toX}); }
`;

const TYPE_COLOR: Record<FyiMessageType, string> = {
  error: "#dc2626", // red
  success: "#0f6d3f", // dark green
  info: "#1e3a8a", // dark blue
};

// Replaces the old "What's New" banner. One message shows at a time - it scrolls
// across once, then the next message in src/content/fyiMessages.ts takes over
// (cycle, not the message index itself, is the remount key: with only one
// message in the list it still needs to restart the animation on every pass).
const FyiBanner = () => {
  const theme = useTheme();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumDevice = useMediaQuery(theme.breakpoints.down("md"));
  const fromX = isSmallDevice ? "20%" : isMediumDevice ? "40%" : "90%";
  const toX = isSmallDevice ? "-20%" : isMediumDevice ? "-40%" : "-120%";
  const durationSec = isSmallDevice ? 15 : isMediumDevice ? 25 : 35;
  const scroll = getScrollKeyframes(fromX, toX);

  const [cycle, setCycle] = useState(0);

  if (FYI_MESSAGES.length === 0) return null;
  const message = FYI_MESSAGES[cycle % FYI_MESSAGES.length];
  const color = TYPE_COLOR[message.type];

  return (
    <div className="mx-4 mt-4 mb-4 flex items-stretch bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex-shrink-0">
      <div
        className="relative flex-shrink-0 flex items-center px-3"
        style={{ backgroundColor: color }}
      >
        <CampaignIcon sx={{ color: "#fff", fontSize: 18, mr: 0.5 }} />
        <span className="text-white font-bold text-sm whitespace-nowrap">FYI</span>
        <div
          style={{
            position: "absolute",
            top: 0,
            right: -12,
            width: 0,
            height: 0,
            borderTop: "22px solid transparent",
            borderBottom: "22px solid transparent",
            borderLeft: `12px solid ${color}`,
            filter: "drop-shadow(-2px 0 2px rgba(0, 0, 0, 0.1))",
          }}
        />
      </div>

      <Box sx={{ width: "100%", overflow: "hidden", whiteSpace: "nowrap", pl: "20px", py: "10px" }}>
        <Box
          key={cycle}
          component="span"
          onAnimationEnd={() => setCycle((c) => c + 1)}
          sx={{
            display: "inline-block",
            animation: `${scroll} ${durationSec}s linear 1`,
            fontSize: "0.8125rem",
            fontWeight: 700,
            color,
            "&:hover": { animationPlayState: "paused" },
          }}
        >
          {message.text}
        </Box>
      </Box>
    </div>
  );
};

export default FyiBanner;
