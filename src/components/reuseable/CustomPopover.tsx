import React, { useEffect, useState } from "react";
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
  coneColor?: string;
}

const CustomPopover: React.FC<Props> = ({
  open,
  close,
  anchorEl,
  width,
  height,
  children,
  isCone,
  coneColor,
}) => {
  const [arrowLeft, setArrowLeft] = useState<number>(0);
  //  const theme = useTheme();
  //   const isSmallDevice = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (anchorEl?.current) {
      const anchorRect = anchorEl.current.getBoundingClientRect();

      const arrowOffset = 10;
      const calculatedLeft = anchorRect.width / 2 - arrowOffset;

      setArrowLeft(calculatedLeft);
    }
  }, [anchorEl, open]);

  return (
    <AnimatePresence>
      {open && (
        <Popover
        elevation={1}
          // disablePortal
          // tabIndex={-1}
          open={open}
          anchorEl={anchorEl?.current || null}
          onClose={close}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          disableAutoFocus
          disableEnforceFocus
          PaperProps={{
            style: {
              transformOrigin: "top",
              position: "relative",
              borderRadius: "6px",
              overflow: "visible",
            },
            sx: {
              mt: 2,
              width: width ? width : 400,
              height: height && height,
              // zIndex: 1600,
            },
          }}
        >
          {isCone && (
            <div
            className="hidden sm:block"
              style={{
                position: "absolute",
                top: "-11px",
                right: `${arrowLeft}px`,
                width: 0,
                height: 0,
                borderLeft: "12px solid transparent",
                borderRight: "12px solid transparent",
                borderBottom: `12px solid ${coneColor ? coneColor : "#fff"} `,
                zIndex: 5,
                
              }}
            />
          )}

          {children}
        </Popover>
      )}
    </AnimatePresence>
  );
};

export default CustomPopover;
