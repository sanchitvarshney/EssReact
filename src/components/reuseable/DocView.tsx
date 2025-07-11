import React from "react";
import { Popover } from "@mui/material";
import { AnimatePresence } from "framer-motion";

interface Props {
  open: boolean;
  close: () => void;
  anchorEl?: any;
  width?: string | number;
  height?: string | number;
  children: React.ReactNode;
  isCone?: boolean;
  vertical?:any
  horizontal?:any
  transformOrigin?:any
}

const DocView: React.FC<Props> = ({
  open,
  close,
  anchorEl,
  width,

  children,
    vertical="center",
  horizontal="right",
  transformOrigin="right"
}) => {
  return (
    <AnimatePresence>
      {open && (
        <Popover
        className="custom-scrollbar-for-menu"
          open={open}
          anchorEl={anchorEl?.current || null}
          onClose={close}
          anchorOrigin={{
            vertical: vertical,
            horizontal: horizontal,
          }}
          transformOrigin={{
            vertical: vertical,
            horizontal: horizontal,
          }}
          disableAutoFocus
          disableEnforceFocus
          PaperProps={{
            style: {
              transformOrigin: transformOrigin,
              margin: 0,
              borderRadius: "2px",
              overflow: "auto",
      
            },
            sx: {
              width: width ? width : 800,
              height: "95vh",
              zIndex: 1600,
              display:"flex",
              justifyContent:"center"
              
            },
          }}
        >
          {children}
        </Popover>
      )}
    </AnimatePresence>
  );
};

export default DocView;
