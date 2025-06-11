import ImageCard from "../components/reuseable/ImageCard";
import todo from "../assets/to-do-list.png";
const Dashboard = () => {
  return (
       <div className="h-[calc(100vh-65px)] w-full px-4 py-4">
     
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <ImageCard key={i} title="test" image={todo} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
