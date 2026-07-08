import { memo } from "react";
import { Dialog, IconButton, Chip } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import CloseIcon from "@mui/icons-material/Close";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TimerIcon from "@mui/icons-material/Timer";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import dummyImg from "../../../assets/gallery.png";
import { ACCENT, type AssetItem } from "./types";

interface AssetDetailsDialogProps {
  asset: AssetItem | null;
  index: number;
  direction: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
}

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex gap-3 items-start">
    <div className="flex items-center gap-2 w-32 flex-shrink-0 pt-0.5">
      {icon}
      <span className="text-xs font-semibold text-gray-500">{label}</span>
    </div>
    <span className="text-sm text-gray-800 flex-1 min-w-0 break-words">
      {value || "—"}
    </span>
  </div>
);

const statusColor = (status: string) => {
  const normalized = status?.toUpperCase();
  if (normalized === "VERIFIED" || normalized === "CONFIRM")
    return { bgcolor: "#dcfce7", color: "#15803d" };
  if (normalized === "DISPUTE" || normalized === "MISSING")
    return { bgcolor: "#fee2e2", color: "#b91c1c" };
  return { bgcolor: "#e0f7fa", color: "#0097a7" };
};

const AssetDetailsDialog = memo(function AssetDetailsDialog({
  asset,
  index,
  direction,
  onClose,
  onPrev,
  onNext,
  onSelect,
}: AssetDetailsDialogProps) {
  const images = asset?.images ?? [];

  return (
    <Dialog
      open={!!asset}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}
    >
      {asset && (
        <div className="flex flex-col bg-white max-h-[85vh]">
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 flex-shrink-0">
            <div>
              <p className="text-base font-bold text-gray-800">{asset.name}</p>
              <p className="text-xs text-gray-400">Asset details</p>
            </div>
            <IconButton
              onClick={onClose}
              size="small"
              aria-label="Close asset details"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar-for-menu grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Left: image gallery */}
            <div className="flex flex-col border-b md:border-b-0 md:border-r border-gray-100">
              <div
                className="relative flex items-center justify-center bg-gray-50 min-h-0 p-6"
                style={{ height: 300 }}
              >
                <AnimatePresence custom={direction} mode="wait">
                  <motion.img
                    key={`${asset.id}-${index}`}
                    src={images[index]}
                    alt={asset.name}
                    custom={direction}
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

                {images.length > 1 && (
                  <>
                    <button
                      onClick={onPrev}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-500 hover:text-[#2eacb3] hover:shadow-lg transition-all"
                    >
                      <FiChevronLeft size={18} />
                    </button>
                    <button
                      onClick={onNext}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-500 hover:text-[#2eacb3] hover:shadow-lg transition-all"
                    >
                      <FiChevronRight size={18} />
                    </button>
                  </>
                )}
              </div>

              {images.length > 1 && (
                <div className="border-t border-gray-100 px-4 py-3 flex items-center gap-3">
                  <div className="flex gap-2 flex-1 overflow-x-auto custom-scrollbar-for-menu pb-0.5">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => onSelect(i)}
                        className={`flex-shrink-0 w-11 h-11 rounded-lg overflow-hidden border-2 transition-all ${
                          i === index
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
                    {index + 1}/{images.length}
                  </span>
                </div>
              )}
            </div>

            {/* Right: details */}
            <div className="p-5 flex flex-col gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                {asset.category && (
                  <Chip
                    label={asset.category}
                    size="small"
                    sx={{
                      bgcolor: "#e0f7fa",
                      color: "#0097a7",
                      fontWeight: 600,
                    }}
                  />
                )}
                {asset.status && (
                  <Chip
                    label={asset.status}
                    size="small"
                    sx={{ fontWeight: 600, ...statusColor(asset.status) }}
                  />
                )}
              </div>

              <div className="flex flex-col gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
                <InfoRow
                  icon={<FingerprintIcon sx={{ fontSize: 15, color: ACCENT }} />}
                  label="Model"
                  value={asset.model}
                />
                <div className="h-px bg-gray-200" />
                <InfoRow
                  icon={<FingerprintIcon sx={{ fontSize: 15, color: ACCENT }} />}
                  label="Serial No."
                  value={asset.code}
                />
                <div className="h-px bg-gray-200" />
                <InfoRow
                  icon={<FingerprintIcon sx={{ fontSize: 15, color: ACCENT }} />}
                  label="Identity"
                  value={asset.id}
                />
                <div className="h-px bg-gray-200" />
                <InfoRow
                  icon={
                    <CalendarTodayIcon sx={{ fontSize: 15, color: ACCENT }} />
                  }
                  label="Allotted On"
                  value={asset.allotedOn}
                />
                {asset.deviceAge && (
                  <>
                    <div className="h-px bg-gray-200" />
                    <InfoRow
                      icon={<TimerIcon sx={{ fontSize: 15, color: ACCENT }} />}
                      label="Device Age"
                      value={asset.deviceAge}
                    />
                  </>
                )}
              </div>

              {asset.description && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <DescriptionOutlinedIcon
                      sx={{ fontSize: 15, color: ACCENT }}
                    />
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Description
                    </span>
                  </div>
                  <div
                    className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-100"
                    dangerouslySetInnerHTML={{ __html: asset.description }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
});

export default AssetDetailsDialog;
