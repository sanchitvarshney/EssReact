import React from "react";
import { Card, Typography, IconButton, Chip, ButtonGroup } from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CustomToolTip from "./CustomToolTip";

type PolicyCardPropsType = {
  title?: string;
  open?:any
};
const PolicyCard: React.FC<PolicyCardPropsType> = ({
  title = "Code of Conduct of Employee",
  open
}) => {
  return (
    <Card
      elevation={2}
      sx={{
        maxWidth: 500,
        p: 2,
        borderRadius: 3,
        backgroundColor: "#ffffff",
      }}
    >
      <div className="w-full flex items-center justify-between">
        <Typography variant="subtitle1" fontWeight="bold">
          {title}
        </Typography>{" "}
        <ButtonGroup variant="outlined" aria-label="Basic button group">
          <CustomToolTip title={"View"} placement={"bottom"}>
            <IconButton onClick={open}>
              <VisibilityIcon sx={{ fontSize: 26, color: "#000" }} />
            </IconButton>
          </CustomToolTip>
          <CustomToolTip title={"Download"} placement={"bottom"}>
            <IconButton>
              <CloudDownloadIcon sx={{ fontSize: 26, color: "#000" }} />
            </IconButton>
          </CustomToolTip>
        </ButtonGroup>
      </div>

      <Chip
        label={"All Poilices"}
        size="small"
        sx={{
          background: "#2eacb3",
          color: "#fff",
          fontWeight: 600,
          fontSize: 12,
          px: 1,
          py: 2,
          height: 22,
          my: 2,
        }}
      />
      <Typography>Last Update: 2025-06-10</Typography>
    </Card>
  );
};

export default PolicyCard;
