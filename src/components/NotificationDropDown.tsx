import { Popover, MenuItem, Typography } from "@mui/material";
import { motion } from "framer-motion";


interface Props {
  open: boolean;
  close: () => void;
  anchorEl: any;
}


const NotificationDropDown: React.FC<Props> = ({ open, close, anchorEl }) => {
  return (
 
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
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -30 },
        transition: { duration: 0.4, ease: [0.25, 0.8, 0.25, 1] },
        sx: {
          mt: 6,
          width: 300,
          height: 400,
          p: 2,
        },
      }}
    >
   
        <Typography variant="subtitle1" sx={{ textAlign: "center", mb: 1 }}>
          NotificationDropDown
        </Typography>
        <MenuItem onClick={close}>Item 1</MenuItem>
        <MenuItem onClick={close}>Item 2</MenuItem>
     
      <MenuItem onClick={close}>Item 3</MenuItem>
   
    </Popover>
  
  );
};

export default NotificationDropDown;
