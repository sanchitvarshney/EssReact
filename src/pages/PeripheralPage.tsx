import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Chip, Typography } from "@mui/material";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import DevicesIcon from "@mui/icons-material/Devices";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import TimerIcon from "@mui/icons-material/Timer";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ComputerIcon from "@mui/icons-material/Computer";

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
  deviceAge: string;
  images: string[];
}

const isImageFile = (url: string) => {
  const ext = url?.split(".")?.pop()?.toLowerCase();
  return ["jpg", "jpeg", "png", "webp"].includes(ext || "");
};

const InfoRow = ({
  icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) => (
  <div className="flex gap-3 items-start">
    <div className="flex items-center gap-2 w-32 flex-shrink-0 pt-0.5">
      {icon}
      <span className="text-xs font-semibold text-gray-500">{label}</span>
    </div>
    <span
      className={`text-sm text-gray-800 flex-1 min-w-0 break-words ${mono ? "font-mono" : ""}`}
    >
      {value || "—"}
    </span>
  </div>
);

const PeripheralPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [peripherals, setPeripherals] = useState<Peripheral[]>([]);
  const [peripheralIndex, setPeripheralIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [imgDirection, setImgDirection] = useState(0);
  const [getPeripheral, { data, isLoading }] = useGetPeripheralMutation();

  // Use primitive userId to prevent double-call when user object reference changes
  const userId = (user as any)?.id as string | undefined;

  useEffect(() => {
    if (!userId) return;
    //@ts-ignore
    getPeripheral({ empcode: userId })
      .then((res) => {
        if ((res as any)?.data?.data?.success === false) {
          showToast((res as any)?.data?.data?.message, "error");
        }
      })
      .catch((err: any) => {
        showToast(
          err?.data?.message?.msg ||
            err?.message ||
            "An unexpected error occurred.",
          "error",
        );
      });
  }, [userId]);

  useEffect(() => {
    if (!data) return;
    const raw = Array.isArray(data) ? data : [];
    const mapped: Peripheral[] = raw.map((item: any) => {
      const allotedParts = (item.alloted_dt || "").split(" | ");
      return {
        id: item.identity,
        name: item.name,
        model: item.model || "",
        category: item.category || item.catergory || "Device",
        serialNo: item.serial || "",
        description: item.description || "",
        allotedon: allotedParts[0] || "",
        deviceAge: allotedParts.slice(1).join(" ") || "",
        images: Array.isArray(item.images) ? item.images : [],
      };
    });
    setPeripherals(mapped);
    setPeripheralIndex(0);
    setImageIndex(0);
  }, [data]);

  const selected = peripherals[peripheralIndex];
  const validImages = (selected?.images ?? []).filter(isImageFile);
  const displayImage = validImages[imageIndex] ?? dummyImg;

  const handlePrevImage = () => {
    if (validImages.length < 2) return;
    setImgDirection(-1);
    setImageIndex((i) => (i - 1 + validImages.length) % validImages.length);
  };

  const handleNextImage = () => {
    if (validImages.length < 2) return;
    setImgDirection(1);
    setImageIndex((i) => (i + 1) % validImages.length);
  };

  const handleSelectPeripheral = (idx: number) => {
    setPeripheralIndex(idx);
    setImageIndex(0);
    setImgDirection(0);
  };

  if (isLoading) return <PeripheralPageSkeleton />;

  if (!peripherals.length) {
    return (
      <div className="h-[calc(100vh-90px)] flex flex-col items-center justify-center px-3 py-4 w-full">
        <ComputerIcon sx={{ fontSize: 56, color: "#cbd5e1" }} />
        <p className="text-gray-400 text-base mt-3 font-medium">
          No peripherals assigned.
        </p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-90px)] flex flex-col overflow-hidden px-3 py-4 w-full">
      {/* Page header */}
      <div className="flex items-center gap-2 mb-3 flex-shrink-0">
        <div className="w-1 h-7 rounded-full bg-[#2eacb3]" />
        <DevicesIcon sx={{ fontSize: 20, color: "#2eacb3" }} />
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: "#1e293b", fontSize: 18 }}
        >
          My Devices
        </Typography>
        <Chip
          label={`${peripherals.length} item${peripherals.length !== 1 ? "s" : ""}`}
          size="small"
          sx={{
            bgcolor: "#e0f7fa",
            color: "#0097a7",
            fontWeight: 600,
            fontSize: 11,
            height: 22,
          }}
        />
      </div>

      {/* Device tabs */}
      {peripherals.length > 1 && (
        <div className="flex gap-2 mb-3 flex-shrink-0 overflow-x-auto pb-1 custom-scrollbar-for-menu">
          {peripherals.map((p, i) => (
            <button
              key={p.id}
              onClick={() => handleSelectPeripheral(i)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-150 ${
                i === peripheralIndex
                  ? "bg-[#2eacb3] text-white border-[#2eacb3] shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#2eacb3] hover:text-[#2eacb3]"
              }`}
            >
              <ComputerIcon sx={{ fontSize: 13 }} />
              {p.name}
            </button>
          ))}
        </div>
      )}

      {/* Main two-column layout */}
      <div className="flex-1 pb-1 overflow-hidden grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-4 min-h-0">
        {/* Left: image gallery */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
          {/* Main image */}
          <div className="flex-1 relative flex items-center justify-center bg-gray-50 min-h-0 p-6">
            <AnimatePresence custom={imgDirection} mode="wait">
              <motion.img
                key={`${peripheralIndex}-${imageIndex}`}
                src={displayImage}
                alt={selected?.name}
                custom={imgDirection}
                variants={{
                  enter: (d: number) => ({
                    x: d >= 0 ? 60 : -60,
                    opacity: 0,
                    scale: 0.95,
                  }),
                  center: { x: 0, opacity: 1, scale: 1 },
                  exit: (d: number) => ({
                    x: d >= 0 ? -60 : 60,
                    opacity: 0,
                    scale: 0.95,
                  }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 320, damping: 30 }}
                className="object-contain rounded-xl max-h-full max-w-full"
                style={{ maxHeight: 260 }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = dummyImg;
                }}
              />
            </AnimatePresence>

            {/* Image nav arrows */}
            {validImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-500 hover:text-[#2eacb3] hover:shadow-lg transition-all"
                >
                  <FiChevronLeft size={18} />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-500 hover:text-[#2eacb3] hover:shadow-lg transition-all"
                >
                  <FiChevronRight size={18} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails + counter */}
          {validImages.length > 1 && (
            <div className="border-t border-gray-100 px-4 py-3 flex items-center gap-3">
              <div className="flex gap-2 flex-1 overflow-x-auto custom-scrollbar-for-menu pb-0.5">
                {validImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setImgDirection(i > imageIndex ? 1 : -1);
                      setImageIndex(i);
                    }}
                    className={`flex-shrink-0 w-11 h-11 rounded-lg overflow-hidden border-2 transition-all ${
                      i === imageIndex
                        ? "border-[#2eacb3] shadow-sm"
                        : "border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = dummyImg;
                      }}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs text-gray-400 font-medium flex-shrink-0 tabular-nums">
                {imageIndex + 1}/{validImages.length}
              </span>
            </div>
          )}
        </div>

        {/* Right: details */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden min-h-0">
          <div
            className="h-1 rounded-t-2xl "
            style={{ background: "linear-gradient(90deg, #2eacb3, #00d4e4)" }}
          />

          <div className="flex-1 overflow-y-auto custom-scrollbar-for-menu min-h-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={selected?.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.22 }}
                className="p-5 flex flex-col gap-5"
              >
                {/* Title block */}
                <div>
                  <span
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full inline-block mb-2"
                    style={{ backgroundColor: "#e0f7fa", color: "#0097a7" }}
                  >
                    {selected?.category}
                  </span>
                  <h2 className="text-xl font-bold text-gray-800 leading-snug">
                    {selected?.name}
                  </h2>
                  {selected?.model && (
                    <p className="text-sm text-gray-500 mt-0.5">
                      {selected.model}
                    </p>
                  )}
                </div>

                {/* Info rows */}
                <div className="flex flex-col gap-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <InfoRow
                    icon={
                      <FingerprintIcon
                        sx={{ fontSize: 15, color: "#2eacb3" }}
                      />
                    }
                    label="Serial No."
                    value={selected?.serialNo}
                    mono
                  />
                  <div className="h-px bg-gray-200" />
                  <InfoRow
                    icon={
                      <CalendarTodayIcon
                        sx={{ fontSize: 15, color: "#2eacb3" }}
                      />
                    }
                    label="Allotted On"
                    value={selected?.allotedon}
                  />
                  {selected?.deviceAge && (
                    <>
                      <div className="h-px bg-gray-200" />
                      <InfoRow
                        icon={
                          <TimerIcon sx={{ fontSize: 15, color: "#2eacb3" }} />
                        }
                        label="Device Age"
                        value={selected.deviceAge}
                      />
                    </>
                  )}
                </div>

                {/* Description */}
                {selected?.description && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <DescriptionOutlinedIcon
                        sx={{ fontSize: 15, color: "#2eacb3" }}
                      />
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Description
                      </span>
                    </div>
                    <div
                      className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-100"
                      dangerouslySetInnerHTML={{ __html: selected.description }}
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeripheralPage;
