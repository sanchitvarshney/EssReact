import type { MenuItem } from "../types/dummytypes";

export const menu: MenuItem[] = [
  {
    id: "home",
    title: "Home",
    icon: "home",
    path: "/",
    // children: [
    //
    //   // {
    //   //   id: "dashboard",
    //   //   title: "Dashboard",
    //   //   path: "/",
    //   // },
    //   {

    // ],
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
      // {
      //   id: "wfh",
      //   title: "WHF Update",
      //   path: "/self-service/wfh",
      // },
    ],
  },
  {
    id: "attendance",
    title: "Attendance",
    icon: "attendance",
    path: "/attendance",
  },
  {
    id: "payroll",
    title: "Quick Payslip",
    path: "/payroll",
    icon: "compensation",
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
  // {
  //   id: "reimbursement",
  //   title: "Reimbursement",
  //   icon: "reimbursement",
  //   children: [
  //     {
  //       id: "claim",
  //       title: "Claim",
  //       path: "/reimbursement/claim",
  //     },
  //     {
  //       id: "status",
  //       title: "Status",
  //       path: "/reimbursement/status",
  //     },
  //     {
  //       id: "grant",
  //       title: "Grant",
  //       path: "/reimbursement/grant",
  //     },
  //   ],
  // },
  //  {
  //   id: "policies",
  //   title: "Policies",
  //   icon: "policyicon",
  //   path: "/hr-policy",
  // },
  {
    id: "documents",
    title: "Documents",
    icon: "folder",
    path: "/hr-documents",
  },
  // {
  //   id: "support",
  //   title: "Support Portal",
  //   icon: "support",
  //   path: "/support-portal",
  // },
];
