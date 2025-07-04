import { Avatar, Box, Divider, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import EmployeeHierarchyPage from "../components/EmployeeHierarchyPage";
import EmployeeInformationPage from "../components/EmployeeInformationPage";
import { CustomButton } from "../components/ui/CustomButton";
import ChangePasswordScreen from "./ChangePasswordScreen";
// import { useNavigate } from "react-router-dom";

const EmployeeProfilePage = () => {
  // const navigate= useNavigate()
  const [value, setValue] = useState("info");
  const [editMode, setEditMode] = useState(false);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    // If tab changes, exit edit mode
    console.log(event);
    setEditMode(false);
  };
  return (
    <div className="w-full h-[calc(100vh-90px)]  overflow-y-auto p-4">
      <div className="w-[100%] sm:w-[80%] px-4 py-6 m-auto flex justify-between ">
        <div className="flex items-center gap-x-15 gap-y-8 flex-wrap  ">
          <div>
            {" "}
            <Avatar
              sx={{ width: 140, height: 140, backgroundColor: "#2eacb3" }}
            />
          </div>

          <div>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Rahul Mehra (EMP-1003)
            </Typography>
            <Typography variant="h6">Assistant Manager</Typography>
            <Typography variant="h6">Marketing</Typography>
            <Typography variant="h6"></Typography>
          </div>
        </div>
        {value === "info" && (
          <div className="flex  inline-block">
            {!editMode &&          <CustomButton
              className={`bg-gray-900 text-white  hover:bg-gray-800/80 cursor-pointer`}
              onClick={() => setEditMode((prev) => !prev)}
             
            >
              Edit Profile
            </CustomButton>}
  
            {editMode &&  <CustomButton
              className="bg-gray-900 text-white ml-4  hover:bg-gray-800/80 cursor-pointer"
              onClick={() => setEditMode((prev) => !prev)}
            >
              Cancel
            </CustomButton>}
          </div>
        )}
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
            value="info"
            label="Information"
            sx={{ fontSize: 16, fontWeight: "medium" }}
          />
          <Tab
            value="chart"
            label="Hierarchy"
            sx={{ fontSize: 16, fontWeight: "medium" }}
          />
          <Tab
            value="password"
            label="Change Password"
            sx={{ fontSize: 16, fontWeight: "medium" }}
          />
        </Tabs>
      </Box>
      <div className="w-full ">
        {value === "info" ? (
          <EmployeeInformationPage editMode={editMode} />
        ) : value === "password" ? (
          <ChangePasswordScreen />
        ) : (
          <EmployeeHierarchyPage />
        )}
      </div>
    </div>
  );
};

export default EmployeeProfilePage;
