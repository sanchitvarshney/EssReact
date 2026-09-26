import { Box } from "@mui/material";
import { useGetRatingWindowQuery } from "../services/kraRating";
import NoticeboardCard from "../components/NoticeboardCard";
import useMediaQuery from "@mui/material/useMediaQuery";
import { keyframes, useTheme } from "@mui/material/styles";
import CampaignIcon from "@mui/icons-material/Campaign";
import CustomFooter from "../components/reuseable/CustomFooter";
import ProfileCard from "../components/dashboard/ProfileCard";
import BirthdaysCard from "../components/dashboard/BirthdaysCard";
import QuickActionsCard from "../components/dashboard/QuickActionsCard";
import TasksCard from "../components/dashboard/TasksCard";
import DocumentsCard from "../components/dashboard/DocumentsCard";
import LeavesAttendanceCard from "../components/dashboard/LeavesAttendanceCard";
import NewJoiningCard from "../components/dashboard/NewJoiningCard";
import AbsentTodayCard from "../components/dashboard/AbsentTodayCard";

const getScrollKeyframes = (fromX: string, toX: string) => keyframes`
  0%   { transform: translateX(${fromX}); }
  100% { transform: translateX(${toX}); }
`;

// Same Live / Xd left / Closing / Locked states as Android's Dashboard KRA tile badge
// (DashboardScreen.kt's kraBadge `when`), computed from the same role-split window shape
// (menu/kra.js's getKraWindowStatus()).
const getKraBadge = (window_?: { employee?: { open: boolean; daysUntilOpen?: number | null }; manager?: { open: boolean } }) => {
  if (!window_) return null;
  const { employee, manager } = window_;
  if (employee?.open) return { label: "Live", color: "#16a34a" };
  if (employee?.daysUntilOpen != null) return { label: `${employee.daysUntilOpen}d left`, color: "#f59e0b" };
  if (manager?.open) return { label: "Closing", color: "#ea580c" };
  return { label: "Locked", color: "#dc2626" };
};

const HomePage = () => {
  const theme = useTheme();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediamDevice = useMediaQuery(theme.breakpoints.down("md"));
  const fromX = isSmallDevice ? "20%" : isMediamDevice ? "40%" : "90%";
  const toX = isSmallDevice ? "-20%" : isMediamDevice ? "-40%" : "-120%";
  const scroll = getScrollKeyframes(fromX, toX);

  const { data: ratingWindowRes } = useGetRatingWindowQuery();
  const kraBadge = getKraBadge(ratingWindowRes?.data);

  return (
    <div className="w-full min-h-full flex flex-col">
      {/* What's New marquee banner */}
      <div className="mx-4 mt-4 mb-4 flex items-stretch bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex-shrink-0">
        {/* Label */}
        <div className="relative flex-shrink-0 bg-[#fec300ff]  flex items-center px-3">
          <CampaignIcon sx={{ color: "#fff", fontSize: 18, mr: 0.5 }} />
          <span className="text-white font-bold text-sm whitespace-nowrap">
            What's New
          </span>
          {/* Triangle pointer */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: -12,
              width: 0,
              height: 0,
              borderTop: "22px solid transparent",
              borderBottom: "22px solid transparent",
              borderLeft: "12px solid #fec300ff",
            filter: "drop-shadow(-2px 0 2px rgba(0, 0, 0, 0.1))",
            }}
          />
        </div>

        {/* Scrolling text */}
        <Box
          sx={{
            width: "100%",
            overflow: "hidden",
            whiteSpace: "nowrap",
            pl: "20px",
            py: "10px",
          }}
        >
          <Box
            component="span"
            sx={{
              display: "inline-block",
              animation: `${scroll} ${
                isSmallDevice ? "15s" : isMediamDevice ? "25s" : "35s"
              } linear infinite`,
              fontSize: "0.8125rem",
              fontWeight: 500,
              color: "#374151",
              "&:hover": { animationPlayState: "paused" },
            }}
          >
            We're excited to introduce you to the enhanced version of the App
            — redesigned with a fresh look, improved performance, and
            user-friendly features to make your experience smoother and more
            efficient than ever before.
          </Box>
        </Box>
      </div>

      <div className="flex-1 px-4 pb-4 flex flex-col gap-4">
        {/* Row 1: profile + birthdays | quick actions + tasks/documents | leaves & attendance */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[minmax(250px,0.9fr)_minmax(0,2.2fr)_minmax(300px,1.1fr)] gap-4 items-start">
          <div className="flex flex-col gap-4 min-w-0">
            <ProfileCard />
            <BirthdaysCard />
          </div>

          <div className="flex flex-col gap-4 min-w-0 md:order-3 xl:order-none md:col-span-2 xl:col-span-1">
            <QuickActionsCard kraBadge={kraBadge} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <TasksCard />
              <DocumentsCard />
            </div>
          </div>

          <div className="min-w-0 md:order-2 xl:order-none">
            <LeavesAttendanceCard />
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
          <NewJoiningCard />
          <AbsentTodayCard />
          <NoticeboardCard />
        </div>
      </div>

      <CustomFooter />
    </div>
  );
};

export default HomePage;
