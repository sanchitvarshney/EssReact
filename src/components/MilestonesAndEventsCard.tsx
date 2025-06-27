import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import MilestonePage from "../pages/MilestonePage";

const MilestonesAndEventsCard: React.FC = () => {

  return (
    <Card
      elevation={2}
      sx={{
        maxWidth: 350,
        // maxHeight: 410,
        // flex:1,
        p: 2,
        borderRadius: 3,
        backgroundColor: "#ffffff",
      }}
      className="w-full"
    >
      <Typography variant="subtitle1" fontWeight="bold" pb={1}>
        Birthday and Anniversary
      </Typography>

      <CardContent sx={{ px: 0 }}>
        <div className="w-full ">
          <MilestonePage />
        </div>
      </CardContent>
    </Card>
  );
};

export default MilestonesAndEventsCard;
