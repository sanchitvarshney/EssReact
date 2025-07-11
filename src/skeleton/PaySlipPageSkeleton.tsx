import { Skeleton } from "@mui/material";

const PaySlipPageSkeleton = () => {
  return (
    <div className=" h-[calc(100vh-90px)] flex flex-col items-center overflow-hidden w-full p-8 ">
      <div className=" w-full max-w-5xl   p-0">
        <div className=" font-bold mb-2 flex justify-center">
          <Skeleton
            variant="text"
            animation="wave"
            width={260}
            sx={{ fontSize: "1rem" }}
          />
        </div>
        <div className="w-[100%] mx-auto p-2 flex justify-center items-center  mb-2  rounded-lg">
          <div className="flex items-center justify-center gap-3 w-full">
            <Skeleton variant="rectangular" width={300} height={40} />
            <Skeleton variant="rectangular" width={200} height={40} />
          </div>
        </div>
      </div>
      <div className="w-full h-[80vh]  overflow-hidden">
        <div className=" w-full h-[80vh] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6  ">
          <div>
            <Skeleton
              variant="rectangular"
              width={"100%"}
              height={"100%"}
              animation="wave"
            />
          </div>

          <div className="  ">
            <Skeleton
              variant="rectangular"
              width={"100%"}
              height={"100%"}
              animation="wave"
            />
          </div>
        </div>
      </div>
      <div className="  w-full flex flex-row items-center justify-between mt-2">
        <Skeleton variant="rectangular" width={"100%"} height={80} />
      </div>
    </div>
  );
};

export default PaySlipPageSkeleton;
