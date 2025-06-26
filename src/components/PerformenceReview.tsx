import { Chip } from "@mui/material";

const PerformenceReview = () => {
  return (
    <div className="w-full">
      <div className="w-full flex justify-center space-x-2">
        <Chip
          
          label={"1M"}
          sx={{
            px:2,
             border:"1px solid  #2eacb3",
            bgcolor: "rgba(52, 159, 195, 0.07)",
            color: "#000",
            fontWeight: 500,
            fontSize: "0.9rem",
            "&:hover": {
              bgcolor: "rgba(52, 159, 195, 0.23)",
            },
          }}
        />
        <Chip
          
          label={"3M"}
          sx={{
                 px:2,
                  border:"1px solid  #2eacb3",
            bgcolor: "rgba(52, 159, 195, 0.07)",
            color: "#000",
            fontWeight: 500,
            fontSize: "0.9rem",
            "&:hover": {
              bgcolor: "rgba(52, 159, 195, 0.23)",
            },
          }}
        />
        <Chip
          
          label={"6M"}
          sx={{
                 px:2,
                  border:"1px solid  #2eacb3",
            bgcolor: "rgba(52, 159, 195, 0.07)",
            color: "#000",
            fontWeight: 500,
            fontSize: "0.9rem",
            "&:hover": {
              bgcolor: "rgba(52, 159, 195, 0.23)",
            },
          }}
        />
        <Chip
          
          label={"1Y"}
          sx={{
                 px:2,
                  border:"1px solid  #2eacb3",
            bgcolor: "rgba(52, 159, 195, 0.07)",
            color: "#000",
            fontWeight: 500,
            fontSize: "0.9rem",
          
            "&:hover": {
              bgcolor: "rgba(52, 159, 195, 0.23)",
            },
          }}
        />
       

      </div>
    </div>
  );
};

export default PerformenceReview;
