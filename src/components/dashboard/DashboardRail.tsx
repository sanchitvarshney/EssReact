import type { ElementType } from "react";
import { Tooltip } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import BeachAccessOutlinedIcon from "@mui/icons-material/BeachAccessOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

export const DASH_PRIMARY = "#00a0a0";

const items: { title: string; path: string; Icon: ElementType; match?: string }[] = [
  { title: "Home", path: "/", Icon: HomeOutlinedIcon },
  { title: "Attendance", path: "/attendance", Icon: CalendarMonthOutlinedIcon },
  { title: "Task Box", path: "/task-box", Icon: AssignmentOutlinedIcon },
  { title: "Payslip", path: "/payroll", Icon: CurrencyRupeeIcon },
  { title: "Leave", path: "/self-service/apply-leave", Icon: BeachAccessOutlinedIcon, match: "/self-service" },
  { title: "Vibe", path: "/vibe", Icon: ForumOutlinedIcon },
  { title: "My KRA", path: "/performance", Icon: TrendingUpIcon },
  { title: "Org View", path: "/home/hierarchy", Icon: AccountTreeOutlinedIcon },
  { title: "HR Documents", path: "/hr-documents", Icon: DescriptionOutlinedIcon },
  { title: "Holidays and Events", path: "/calendar", Icon: EventOutlinedIcon },
];

const profileItem = { title: "My Profile", path: "/manage-account", Icon: PersonOutlineIcon };

const DashboardRail = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const renderItem = ({ title, path, Icon, match }: (typeof items)[number]) => {
          const active = path === "/" ? pathname === "/" : pathname.startsWith(match ?? path);
          return (
            <Tooltip key={title} title={title} placement="right" arrow>
              <button
                onClick={() => navigate(path)}
                aria-label={title}
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-150 cursor-pointer"
                style={{
                  background: active ? "linear-gradient(135deg, #1cc4b5 0%, #00a0a0 55%, #007f86 100%)" : "transparent",
                  color: active ? "#fff" : "#6b7280",
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.background = "#e0f6f6";
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.background = "transparent";
                }}
              >
                <Icon sx={{ fontSize: 20 }} />
              </button>
            </Tooltip>
          );
        };

  return (
    <aside className="hidden md:flex flex-col items-center w-[64px] flex-shrink-0 bg-white border-r border-gray-100 py-3 h-screen sticky top-0">
      <img
        src="/msc-48x48.png"
        alt="mscorpres"
        className="w-9 h-9 rounded-full mb-3 cursor-pointer"
        onClick={() => navigate("/")}
      />
      <div className="flex flex-col items-center gap-1.5 flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar-for-menu w-full py-1">
        {items.map(renderItem)}
      </div>
      <div className="pt-2">{renderItem(profileItem)}</div>
    </aside>
  );
};

export default DashboardRail;
