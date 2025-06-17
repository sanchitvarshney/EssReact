import { Typography } from "@mui/material";
import ImageCard from "../components/reuseable/ImageCard";
import { homeData } from "../staticData/homepagedata";
import type { homeDataTypes } from "../types/home-data-types/homepagetypes";

const HomePage = () => {
  return (
    <div className="w-full  h-[calc(100vh-90px)] flex justify-center">
      <div className="w-[85%] flex justify-start items-start flex-col">
        <Typography sx={{ padding: 3, fontSize: 20, fontWeight: 600 }}>
          Home Screen
        </Typography>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-15 px-3 ml-2 ">
          {homeData.map((item: homeDataTypes) => (
            <ImageCard title={item.title} image={item.icon} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
