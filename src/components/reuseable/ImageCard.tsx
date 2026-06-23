import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import CustomTag from "./CustomTag";
import { useDrawerContext } from "../../contextapi/DrawerContextApi";
import blockicon from "../../assets/blockimage/policiesb&w.png";
import imgPerfor from "../../assets/blockimage/bg-performance.png";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import imgtaskbox from "../../assets/blockimage/bw-taskbox.png";
import imgrecruitment from "../../assets/blockimage/recurt.png";
import React from "react";

type ImageCardProps = {
  title: string;
  image: string;
  path: string;
};

const COMING_SOON = ["hr policies", "performance", "task box", "recruitment"];

const getBlockedImage = (title: string) => {
  switch (title.toLowerCase()) {
    case "hr policies": return blockicon;
    case "performance": return imgPerfor;
    case "task box": return imgtaskbox;
    case "recruitment": return imgrecruitment;
    default: return blockicon;
  }
};

const ImageCard: FC<ImageCardProps> = ({ title, image, path }) => {
  const navigation = useNavigate();
  const { setIsExpended } = useDrawerContext();
  const [open, setOpen] = useState(false);

  const isComingSoon = COMING_SOON.includes(title.toLowerCase());
  const isHelpdesk = title.toLowerCase() === "helpdesk";
  const displayImage = isComingSoon ? getBlockedImage(title) : image;

  const handleNavigate = () => {
    if (isComingSoon) return;
    if (isHelpdesk) { setOpen(true); return; }
    setIsExpended(false);
    navigation(path);
  };

  return (
    <div className="relative">
      <div
        onClick={handleNavigate}
        className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl border transition-all duration-200 select-none
          ${isComingSoon
            ? "bg-gray-50 border-gray-200 cursor-default"
            : "bg-white border-gray-100 shadow-sm cursor-pointer hover:shadow-md hover:border-[#2eacb3]/50 hover:-translate-y-0.5 active:scale-[0.97]"
          }`}
      >
        {/* Icon container */}
        <div
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isComingSoon ? "bg-gray-100" : "bg-[#f0fdfe]"
          }`}
        >
          <img
            src={displayImage}
            alt={title}
            className={`w-9 h-9 sm:w-11 sm:h-11 object-contain ${
              isComingSoon ? "grayscale opacity-40" : ""
            }`}
          />
        </div>

        {/* Title */}
        <p
          className={`text-[11px] sm:text-xs font-semibold text-center leading-snug ${
            isComingSoon ? "text-gray-400" : "text-gray-700"
          }`}
        >
          {title}
        </p>

        {/* Bottom accent line for active items */}
        {!isComingSoon && (
          <div className="w-6 h-0.5 rounded-full bg-[#2eacb3] opacity-40" />
        )}
      </div>

      {/* Coming soon badge */}
      {isComingSoon && (
        <div className="absolute -top-2 -right-2 z-10">
          <CustomTag label="Coming Soon" />
        </div>
      )}

      {/* Helpdesk disclaimer dialog */}
      <React.Fragment>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          BackdropProps={{
            sx: {
              backgroundColor: "rgba(0, 0, 0, 0)",
              backdropFilter: "blur(5px)",
              WebkitBackdropFilter: "blur(5px)",
            },
          }}
        >
          <DialogTitle id="alert-dialog-title">Disclaimer</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <b>Please note: </b>By clicking on the "Raise a Ticket" link, you
              will be redirected from the ESS Portal to a separate support system
              managed by mscorpres. While both platforms are part of our
              organization, the Raise Ticket portal operates independently and may
              have its own terms of use and privacy policies. Please ensure you
              review those terms before proceeding.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={() => setOpen(false)}>
              Disagree
            </Button>
            <Button
              color="success"
              variant="contained"
              onClick={() =>
                window.open("https://support.mscorpres.com/open.php", "_blank")
              }
            >
              Agree&nbsp;
              <ArrowOutwardIcon fontSize="small" />
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </div>
  );
};

export default ImageCard;
