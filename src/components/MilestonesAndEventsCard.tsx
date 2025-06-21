import React, { useState } from "react";
import { Card, CardContent, Tab, Tabs, Typography } from "@mui/material";
import MilestonePage from "../pages/MilestonePage";

const MilestonesAndEventsCard: React.FC = () => {
  const [value, setValue] = useState("milestone");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    console.log(event);
  };
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
        Milestones And Events
      </Typography>

      <Tabs
        value={value}
        onChange={handleChange}
        TabIndicatorProps={{
          style: {
            backgroundColor: "#2eacb3",
          },
        }}
        textColor="inherit"
        sx={{
          "& .MuiTab-root": {
            color: "#333",
          },
          "& .Mui-selected": {
            color: "#2eacb3",
          },
        }}
      >
        <Tab
          value="milestone"
          label="Milestones"
          sx={{ fontSize: 15, fontWeight: "medium" }}
        />
        <Tab
          value="event"
          label="Events"
          sx={{ fontSize: 15, fontWeight: "medium" }}
        />
      </Tabs>
      <CardContent sx={{ px: 0 }}>
        <div className="w-full ">
          {value === "milestone" ? (
            <MilestonePage />
          ) : (
            //   <EmployeeHierarchyPage />
            <h1>Events</h1>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MilestonesAndEventsCard;
