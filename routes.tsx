import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter, useParams } from "react-router-dom";
import SideMenuBar from "./src/components/sidemenubar/SideMenuBar";
import Protected from "./src/routes/Protected";
import FallBackUi from "./src/pages/errorBoundary/FallBackUi";
import MainLayout from "./src/layouts/MainLayout";
import McGuardLayout from "./src/mscguard/layouts/McGuardLayout";
import McGuardProtected from "./src/mscguard/routes/McGuardProtected";
import { HierarchyProvider } from "./src/contextapi/hierarchyProvider";
import DotLoading from "./src/components/reuseable/DotLoading";

// Every page is its own chunk, so the first paint only downloads what the current route needs.
const HolidayPage = lazy(() => import("./src/components/HolidayPage"));
const Custom404Page = lazy(() => import("./src/pages/Custom404Page"));
const LeavePage = lazy(() => import("./src/pages/LeavePage"));
const AttendancePage = lazy(() => import("./src/pages/AttendancePage"));
const TeamAttendancePage = lazy(() => import("./src/pages/TeamAttendancePage"));
const TeamMemberAttendancePage = lazy(() => import("./src/pages/TeamMemberAttendancePage"));
const ReimbursementPage = lazy(() => import("./src/pages/ReimbursementPage"));
const LoanPage = lazy(() => import("./src/pages/LoanPage"));
const GatePassPage = lazy(() => import("./src/pages/GatePassPage"));
const PreApprovalPage = lazy(() => import("./src/pages/PreApprovalPage"));
const LeaveStatusPage = lazy(() => import("./src/pages/LeaveStatusPage"));
const WFHPage = lazy(() => import("./src/pages/WFHPage"));
const PaySlipPage = lazy(() => import("./src/pages/PaySlipPage"));
const HierarchyChart = lazy(() => import("./src/pages/HierarchyChart"));
const AnnouncementPage = lazy(() => import("./src/pages/AnnouncementPage"));
const HomePage = lazy(() => import("./src/pages/HomePage"));
const EmployeeProfilePage = lazy(() => import("./src/pages/EmployeeProfilePage"));
const PolicyPage = lazy(() => import("./src/pages/PolicyPage"));
const DocumentsPage = lazy(() => import("./src/pages/DocumentsPage"));
const LeaveGrantPage = lazy(() => import("./src/pages/LeaveGrantPage"));
const HelpPortal = lazy(() => import("./src/pages/HelpPortal"));
const RecruitmentsPage = lazy(() => import("./src/pages/RecruitmentsPage"));
const PerformancePage = lazy(() => import("./src/pages/PerformancePage"));
const ReimbursementClaim = lazy(() => import("./src/pages/ReimbursementClaim"));
const PeripheralPage = lazy(() => import("./src/pages/PeripheralPage"));
const CreateTicketPage = lazy(() => import("./src/pages/CreateTicketPage"));
const ReimbursementStatusPage = lazy(() => import("./src/pages/ReimbursementStatusPage"));
const ReimbursementGrantPage = lazy(() => import("./src/pages/ReimbursementGrantPage"));
const RecoverPassword = lazy(() => import("./src/pages/RecoverPassword"));
const TwoFactorAuthPage = lazy(() => import("./src/pages/TwoFactorAuthPage"));
const SignInScreen = lazy(() => import("./src/pages/SignInScreen"));
const WebAccessBlockedPage = lazy(() => import("./src/pages/WebAccessBlockedPage"));
const TaskPage = lazy(() => import("./src/pages/TaskPage"));
const EmployeeDetails = lazy(() => import("./src/pages/EmployeeDetails"));
const GatepassRequestPage = lazy(() => import("./src/pages/GatepassRequestPage"));
const VisitorInvitePage = lazy(() => import("./src/pages/VisitorInvitePage"));
const VisitorSelfRegisterEntryPage = lazy(() => import("./src/pages/VisitorSelfRegisterEntryPage"));
const Login = lazy(() => import("./src/mscguard/pages/Login"));
const Dashboard = lazy(() => import("./src/mscguard/pages/Dashboard"));
const GatepassApprovals = lazy(() => import("./src/mscguard/pages/GatepassApprovals"));
const MaterialApprovals = lazy(() => import("./src/mscguard/pages/MaterialApprovals"));
const PreApprovals = lazy(() => import("./src/mscguard/pages/PreApprovals"));
const Attendance = lazy(() => import("./src/mscguard/pages/Attendance"));
const EmployeeCodes = lazy(() => import("./src/mscguard/pages/EmployeeCodes"));
const EmpHierarchy = lazy(() => import("./src/mscguard/pages/EmpHierarchy"));
const Analytics = lazy(() => import("./src/mscguard/pages/Analytics"));
const AdvancedSearch = lazy(() => import("./src/mscguard/pages/AdvancedSearch"));
const Reports = lazy(() => import("./src/mscguard/pages/Reports"));
const Guards = lazy(() => import("./src/mscguard/pages/Guards"));
const McGuardSettings = lazy(() => import("./src/mscguard/pages/Settings"));

const RouteFallback = () => (
  <div className="w-full h-full min-h-[60vh] flex items-center justify-center">
    <DotLoading />
  </div>
);

const withSuspense = (node: ReactNode) => <Suspense fallback={<RouteFallback />}>{node}</Suspense>;

const EmployeeDetailsRoute = () => {
  const { empCode } = useParams();
  return (
    <HierarchyProvider key={empCode}>
      <EmployeeDetails />
    </HierarchyProvider>
  );
};

