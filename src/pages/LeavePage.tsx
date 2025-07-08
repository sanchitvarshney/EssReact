import { Box, Modal } from "@mui/material";
import { CustomButton } from "../components/ui/CustomButton";
import LeaveCard from "../components/reuseable/LeaveCard";
import { leaveData } from "../dummydata/DataforLeave";
import { useState } from "react";
import CustomModal from "../components/reuseable/CustomModal";
import ApplyLeavePage from "./ApplyLeavePage";

import HolidayPage from "../components/HolidayPage";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",

  bgcolor: "background.paper",

  boxShadow: 24,

  overflow: "visible",
  
};

const LeavePage = () => {
  const [open, setOpen] = useState(false);

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  // const navigate = useNavigate();
  return (
    <div className="w-full px-4 py-3">
      <div className="flex w-full justify-between items-center flex-wrap gap-2   ">
        <div className="flex gap-[2px] flex-wrap">
          {/* <Typography>Your Leave balance as of (Date)</Typography> */}
          <span className="text-sm  select-none  font-semibold bg-[#2eacb3] px-3 py-2 rounded-full">
            Pending Requests (0)
          </span>
        </div>
        <div className="flex gap-[20px] flex-wrap">
          <CustomButton
            onClick={() => setOpen(true)}
            className="bg-[#fff] text-[#000] border-[#000] border-1 rounded-[2px] cursor-pointer"
          >
            LIST OF HOLYDAYS
          </CustomButton>
          <CustomButton
            onClick={() => setIsOpenModal(true)}
            className=" cursor-pointer bg-[#000] text-[#fff] rounded-[2px] cursor-pointer"
          >
            APPLY LEAVE
          </CustomButton>
        </div>
      </div>

      <div className="  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-4  gap-4  ">
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

      <CustomModal
        open={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        title={"Apply For Leave"}
      >
        <ApplyLeavePage />
      </CustomModal>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          

          <HolidayPage openClose={() => setOpen(false)} open={open} />
        </Box>
      </Modal>
    </div>
  );
};

export default LeavePage;
