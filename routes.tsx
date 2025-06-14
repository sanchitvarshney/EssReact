import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./src/layouts/MainLayout";
import HolidayPage from "./src/components/HolidayPage";
import Custom404Page from "./src/pages/Custom404Page";

import LeavePage from "./src/pages/LeavePage";
import SideMenuBar from "./src/components/sidemenubar/SideMenuBar";
import Dashboard from "./src/pages/Dashboard";

import AttendancePage from "./src/pages/AttendancePage";

import LeaveStatusPage from "./src/pages/LeaveStatusPage";
import WFHPage from "./src/pages/WFHPage";
import PaySlipPage from "./src/pages/PaySlipPage";
import HierarchyChart from "./src/pages/HierarchyChart";
import AnnouncementPage from "./src/pages/AnnouncementPage";


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
    path: "/self-service/attendance",
    element: (
      <MainLayout>
        <SideMenuBar>
          <AttendancePage />
        </SideMenuBar>
      </MainLayout>
    ),
  },
    
  {
    path: "/calendar",
    element: (
      <MainLayout>
        <SideMenuBar>
          <HolidayPage />
        </SideMenuBar>
      </MainLayout>
    ),
  },
  {
    path: "/self-service/apply-leave",
    element: (
      <MainLayout>
        <SideMenuBar>
          <LeavePage />
        </SideMenuBar>
      </MainLayout>
    ),
  },
    {
    path: "/self-service/leave-status",
    element: (
      <MainLayout>
        <SideMenuBar>
          <LeaveStatusPage />
        </SideMenuBar>
      </MainLayout>
    ),
  },
     {
    path: "/self-service/wfh",
    element: (
      <MainLayout>
        <SideMenuBar>
          <WFHPage />
        </SideMenuBar>
      </MainLayout>
    ),
  },

       {
    path: "/self-service/payslip",
    element: (
      <MainLayout>
        <SideMenuBar>
          <PaySlipPage />
        </SideMenuBar>
      </MainLayout>
    ),
  },
         {
    path: "/home/announcement",
    element: (
      <MainLayout>
        <SideMenuBar>
          <AnnouncementPage />
        </SideMenuBar>
      </MainLayout>
    ),
  },
       {
    path: "/home/hierarchy",
    element: (
      <MainLayout>
        <SideMenuBar>
          <HierarchyChart />
        </SideMenuBar>
      </MainLayout>
    ),
  },

  {
    path: "*",
    element: <Custom404Page />,
  },
]);
