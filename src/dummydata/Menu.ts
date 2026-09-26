import type { MenuItem } from "../types/dummytypes";

export const menu: MenuItem[] = [
  {
    id: "home",
    title: "Home",
    icon: "home",
    path: "/",
  },
  {
    id: "announcement",
    title: "Vibe",
    icon: "vibeicon",
    path: "/vibe",
  },
  {
    id: "hierarchy",
    title: "Hierarchy",
    path: "/home/hierarchy",
    icon: "orgchart",
  },
  {
    id: "self",
    title: "Leave",
    icon: "flows",
    children: [
      {
        id: "applyleave",
        title: "Apply Leave",
        path: "/self-service/apply-leave",
      },
      {
        id: "leavestatus",
        title: "Leave Status",
        path: "/self-service/leave-status",
      },
      {
        id: "leave-grant",
        title: "Leave Grant",
        path: "/self-service/leave-grant",
      },
    ],
  },
  {
    id: "attendance",
    title: "Attendance",
    icon: "attendance",
    path: "/attendance",
  },
  {
    id: "team-attendance",
    title: "Team Attendance",
    icon: "PeopleIcon",
    path: "/team-attendance",
  },
  {
    id: "payroll",
    title: "Quick Payslip",
    path: "/payroll",
    icon: "compensation",
  },
  {
    id: "reimbursement-claims",
    title: "Reimbursement",
    icon: "reimbursement",
    path: "/reimbursement",
  },
  {
    id: "loan",
    title: "Loan & Advance",
    icon: "compensation",
    path: "/loan",
  },
  {
    id: "gate-pass",
    title: "Gate Pass",
    icon: "peripheral",
    path: "/gate-pass",
  },
  {
    id: "event",
    title: "Holidays / Events",
    icon: "AccessTimeIcon",
    path: "/calendar",
  },
  {
    id: "peripheral",
    title: "Peripheral",
    icon: "MonetizationOnIcon",
    path: "/peripheral",
  },
  {
    id: "documents",
    title: "Documents",
    icon: "folder",
    path: "/hr-documents",
  },
];
