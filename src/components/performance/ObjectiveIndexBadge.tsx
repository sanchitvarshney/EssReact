import { memo } from "react";
import { Box } from "@mui/material";

const ObjectiveIndexBadge = memo(({ index }: { index: number }) => (
  <Box
    sx={{
      width: 26,
      height: 26,
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#e0f6f6",
      color: "#007f86",
      fontSize: 12,
      fontWeight: 700,
    }}
  >
    {index}
  </Box>
));

ObjectiveIndexBadge.displayName = "ObjectiveIndexBadge";

export default ObjectiveIndexBadge;
