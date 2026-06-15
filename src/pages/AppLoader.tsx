import { LinearProgress, Typography } from "@mui/material";

const AppLoader = ({ logo }: any) => {
  return (
    <div className="h-screen flex flex-col items-center justify-center w-full  bg-white">
      <img src={logo} alt="Mscorpres Logo" className="w-[500px] opacity-50" />

      <LinearProgress sx={{ width: "500px", height: "5px", mt: 2 }} />
      <Typography variant="h6" sx={{ mt: 4 }}>
        Loading ESS Portal
      </Typography>
    </div>
  );
};

export default AppLoader;
