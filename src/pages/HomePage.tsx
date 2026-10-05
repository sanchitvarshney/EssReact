import { useGetRatingWindowQuery } from "../services/kraRating";
import NoticeboardCard from "../components/NoticeboardCard";
import CustomFooter from "../components/reuseable/CustomFooter";
import ProfileCard from "../components/dashboard/ProfileCard";
import BirthdaysCard from "../components/dashboard/BirthdaysCard";
import QuickActionsCard from "../components/dashboard/QuickActionsCard";
import LeavesAttendanceCard from "../components/dashboard/LeavesAttendanceCard";
import NewJoiningCard from "../components/dashboard/NewJoiningCard";
import AbsentTodayCard from "../components/dashboard/AbsentTodayCard";
import FyiBanner from "../components/dashboard/FyiBanner";

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
  const { data: ratingWindowRes } = useGetRatingWindowQuery();
  const kraBadge = getKraBadge(ratingWindowRes?.data);

  return (
    <div className="w-full min-h-full flex flex-col">
      <FyiBanner />

      <div className="flex-1 px-4 pb-4 flex flex-col gap-4">
        {/* Row 1: profile + birthdays | quick actions | leaves & attendance - all 3
            columns stretch to the same height (tallest of the three), so removing
            Tasks/Documents from the middle column doesn't leave it visibly shorter. */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[minmax(250px,0.9fr)_minmax(0,2.2fr)_minmax(300px,1.1fr)] gap-4 items-stretch">
          <div className="flex flex-col gap-4 min-w-0">
            <ProfileCard />
            <BirthdaysCard />
          </div>

          <div className="flex flex-col min-w-0 h-full md:order-3 xl:order-none md:col-span-2 xl:col-span-1">
            <QuickActionsCard kraBadge={kraBadge} />
          </div>

          <div className="min-w-0 h-full md:order-2 xl:order-none">
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
