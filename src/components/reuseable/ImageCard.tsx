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

type ImageCardProps = {
  title: string;
  image: string;
  path: string;
  badge?: { label: string; color: string };
  variant?: "default" | "tile" | "chip";
  tint?: string;
};

const COMING_SOON = ["hr policies", "recruitment"];

const getBlockedImage = (title: string) => {
  switch (title.toLowerCase()) {
    case "hr policies": return blockicon;
    case "performance": return imgPerfor;
    case "task box": return imgtaskbox;
    case "recruitment": return imgrecruitment;
    default: return blockicon;
  }
};

const ImageCard: FC<ImageCardProps> = ({ title, image, path, badge, variant = "default", tint = "#eef2ff" }) => {
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

  const helpdeskDialog = (
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
  );

  if (variant === "chip") {
    return (
      <div className="relative">
        <button
          onClick={handleNavigate}
          disabled={isComingSoon}
          className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-md border text-left transition-colors ${
            isComingSoon
              ? "border-gray-100 bg-gray-50 cursor-default"
              : "border-[#cdeaea] bg-white hover:border-[#00a0a0] hover:bg-[#f0fbfb] cursor-pointer"
          }`}
        >
          <img
            src={displayImage}
            alt=""
            className={`w-4 h-4 object-contain flex-shrink-0 ${
              isComingSoon ? "grayscale opacity-40" : ""
            }`}
          />
          <span
            className={`text-[11px] font-medium truncate ${
              isComingSoon ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {title}
          </span>
          {!isComingSoon && badge && (
            <span
              className="ml-auto text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full whitespace-nowrap"
              style={{ backgroundColor: badge.color }}
            >
              {badge.label}
            </span>
          )}
        </button>
        {helpdeskDialog}
      </div>
    );
  }

  if (variant === "tile") {
    return (
      <div className="relative">
        <div
          onClick={handleNavigate}
          className={`group flex flex-col items-center gap-2 select-none ${
            isComingSoon ? "cursor-default" : "cursor-pointer"
          }`}
        >
          <div
            className={`relative w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-200 ${
              isComingSoon
                ? ""
                : "group-hover:-translate-y-0.5 group-hover:shadow-md group-active:scale-95"
            }`}
            style={{ backgroundColor: isComingSoon ? "#f3f4f6" : tint }}
          >
            <img
              src={displayImage}
              alt={title}
              className={`w-7 h-7 object-contain ${
                isComingSoon ? "grayscale opacity-40" : ""
              }`}
            />
            {!isComingSoon && badge && (
              <span
                className="absolute -top-1.5 -right-2 text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full whitespace-nowrap shadow-sm"
                style={{ backgroundColor: badge.color }}
              >
                {badge.label}
              </span>
            )}
            {isComingSoon && (
              <span className="absolute -top-1.5 -right-2 text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full bg-gray-400 whitespace-nowrap">
                Soon
              </span>
            )}
          </div>
          <p
            className={`text-[11px] font-medium text-center leading-tight ${
              isComingSoon ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {title}
          </p>
        </div>
        {helpdeskDialog}
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        onClick={handleNavigate}
        className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl border transition-all duration-200 select-none
          ${isComingSoon
            ? "bg-gray-50 border-gray-200 cursor-default"
            : "bg-white border-gray-100 shadow-sm cursor-pointer hover:shadow-md hover:border-[#00a0a0]/50 hover:-translate-y-0.5 active:scale-[0.97]"
          }`}
      >
   
        <div
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isComingSoon ? "bg-gray-100" : "bg-[#f0fbfb]"
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

        <p
          className={`text-[11px] sm:text-xs font-semibold text-center leading-snug ${
            isComingSoon ? "text-gray-400" : "text-gray-700"
          }`}
        >
          {title}
        </p>

     
        {!isComingSoon && (
          <div className="w-6 h-0.5 rounded-full bg-[#00a0a0] opacity-40" />
        )}
      </div>

  
      {isComingSoon && (
        <div className="absolute -top-2 -right-2 z-10">
          <CustomTag label="Coming Soon" />
        </div>
      )}

      {!isComingSoon && badge && (
        <div className="absolute -top-2 -right-2 z-10">
          <CustomTag label={badge.label} color={badge.color} />
        </div>
      )}

      {helpdeskDialog}
    </div>
  );
};

export default ImageCard;
