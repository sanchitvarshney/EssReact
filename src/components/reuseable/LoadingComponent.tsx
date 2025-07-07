import CircularProgress from "@mui/material/CircularProgress";
const LoadingComponent = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <CircularProgress color="success"  />
    </div>
  );
};

export default LoadingComponent;
