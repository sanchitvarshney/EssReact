import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";
import type { SlideProps } from "@mui/material/Slide";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CloseIcon from "@mui/icons-material/Close";

interface ToastShowProps {
  isOpen: boolean;
  msg: string;
  onClose?: () => void;
  type: "success" | "error";
}

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

const CONFIG = {
  success: {
    icon: CheckCircleOutlineIcon,
    accent: "#2eacb3",
    iconBg: "#e0f7fa",
    iconColor: "#2eacb3",
    label: "Success",
  },
  error: {
    icon: ErrorOutlineIcon,
    accent: "#ef4444",
    iconBg: "#fee2e2",
    iconColor: "#ef4444",
    label: "Error",
  },
};

const AUTO_HIDE = 5000;

const ToastShow: React.FC<ToastShowProps> = ({
  isOpen,
  msg,
  onClose,
  type = "success",
}) => {
  const [progress, setProgress] = React.useState(100);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const cfg = CONFIG[type];
  const Icon = cfg.icon;

  React.useEffect(() => {
    if (isOpen) {
      setProgress(100);
      const step = 100 / (AUTO_HIDE / 100);
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p <= 0) {
            clearInterval(intervalRef.current!);
            return 0;
          }
          return p - step;
        });
      }, 100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setProgress(100);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isOpen]);

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      open={isOpen}
      autoHideDuration={AUTO_HIDE}
      onClose={onClose}
      slots={{ transition: SlideTransition }}
      key="bottom-center"
      sx={{ bottom: { xs: 16, sm: 24 } }}
    >
      <div
        style={{
          minWidth: 320,
          maxWidth: 420,
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)",
          overflow: "hidden",
          border: "1px solid #f1f5f9",
        }}
      >
        {/* Main content */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px 14px 14px" }}>
          {/* Accent bar */}
          <div
            style={{
              width: 4,
              alignSelf: "stretch",
              borderRadius: 99,
              backgroundColor: cfg.accent,
              flexShrink: 0,
            }}
          />

          {/* Icon */}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: cfg.iconBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon sx={{ fontSize: 20, color: cfg.iconColor }} />
          </div>

          {/* Text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: cfg.accent, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              {cfg.label}
            </p>
            <p style={{ margin: "2px 0 0", fontSize: 13, fontWeight: 500, color: "#374151", lineHeight: 1.4, wordBreak: "break-word" }}>
              {msg}
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              flexShrink: 0,
              width: 28,
              height: 28,
              borderRadius: 8,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#9ca3af",
              transition: "background 0.15s, color 0.15s",
              padding: 0,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#f3f4f6";
              (e.currentTarget as HTMLButtonElement).style.color = "#374151";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "#9ca3af";
            }}
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </button>
        </div>

        {/* Progress bar */}
        <div style={{ height: 3, backgroundColor: "#f1f5f9" }}>
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              backgroundColor: cfg.accent,
              borderRadius: "0 99px 99px 0",
              transition: "width 0.1s linear",
              opacity: 0.7,
            }}
          />
        </div>
      </div>
    </Snackbar>
  );
};

export default ToastShow;
