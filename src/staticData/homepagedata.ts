import empIcon from "../assets/staff.png";
import type { homeDataTypes } from "../types/home-data-types/homepagetypes";

export const homeData: homeDataTypes[] = [
  { id: "taskbox", title: "Task Box", icon: empIcon, path: "/task-box" },
  { id: "employee", title: "Employees", icon: empIcon, path: "/employees" },
  { id: "vibe", title: "Vibe", icon: empIcon, path: "/vibe" },
  { id: "compensation", title: "Compensation", icon: empIcon, path: "/compensations" },
  { id: "attendance", title: "Attendance", icon: empIcon, path: "/attendances" },
  { id: "leave", title: "Leave", icon: empIcon, path: "/leaves" },
  { id: "policie", title: "HR Policies", icon: empIcon, path: "/hr-policies" },
  { id: "document", title: "HR Documents", icon: empIcon, path: "/hr-documents" },
  { id: "recruitment", title: "recruitment", icon: empIcon, path: "/recruitments" },
  { id: "calender", title: "Calendar", icon: empIcon, path: "/calendar" },
  { id: "performance", title: "Performance", icon: empIcon, path: "/performance" },
  { id: "help", title: "Helpdesk", icon: empIcon, path: "/help" },
];
