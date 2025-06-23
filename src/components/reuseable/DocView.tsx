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
}

const DocView: React.FC<Props> = ({
  open,
  close,
  anchorEl,
  width,
 
  children,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <Popover
          open={open}
          anchorEl={anchorEl?.current || null}
          onClose={close}
          anchorOrigin={{
            vertical: "center",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "center",
            horizontal: "right",
          }}
          disableAutoFocus
          disableEnforceFocus
          PaperProps={{
            style: {
              transformOrigin: "right",
              position: "relative",
              borderRadius: "2px",
              overflow: "visible",
            },
            sx: {
            
              width: width ? width : 800,
              height: "95vh",
              zIndex: 1600,
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
