import { useLocation, useNavigate } from "react-router-dom";
import EditCalendarOutlinedIcon from "@mui/icons-material/EditCalendarOutlined";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";

const TABS = [
  { label: "Apply leave", path: "/self-service/apply-leave", icon: EditCalendarOutlinedIcon },
  { label: "My requests", path: "/self-service/leave-status", icon: EventBusyOutlinedIcon },
  { label: "Leave grant", path: "/self-service/leave-grant", icon: HowToRegOutlinedIcon },
];

// Sub-navigation for the Leave section (the sidebar only links to the first page).
const LeaveTabs = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="flex items-center bg-white border border-gray-100 shadow-sm rounded-2xl p-1 gap-0.5 w-fit max-w-full overflow-x-auto flex-shrink-0">
      {TABS.map(({ label, path, icon: Icon }) => {
        const on = pathname === path;
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              on
                ? "text-white shadow-sm bg-gradient-to-r from-[#00a0a0] to-[#007f86]"
                : "text-gray-500 hover:text-[#007f86] hover:bg-[#f0fbfb]"
            }`}
          >
            <Icon sx={{ fontSize: 16 }} />
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default LeaveTabs;
