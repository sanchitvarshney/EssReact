// import { LinearProgress, Typography } from "@mui/material";

// const AppLoader = ({ logo }: any) => {
//   return (
//     <div className="h-screen flex flex-col items-center justify-center w-full  bg-white">
//       <img src={logo} alt="Mscorpres Logo" className="w-[500px] opacity-50" />

//       <LinearProgress sx={{ width: "500px", height: "5px", mt: 2 }} />
//       <Typography variant="h6" sx={{ mt: 4 }}>
//         Loading ESS Portal
//       </Typography>
//     </div>
//   );
// };

// export default AppLoader;


// import { LinearProgress, Typography } from "@mui/material";

// const AppLoader = ({ logo }: any) => {
//   return (
//     <div className="h-screen flex flex-col items-center justify-center w-full  bg-white">
//       <img src={logo} alt="Mscorpres Logo" className="w-[500px] opacity-50" />

//       <LinearProgress sx={{ width: "500px", height: "5px", mt: 2 }} />
//       <Typography variant="h6" sx={{ mt: 4 }}>
//         Loading ESS Portal
//       </Typography>
//     </div>
//   );
// };

// export default AppLoader;

import { LinearProgress } from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const AppLoader = ({ logo }: any) => {
  const text = "Loading ESS Portal...";
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;

    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i));
      i++;

      if (i === text.length) {
        clearInterval(interval);
      }
    }, 120);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center w-full bg-white">
      <motion.img
        src={logo}
        alt="Logo"
        className="w-[500px] opacity-60"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{
          opacity: 0.6,
          scale: [0.98, 1.05, 0.98],
        }}
        transition={{
          opacity: { duration: 0.8 },
          scale: {
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          },
          y: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          },
          x: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      />

      <LinearProgress
        sx={{
          width: "500px",
          height: "4px",
          mt: 0,
       
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{ marginTop: 5 }}
      >
        <h2
          style={{
            fontSize: "18px",
            fontWeight: 500,
            color: "#444",
            textAlign: "center",
            letterSpacing: "0.5px",
          }}
        >
          {displayed}
          <span>|</span>
        </h2>
      </motion.div>
    </div>
  );
};

export default AppLoader;

