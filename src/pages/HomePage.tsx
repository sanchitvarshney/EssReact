import { Typography } from "@mui/material";
import ImageCard from "../components/reuseable/ImageCard";
import { homeData } from "../staticData/homepagedata";
import type { homeMenuTypes } from "../types/home-data-types/homepagetypes";

const HomePage = () => {
  return (
    <div className="w-full  h-[calc(100vh-90px)] flex justify-center overflow-y-auto">
      <div className="w-[85%] flex justify-start items-start flex-col">
        <Typography sx={{ padding: 3, fontSize: 20, fontWeight: 600 }}>
          My Access
        </Typography>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 w-full lg:grid-cols-5 xl:grid-cols-6  gap-x-8 px-4  mx-auto ">
          {homeData.map((item: homeMenuTypes) => (
            <ImageCard title={item.title} image={item.icon} path={item.path} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
