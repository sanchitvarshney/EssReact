import ImageCard from "../components/reuseable/ImageCard";
import todo from "../assets/to-do-list.png";
import SlideShowCard from "../components/reuseable/SlideShowCard";
import CustomChart from "../components/CustomChart";
import OfficeAbsenceComponent from "../components/OfficeAbsenceComponent";
const Dashboard = () => {
  return (
    <div className=" w-full p-4 custom-scrollbar-for-menu ">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <ImageCard key={i} title="test" image={todo} />
        ))}
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
