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

interface SideShowPropsType  {
  des ?: string;
  // date :any;
  // name: string;
  // joinDate?: any | string
}

const SideShowCard : FC<SideShowPropsType>= ({des="Hire"}) => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);SideMenuBar
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-sm  ">
      <div className="relative rounded-md shadow-lg overflow-hidden h-100  flex flex-col  justify-center items-center">
        <div className="absolute top-4 text-black z-10"><h2 className="text-xl font-bold">{des}</h2></div>
       
        <div className="w-60 h-60 bg-red-800 flex justify-center items-center rounded-full  mb-10 overflow-hidden">
          <img
            src={slides[current].image}
            alt={slides[current].title}
            className="w-[100%] h-[100%]  object-fill rounded-4xl"
          />
        </div>
        <div className="absolute inset-0 bg-black/10 flex flex-col justify-end items-center p-4 text-black">
          <h2 className="text-xl font-bold">{slides[current].date}</h2>
          <h3 className="text-xl font-bold">{slides[current].title}</h3>
          <p className="text-sm">{slides[current].description}</p>
        </div>
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
