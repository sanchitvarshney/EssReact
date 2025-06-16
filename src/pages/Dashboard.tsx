
import sickicon from "../assets/hospital-building.png";
import earnicon from "../assets/coin.png";
import accespticon from "../assets/accept.png";
import homeicon from "../assets/house.png";
import SlideShowCard from "../components/reuseable/SlideShowCard";
import CustomChart from "../components/CustomChart";
import OfficeAbsenceComponent from "../components/OfficeAbsenceComponent";
import HolidayCard from "../components/reuseable/HolidayCard";
const Dashboard = () => {
  return (
    <div className=" w-full p-4 custom-scrollbar-for-menu ">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
        <HolidayCard title="Sick Leave" image={sickicon} value={8}/>
         <HolidayCard title="Earned Leave" image={earnicon} value={8}/>
          <HolidayCard title="Compensatory Leave" image={accespticon} value={8}/>
           <HolidayCard title="Work From Home" image={homeicon} value={8}/>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:place-items-center md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        <SlideShowCard />
        <SlideShowCard />
        <SlideShowCard />
      </div>
      <div className="mt-10 flex flex-col lg:flex-row justify-between items-start  flex-wrap">
        <div className="w-full lg:w-2/3 flex items-center justify-start">
          <CustomChart />
        </div>

        <div className="w-full lg:w-1/3 bg-white shadow-xl p-4 h-70 rounded-0 ring-2 ring-gray-300/50">
          <h2 className="mb-4 text-lg font-semibold">
            Today's On Office Absence
          </h2>
          <OfficeAbsenceComponent />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
