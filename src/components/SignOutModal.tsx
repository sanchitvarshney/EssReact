import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

import DialogTitle from "@mui/material/DialogTitle";
import { Avatar } from "@mui/material";

interface SignOutModalProps {
  // open?: boolean;
  close?: () => void;
  // aggree?: () => void;
  // title?: string;
  // description?: string;
}
const SignOutModal: React.FC<SignOutModalProps> = ({
  // open,
  close,
  // title,
  // description,
  // aggree,
}) => {
      const [selected, setSelected] = React.useState<string | null>(null);


  const handleSubmit = () => {
    // if (selected && onSubmit) {
    //   onSubmit(selected, dontShow);
    // }
  };

  const feedbackOptions = [
    { emoji: "😞", label: "Poor", value: "poor" },
    { emoji: "🙂", label: "Good", value: "good" },
    { emoji: "😄", label: "Excellent", value: "excellent" },
  ];
  return (
    <Dialog
      open={true}
      onClose={close}
      PaperProps={{
 sx: {
  overflow: "visible",
  borderRadius: 3,
  p: 3,
  pt: 6,
  minWidth: 500,
  border: "3px solid #000000",
  background: "linear-gradient(to bottom , #ecfcfdff, #e8f7f8ff)",
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
          border: "3px solid #000000",
          backgroundColor: "#e3e1e1",
        }}
      />

      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
        How was Alexa's support?!
      </DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div className="flex gap-13  my-4">
          {feedbackOptions.map((option) => (
            <div
              key={option.value}
              onClick={() => setSelected(option.value)}
              className={`flex flex-col items-center  cursor-pointer transition  hover:scale-103 ${
                selected === option.value ? "scale-110 text-blue-600" : "text-gray-500"
              }`}
            >
              <span className="text-4xl">{option.emoji}</span>
              <span className="mt-1 text-sm font-medium">{option.label}</span>
            </div>
          ))}
        </div>

     
      </DialogContent>

      <DialogActions sx={{ justifyContent: "flex-end", px: 3 }}>
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SignOutModal;
