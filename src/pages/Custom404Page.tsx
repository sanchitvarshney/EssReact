import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Custom404Page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#000] to-[#fff] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mb-8"
        >
          <h1 className="text-9xl md:text-[12rem] font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent tracking-tight drop-shadow-lg">
            404
          </h1>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 blur-xl -z-10"></div>
        </motion.div>

        <motion.div
          initial={{ y: -50, opacity: 0, rotate: -12 }}
          animate={{ y: 0, opacity: 1, rotate: -12 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
          className="relative mb-8"
        >
          <div className="inline-block bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-full shadow-lg transform -rotate-12">
            <span className="text-sm font-semibold tracking-wide">
              Page Not Found
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 to-pink-500/30 blur-lg -z-10"></div>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Oops! Something went wrong
          </h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-md mx-auto">
            The page you're looking for seems to have wandered off into the
            digital void. Don't worry, let's get you back on track!
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            to="/"
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:from-blue-700 hover:to-indigo-700"
          >
            <span className="relative z-10">Go Home</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:border-gray-300"
          >
            <span className="relative z-10">Go Back</span>
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-16 flex justify-center space-x-2"
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
              className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
            />
          ))}
        </motion.div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400/60 to-purple-400/60 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Custom404Page;
