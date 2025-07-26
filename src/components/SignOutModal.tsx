import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

import DialogTitle from "@mui/material/DialogTitle";
import { Avatar, Box } from "@mui/material";

const feedbackStyles = {
  poor: {
    bg: "#ffe5e5",
    border: "#e53935",
  },
  good: {
    bg: "#fff4e5",
    border: "#fb8c00",
  },
  excellent: {
    bg: "#e6f7e6",
    border: "#43a047",
  },
};

interface SignOutModalProps {
  openSign?: any;
  close?: () => void;
  aggree?: () => void;
  title?: string;
  description?: string;
  setSelected?: any;
  selected?: any;
}
const SignOutModal: React.FC<SignOutModalProps> = ({
  openSign,
  close,
  setSelected,
  selected,
  aggree,
}) => {
  const feedbackOptions = [
    { emoji: "😞", label: "Poor", value: "poor" },
    { emoji: "🙂", label: "Good", value: "good" },
    { emoji: "😄", label: "Excellent", value: "excellent" },
  ];
  return (
    <Dialog
      open={openSign}
      // onClose={close}
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0)",
          backdropFilter: "blur(5px)",
          WebkitBackdropFilter: "blur(5px)",
        },
      }}
      PaperProps={{
        sx: {
          overflow: "visible",
          borderRadius: 3,
          p: 3,
          pt: 6,
          minWidth: 500,
          border: "3px solid #ffb476ff",
          background: "linear-gradient(to bottom , #faffb7ff, #fefff4ff)",
        },
      }}
      // className=" bg-gradient-to-br from-[#d7f1f3] to-[#d7f1f3]"
    >
      <Avatar
        src=""
        sx={{
          width: 80,
          height: 80,
          position: "absolute",
          top: -40,
          left: "calc(50% - 40px)",
          // border: "3px solid #ffb476ff",
          backgroundColor: "#ebd93cff",
        }}
      />

      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
        How was the experience with the new ESS on your device?
      </DialogTitle>

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Box sx={{ display: "flex", gap: 3, my: 2 }}>
          {feedbackOptions.map((option) => {
            const isSelected = selected === option.value;
            const { bg, border } =
              feedbackStyles[option.value as keyof typeof feedbackStyles];

            return (
              <Box
                key={option.value}
                onClick={() => setSelected(option.value)}
                sx={{
                  width: 100,
                  height: 100,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 2,
                  backgroundColor: isSelected ? bg : "transparent",
                  border: `2px solid ${isSelected ? border : "transparent"}`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: bg,
                    borderColor: border,
                    transform: "scale(1.05)",
                  },
                }}
              >
                <span style={{ fontSize: "2rem" }}>{option.emoji}</span>
                <span style={{ marginTop: 8, fontWeight: 500 }}>
                  {option.label}
                </span>
              </Box>
            );
          })}
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", px: 3, gap: 2 }}>
        <Button
          onClick={close}
          variant="text"
          className="text-blue-500 text-sm"
        >
          Cancel
        </Button>
        <Button variant="contained" color="warning" onClick={aggree}>
          Secure Logout
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SignOutModal;
