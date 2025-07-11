import taskbox from "../assets/to-do-list.png";
import vibe from "../assets/speech-bubble.png";
import compensation from "../assets/money.png";
import attendance from "../assets/calendar.png";
import leave from "../assets/sunbed.png";
import policice from "../assets/policy.png";
import doc from "../assets/documentation.png";
import recruitment from "../assets/selection.png";
import calendar from "../assets/calendar (2).png";
import performance from "../assets/performance.png";
import reimb from "../assets/dollar.png";
import help from "../assets/help.png";
import org from "../assets/hierarchy-structure.png";
import perip from "../assets/peripheral.png";
import type { homeMenuTypes } from "../types/home-data-types/homepagetypes";

export const homeData: homeMenuTypes[] = [
  { id: "taskbox", title: "Task Box", icon: taskbox, path: "/task-box" },

  { id: "vibe", title: "Vibe", icon: vibe, path: "/vibe" },
  {
    id: "compensation",
    title: "Compensation",
    icon: compensation,
    path: "/self-service/payslip",
  },
  {
    id: "attendance",
    title: "Attendance",
    icon: attendance,
    path: "/self-service/attendance",
  },
  {
    id: "leave",
    title: "Leave",
    icon: leave,
    path: "/self-service/apply-leave",
  },
  { id: "policie", title: "HR Policies", icon: policice, path: "/hr-policy" },
  { id: "document", title: "HR Documents", icon: doc, path: "/hr-documents" },
  {
    id: "recruitment",
    title: "Recruitment",
    icon: recruitment,
    path: "/recruitments",
  },
  { id: "holiday", title: "Holidays and Events", icon: calendar, path: "/calendar" },
  {
    id: "performance",
    title: "Performance",
    icon: performance,
    path: "/performance",
  },
      {
    id: "peripheral",
    title: "Peripheral",
    icon: perip,
    path: "/peripheral",
  },

  {
    id: "reimbursement",
    title: "Reimbursement",
    icon: reimb,
    path: "/reimbursement/claim",
  },

  { id: "org", title: "Org View", icon: org, path: "/home/hierarchy" },
    { id: "help", title: "Helpdesk", icon: help, path: "/support-portal" },
];
