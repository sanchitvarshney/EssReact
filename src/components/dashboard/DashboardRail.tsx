import { useState, type ElementType } from "react";
import { Avatar, Tooltip } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import BeachAccessOutlinedIcon from "@mui/icons-material/BeachAccessOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { useAuth } from "../../contextapi/AuthContext";
import { useMyCompany } from "../../hooks/useMyCompany";

export const DASH_PRIMARY = "#00a0a0";

const ACTIVE_BG = "linear-gradient(135deg, #1cc4b5 0%, #00a0a0 55%, #007f86 100%)";

type RailItem = { title: string; path: string; Icon: ElementType; match?: string };

const groups: { label: string; items: RailItem[] }[] = [
  {
    label: "Workspace",
    items: [
      { title: "Home", path: "/", Icon: HomeOutlinedIcon },
      { title: "Task Box", path: "/task-box", Icon: AssignmentOutlinedIcon },
      { title: "Vibe", path: "/vibe", Icon: ForumOutlinedIcon },
      { title: "Org View", path: "/home/hierarchy", Icon: AccountTreeOutlinedIcon },
    ],
  },
  {
    label: "My work",
    items: [
      { title: "Attendance", path: "/attendance", Icon: CalendarMonthOutlinedIcon },
      { title: "Team Attendance", path: "/team-attendance", Icon: GroupsOutlinedIcon },
      { title: "Leave", path: "/self-service/apply-leave", Icon: BeachAccessOutlinedIcon, match: "/self-service" },
      { title: "Payslip", path: "/payroll", Icon: CurrencyRupeeIcon },
      { title: "Reimbursement", path: "/reimbursement", Icon: ReceiptLongOutlinedIcon },
      { title: "Loan & Advance", path: "/loan", Icon: PaymentsOutlinedIcon },
      { title: "Gate Pass", path: "/gate-pass", Icon: ConfirmationNumberOutlinedIcon },
      { title: "My KRA", path: "/performance", Icon: TrendingUpIcon },
    ],
  },
  {
    label: "Company",
    items: [
      { title: "HR Documents", path: "/hr-documents", Icon: DescriptionOutlinedIcon },
      { title: "Holidays & Events", path: "/calendar", Icon: EventOutlinedIcon },
    ],
  },
];

const profileItem: RailItem = { title: "My Profile", path: "/manage-account", Icon: PersonOutlineIcon };

