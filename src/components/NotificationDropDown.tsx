import { Popover, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import NotificationContent from "./reuseable/NotificationContent";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
interface Props {
  open: boolean;
  close: () => void;
  anchorEl: any;
}

const NotificationDropDown: React.FC<Props> = ({ open, close, anchorEl }) => {
  return (
    <AnimatePresence>
      {open && (
        <Popover
          open={open}
          anchorEl={anchorEl?.current || null}
          onClose={close}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          disableAutoFocus
          disableEnforceFocus
          PaperProps={{
            component: motion.div,
            initial: { opacity: 0.1, y: -10, scaleY: 0.6 },
            animate: { opacity: 1, y: -5, scaleY: 1 },
            exit: { opacity: 0.2, y: -10, scaleY: 0.4 },
            transition: {
              duration: 0.1,
              ease: "easeOut",
              scaleY: { duration: 0.15 },
            },
            style: {
              transformOrigin: "top",
              position: "relative",

              borderRadius: "8px",

              overflow: "visible",
            },
            sx: {
              mt: 6,
              width: { sm: 300, md: 350, lg: 400 },
              height: 350,
            },
          }}
        >
          {/* Triangle/Cone pointing upward */}
          <div
            style={{
              position: "absolute",
              top: "-10px",
              right: "85px",
              width: 0,
              height: 0,
              borderLeft: "10px solid transparent",
              borderRight: "10px solid transparent",
              borderBottom: "10px solid #ffffff",
              zIndex: 5,
            }}
          />

          <>
            <div className="w-full flex justify-between items-center p-3 border-b-1 border-gray-700/40">
              <Typography sx={{ fontSize: 19, fontWeight: 600 }}>
                Notifications
              </Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                See All <ArrowForwardIcon sx={{fontSize:16}} />
              </Typography>
            </div>
            <NotificationContent
              title={"name"}
              message={"hii"}
              time={"9:23 am"}
            />
          </>
        </Popover>
      )}
    </AnimatePresence>
  );
};

export default NotificationDropDown;
