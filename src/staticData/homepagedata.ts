import taskbox from "../assets/to-do-list.png";
import vibe from "../assets/speech-bubble.png";
import compensation from "../assets/money.png";
import attendance from "../assets/calendar.png";
import leave from "../assets/sunbed.png";
import doc from "../assets/documentation.png";
import calendar from "../assets/calendar (2).png";
import performance from "../assets/performance.png";
import reimb from "../assets/dollar.png";
import loanIcon from "../assets/coin.png";
import gatePassIcon from "../assets/accept.png";
import help from "../assets/help.png";
import org from "../assets/hierarchy-structure.png";
import perip from "../assets/peripheral.png";
import type { homeMenuTypes } from "../types/home-data-types/homepagetypes";


export const homeData: homeMenuTypes[] = [
  { id: "taskbox", title: "Task Box", icon: taskbox, path: "/task-box" },

  { id: "vibe", title: "Vibe", icon: vibe, path: "/vibe" },
  {
    id: "payroll",
    title: "Quick Payslip",
    icon: compensation,
    path: "/payroll",
  },
  {
    id: "attendance",
    title: "Attendance",
    icon: attendance,
    path: "/attendance",
  },
  {
    id: "leave",
    title: "Leave",
    icon: leave,
    path: "/self-service/apply-leave",
  },
  { id: "document", title: "HR Documents", icon: doc, path: "/hr-documents" },
  { id: "holiday", title: "Holidays and Events", icon: calendar, path: "/calendar" },
  {
    id: "performance",
    title: "My KRA",
    icon: performance,
    path: "/performance",
  },
      {
    id: "peripheral",
    title: "Peripheral",
    icon: perip,
    path: "/peripheral",
  },

  { id: "reimbursement", title: "Reimbursement", icon: reimb, path: "/reimbursement" },
  { id: "loan", title: "Loan & Advance", icon: loanIcon, path: "/loan" },
  { id: "gatepass", title: "Gate Pass", icon: gatePassIcon, path: "/gate-pass" },

  { id: "org", title: "Org View", icon: org, path: "/home/hierarchy" },
    { id: "help", title: "Helpdesk", icon: help, path: "" },
];
