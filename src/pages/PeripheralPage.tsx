import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import mouse from "../assets/mouse.png";
import laptop from "../assets/laptop.png";
import monitor from "../assets/computer.png";
import adaptor from "../assets/phone-charger.png";
import defaultImage from "../assets/photo.png";
import { useGetPeripheralMutation } from "../services/doc";
import { useAuth } from "../contextapi/AuthContext";

import PeripheralPageSkeleton from "../skeleton/PeripheralPageSkeleton";
import { useToast } from "../hooks/useToast";

interface Peripheral {
  id: string;
  name: string;
  category: string;
  serialNo: string;
  description: string;
  allotedon: string;
  image: string;
  ageofdevice?: string;
}

const getImageUrl = (value: string): string => {
  const lowervalue = value.toLowerCase();

  switch (lowervalue) {
    case "mouse":
      return mouse;
    case "adaptor":
      return adaptor;
    case "monitor":
      return monitor;
    case "laptop":
      return laptop;
    default:
      return defaultImage;
  }
};

const PeripheralPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [peripherals, setPeripherals] = useState<Peripheral[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [getPeripheral, { data, isLoading, error }] =
    useGetPeripheralMutation();

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % peripherals.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + peripherals.length) % peripherals.length
    );
  };

  const selectedPeripheral = peripherals[currentIndex];

  useEffect(() => {
    if (user) {
      //@ts-ignore
      getPeripheral({ empcode: user?.id });
    }
  }, [user]);

  useEffect(() => {
    //@ts-ignore
    if (error) {
     
      showToast(
         //@ts-ignore
        error?.message || error?.data?.message || error?.error || "Something went wrong",
        "error"
      );
    }
  
  }, [error]);

  useEffect(() => {
    if (data) {
      const res = data.map((item: any) => ({
        id: item.identity,
        name: item.name,
        category: item.category || item.catergory, // support both spellings
        serialNo: item.serial,
        description: item.description,
        allotedon: item.alloted_dt,
        image: getImageUrl(item.category || item.catergory),
        ageofdevice: item.ageofdevice, // map if available
      }));

      setPeripherals(res);
    }
  }, [data]);

  if (isLoading) return <PeripheralPageSkeleton />;
  if (!peripherals.length) {
    return (
      <div className="bg-gray-100 flex min-h-[calc(100vh-90px)] overflow-y-auto p-2 w-full">
        <div className="w-full flex justify-center items-center h-full">
          <p className="text-gray-500 text-lg">No peripherals found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 flex min-h-[calc(100vh-90px)] overflow-y-auto p-2 w-full">
      <div className="w-full gap-6 grid grid-cols-1 lg:grid-cols-2">
        {/* Carousel Section */}
        <div className="flex flex-col justify-evenly items-center w-full">
          <div className="w-full flex justify-center">
            <img
              src={`${selectedPeripheral?.image}`}
              alt={selectedPeripheral?.name}
              className="w-40 h-40 sm:w-60 sm:h-60 md:w-72 md:h-72 lg:w-80 lg:h-80 p-2 object-contain mx-auto mb-2 rounded-lg  bg-[rgba(259,259,259,0.0)]"
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
            <div
              className="w-full flex justify-center items-center relative min-h-[180px] sm:min-h-[200px] md:min-h-[220px]"
              style={{ perspective: "1000px" }}
            >
              <AnimatePresence>
                {peripherals.length <= 2
                  ? peripherals.map((item, i) => {
                      const isCenter = i === currentIndex;
                      return (
                        <motion.div
                          key={item.id}
                          className="absolute w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-35 lg:h-35 cursor-pointer flex justify-center items-center"
                          style={{
                            top: "50%",
                            left: "50%",
                            x: "-50%",
                            y: "-50%",
                          }}
                          initial={{
                            scale: 0,
                            opacity: 0,
                            rotateY: i > currentIndex ? -90 : 90,
                            x: "-50%",
                          }}
                          animate={{
                            scale: isCenter ? 1 : 0.7,
                            opacity: isCenter ? 1 : 0.4,
                            zIndex: isCenter ? 10 : 1,
                            x: `calc(-50% + ${(i - currentIndex) * 80}px)`,
                            rotateY: 0,
                          }}
                          exit={{
                            scale: 0,
                            opacity: 0,
                            rotateY: i > currentIndex ? 90 : -90,
                            x: "-50%",
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                          onClick={() => setCurrentIndex(i)}
                        >
                          <img
                            src={item?.image}
                            alt={item?.name}
                            className={`w-full h-full object-cover rounded-xl p-1 shadow-lg transition-all duration-300 ${
                              isCenter
                                ? "ring-4 ring-[#2eacb3]"
                                : "ring-2 ring-transparent"
                            }`}
                          />
                        </motion.div>
                      );
                    })
                  : [-2, -1, 0, 1, 2].map((offset: any) => {
                      const index =
                        (currentIndex + offset + peripherals.length) %
                        peripherals.length;
                      const item = peripherals[index];
                      const isCenter = offset === 0;

                      return (
                        <motion.div
                          key={item?.id}
                          className="absolute w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-35 lg:h-35 cursor-pointer flex justify-center items-center"
                          style={{
                            top: "50%",
                            left: "50%",
                            x: "-50%",
                            y: "-50%",
                          }}
                          initial={{
                            scale: 0,
                            opacity: 0,
                            rotateY: offset > 0 ? -90 : 90,
                            x: "-50%",
                          }}
                          animate={{
                            scale: isCenter ? 1 : 0.7,
                            opacity: isCenter ? 1 : 0.4,
                            zIndex: isCenter ? 10 : 1,
                            x: `calc(-50% + ${offset * 80}px)`,
                            rotateY: 0,
                          }}
                          exit={{
                            scale: 0,
                            opacity: 0,
                            rotateY: offset > 0 ? 90 : -90,
                            x: "-50%",
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                          onClick={() => setCurrentIndex(index)}
                        >
                          <img
                            src={item?.image}
                            alt={item?.name}
                            className={`w-full h-full object-cover rounded-xl p-1 shadow-lg transition-all duration-300 ${
                              isCenter
                                ? "ring-4 ring-[#2eacb3]"
                                : "ring-2 ring-transparent"
                            }`}
                          />
                        </motion.div>
                      );
                    })}
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
        <div className="w-full max-w-2xl m-auto overflow-y-auto h-[60vh] sm:h-[70vh] rounded-2xl shadow-2xl border border-gray-200 bg-white flex flex-col">
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

                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <p className="w-32 sm:w-40 min-w-[100px] sm:min-w-[120px] font-semibold text-gray-500 text-base">
                    Age of Device:
                  </p>
                  <p className="text-gray-800 text-base">
                    {selectedPeripheral?.ageofdevice}
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
