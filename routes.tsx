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
import EmployeeProfilePage from "./src/pages/EmployeeProfilePage";

import PolicyPage from "./src/pages/PolicyPage";
import DocumentsPage from "./src/pages/DocumentsPage";
import LeaveGrantPage from "./src/pages/LeaveGrantPage";

import HelpPortal from "./src/pages/HelpPortal";
import RecruitmentsPage from "./src/pages/RecruitmentsPage";
import PerformancePage from "./src/pages/PerformancePage";

export const route = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "manage-account",
        element: <EmployeeProfilePage />,
      },
      {
        path: "hr-policy",
        element: <PolicyPage />,
      },
      {
        path: "/support-protal",
        element: <HelpPortal />,
      },
      {
        element: <SideMenuBar />,
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
            path: "vibe",
            element: <AnnouncementPage />,
          },
          {
            path: "home/hierarchy",
            element: <HierarchyChart />,
          },
          {
            path: "/hr-documents",
            element: <DocumentsPage />,
          },
          {
            path: "/self-service/leave-grant",
            element: <LeaveGrantPage />,
          },
                  {
            path: "/performance",
            element: <PerformancePage />,
          },
        ],
      },
      {
        path: "/recruitments",
        element: <RecruitmentsPage />,
      },
    ],
  },
  {
    path: "*",
    element: <Custom404Page />,
  },
]);
