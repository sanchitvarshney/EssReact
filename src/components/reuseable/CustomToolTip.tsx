import {
  styled,
  Tooltip,
  tooltipClasses,
  type TooltipProps,
} from "@mui/material";
import React from "react";

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip
    PopperProps={{
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, -5], // [horizontal, vertical] distance from the anchor
          },
        },
      ],
    }}
    {...props}
    classes={{ popper: className }}
    arrow // Enable arrow
  />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
    color: "#fff",
    boxShadow: theme.shadows[2],
    fontSize: 12,
    fontWeight:"bold"
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black, // Match arrow color with tooltip background
  },
}));

type Props = {
  children: React.ReactElement | any;
  title: string;
  placement:
    | "bottom"
    | "left"
    | "right"
    | "top"
    | "bottom-end"
    | "bottom-start"
    | "left-end"
    | "left-start"
    | "right-end"
    | "right-start"
    | "top-end"
    | "top-start"
    | undefined;
};

const CustomToolTip: React.FC<Props> = ({
  children,
  title = "Tooltip",
  placement = "right",
}) => {
  return (
    <LightTooltip title={title} placement={placement}>
      {children}
    </LightTooltip>
  );
};

export default CustomToolTip;
