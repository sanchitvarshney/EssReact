import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { useGetPeripheralMutation } from "../services/doc";
import { useAuth } from "../contextapi/AuthContext";

import PeripheralPageSkeleton from "../skeleton/PeripheralPageSkeleton";
import { useToast } from "../hooks/useToast";
import dummyImg from "../assets/gallery.png";

interface Peripheral {
  id: string;
  name: string;
  category: string;
  serialNo: string;
  model: string;
  description: string;
  allotedon: string;
  image: string;
  ageofdevice?: string;
}

// function getExtensionFromUrl(url) {
//   const match = url?.match(/\.([a-zA-Z0-9]+)(\?.*)?$/);
//   return match ? match[1].toLowerCase() : null;
// }
function getFileTypeFromUrl(url: any) {
  
  const extension = url?.split(".").pop().toLowerCase();

  if (extension === "jpeg" || extension === "jpg") {
    return "JPEG";
  } else if (extension === "pdf") {
    return "PDF";
  } else {
    return "Unknown or unsupported type";
  }
}

const PeripheralPage: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();
  const [peripherals, setPeripherals] = useState<Peripheral[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev
  const [getPeripheral, { data, isLoading }] = useGetPeripheralMutation();

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % peripherals.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + peripherals.length) % peripherals.length
    );
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.7,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      zIndex: 10,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.7,
    }),
  };

  const selectedPeripheral = peripherals[currentIndex];

  useEffect(() => {
    if (user) {
      //@ts-ignore
      getPeripheral({ empcode: user?.id })
        .then((res) => {
          if (res?.data?.data?.success === false) {
            showToast(res?.data?.data?.message, "error");
          }
        })
        .catch((err) => {
          showToast(
            err?.data?.message?.msg || err?.message || "We're Sorry An unexpected error has occured. Our technical staff has been automatically notified and will be looking into this with utmost urgency.",
            "error"
          );
        });
    }
  }, [user]);

  useEffect(() => {
    if (data) {
      const res = data.map((item: any) => ({
        id: item.identity,
        name: item.name,
        model: item.model,
        category: item.category || item.catergory, // support both spellings
        serialNo: item.serial,
        description: item.description,
        allotedon: item.alloted_dt,
        image: item.images[0],
        ageofdevice: item.ageofdevice, // map if available
      }));

      setPeripherals(res);
    }
  }, [data]);

  if (isLoading) return <PeripheralPageSkeleton />;
  if (!peripherals.length) {
    return (
      <div className="bg-gray-100 flex min-h-[calc(100vh-90px)] overflow-y-auto p-2 w-full will-change-transform">
        <div className="w-full flex justify-center items-center h-full">
          <p className="text-gray-500 text-lg">No peripherals found.</p>
        </div>
      </div>
    );
  }


  const getImgType = getFileTypeFromUrl(selectedPeripheral?.image)

  return (
    <div className=" flex min-h-[calc(100vh-90px)] overflow-y-auto p-2 w-full will-change-transform">
      <div className="w-full gap-6 grid grid-cols-1 lg:grid-cols-2">
        {/* Carousel Section */}
        <div className="flex flex-col justify-evenly mx-auto items-center w-xl">
          <div className="w-full flex justify-center">
            <img
              onLoad={() => setLoaded(true)}
              src={`${
                getImgType=== "PDF" ||
                !selectedPeripheral?.image
                  ? dummyImg
                  :  selectedPeripheral?.image
              }`}
              alt={selectedPeripheral?.name}
              className={`w-40 h-40 sm:w-60 sm:h-60 md:w-72 md:h-72 lg:w-80 lg:h-80 p-2 object-contain mx-auto mb-2 rounded-lg bg-[rgba(259,259,259,0.0)] 
          transition-opacity duration-700 ease-in-out ${
            loaded ? "opacity-100" : "opacity-50"
          }`}
            />
          </div>

          <div className="w-full flex justify-center items-center relative mt-2">
            <div className="hidden sm:block mt-0">
              <button
                onClick={handlePrev}
                className="bg-[#2eacb3] shadow-lg p-2 rounded-full transition-transform hover:scale-110"
                disabled={peripherals.length < 2}
              >
                <FiChevronLeft size={24} className="text-white" />
              </button>
            </div>
            <div className="w-full flex justify-center items-center relative min-h-[180px] sm:min-h-[200px] md:min-h-[220px]">
              <AnimatePresence custom={direction} initial={false} mode="wait">
                <motion.div
                  key={selectedPeripheral?.id}
                  className="absolute top-1/2 left-1/2 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-35 lg:h-35 cursor-pointer flex justify-center items-center"
                  style={{
                    translateX: "-50%",
                    translateY: "-50%",
                  }}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                  onClick={() => {}}
                >
                  <img
                    src={`${
                      getImgType === "PDF" ||
                      !selectedPeripheral?.image
                        ? dummyImg
                        : selectedPeripheral?.image
                    }`}
                    alt={selectedPeripheral?.name}
                    className={`w-full h-full object-cover rounded-xl p-1 shadow-lg transition-all duration-300 ring-4 ring-[#2eacb3]`}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="hidden sm:block mt-0">
              <button
                onClick={handleNext}
                className="bg-[#2eacb3] shadow-lg p-2 rounded-full transition-transform hover:scale-110"
                disabled={peripherals.length < 2}
              >
                <FiChevronRight size={24} className="text-white" />
              </button>
            </div>
          </div>
          {/* Mobile navigation arrows */}
          <div className="flex w-full justify-center space-x-4 items-center mt-1 sm:hidden">
            <button
              onClick={handlePrev}
              className="bg-[#2eacb3] shadow-lg p-2 rounded-full transition-transform hover:scale-110"
              disabled={peripherals.length < 2}
            >
              <FiChevronLeft size={20} className="text-white" />
            </button>
            <button
              onClick={handleNext}
              className="bg-[#2eacb3] shadow-lg p-2 rounded-full transition-transform hover:scale-110"
              disabled={peripherals.length < 2}
            >
              <FiChevronRight size={20} className="text-white" />
            </button>
          </div>
        </div>
        {/* Details Section */}
        <div className="w-full max-w-2xl m-auto overflow-y-auto will-change-transform h-[60vh] sm:h-[70vh] rounded-2xl shadow-2xl border border-gray-200 bg-white flex flex-col">
          <div className="h-2 w-full bg-[#2eacb3] rounded-t-2xl mb-2" />
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedPeripheral?.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="p-4 w-full mx-auto"
            >
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-[#2eacb3] mb-6 flex items-center gap-2">
                <span className="text-gray-400 font-bold">
                  #{currentIndex + 1}
                </span>
                {selectedPeripheral?.name}
              </h2>

              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <p className="w-32 sm:w-40 min-w-[100px] sm:min-w-[120px] font-semibold text-gray-500 text-base">
                    Serial ID:
                  </p>
                  <p className="text-gray-800 text-base break-words">
                    {selectedPeripheral?.serialNo}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <p className="w-32 sm:w-40 min-w-[100px] sm:min-w-[120px] font-semibold text-gray-500 text-base">
                    Model:
                  </p>
                  <p className="text-gray-800 text-base break-words">
                    {selectedPeripheral?.model}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <p className="w-32 sm:w-40 min-w-[100px] sm:min-w-[120px] font-semibold text-gray-500 text-base">
                    Description:
                  </p>
                  <p className="text-gray-800 text-base flex-1 text-justify break-words">
                    {selectedPeripheral?.description}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <p className="w-32 sm:w-40 min-w-[100px] sm:min-w-[120px] font-semibold text-gray-500 text-base">
                    Allotted Date:
                  </p>
                  <p className="text-gray-800 text-base">
                    {selectedPeripheral?.allotedon}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default PeripheralPage;
