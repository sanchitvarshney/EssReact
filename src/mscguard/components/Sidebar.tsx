import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  IdCard,
  Package,
  CalendarCheck,
  Users,
  BarChart3,
  Search,
  FileText,
  Network,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import type { McGuardRole } from "../types/mscguardTypes";
import gatepassIcon from "../assets/gatepass-icon.png";

interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  minRole?: McGuardRole; // "Admin" restricts the item to Admin only
  comingSoon?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", to: "/gp/sp", icon: LayoutDashboard },
  { label: "Gate Pass Approvals", to: "/gp/sp/gatepass", icon: IdCard },
  { label: "Material Approvals", to: "/gp/sp/material", icon: Package },
  { label: "Pre-Approvals", to: "/gp/sp/pre-approved", icon: CalendarCheck },
  { label: "Attendance", to: "/gp/sp/attendance", icon: Users },
  { label: "Employee Codes", to: "/gp/sp/employee-codes", icon: IdCard, minRole: "Admin" },
  { label: "Emp/Manager Hierarchy", to: "/gp/sp/hierarchy", icon: Network, minRole: "Admin" },
  { label: "Guards", to: "/gp/sp/guards", icon: ShieldCheck, minRole: "Admin" },
  { label: "Analytics", to: "/gp/sp/analytics", icon: BarChart3 },
  { label: "Advanced Search", to: "/gp/sp/search", icon: Search },
  { label: "Reports", to: "/gp/sp/reports", icon: FileText },
  { label: "Settings", to: "/gp/sp/settings", icon: SlidersHorizontal, minRole: "Admin" },
];

interface SidebarProps {
  userRole: McGuardRole;
}

export default function Sidebar({ userRole }: SidebarProps) {
  const items = NAV_ITEMS.filter((item) => !item.minRole || item.minRole === userRole);

  return (
    <aside className="w-80 shrink-0 bg-white h-screen sticky top-0 flex flex-col border-r border-gray-200">
      <div className="flex items-center gap-2 px-5 py-5">
        <img src={gatepassIcon} alt="" className="w-9 h-9 rounded-lg" />
        <span className="text-gray-800 font-semibold text-lg">MsCGuard</span>
      </div>

      <div className="px-5 pb-2 pt-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
        Menu
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-6 flex flex-col gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          if (item.comingSoon) {
            return (
              <div
                key={item.to}
                className="flex items-center justify-between gap-3 rounded-md px-3 py-2.5 text-gray-400 cursor-not-allowed select-none"
                title="Coming soon"
              >
                <span className="flex items-center gap-3 text-sm">
                  <Icon size={18} />
                  {item.label}
                </span>
                <span className="text-[10px] font-medium bg-gray-100 text-gray-400 rounded px-1.5 py-0.5">
                  Soon
                </span>
              </div>
            );
          }
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/gp/sp"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "bg-blue-700 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
