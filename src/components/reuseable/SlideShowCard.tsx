import { useEffect, useState, type FC } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { CustomButton } from "../ui/CustomButton";
import SideMenuBar from "../sidemenubar/SideMenuBar";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    id: 1,
    date: "14-04-2025",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Nature View",
    description: "Experience",
  },
  {
    id: 2,
    date: "12-04-2025",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Urban Life",
    description: "Dive .",
  },
  {
    id: 3,
    date: "18-04-2025",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Ocean Vibes",
    description: "Feel the breeze",
  },
];

interface SideShowPropsType {
  title?: string;
}

const SideShowCard: FC<SideShowPropsType> = ({ title = "New Hire" }) => {
  const [current, setCurrent] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);

  const nextSlide = () => {
    if (isNavigating) return;

    setIsNavigating(true);
    setCurrent((prev) => (prev + 1) % slides.length);

    setTimeout(() => {
      setIsNavigating(false);
    }, 1000);
  };

  const prevSlide = () => {
    if (isNavigating) return;

    setIsNavigating(true);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    SideMenuBar;

    setTimeout(() => {
      setIsNavigating(false);
    }, 1000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isNavigating) {
        nextSlide();
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [isNavigating]);

  return (
    <div className="w-90 max-w-60 sm:max-w-80 md:max-w-90 lg:max-w-60 xl:max-w-85 mx-auto">
      <motion.div
        initial={{ opacity: 0, x: 100, scaleX: 0.95 }}
        animate={{ opacity: 1, x: 0, scaleX: 1 }}
        exit={{ opacity: 0, x: -40, scaleX: 0.95 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="relative rounded-md shadow-sm overflow-hidden h-[20rem] sm:h-[26rem] md:h-[25rem] flex flex-col justify-center items-center"
      >
        <div className="absolute top-4 text-black z-10">
          <h2 className="text-lg sm:text-xl font-bold">{title}</h2>
        </div>

        <div className="w-35 h-35 sm:w-45 sm:h-45 md:w-50 md:h-50 lg:w-40 lg:h-40 xl:w-50 xl:h-50 flex justify-center items-center rounded-full sm:mb-6 mb-3 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={current}
              src={slides[current].image}
              alt={slides[current].title}
              className="w-full h-full object-fill"
              initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
          </AnimatePresence>
        </div>

        <div className="absolute inset-0 bg-black/5 flex flex-col justify-end items-center p-4 text-black text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="flex flex-col items-center"
            >
              <h2 className="text-base sm:text-lg font-semibold">
                {slides[current].date}
              </h2>
              <h3 className="text-base sm:text-lg font-bold">
                {slides[current].title}
              </h3>
              <p className="text-sm sm:text-base">
                {slides[current].description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 px-2">
          <CustomButton
            size="icon"
            variant="ghost"
            onClick={prevSlide}
            disabled={isNavigating}
            className={`transition-opacity duration-300 ${
              isNavigating ? "opacity-50 cursor-not-allowed" : "opacity-100"
            }`}
          >
            <ArrowBackIosIcon className="text-black" />
          </CustomButton>
        </div>
        <div className="absolute top-1/2 right-0 transform -translate-y-1/2 px-2">
          <CustomButton
            size="icon"
            variant="ghost"
            onClick={nextSlide}
            disabled={isNavigating}
            className={`transition-opacity duration-300 ${
              isNavigating ? "opacity-50 cursor-not-allowed" : "opacity-100"
            }`}
          >
            <ArrowForwardIosIcon className="text-black" />
          </CustomButton>
        </div>
      </motion.div>
    </div>
  );
};

export default SideShowCard;
