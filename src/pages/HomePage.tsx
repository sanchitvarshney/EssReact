import { Typography } from "@mui/material";
import ImageCard from "../components/reuseable/ImageCard";
import { homeData } from "../staticData/homepagedata";
import type { homeMenuTypes } from "../types/home-data-types/homepagetypes";

const HomePage = () => {
  return (
    <div className="w-full  h-[calc(100vh-90px)] flex justify-center overflow-y-auto">
      <div className="w-[85%] flex justify-start items-start flex-col">
        <div className="flex justify-between items-center w-full mb-2 ">
          <Typography sx={{ padding: 3, fontSize: 20, fontWeight: 600 }}>
            My Access
          </Typography>
         {/* <div className="max-w-5xl min-w-xl h-8 bg-red-400 flex justify-between items-center ">
          <span>Date</span>
            <span> notice</span>
              <span>size</span>
         </div> */}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 w-full lg:grid-cols-5 xl:grid-cols-6  gap-x-8 px-4  mx-auto overflow-visible ">
          {homeData.map((item: homeMenuTypes) => (
            <ImageCard
              key={item.id}
              title={item.title}
              image={item.icon}
              path={item.path}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