const DashboardRail = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { company, branch } = useMyCompany();
  const u: any = user ?? {};
  // Open by default on every load; the toggle only collapses it for the current session.
  const [expanded, setExpanded] = useState(true);

  const toggle = () => setExpanded((prev) => !prev);

  const isActive = ({ path, match }: RailItem) =>
    path === "/" ? pathname === "/" : pathname.startsWith(match ?? path);

  const renderItem = (item: RailItem) => {
    const { title, path, Icon } = item;
    const active = isActive(item);
    return (
      <Tooltip key={title} title={expanded ? "" : title} placement="right" arrow>
        <button
          onClick={() => navigate(path)}
          aria-label={title}
          aria-current={active ? "page" : undefined}
          className={`group relative h-10 rounded-xl flex items-center flex-shrink-0 transition-all duration-150 cursor-pointer ${
            expanded ? "w-full px-3 gap-3 justify-start" : "w-10 justify-center"
          } ${active ? "text-white shadow-md shadow-[#00a0a0]/30" : "text-gray-500 hover:bg-[#e0f6f6] hover:text-[#007f86]"}`}
          style={{ background: active ? ACTIVE_BG : undefined }}
        >
          <Icon sx={{ fontSize: 20 }} className="flex-shrink-0" />
          {expanded && <span className={`text-[13px] truncate ${active ? "font-semibold" : "font-medium"}`}>{title}</span>}
          {expanded && active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/90" />}
        </button>
      </Tooltip>
    );
  };

  return (
    <aside
      className={`hidden md:flex flex-col flex-shrink-0 bg-white border-r border-gray-100 py-3 h-screen sticky top-0 transition-[width] duration-300 ease-in-out ${
        expanded ? "w-[248px] px-3" : "w-[64px] items-center"
      }`}
    >
      {/* Brand */}
      <button
        onClick={() => navigate("/")}
        className={`flex items-center mb-3 cursor-pointer ${expanded ? "w-full gap-3 px-1.5 py-1 text-left" : "justify-center"}`}
        aria-label="Go to home"
      >
        <img src="/msc-48x48.png" alt="mscorpres" className="w-9 h-9 rounded-full flex-shrink-0" />
        {expanded && (
          <span className="min-w-0 leading-tight">
            <span className="block text-sm font-bold text-gray-800 truncate" title={company}>
              {company || "ESS Portal"}
            </span>
            <span className="block text-[11px] text-gray-400 truncate" title={branch}>
              {branch || "Employee Self Service"}
            </span>
          </span>
        )}
      </button>

      {/* Navigation groups */}
      <nav
        className={`flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar-for-menu w-full py-1 flex flex-col ${
          expanded ? "gap-4" : "gap-2 items-center"
        }`}
      >
        {groups.map((group, gi) => (
          <div key={group.label} className={`flex flex-col gap-1 w-full ${expanded ? "" : "items-center"}`}>
            {expanded ? (
              <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                {group.label}
              </p>
            ) : (
              gi > 0 && <span className="w-6 h-px bg-gray-100 mb-1 self-center" />
            )}
            {group.items.map(renderItem)}
          </div>
        ))}
      </nav>

      {/* Footer: profile + expand / collapse */}
      <div className={`pt-3 flex flex-col gap-2 w-full ${expanded ? "border-t border-gray-100" : "items-center"}`}>
        {expanded ? (
          <button
            onClick={() => navigate(profileItem.path)}
            aria-label="My Profile"
            className={`flex items-center gap-3 w-full rounded-2xl px-2.5 py-2.5 text-left transition-colors cursor-pointer ${
              isActive(profileItem) ? "bg-[#e0f6f6] ring-1 ring-[#00a0a0]/30" : "bg-[#f6fafa] hover:bg-[#e0f6f6]"
            }`}
          >
            <Avatar
              src={u.imgUrl}
              alt={u.name}
              sx={{ width: 36, height: 36, bgcolor: "#00a0a0", fontSize: 14, fontWeight: 700, pointerEvents: "none" }}
            >
              {u.name?.charAt(0)}
            </Avatar>
            <span className="min-w-0 leading-tight">
              <span className="block text-[13px] font-semibold text-gray-800 truncate">{u.name || "My Profile"}</span>
              <span className="block text-[11px] text-gray-400 truncate">{u.id ? `${u.id} · View profile` : "View profile"}</span>
            </span>
          </button>
        ) : (
          renderItem(profileItem)
        )}

        <Tooltip title={expanded ? "" : "Expand menu"} placement="right" arrow>
          <button
            onClick={toggle}
            aria-label={expanded ? "Collapse menu" : "Expand menu"}
            aria-expanded={expanded}
            className={`h-9 rounded-xl flex items-center flex-shrink-0 text-[#007f86] bg-[#f0fbfb] hover:bg-[#e0f6f6] transition-colors cursor-pointer ${
              expanded ? "w-full px-3 gap-3 justify-center" : "w-10 justify-center"
            }`}
          >
            {expanded ? (
              <KeyboardDoubleArrowLeftIcon sx={{ fontSize: 18 }} className="flex-shrink-0" />
            ) : (
              <KeyboardDoubleArrowRightIcon sx={{ fontSize: 18 }} className="flex-shrink-0" />
            )}
            {expanded && <span className="text-xs font-semibold">Collapse menu</span>}
          </button>
        </Tooltip>
      </div>
    </aside>
  );
};

export default DashboardRail;
