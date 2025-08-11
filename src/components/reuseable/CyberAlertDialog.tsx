import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Backdrop,
  Button,
  Typography,
} from "@mui/material";
import { ShieldCheck, Info, ArrowRight } from "lucide-react";
import { styled } from "@mui/system";

interface CyberAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

// Styled custom backdrop with blur
const StyledBackdrop = styled(Backdrop)({
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(5px)",
  WebkitBackdropFilter: "blur(5px)",
});

const CyberAlertDialog: React.FC<CyberAlertDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
}) => {
  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        console.log(event);
        // Prevent closing on backdrop click or Escape key
        if (reason === "backdropClick" || reason === "escapeKeyDown") return;
        onOpenChange(false);
      }}
      maxWidth="lg"
      fullWidth
      BackdropComponent={StyledBackdrop}
      PaperProps={{
        sx: {
          p: 4,
          borderRadius: 2,
          maxHeight: "70vh",
          overflowY: "auto",
          willChange: "transform",
        },
      }}
    >
      <DialogTitle>
        <div className="flex items-center space-x-3 text-[#2eacb3]">
          <ShieldCheck className="h-8 w-8" />
          <Typography variant="h5" fontWeight="bold">
            Important - Cyber Alert & Prevention
          </Typography>
        </div>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{ display: "flex", flexDirection: "column", gap: 4 }}
      >
        {/* Section 1 */}
        <div className="bg-gradient-to-r from-[#2eacb3]/10 to-transparent p-6 rounded-xl">
          <div className="flex items-center space-x-3 mb-4">
            <Info className="h-6 w-6 text-[#2eacb3]" />
            <Typography variant="h6" color="textPrimary">
              Cybersecurity Measures
            </Typography>
          </div>
          <ul className="space-y-3 text-gray-600">
            {[
              "Avoid downloading unverified attachments or clicking on unknown links. These can contain malware or lead to phishing websites.",
              "Use strong and unique passwords that include a mix of upper and lower-case letters, numbers, and special characters.",
              "Regularly update your passwords and avoid reusing old ones.",
              "Enable multi-factor authentication (MFA) where possible for extra security.",
              "Report any suspicious activity to the IT department immediately.",
            ].map((text, idx) => (
              <li key={idx} className="flex items-start">
                <ArrowRight className="h-5 w-5 mr-2 mt-0.5 text-[#2eacb3]" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 2 */}
        <div className="bg-gradient-to-r from-[#2eacb3]/10 to-transparent p-6 rounded-xl">
          <div className="flex items-center space-x-3 mb-4">
            <Info className="h-6 w-6 text-[#2eacb3]" />
            <Typography variant="h6" color="textPrimary">
              Why Windows Updates are Important
            </Typography>
          </div>
          <ul className="space-y-3 text-gray-600">
            {[
              "Security Patches: These updates address vulnerabilities that hackers can exploit.",
              "Performance Enhancements: Updates often include optimizations for system speed and responsiveness.",
              "Bug Fixes: Microsoft continually works to identify and fix system issues.",
              "New Features: Some updates introduce new functionalities to expand your system's capabilities.",
            ].map((text, idx) => (
              <li key={idx} className="flex items-start">
                <ArrowRight className="h-5 w-5 mr-2 mt-0.5 text-[#2eacb3]" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-center">
          <Button
            onClick={onConfirm}
            variant="contained"
            sx={{
              width: 150,
              backgroundColor: "#2eacb3",
              "&:hover": {
                backgroundColor: "#279aa0",
              },
              px: 4,
              py: 1.5,
              fontWeight: "bold",
              fontSize: "1rem",
              borderRadius: 2,
            }}
            endIcon={<ArrowRight className="h-5 w-5" />}
          >
            I Agree
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CyberAlertDialog;