export const route = createBrowserRouter([
  {
    path: "/",
    element: (
      <Protected>
        <MainLayout />
      </Protected>
    ),
    errorElement: <FallBackUi />,
    children: [
      {
        index: true,
        element: withSuspense(<HomePage />),
      },

      {
        element: <SideMenuBar />,
        children: [
          {
            path: "task-box",
            element: withSuspense(<TaskPage />),
          },
          {
            path: "manage-account",
            element: withSuspense(
              <HierarchyProvider>
                <EmployeeProfilePage />
              </HierarchyProvider>,
            ),
          },

          {
            path: "hr-policy",
            element: withSuspense(<PolicyPage />),
          },
          {
            path: "support-portal",
            element: withSuspense(<HelpPortal />),
          },
          {
            path: "attendance",
            element: withSuspense(<AttendancePage />),
          },
          {
            path: "team-attendance",
            element: withSuspense(<TeamAttendancePage />),
          },
          {
            path: "team-attendance/:empCode",
            element: withSuspense(<TeamMemberAttendancePage />),
          },
          {
            path: "calendar",
            element: withSuspense(<HolidayPage />),
          },
          {
            path: "self-service/apply-leave",
            element: withSuspense(<LeavePage />),
          },
          {
            path: "self-service/leave-status",
            element: withSuspense(<LeaveStatusPage />),
          },
          {
            path: "self-service/wfh",
            element: withSuspense(<WFHPage />),
          },
          {
            path: "payroll",
            element: withSuspense(<PaySlipPage />),
          },
          {
            path: "vibe",
            element: withSuspense(<AnnouncementPage />),
          },
          {
            path: "home/hierarchy",
            element: withSuspense(
              <HierarchyProvider>
                <HierarchyChart />
              </HierarchyProvider>,
            ),
          },
          {
            path: "hr-documents",
            element: withSuspense(<DocumentsPage />),
          },
          {
            path: "self-service/leave-grant",
            element: withSuspense(<LeaveGrantPage />),
          },
          {
            path: "kra",
            element: withSuspense(<PerformancePage />),
          },
          {
            path: "reimbursement",
            element: withSuspense(<ReimbursementPage />),
          },
          {
            path: "loan",
            element: withSuspense(<LoanPage />),
          },
          {
            path: "gate-pass",
            element: withSuspense(<PreApprovalPage />),
          },
          {
            path: "gate-pass/out-pass",
            element: withSuspense(<GatePassPage />),
          },
          {
            path: "reimbursement/claim",
            element: withSuspense(<ReimbursementClaim />),
          },
          {
            path: "recruitments",
            element: withSuspense(<RecruitmentsPage />),
          },
          {
            path: "peripheral",
            element: withSuspense(<PeripheralPage />),
          },
          {
            path: "support-portal/create-new-ticket",
            element: withSuspense(<CreateTicketPage />),
          },
          {
            path: "reimbursement/status",
            element: withSuspense(<ReimbursementStatusPage />),
          },
          {
            path: "reimbursement/grant",
            element: withSuspense(<ReimbursementGrantPage />),
          },
          {
            path: "employee/details/:empCode",
            element: withSuspense(<EmployeeDetailsRoute />),
          },
        ],
      },
    ],
  },
  {
    path: "/gp/int/emp",
    element: withSuspense(<GatepassRequestPage />),
  },
  {
    path: "/gp/int/invite/:token",
    element: withSuspense(<VisitorInvitePage />),
  },
  {
    path: "/gp/int/self",
    element: withSuspense(<VisitorSelfRegisterEntryPage />),
  },
  {
    path: "/gp/sp/login",
    element: withSuspense(<Login />),
  },
  {
    path: "/gp/sp",
    element: (
      <McGuardProtected>
        <McGuardLayout />
      </McGuardProtected>
    ),
    children: [
      { index: true, element: withSuspense(<Dashboard />) },
      { path: "gatepass", element: withSuspense(<GatepassApprovals />) },
      { path: "material", element: withSuspense(<MaterialApprovals />) },
      { path: "pre-approved", element: withSuspense(<PreApprovals />) },
      { path: "attendance", element: withSuspense(<Attendance />) },
      { path: "employee-codes", element: withSuspense(<EmployeeCodes />) },
      { path: "hierarchy", element: withSuspense(<EmpHierarchy />) },
      { path: "analytics", element: withSuspense(<Analytics />) },
      { path: "search", element: withSuspense(<AdvancedSearch />) },
      { path: "reports", element: withSuspense(<Reports />) },
      { path: "guards", element: withSuspense(<Guards />) },
      { path: "settings", element: withSuspense(<McGuardSettings />) },
    ],
  },
  {
    // Outside MainLayout on purpose - a blocked employee gets none of the real
    // app chrome, just this page (see useWebAccessBlockGuard.ts).
    path: "/app-only",
    element: (
      <Protected>
        {withSuspense(<WebAccessBlockedPage />)}
      </Protected>
    ),
  },
  {
    path: "/sign-in",
    element: (
      <Protected authentication={false}>
        {withSuspense(<SignInScreen />)}
      </Protected>
    ),
  },
  {
    path: "/recover-password",
    element: (
      <Protected authentication={false}>
        {withSuspense(<RecoverPassword />)}
      </Protected>
    ),
  },
  {
    path: "/two-factor-auth",
    element: (
      <Protected authentication={false}>
        {withSuspense(<TwoFactorAuthPage />)}
      </Protected>
    ),
  },
  {
    path: "*",
    element: (
      <Protected>
        {withSuspense(<Custom404Page />)}
      </Protected>
    ),
  },
]);
