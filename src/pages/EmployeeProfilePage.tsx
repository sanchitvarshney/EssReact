import { Avatar, Box, Divider, Tab, Tabs, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import EmployeeHierarchyPage from "../components/EmployeeHierarchyPage";
import EmployeeInformationPage from "../components/EmployeeInformationPage";

import ChangePasswordScreen from "./ChangePasswordScreen";
import { useGetuserdataMutation } from "../services/auth";
import { useAuth } from "../contextapi/AuthContext";

import { useToast } from "../hooks/useToast";
import EmployeeProfilePageSkeleton from "../skeleton/EmployeeProfilePageSkeleton";
// import { useNavigate } from "react-router-dom";

const EmployeeProfilePage = () => {
  // const navigate= useNavigate()
  const { showToast } = useToast();
  const [value, setValue] = useState("password");
  const [editMode, setEditMode] = useState(false);
  const { user } = useAuth();
  const [getuserdata, { isLoading, data, error }] = useGetuserdataMutation();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    // If tab changes, exit edit mode
    console.log(event);
    setEditMode(false);
  };

  const fetchUserDetails = async () => {
    //@ts-ignore
    await getuserdata({ logedINUser: user?.id }).unwrap();
  };

  useEffect(() => {
    if (user) {
      fetchUserDetails();
    }
  }, [user]);
  useEffect(() => {
    if (error) {
      // Fallback error message
      const errorMsg =
      //@ts-ignore
        error?.data?.message ||
        "We're Sorry An unexpected error has occured. Our technical staff has been automatically notified and will be looking into this with utmost urgency. while fetching user data.";
      showToast(errorMsg, "error");
    }
  }, [error]);
  return (
    <div className="w-full h-[calc(100vh-90px)]  overflow-y-auto p-4 will-change-transform bg-white">
      {isLoading ? (
        <EmployeeProfilePageSkeleton />
      ) : (
        <>
          <div className="w-[100%] sm:w-[80%] px-4 py-6 m-auto flex justify-between ">
            <div className="flex items-center gap-x-15 gap-y-8 flex-wrap  ">
              <div>
         
                <Avatar
                  //@ts-ignore
                  src={user?.imgUrl}
                  //@ts-ignore
                  alt={user?.name}
                  sx={{ width: 140, height: 140, backgroundColor: "#2eacb3",           pointerEvents: "none",
                      userSelect: "none", }}
                />
              </div>

              <div>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {/* @ts-ignore */}
                  {`${user?.name} (${user?.id}) `}
                </Typography>
                {/* @ts-ignore */}
                <Typography variant="subtitle2">{user?.role}</Typography>
                {/* @ts-ignore */}
                <Typography variant="subtitle2">{user?.dept}</Typography>
              </div>
            </div>
          </div>
          <Divider sx={{ marginTop: 1 }} />
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
              <EmployeeInformationPage editMode={editMode} data={data} />
            ) : value === "password" ? (
              <ChangePasswordScreen />
            ) : (
              //@ts-ignore
              <EmployeeHierarchyPage  userId={user?.id}/>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default EmployeeProfilePage;
