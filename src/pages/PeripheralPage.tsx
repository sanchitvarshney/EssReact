import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import mouse from "../assets/mouse.png";
import laptop from "../assets/andrey-matveev-PrVNgIj8DhQ-unsplash.jpg";
import moniter from "../assets/bernd-dittrich-966_0A195uE-unsplash.jpg";

const peripherals: any[] = [
  {
    id: 1,
    name: "Ergonomic Mouse",

    serialNo: "9764789xxxx",
    description: "A comfortable mouse designed for long hours of use.A comfortable mouse designed for long hours of use.A comfortable mouse designed for long hours of use.A comfortable mouse designed for long hours of use.A comfortable mouse designed for long hours of use.A comfortable mouse designed for long hours of use.A comfortable mouse designed for long hours of use.A comfortable mouse designed for long hours of use.A comfortable mouse designed for long hours of use.A comfortable mouse designed for long A comfortable mouse designed for long hours of use.A comfortable mouse designed for long hours of use.A comfortable mouse designed for long hours of use.A comfortable mouse designed for long hours of use.A comfortable mouse designed for long hours of use.A comfortable mouse designed for long hours of use.A comfortable mouse designed for long hours of use.A comfortable mouse designed for long hours of use.hours of use.",
    allotedon: "May 20,2024",
    ageofdevice: "(1 year, 11 months & 19days)",
    image: mouse,
  },
  {
    id: 2,
    name: "Mechanical Keyboard",
    serialNo: "9764789xxxx",
    description: "A tactile and responsive keyboard for typing enthusiasts.",
    allotedon: "May 20,2024",
    ageofdevice: "(1 year, 11 months & 19days)",
    image: laptop,
  },
  {
    id: 3,
    name: "4K Monitor",
    serialNo: "9764789xxxx",
    description: "A high-resolution display for crisp and clear visuals.",
    allotedon: "May 20,2024",
    ageofdevice: "(1 year, 11 months & 19days)",
    image: moniter,
  },
  {
    id: 4,
    name: "Noise-Cancelling Headphones",
    serialNo: "9764789xxxx",
    description: "Immerse yourself in sound without distractions.",
    allotedon: "May 20,2024",
    ageofdevice: "(1 year, 11 months & 19days)",
    image: moniter,
  },
  {
    id: 5,
    name: "Webcam",

    serialNo: "9764789xxxx",
    description: "A high-definition webcam for video conferencing.",
    allotedon: "May 20,2024",
    ageofdevice: "(1 year, 11 months & 19days)",
    image: "https://picsum.photos/seed/webcam/400/300",
  },
];

const PeripheralPage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % peripherals.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + peripherals.length) % peripherals.length
    );
  };

  const selectedPeripheral = peripherals[currentIndex];

  return (
    <div className="bg-gray-100 min-h-[calc(100vh-90px)] p-4 sm:p-6 lg:p-8 w-full">
      <div className="max-w-6xl mx-auto">
        <div className="relative mx-auto  rounded-t-xl bg-[#fff] max-w-4xl h-[240px] md:h-[350px] shadow-2xl">
          <div className="rounded-lg overflow-hidden h-full bg-gray-100 flex items-start justify-start overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedPeripheral.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className=" p-4"
              >
                {/* <img src={selectedPeripheral.image} alt={selectedPeripheral.name} className="w-32 h-32 md:w-48 md:h-48 object-contain mx-auto mb-4 rounded-lg"/> */}
                <h2 className="text-xl md:text-2xl font-bold text-black mb-4">
                  #{currentIndex + 1} {selectedPeripheral.name}
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <p className="w-36 font-semibold text-gray-600 text-sm md:text-base ">
                      Serial ID:
                    </p>
                    <p className="text-gray-800 text-sm md:text-base">
                      {selectedPeripheral.serialNo}
                    </p>
                  </div>
                  <div className="flex items-start">
                    <p className="w-36 font-semibold text-gray-600 text-sm md:text-base ">
                      Description:
                    </p>
                    <p className="text-gray-800 text-sm md:text-base flex-1 text-justify">
                      {selectedPeripheral.description}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <p className="w-36 font-semibold text-gray-600 text-sm md:text-base">
                      Allotted Date:
                    </p>
                    <p className="text-gray-800 text-sm md:text-base">
                      {selectedPeripheral.allotedon}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <p className="w-36 font-semibold text-gray-600 text-sm md:text-base">
                      Age of Device:
                    </p>
                    <p className="text-gray-800 text-sm md:text-base">
                      {selectedPeripheral.ageofdevice}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className=" max-w-4xl relative mt-16 h-30 flex items-center justify-center mx-auto">
          <button
            onClick={handlePrev}
            className="absolute left-0 z-10 bg-[#2eacb3]  shadow-lg p-2 rounded-full transform -translate-y-1/2 top-1/2 transition-transform hover:scale-110"
          >
            <FiChevronLeft size={24} className="text-white" />
          </button>

          <div
            className="relative w-full h-full justify-center flex items-center"
            style={{ perspective: "1000px" }}
          >
            <AnimatePresence>
              {[-2, -1, 0, 1, 2].map((offset) => {
                const index =
                  (currentIndex + offset + peripherals.length) %
                  peripherals.length;
                const item = peripherals[index];
                const isCenter = offset === 0;

                return (
                  <motion.div
                    key={index}
                    className="absolute w-40 h-40 cursor-pointer p-0 flex justify-center items-center"
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
                      x: `calc(-50% + ${offset * 120}px)`, // Adjust spacing
                      rotateY: 0,
                    }}
                    exit={{
                      scale: 0,
                      opacity: 0,
                      rotateY: offset > 0 ? 90 : -90,
                      x: "-50%",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    onClick={() => setCurrentIndex(index)}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className={`w-30 h-30 object-cover rounded-xl p-1 shadow-lg transition-all duration-300 ${
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

          <button
            onClick={handleNext}
            className="absolute right-0  z-10 bg-[#2eacb3]  shadow-lg p-2 rounded-full transform -translate-y-1/2 top-1/2 transition-transform hover:scale-110"
          >
            <FiChevronRight size={24} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PeripheralPage;
