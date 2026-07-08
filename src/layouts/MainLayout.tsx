import styled from "styled-components";

import Header from "../components/header/Header";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { Avatar, Typography } from "@mui/material";
import nointernet from "../assets/no-wifi.png";
import AISurveyDialog from "../components/reuseable/AISurveyDialog";
import CyberAlertDialog from "../components/reuseable/CyberAlertDialog";
import AssetVerificationDrawer from "../components/reuseable/AssetVerificationDrawer";
import {
  clearAiSurveyPendingForLogin,
  shouldOpenAiSurveyOnHome,
  syncAiSurveyStateWithUser,
} from "../helper/aiSurveyStorage";
import {
  clearAssetConfirmationPendingForLogin,
  shouldOpenAssetConfirmation,
  syncAssetConfirmationStateWithUser,
} from "../helper/assetVerificationStorage";
import { updateStoredUserAssetConfirmation } from "../helper/userStorage";

// props: { children: React.ReactNode }
function MainLayout() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // These mandatory gates are mounted here (not on a single page) so they
  // show up regardless of which route the user lands/navigates on.
  const needsAiSurvey = shouldOpenAiSurveyOnHome();
  const [aiSurveySessionDone, setAiSurveySessionDone] = useState(() => {
    syncAiSurveyStateWithUser();
    return !shouldOpenAiSurveyOnHome();
  });
  const aiSurveyOpen = needsAiSurvey && !aiSurveySessionDone;

  const needsAssetConfirmation = shouldOpenAssetConfirmation();
  const [assetConfirmationSessionDone, setAssetConfirmationSessionDone] =
    useState(() => {
      syncAssetConfirmationStateWithUser();
      return !shouldOpenAssetConfirmation();
    });
  const assetConfirmationOpen =
    aiSurveySessionDone && needsAssetConfirmation && !assetConfirmationSessionDone;

  const [showCyberAlert, setShowCyberAlert] = useState(false);

  useEffect(() => {
    if (!aiSurveySessionDone || !assetConfirmationSessionDone) {
      setShowCyberAlert(false);
      return;
    }
    setShowCyberAlert(
      localStorage.getItem("cyberAlertAcknowledged") === "true" ? false : true,
    );
  }, [aiSurveySessionDone, assetConfirmationSessionDone]);

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

  const handleAssetConfirmationComplete = () => {
    clearAssetConfirmationPendingForLogin();
    updateStoredUserAssetConfirmation("N");
    setAssetConfirmationSessionDone(true);
  };

  return (
    <Wrapper className="">
      {!isOnline && (
        <div className="absolute top-0  w-full h-screen  flex flex-col justify-center items-center bg-gray-400/20 w-full z-1200  ">
          <Avatar
            src={nointernet}
            alt="no-internet"
            sx={{ width: 100, height: 100, mb: 1 }}
          />
          <Typography
            variant="subtitle2"
            sx={{ fontSize: 22, fontWeight: 500, color: "#000" }}
          >
            No internet connection. Check your network.
          </Typography>
        </div>
      )}
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <main
        className={`relative  bg-gradient-to-br from-[#f8fbfc] to-[#eaf7f5]
 h-full  custom-scrollbar-for-menu  ${!isOnline && "blur-sm"} `}
      >
        <Outlet />
      </main>
      {/* <div className="absolute bottom-0 right-4 sm:right-10 z-99">
        <CustomFooter />
      </div> */}

      <AISurveyDialog
        open={aiSurveyOpen}
        onClose={handleAiSurveyDismiss}
        onComplete={handleAiSurveyComplete}
      />
      <AssetVerificationDrawer
        open={assetConfirmationOpen}
        onComplete={handleAssetConfirmationComplete}
      />
      <CyberAlertDialog
        open={showCyberAlert && !aiSurveyOpen && !assetConfirmationOpen}
        onOpenChange={(open) => {
          if (!open) return;
          setShowCyberAlert(open);
        }}
        onConfirm={() => {
          setShowCyberAlert(false);
          handleCyberAlertConfirm();
        }}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  .btn {
    overflow: hidden;
    position: relative;

    span {
      position: absolute;
      background-color: #d1d101a3;
      height: 100px;
      width: 10px;
      rotate: 30deg;
      left: -20px;
      transition: all 1.3s;
    }
    &:hover {
      span {
        left: 120px;
        transition: all 1.3s;
      }
    }
  }
`;
export default MainLayout;
