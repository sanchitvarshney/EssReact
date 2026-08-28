import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  widthClass?: string;
}

export default function Modal({ title, onClose, children, widthClass = "max-w-2xl" }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        className="absolute inset-0 bg-black/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        onClick={onClose}
      />
      <motion.div
        className={`relative w-full ${widthClass} max-h-[85vh] overflow-y-auto bg-white border border-gray-200 rounded-md shadow-xl`}
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 flex items-center justify-between px-5 py-4">
          <h2 className="text-gray-800 font-semibold">{title}</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </motion.div>
    </div>
  );
}
