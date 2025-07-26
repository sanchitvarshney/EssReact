import { Typography } from "@mui/material";
import nextgenimg from "../../assets/lightlogov2.svg";

const CustomFooter = () => {
  return (
   <div className="w-full  flex-wrap bg-[#444445] px-[50px] sm:px-[200px] flex items justify-between gap-[50px] py-[20px] border-t-1 border-gray-300 text-white">
          <div className="flex flex-col gap-[10px] w-[500px] items-start text-left justify-end">
            <img src="./ms.png" alt="" className="w-[250px]" />
            <div>
              <Typography fontSize={13} className=" ">
                MsCorpres Automation Pvt Ltd
              </Typography>
              <Typography fontSize={13} className=" ">
                Office No. 1 and 2, 3rd Floor, Plot number B-88 Sector 83,
                Noida, Gautam Buddha Nagar, 201305
              </Typography>
              <Typography fontSize={13} className=" ">
                Phone 2: +91 88 26 788880{" "}
              </Typography>
              <Typography fontSize={13} className=" ">
                Email: marketing@mscorpres.in
              </Typography>
            </div>
          </div>
          <div className="flex flex-col items-start gap-y-4  ">
            <div>
              <img src={nextgenimg} alt="nextgenlogo" className="w-50 " />
            </div>
            <Typography fontSize={13} className="">
              © 2017 - {new Date().getFullYear()} | All rights reserved
            </Typography>
          </div>
        </div>
  )
}

export default CustomFooter