import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import ImageCard from "../components/reuseable/ImageCard";
import { homeData } from "../staticData/homepagedata";
import type { homeMenuTypes } from "../types/home-data-types/homepagetypes";
import NoticeboardCard from "../components/NoticeboardCard";
import useMediaQuery from "@mui/material/useMediaQuery";
import { keyframes, useTheme } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import CampaignIcon from "@mui/icons-material/Campaign";

import CyberAlertDialog from "../components/reuseable/CyberAlertDialog";
import AISurveyDialog from "../components/reuseable/AISurveyDialog";
import { useEffect, useState } from "react";
import CustomFooter from "../components/reuseable/CustomFooter";
import {
  clearAiSurveyPendingForLogin,
  shouldOpenAiSurveyOnHome,
  syncAiSurveyStateWithUser,
} from "../helper/aiSurveyStorage";

const getScrollKeyframes = (fromX: string, toX: string) => keyframes`
  0%   { transform: translateX(${fromX}); }
  100% { transform: translateX(${toX}); }
`;

const HomePage = () => {
  const theme = useTheme();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediamDevice = useMediaQuery(theme.breakpoints.down("md"));
  const fromX = isSmallDevice ? "20%" : isMediamDevice ? "40%" : "90%";
  const toX = isSmallDevice ? "-20%" : isMediamDevice ? "-40%" : "-120%";
  const scroll = getScrollKeyframes(fromX, toX);

  const needsAiSurvey = shouldOpenAiSurveyOnHome();

  const [aiSurveySessionDone, setAiSurveySessionDone] = useState(() => {
    syncAiSurveyStateWithUser();
    return !shouldOpenAiSurveyOnHome();
  });
  const [showCyberAlert, setShowCyberAlert] = useState(false);

  const aiSurveyOpen = needsAiSurvey && !aiSurveySessionDone;

  useEffect(() => {
    if (!aiSurveySessionDone) {
      setShowCyberAlert(false);
      return;
    }
    setShowCyberAlert(
      localStorage.getItem("cyberAlertAcknowledged") === "true" ? false : true
    );
  }, [aiSurveySessionDone]);

  const handleCyberAlertConfirm = () => {
    setShowCyberAlert(false);
    localStorage.setItem("cyberAlertAcknowledged", "true");
  };

  const handleAiSurveyDismiss = () => {
    clearAiSurveyPendingForLogin();
    setAiSurveySessionDone(true);
  };

  const handleAiSurveyComplete = () => {
    clearAiSurveyPendingForLogin();
    setAiSurveySessionDone(true);
  };

  return (
    <div className="w-full h-[calc(100vh-80px)] flex flex-col overflow-y-auto will-change-transform">

      {/* What's New marquee banner */}
      <div className="mx-4 mt-4 mb-5 flex items-stretch bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex-shrink-0">
        {/* Label */}
        <div className="relative flex-shrink-0 bg-[#fec300ff] flex items-center px-3">
          <CampaignIcon sx={{ color: "#fff", fontSize: 18, mr: 0.5 }} />
          <span className="text-white font-bold text-sm whitespace-nowrap">What's New</span>
          {/* Triangle pointer */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: -12,
              width: 0,
              height: 0,
              borderTop: "22px solid transparent",
              borderBottom: "22px solid transparent",
              borderLeft: "12px solid #fec300ff",
            }}
          />
        </div>

        {/* Scrolling text */}
        <Box sx={{ width: "100%", overflow: "hidden", whiteSpace: "nowrap", pl: "20px", py: "10px" }}>
          <Box
            component="span"
            sx={{
              display: "inline-block",
              animation: `${scroll} ${
                isSmallDevice ? "15s" : isMediamDevice ? "25s" : "35s"
              } linear infinite`,
              fontSize: "0.8125rem",
              fontWeight: 500,
              color: "#374151",
              "&:hover": { animationPlayState: "paused" },
            }}
          >
            We're excited to introduce you to the enhanced version of ESS
            (Employee Self-Service) — redesigned with a fresh look, improved
            performance, and user-friendly features to make your experience
            smoother and more efficient than ever before.
          </Box>
        </Box>
      </div>

      {/* Mobile noticeboard accordion */}
      <div className="block sm:hidden px-4 mb-4">
        <Accordion
          sx={{
            borderRadius: "16px !important",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            border: "1px solid #e2e8f0",
            "&:before": { display: "none" },
            overflow: "hidden",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#2eacb3" }} />}
            sx={{ minHeight: 48, "& .MuiAccordionSummary-content": { my: 0 } }}
          >
            <div className="flex items-center gap-2">
              <NotificationsNoneIcon sx={{ fontSize: 18, color: "#2eacb3" }} />
              <Typography variant="subtitle2" fontWeight={700} color="#1e293b">
                Notice Board
              </Typography>
            </div>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0, px: 0, pb: 0 }}>
            <NoticeboardCard />
          </AccordionDetails>
        </Accordion>
      </div>

      {/* Main content: menu grid + noticeboard sidebar */}
      <div
        className={`flex-1 ${
          isSmallDevice
            ? "w-full px-4"
            : `grid ${
                isMediamDevice ? "md:grid-cols-[2fr_1fr]" : "lg:grid-cols-[3fr_1fr]"
              } gap-4 px-4`
        }`}
      >
        {/* Menu grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 content-start pb-4">
          {homeData.map((item: homeMenuTypes) => (
            <ImageCard
              key={item.id}
              title={item.title}
              image={item.icon}
              path={item.path}
            />
          ))}
        </div>

        {/* Noticeboard sidebar (tablet and above) */}
        <div className="hidden sm:block pb-4">
          <NoticeboardCard />
        </div>
      </div>

      <CustomFooter />

      <AISurveyDialog
        open={aiSurveyOpen}
        onClose={handleAiSurveyDismiss}
        onComplete={handleAiSurveyComplete}
      />
      <CyberAlertDialog
        open={showCyberAlert && aiSurveySessionDone && !aiSurveyOpen}
        onOpenChange={(open) => {
          if (!open) return;
          setShowCyberAlert(open);
        }}
        onConfirm={() => {
          setShowCyberAlert(false);
          handleCyberAlertConfirm();
        }}
      />
    </div>
  );
};

export default HomePage;
