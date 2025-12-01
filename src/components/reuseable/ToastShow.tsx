// import * as React from "react";
// import Box from "@mui/material/Box";
// import Snackbar from "@mui/material/Snackbar";
// import Slide from "@mui/material/Slide";
// import type { SlideProps } from "@mui/material/Slide";
// import { Alert, Typography } from "@mui/material";

// interface ToastShowProps {
//   isOpen: boolean;
//   msg: string;
//   onClose?: () => void;
//   type: "success" | "error";
// }

// // Slide direction function
// function SlideTransition(props: SlideProps) {
//   return <Slide {...props} direction="up" />;
// }

// const ToastShow: React.FC<ToastShowProps> = ({
//   isOpen,
//   msg,
//   onClose,
//   type = "success",
// }) => {
//   return (
//     <Box sx={{ width: 500 }}>
//       <Snackbar
//         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//         open={isOpen}
//         autoHideDuration={5000}
//         onClose={onClose}
//         TransitionComponent={SlideTransition}
//         key={"bottom" + "center"}
//       >
//         {/* <Alert onClose={onClose} severity={type} sx={{ width: "100%" }}>
//           {msg}
//         </Alert> */}
//         <Typography variant="subtitle2" sx={{ color: "white" ,bgcolor:type === "success" ? "success.main" : "error.main", px: 2, py:2}}>{msg}</Typography>
//       </Snackbar>
//     </Box>
//   );
// };

// export default ToastShow;


import * as React from "react";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";
import type { SlideProps } from "@mui/material/Slide";
import { Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { keyframes } from "@emotion/react";
import { Cross2Icon } from "@radix-ui/react-icons";

interface ToastShowProps {
  isOpen: boolean;
  msg: string;
  onClose?: () => void;
  type: "success" | "error";
}

// Slide direction function
function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

// Animation (scale bounce)
const bounce = keyframes`
  0% { transform: scale(0.5); opacity: 0; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); }
`;

const ToastShow: React.FC<ToastShowProps> = ({
  isOpen,
  msg,
  onClose,
  type = "success",
}) => {
  const Icon = type === "success" ? CheckCircleIcon : ErrorIcon;

  return (
    <Box sx={{ width: 500, zIndex:130000 }}>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={isOpen}
        autoHideDuration={5000}
        onClose={onClose}
        TransitionComponent={SlideTransition}
        key={"bottom" + "center"}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: type === "success" ? "success.main" : "error.main",
            color: "white",
            px: 2,
            py: 1.5,
            borderRadius: 1,
          }}
        >
          <Icon
            sx={{
              mr: 1.5,
              fontSize: 24,
              animation: `${bounce} 0.6s ease`,
            }}
          />
          <Typography variant="subtitle2">{msg}</Typography>
           <Cross2Icon className="w-4 h-4 ml-2 cursor-pointer " onClick={onClose} />
        </Box>
      </Snackbar>
    </Box>
  );
};

export default ToastShow;
