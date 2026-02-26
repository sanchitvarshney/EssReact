import {
  Drawer,
  Typography,
  Button,
  Backdrop,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ShieldCheck, Info, ArrowRight } from "lucide-react";

interface CyberAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

// Styled custom backdrop with blur
const StyledBackdrop = styled(Backdrop)({
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(2px)",
  WebkitBackdropFilter: "blur(2px)",
});

const CyberAlertDialog: React.FC<CyberAlertDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
}) => {
  return (
    <Drawer
      anchor="top"
      open={open}
      onClose={(__, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") return;
        onOpenChange(false);
      }}
      ModalProps={{
        BackdropComponent: StyledBackdrop,
      }}
      SlideProps={{
        timeout: 1000, 
      }}
      PaperProps={{
        sx: {
          p: 4,
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
          maxHeight: "70vh",
          overflowY: "auto",
          willChange: "transform",
        },
      }}
    >
      <div className="flex items-center space-x-3 text-[#2eacb3] mb-4">
        <ShieldCheck className="h-8 w-8" />
        <Typography variant="h5" fontWeight="bold">
          Important - Cyber Alert & Prevention
        </Typography>
      </div>
      <Divider sx={{mb:2}} />

      <div className="flex flex-col gap-6 max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Section 1 */}
        <div className="bg-gradient-to-r from-[#2eacb3]/10 to-transparent p-6 rounded-xl">
          <div className="flex items-center space-x-3 mb-4">
            <Info className="h-6 w-6 text-[#2eacb3]" />
            <Typography variant="h6">Cybersecurity Measures</Typography>
          </div>
          <ul className="space-y-3 text-gray-600">
            {[
              "Avoid downloading unverified attachments or clicking on unknown links.",
              "Use strong and unique passwords.",
              "Regularly update your passwords.",
              "Enable multi-factor authentication (MFA).",
              "Report suspicious activity immediately.",
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
            <Typography variant="h6">
              Why Windows Updates are Important
            </Typography>
          </div>
          <ul className="space-y-3 text-gray-600">
            {[
              "Security patches fix vulnerabilities.",
              "Performance enhancements improve speed.",
              "Bug fixes resolve system issues.",
              "New features expand functionality.",
            ].map((text, idx) => (
              <li key={idx} className="flex items-start">
                <ArrowRight className="h-5 w-5 mr-2 mt-0.5 text-[#2eacb3]" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>

      
      </div>
      <Divider sx={{my:2}} />
        <div className="flex justify-start">
          <Button
            onClick={onConfirm}
            variant="contained"
            sx={{
              width: 150,
              backgroundColor: "#2eacb3",
              "&:hover": { backgroundColor: "#279aa0" },
              px: 2,
              py: 1.2,
              fontWeight: "bold",
              fontSize: "1rem",
              borderRadius: 2,
            }}
            endIcon={<ArrowRight className="h-5 w-5" />}
          >
            Continue
          </Button>
        </div>
    </Drawer>
  );
};

export default CyberAlertDialog;
