import sickicon from "../assets/hospital-building.png";
import earnicon from "../assets/coin.png";
import accespticon from "../assets/accept.png";
import homeicon from "../assets/house.png";
import SlideShowCard from "../components/reuseable/SlideShowCard";
import CustomChart from "../components/CustomChart";
import OfficeAbsenceComponent from "../components/OfficeAbsenceComponent";
import HolidayCard from "../components/reuseable/HolidayCard";
import { Typography } from "@mui/material";
const Dashboard = () => {
  return (
    <div className=" w-full p-4 custom-scrollbar-for-menu ">
      <div className="py-1 mb-4">
        <Typography sx={{ fontSize: 24, fontWeight: "bold" }}>
          Dashboard
        </Typography>
        <p className="text-[14px] text-gray-500">
          Welcome to the Employee Self-Service (ESS) Dashboard
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
        <HolidayCard title="Sick Leave" image={sickicon} value={8} />
        <HolidayCard title="Earned Leave" image={earnicon} value={8} />
        <HolidayCard title="Compensatory Leave" image={accespticon} value={8} />
        <HolidayCard title="Work From Home" image={homeicon} value={8} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:place-items-center md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-8">
        <SlideShowCard />
        <SlideShowCard />
        <SlideShowCard />
      </div>

      <div className="w-full h-100 bg-white shadow-md p-3 mt-8  rounded-0 ring-2 ring-gray-300/50 overflow-y-auto">
        <h2 className="mb-4 text-lg font-semibold">
          Today's On Office Absence
        </h2>
        <OfficeAbsenceComponent />
      </div>

      <div className="w-full   m-auto rounded-0 ring-2 ring-gray-300/50 my-6 p-3">
        <span className="text-lg font-semibold">Attendance Trend</span>
        <CustomChart />
      </div>
    </div>
  );
};

export default Dashboard;
