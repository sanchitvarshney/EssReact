import { Avatar, Box, Divider, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import EmployeeHierarchyPage from "../components/EmployeeHierarchyPage";
import EmployeeInformationPage from "../components/EmployeeInformationPage";

const EmployeeProfilePage = () => {
  const [value, setValue] = useState("info");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    console.log(event);
  };
  return (
    <div className="w-full h-[calc(100vh-90px)] p-4">
      <div className="w-200  px-3 py-6 m-auto flex  items-center gap-15">
        <Avatar sx={{ width: 140, height: 140 }} />
        <div>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Rahul Mehra (EMP-1003)
          </Typography>
          <Typography variant="h6">Assistant Manager</Typography>
          <Typography variant="h6">Marketing</Typography>
          <Typography variant="h6"></Typography>
        </div>
      </div>
      <Divider sx={{ marginTop: 2 }} />
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          padding: 2,
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
        >
          <Tab value="info" label="Information" />
          <Tab value="chart" label="Hierarchy" />
        </Tabs>
      </Box>
      <div className="w-full">
        {value === "info" ? (
          <EmployeeInformationPage />
        ) : (
          <EmployeeHierarchyPage />
        )}
      </div>
    </div>
  );
};

export default EmployeeProfilePage;
