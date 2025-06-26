import { Box } from "@mui/material";

import task from "../assets/task.png";
import clock from "../assets/clock (2).png";
import review from "../assets/market-review.png";
import notes from "../assets/to-do-list.png";

import PerformanceCard from "../components/reuseable/PerformanceCard";
import PerformenceReview from "../components/PerformenceReview";

const PerformancePage = () => {
  return (
    <Box className=" h-[calc(100vh-90px)] overflow-auto p-4 gap-4 grid  sm:grid-cols-[2fr_1fr] grid-cols-[2fr]  md:grid-cols-[2fr_1fr] ">
      <div className="flex flex-col gap-4">
        <PerformanceCard
          title={"Open Task"}
          width={"800px"}
          svg={task}
          hight={"300px"}
        />
        <PerformanceCard
          title={"Goals"}
          width={"800px"}
          svg={notes}
          hight={"150px"}
        />
        <PerformanceCard
          title={"Feedback"}
          width={"800px"}
          svg={review}
          hight={"300px"}
        ><PerformenceReview /></PerformanceCard>
      </div>
      <div className="flex flex-col items-center gap-4">
        <PerformanceCard
          title={"Activity"}
          width={"380px"}
          svg={clock}
          hight={"300px"}
          des="last 30 days ago"
        />
 
      </div>
    </Box>
  );
};

export default PerformancePage;
