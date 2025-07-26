import { Box, Modal } from "@mui/material";
import { CustomButton } from "../components/ui/CustomButton";
import LeaveCard from "../components/reuseable/LeaveCard";

import { useEffect, useState } from "react";
import CustomModal from "../components/reuseable/CustomModal";
import ApplyLeavePage from "./ApplyLeavePage";

import HolidayPage from "../components/HolidayPage";
import {
  useGetEarnLeaveMutation,
  useGetPendingRequestMutation,
  useGetSickLeaveMutation,
  useGetWorkFromHomeMutation,
  useUpdateElLeaveMutation,
  useUpdateSlLeaveMutation,
  useUpdateWfhLeaveMutation,
} from "../services/Leave";
import { useAuth } from "../contextapi/AuthContext";
import LeavePageSkeleton from "../skeleton/LeavePageSkeleton";
import { useToast } from "../hooks/useToast";
import elimg from "../assets/elpng.png";
import slimg from "../assets/slimg.png";
import wfmimg from "../assets/wfhpng.png";
import climg from "../assets/climg.png";
import CustomToolTip from "../components/reuseable/CustomToolTip";

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
  const [countPendingReq, setCountPendingReq] = useState<number | string>(0);

  const [
    getEranLeave,
    { data: eranLeaveData, isLoading: eranLeaveLoading, error: eranLeaveError },
  ] = useGetEarnLeaveMutation();
  const [
    getSickLeave,
    { data: sickLeaveData, isLoading: sickLeaveLoading, error: sickLeaveError },
  ] = useGetSickLeaveMutation();
  const [
    getWorkFromHome,
    { data: wfhData, isLoading: wfhLoading, error: wfhError },
  ] = useGetWorkFromHomeMutation();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [leaveData, setLeaveData] = useState<any | undefined>([]);

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const [
    getPendingRequest,
    { data: pendingReqData, isLoading: pendingReqLoading, error: pendingError },
  ] = useGetPendingRequestMutation();

  const [
    updateElLeave,
    { isLoading: updateElLeaveLoading, isSuccess: updateElLeaveSuccess,data:updateElLeaveData },
  ] = useUpdateElLeaveMutation();
  const [
    updateSlLeave,
    { isLoading: updateSlLeaveLoading, isSuccess: updateSlLeaveSuccess,data:updateSlLeaveData },
  ] = useUpdateSlLeaveMutation();
  const [
    updateWfhLeave,
    { isLoading: updateWfhLeaveLoading, isSuccess: updateWfhLeaveSuccess,data:updateWfhLeaveData },
  ] = useUpdateWfhLeaveMutation();

  useEffect(() => {
    if (!user) return;
    //@ts-ignore
    getPendingRequest({ empcode: user?.id }).unwrap();
  }, [user, updateElLeaveSuccess, updateSlLeaveSuccess, updateWfhLeaveSuccess]);

  useEffect(() => {
    if (pendingError) {
      const error = eranLeaveError as any;
      showToast(
        error?.message ||
          error?.data?.message ||
          "We're Sorry An unexpected error has occured. Our technical staff has been automatically notified and will be looking into this with utmost urgency.",
        "error"
      );
    }
  }, [pendingError]);
  // const navigate = useNavigate();

  useEffect(() => {
    if (eranLeaveError || sickLeaveError || wfhError) {
      showToast(
        //@ts-ignore
        eranLeaveError?.message ||
          //@ts-ignore
          eranLeaveError?.data?.message ||
          //@ts-ignore
          sickLeaveError?.message ||
          //@ts-ignore
          sickLeaveError?.data?.message ||
          //@ts-ignore
          wfhError?.message ||
          //@ts-ignore
          wfhError?.data?.message ||
          "We're Sorry An unexpected error has occured. Our technical staff has been automatically notified and will be looking into this with utmost urgency.",
        "error"
      );
    }
  }, [eranLeaveError, sickLeaveError, wfhError]);

  useEffect(() => {
    //@ts-ignore
    if (!user?.id) return;
    const currentDate = new Date().toISOString().split("T")[0];

    //@ts-ignore
    getEranLeave({ type: "EL", currentDate, empcode: user?.id });
    //@ts-ignore
    getSickLeave({ type: "SL", currentDate, empcode: user?.id });
    //@ts-ignore
    getWorkFromHome({ type: "WFH", currentDate, empcode: user?.id });
  }, [
    //@ts-ignore
    user?.id,
    // updateElLeaveSuccess,
    // updateSlLeaveSuccess,
    // updateWfhLeaveSuccess,
  ]);

  useEffect(() => {
    if (eranLeaveData && sickLeaveData && wfhData) {
      const result = [
        {
          type: "Earned Leave",
          img: elimg,
          currentlyAvailable: eranLeaveData?.data?.l_cl_bal || updateElLeaveData?.data?.l_cl_bal,

          creditedFromLastMonth: eranLeaveData?.data?.l_op_bal || updateElLeaveData?.data?.l_op_bal,
          annualAllotment: eranLeaveData?.data?.total_yr_bal || updateElLeaveData?.data?.total_yr_bal,
        },
        {
          type: "Sick Leave",
          img: slimg,
          currentlyAvailable: sickLeaveData?.l_cl_bal || updateSlLeaveData?.l_cl_bal,
          creditedFromLastMonth: sickLeaveData?.l_op_bal || updateSlLeaveData?.l_op_bal,
          annualAllotment: sickLeaveData?.total_yr_bal || updateSlLeaveData?.total_yr_bal,
        },
        {
          type: "Work From Home",
          img: wfmimg,
          currentlyAvailable: wfhData?.l_cl_bal || updateWfhLeaveData?.l_cl_bal,
          creditedFromLastMonth: wfhData?.l_op_bal || updateWfhLeaveData?.l_op_bal,
          annualAllotment: wfhData?.total_yr_bal || updateWfhLeaveData?.total_yr_bal,
        },
        {
          type: "Compensatory Leave",
          img: climg,
          currentlyAvailable:
            eranLeaveData?.compBal === null ? 0 : eranLeaveData?.compBal,
          creditedFromLastMonth: 0,
          annualAllotment: 0,
        },
      ];

      setLeaveData(result);
    }
  }, [eranLeaveData, sickLeaveData, wfhData]);

  const refetch = async () => {
    try {
      await Promise.all([
        updateElLeave().unwrap(),
        updateSlLeave().unwrap(),
        updateWfhLeave().unwrap(),
      ]);
      showToast("Leave updated successfully", "success");
    } catch (err) {
      showToast("Error updating leave", "error");
    }
  };

  useEffect(() => {
    if (pendingReqData) {
      const countValue = pendingReqData.filter((item: any) => {
        return item.status === "PEN";
      }).length;
      setCountPendingReq(countValue);
    }
  }, [pendingReqData]);

  return (
    <div className="w-full px-6 py-3">
      {eranLeaveLoading ||
      sickLeaveLoading ||
      wfhLoading ||
      pendingReqLoading ||
      updateElLeaveLoading ||
      updateSlLeaveLoading ||
      updateWfhLeaveLoading ? (
        <LeavePageSkeleton />
      ) : (
        <>
          {" "}
          <div className="flex w-full justify-between items-center flex-wrap gap-2   ">
            <div className="flex gap-[2px] flex-wrap">
              <span className="text-md  select-none  font-semibold   ">
                Pending Requests ({countPendingReq})
              </span>
            </div>
            <div className="flex gap-[20px] flex-wrap">
              <CustomButton
                onClick={() => setOpen(true)}
                className="bg-[#fff] text-[#000] border-[#000] border-1 rounded-[2px] cursor-pointer hover:bg-[#e0e0e0]"
              >
                LIST OF HOLYDAYS
              </CustomButton>
              <CustomButton
                onClick={() => setIsOpenModal(true)}
                className=" cursor-pointer bg-[#000] text-[#fff] rounded-[2px] cursor-pointer hover:bg-[#4a4949]"
              >
                APPLY LEAVE
              </CustomButton>
              <CustomToolTip
                title={
                  "You can update your leave starting on the 1st of each month."
                }
                placement={"bottom"}
              >
                <CustomButton
                  onClick={() => refetch()}
                  className=" cursor-pointer bg-[#000] text-[#fff] rounded-[2px] cursor-pointer hover:bg-[#4a4949]"
                >
                  Refresh Leave
                </CustomButton>
              </CustomToolTip>
            </div>
          </div>
          <div className="  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-4  gap-4  ">
            {leaveData.map((leave: any) => (
              <LeaveCard
                key={leave.type}
                title={leave.type}
                img={leave.img}
                currentValue={`${leave.currentlyAvailable} days`}
                credited={`${leave.creditedFromLastMonth} days`}
                annualAllotment={`${leave.annualAllotment} days`}
              />
            ))}
          </div>
          <CustomModal
            open={isOpenModal}
            onClose={() => setIsOpenModal(false)}
            title={"Apply For Leave"}
          >
            <ApplyLeavePage onClose={() => setIsOpenModal(false)} />
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
        </>
      )}
    </div>
  );
};

export default LeavePage;
