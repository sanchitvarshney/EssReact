import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./src/layouts/MainLayout";
import HolidayPage from "./src/components/HolidayPage";
import Custom404Page from "./src/pages/Custom404Page";

import LeavePage from "./src/pages/LeavePage";
import SideMenuBar from "./src/components/sidemenubar/SideMenuBar";
import Dashboard from "./src/pages/Dashboard";
import CustomCalender from "./src/components/CustomCalender";

export const route = createBrowserRouter([
  {
    path: "/",
    element: (
      <MainLayout>
        <SideMenuBar>
         <Dashboard />
        </SideMenuBar>
      </MainLayout>
    ),
  },
    {
    path: "/calender",
    element: (
      <MainLayout>
        <SideMenuBar>
         <CustomCalender />
        </SideMenuBar>
      </MainLayout>
    ),
  },
  { path: "/holidays", element: (<MainLayout>
        <SideMenuBar>
         <HolidayPage />
        </SideMenuBar>
      </MainLayout>) },
  { path: "/leave", element:  (<MainLayout>
        <SideMenuBar>
       <LeavePage />
        </SideMenuBar>
      </MainLayout>) },

  {
    path: "*",
    element: <Custom404Page />,
  },
]);
