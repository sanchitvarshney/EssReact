import { IconButton, Typography } from "@mui/material";
import { CustomButton } from "../components/ui/CustomButton";
import LeaveCard from "../components/reuseable/LeaveCard";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";

import { useEffect, useState } from "react";
import CustomModal from "../components/reuseable/CustomModal";
import ApplyLeavePage from "./ApplyLeavePage";
import LeaveTabs from "../components/leave/LeaveTabs";
import {
  useGetEarnLeaveMutation,
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
import { btnstyle } from "../constants/themeConstant";

const LeavePage = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [leaveData, setLeaveData] = useState<any[]>([]);

  const { user } = useAuth();
  const { showToast } = useToast();

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
  const [
    updateElLeave,
    { isLoading: updateElLeaveLoading, isSuccess: updateElLeaveSuccess },
  ] = useUpdateElLeaveMutation();
  const [
    updateSlLeave,
    { isLoading: updateSlLeaveLoading, isSuccess: updateSlLeaveSuccess },
  ] = useUpdateSlLeaveMutation();
  const [
    updateWfhLeave,
    { isLoading: updateWfhLeaveLoading, isSuccess: updateWfhLeaveSuccess },
  ] = useUpdateWfhLeaveMutation();

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
          "An unexpected error occurred.",
        "error",
      );
    }
  }, [eranLeaveError, sickLeaveError, wfhError]);

  useEffect(() => {
    //@ts-ignore
    if (!user?.id) return;
    const currentDate = new Date().toISOString().split("T")[0];
    //@ts-ignore
    getEranLeave({ type: "EL", currentDate, empcode: user.id });
    //@ts-ignore
    getSickLeave({ type: "SL", currentDate, empcode: user.id });
    //@ts-ignore
    getWorkFromHome({ type: "WFH", currentDate, empcode: user.id });
  }, [
    //@ts-ignore
    user?.id,
    updateElLeaveSuccess,
    updateSlLeaveSuccess,
    updateWfhLeaveSuccess,
  ]);

  useEffect(() => {
    if (eranLeaveData && sickLeaveData && wfhData) {
      setLeaveData([
        {
          type: "Earned Leave",
          img: elimg,
          currentlyAvailable: eranLeaveData?.data?.l_cl_bal,
          creditedFromLastMonth: eranLeaveData?.data?.l_op_bal,
          annualAllotment: eranLeaveData?.data?.total_yr_bal,
        },
        {
          type: "Sick Leave",
          img: slimg,
          currentlyAvailable: sickLeaveData?.l_cl_bal,
          creditedFromLastMonth: sickLeaveData?.l_op_bal,
          annualAllotment: sickLeaveData?.total_yr_bal,
        },
        {
          type: "Work From Home",
          img: wfmimg,
          currentlyAvailable: wfhData?.l_cl_bal,
          creditedFromLastMonth: wfhData?.l_op_bal,
          annualAllotment: wfhData?.total_yr_bal,
        },
        {
          type: "Compensatory Leave",
          img: climg,
          currentlyAvailable: eranLeaveData?.compBal ?? 0,
          creditedFromLastMonth: 0,
          annualAllotment: 0,
        },
      ]);
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
    } catch {
      showToast("Error updating leave", "error");
    }
  };

  const isBusy =
    eranLeaveLoading ||
    sickLeaveLoading ||
    wfhLoading ||
    updateElLeaveLoading ||
    updateSlLeaveLoading ||
    updateWfhLeaveLoading;

  return (
    <div className="h-full flex flex-col overflow-hidden px-3 py-4 w-full">
      <div className="mb-3 flex-shrink-0">
        <LeaveTabs />
      </div>
      {/* Page header: title on the left, actions on the right */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div
            style={{ backgroundColor: "#00a0a0" }}
            className="w-1 h-7 rounded-full"
          />
          <Typography
            sx={{
              fontSize: { xs: 16, sm: 19 },
              fontWeight: 700,
              color: "#232324",
            }}
          >
            Leave Management
          </Typography>
        </div>

        <div className="flex items-center gap-2">
          <CustomButton
            onClick={() => setIsOpenModal(true)}
            disabled={isBusy}
            className={btnstyle}
            style={{ marginTop: 0 }}
          >
            <AddIcon sx={{ fontSize: 15, marginRight: "3px" }} />
            Apply Leave
          </CustomButton>

          <CustomToolTip
            title="Refresh leave balance (you can update your leave starting on the 1st of each month)."
            placement="bottom"
          >
            <span>
              <IconButton
                onClick={refetch}
                disabled={isBusy}
                aria-label="Refresh leave balance"
                sx={{
                  width: 40,
                  height: 40,
                  color: "#007f86",
                  bgcolor: "#e0f6f6",
                  "&:hover": { bgcolor: "#cdeaea" },
                  "&.Mui-disabled": { opacity: 0.5 },
                }}
              >
                <RefreshIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </span>
          </CustomToolTip>
        </div>
      </div>

      {/* Leave cards */}
      <div className="overflow-y-auto custom-scrollbar-for-menu">
        {isBusy ? (
          <LeavePageSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-4">
            {leaveData.map((leave: any) => (
              <LeaveCard
                key={leave.type}
                title={leave.type}
                img={leave.img}
                currentValue={leave.currentlyAvailable}
                credited={`${leave.creditedFromLastMonth} days`}
                annualAllotment={`${leave.annualAllotment} days`}
              />
            ))}
          </div>
        )}
      </div>

      <CustomModal
        open={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        title="Apply For Leave"
      >
        <ApplyLeavePage onClose={() => setIsOpenModal(false)} />
      </CustomModal>

    </div>
  );
};

export default LeavePage;
