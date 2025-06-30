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
import ReimbursementClaim from "./src/pages/ReimbursementClaim";
import PeripheralPage from "./src/pages/PeripheralPage";
import CreateTicketPage from "./src/pages/CreateTicketPage";
import ViewStatusTicketPage from "./src/pages/ViewStatusTicketPage";
import ReimbursementStatusPage from "./src/pages/ReimbursementStatusPage";
import ReimbursementGrantPage from "./src/pages/ReimbursementGrantPage";
import RecoverPassword from "./src/pages/RecoverPassword";
import Protected from "./src/routes/Protected";
import SignInScreen from "./src/pages/SignInScreen";
import TaskPage from "./src/pages/TaskPage";

export const route = createBrowserRouter([
  {
    path: "/",
    element: (
      <Protected>
        <MainLayout />
      </Protected>
    ),
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
        element: <SideMenuBar />,
        children: [
              {
            path: "task-box",
            element: <TaskPage />,
          },
          {
            path: "hr-policy",
            element: <PolicyPage />,
          },
          {
            path: "support-portal",
            element: <HelpPortal />,
          },
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
            path: "hr-documents",
            element: <DocumentsPage />,
          },
          {
            path: "self-service/leave-grant",
            element: <LeaveGrantPage />,
          },
          {
            path: "performance",
            element: <PerformancePage />,
          },
          {
            path: "reimbursement/claim",
            element: <ReimbursementClaim />,
          },
          {
            path: "recruitments",
            element: <RecruitmentsPage />,
          },
          {
            path: "peripheral",
            element: <PeripheralPage />,
          },
          {
            path: "/support-protal",
            element: <HelpPortal />,
          },
                 {
            path: "/support-protal/create-new-ticket",
            element: <CreateTicketPage />,
          },
                          {
            path: "/support-protal/ticket-status",
            element: <ViewStatusTicketPage />,
          },
          {
            path: "ticket-status",
            element: <ViewStatusTicketPage />,
          },
          {
            path: "reimbursement/status",
            element: <ReimbursementStatusPage />,
          },
          {
            path: "reimbursement/grant",
            element: <ReimbursementGrantPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/sign-in",
    element: (
      <Protected authentication={false}>
        <SignInScreen />
      </Protected>
    ),
  },
  {
    path: "/recover-password",

    element: (
      <Protected authentication={false}>
        <RecoverPassword />{" "}
      </Protected>
    ),
  },
  {
    path: "*",
    element: (
      <Protected >
        <Custom404Page />
      </Protected>
    ),
  },
]);
