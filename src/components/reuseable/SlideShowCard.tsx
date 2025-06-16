import { useEffect, useState, type FC } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { CustomButton } from "../ui/CustomButton";
import SideMenuBar from "../sidemenubar/SideMenuBar";

const slides = [
  {
    id: 1,
    date: "14-04-2025",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Nature View",
    description: "Experience the serenity of natural landscapes.",
  },
  {
    id: 2,
    date: "12-04-2025",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Urban Life",
    description: "Dive into the rhythm of the city lights.",
  },
  {
    id: 3,
    date: "18-04-2025",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Ocean Vibes",
    description: "Feel the breeze and embrace the waves.",
  },
];

interface SideShowPropsType {
  des?: string;
  // date :any;
  // name: string;
  // joinDate?: any | string
}

const SideShowCard: FC<SideShowPropsType> = ({ des = "Hire" }) => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    SideMenuBar;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
   <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto">
  <div className="relative rounded-md shadow-lg overflow-hidden h-[20rem] sm:h-[26rem] md:h-[25rem] flex flex-col justify-center items-center">
    
    {/* Top label */}
    <div className="absolute top-4 text-black z-10">
      <h2 className="text-lg sm:text-xl font-bold">{des}</h2>
    </div>

    {/* Image Container */}
    <div className="w-32 h-32 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-45 lg:h-45 bg-red-800 flex justify-center items-center rounded-full sm:mb-6 mb-3 overflow-hidden">
      <img
        src={slides[current].image}
        alt={slides[current].title}
        className="w-full h-full object-cover"
      />
    </div>

    {/* Overlay content */}
    <div className="absolute inset-0 bg-black/10 flex flex-col justify-end items-center p-4 text-black text-center">
      <h2 className="text-base sm:text-lg font-semibold">{slides[current].date}</h2>
      <h3 className="text-base sm:text-lg font-bold">{slides[current].title}</h3>
      <p className="text-sm sm:text-base">{slides[current].description}</p>
    </div>

    {/* Navigation Buttons */}
    <div className="absolute top-1/2 left-0 transform -translate-y-1/2 px-2">
      <CustomButton size="icon" variant="ghost" onClick={prevSlide}>
        <ArrowBackIosIcon className="text-black" />
      </CustomButton>
    </div>
    <div className="absolute top-1/2 right-0 transform -translate-y-1/2 px-2">
      <CustomButton size="icon" variant="ghost" onClick={nextSlide}>
        <ArrowForwardIosIcon className="text-black" />
      </CustomButton>
    </div>
  </div>
</div>

  );
};

export default SideShowCard;
