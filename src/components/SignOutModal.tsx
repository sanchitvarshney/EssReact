import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

import DialogTitle from "@mui/material/DialogTitle";
import { Avatar } from "@mui/material";

import { useAuth } from "../contextapi/AuthContext";

interface SignOutModalProps {
  openSign?: any;
  close?: () => void;
  aggree?: () => void;
  title?: string;
  description?: string;

}
const SignOutModal: React.FC<SignOutModalProps> = ({
  openSign,
  close,

  aggree,
  
  
}) => {
 const {  } = useAuth();
  const [selected, setSelected] = React.useState<string | null>(null);

  
 


  const feedbackOptions = [
    { emoji: "😞", label: "Poor", value: "poor" },
    { emoji: "🙂", label: "Good", value: "good" },
    { emoji: "😄", label: "Excellent", value: "excellent" },
  ];
  return (
    <Dialog
      open={openSign}
      onClose={close}
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
        <div className="flex gap-13  my-4">
          {feedbackOptions.map((option) => (
            <div
              key={option.value}
              onClick={() => setSelected(option.value)}
              className={`flex flex-col items-center  cursor-pointer transition  hover:scale-103 ${
                selected === option.value
                  ? "scale-110 text-blue-600"
                  : "text-gray-500"
              }`}
            >
              <span className="text-4xl">{option.emoji}</span>
              <span className="mt-1 text-sm font-medium">{option.label}</span>
            </div>
          ))}
        </div>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", px: 3, gap: 2 }}>
        <Button  onClick={close}  variant="text" className="text-blue-500 text-sm">Cancel</Button>
        <Button variant="contained" color="warning" onClick={aggree}>
          Secure Logout
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SignOutModal;
