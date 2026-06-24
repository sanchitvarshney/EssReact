import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchOffIcon from "@mui/icons-material/SearchOff";

const Custom404Page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdfe] via-white to-[#f8fafc] flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* Background decorative blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-72 h-72 bg-[#2eacb3]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-[#2eacb3]/08 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#e0f7fa]/40 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center max-w-lg mx-auto flex flex-col items-center">

        {/* Animated icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-6"
        >
          <div className="relative inline-flex items-center justify-center">
            {/* Outer ring pulse */}
            <motion.div
              animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.15, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-36 h-36 rounded-full bg-[#2eacb3]/20"
            />
            {/* Icon container */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#2eacb3] to-[#0097a7] flex items-center justify-center shadow-lg shadow-[#2eacb3]/30">
              <SearchOffIcon sx={{ fontSize: 44, color: "#fff" }} />
            </div>
          </div>
        </motion.div>

        {/* 404 number */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
          className="text-[7rem] sm:text-[9rem] font-black leading-none tracking-tight"
          style={{
            background: "linear-gradient(135deg, #2eacb3 0%, #0097a7 50%, #00838f 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          404
        </motion.h1>

        {/* Badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="mb-4"
        >
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#0097a7] bg-[#e0f7fa] border border-[#2eacb3]/25 px-4 py-1.5 rounded-full">
            Page Not Found
          </span>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mb-8 flex flex-col gap-2"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Oops! This page doesn't exist.
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed max-w-sm mx-auto">
            The page you're looking for may have been moved, deleted, or never
            existed. Let's get you back on track.
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center w-full"
        >
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-xl shadow-md shadow-[#2eacb3]/25 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-95"
            style={{ background: "linear-gradient(135deg, #2eacb3, #0097a7)" }}
          >
            <HomeIcon sx={{ fontSize: 18 }} />
            Go to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-[#2eacb3]/50 hover:bg-[#f0fdfe] hover:text-[#2eacb3] transition-all duration-200 hover:scale-[1.02] active:scale-95"
          >
            <ArrowBackIcon sx={{ fontSize: 18 }} />
            Go Back
          </button>
        </motion.div>

        {/* Animated dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-12 flex items-center gap-2"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
              className="w-2 h-2 rounded-full bg-[#2eacb3]"
            />
          ))}
        </motion.div>

      </div>
    </div>
  );
};

export default Custom404Page;
