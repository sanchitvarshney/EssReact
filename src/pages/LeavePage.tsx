import { Typography } from "@mui/material";
import { CustomButton } from "../components/ui/CustomButton";
import LeaveCard from "../components/reuseable/LeaveCard";
import { leaveData } from "../dummydata/DataforLeave";
import { useState } from "react";
import CustomModal from "../components/reuseable/CustomModal";
import ApplyLeavePage from "./ApplyLeavePage";
import { useNavigate } from "react-router-dom";

const LeavePage = () => {
    
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
    const navigate = useNavigate()
  return (
    <div className="w-full px-6 py-5">
      <div className="flex w-full justify-between items-center flex-wrap gap-4">
        <div className="flex gap-[2px] flex-wrap">
          <Typography>Your Leave balance as of (Date)</Typography>
          <span className="text-sm font-semibold bg-yellow-500 px-2 rounded-full">
            Pending Requests (0)
          </span>
        </div>
        <div className="flex gap-[20px] flex-wrap">
          <CustomButton onClick={()=>navigate('/holidays')} className="bg-[#fff] text-[#000] border-[#000] border-1 rounded-[2px]">
            LIST OF HOLYDAYS
          </CustomButton>
          <CustomButton onClick={()=>setIsOpenModal(true)} className=" cursor-pointer bg-[#000] text-[#fff] rounded-[2px]">
            APPLY LEAVE
          </CustomButton>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 py-8">
        {leaveData.map((leave) => (
          <LeaveCard
            key={leave.type}
            title={leave.type}
            currentValue={`${leave.currentlyAvailable} days`}
            accrued={`${leave.currentlyAvailable} days`}
            credited={`${leave.creditedFromLastYear} days`}
            annualAllotment={`${leave.annualAllotment} days`}
          />
        ))}
      </div>
      <CustomModal open={isOpenModal} onClose={()=> setIsOpenModal(false) } title={"Apply For Leave"} >
        <ApplyLeavePage />
      </CustomModal>
    </div>
  );
};

export default LeavePage;
