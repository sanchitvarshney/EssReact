import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./src/layouts/MainLayout";
import HolidayPage from "./src/components/HolidayPage";
import Custom404Page from "./src/pages/Custom404Page";
import LeavePage from "./src/pages/LeavePage";
import SideMenuBar from "./src/components/sidemenubar/SideMenuBar";
import AttendancePage from "./src/pages/AttendancePage";
import LeaveStatusPage from "./src/pages/LeaveStatusPage";
import WFHPage from "./src/pages/WFHPage";
import PaySlipPage from "./src/pages/PaySlipPage";
import HierarchyChart from "./src/pages/HierarchyChart";
import AnnouncementPage from "./src/pages/AnnouncementPage";
import HomePage from "./src/pages/HomePage";

export const route = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // This layout includes <Header /> and <Outlet />
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        element: <SideMenuBar />, // This includes <SideMenuBar /> and <Outlet />
        children: [
          {
            path: "self-service/attendance",
            element: <AttendancePage />,
          },
          {
            path: "calendar",
            element: <HolidayPage />,
          },
          {
            path: "self-service/apply-leave",
            element: <LeavePage />,
          },
          {
            path: "self-service/leave-status",
            element: <LeaveStatusPage />,
          },
          {
            path: "self-service/wfh",
            element: <WFHPage />,
          },
          {
            path: "self-service/payslip",
            element: <PaySlipPage />,
          },
          {
            path: "home/announcement",
            element: <AnnouncementPage />,
          },
          {
            path: "home/hierarchy",
            element: <HierarchyChart />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Custom404Page />,
  },
]);
