import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

// Same purpose as Modal, for content-heavy forms (multi-section detail
// views, dynamic level editors) that feel cramped in a centered dialog —
// slides in from the right and takes the full viewport height instead.
interface DrawerProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  widthClass?: string;
}

export default function Drawer({ title, onClose, children, widthClass = "max-w-xl" }: DrawerProps) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <motion.div
        className="absolute inset-0 bg-black/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        onClick={onClose}
      />
      <motion.div
        className={`relative w-full ${widthClass} h-full bg-white shadow-xl flex flex-col`}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <div className="shrink-0 border-b border-gray-200 flex items-center justify-between px-6 py-4">
          <h2 className="text-gray-800 font-semibold text-lg">{title}</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
      </motion.div>
    </div>
  );
}
