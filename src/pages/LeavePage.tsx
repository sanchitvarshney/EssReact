import { Box, Chip, Modal, Typography } from "@mui/material";
import { CustomButton } from "../components/ui/CustomButton";
import LeaveCard from "../components/reuseable/LeaveCard";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import EventIcon from "@mui/icons-material/Event";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

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
import { useNavigate } from "react-router-dom";
import { btnstyle } from "../constants/themeConstant";

const holidayModalStyle = {
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
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
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
    getPendingRequest,
    { data: pendingReqData, isLoading: pendingReqLoading, error: pendingError },
  ] = useGetPendingRequestMutation();
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
    if (!user) return;
    //@ts-ignore
    getPendingRequest().unwrap();
  }, [user, updateElLeaveSuccess, updateSlLeaveSuccess, updateWfhLeaveSuccess]);

  useEffect(() => {
    if (pendingError) {
      const error = eranLeaveError as any;
      showToast(
        error?.message ||
          error?.data?.message ||
          "An unexpected error occurred.",
        "error",
      );
    }
  }, [pendingError]);

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
    pendingReqLoading ||
    updateElLeaveLoading ||
    updateSlLeaveLoading ||
    updateWfhLeaveLoading;

  const pendingCount = pendingReqData?.pendingRequests ?? 0;

  const handleNavigatePending = () => {
    if (isBusy) {
      showToast("Please wait for the data to load", "error");
      return;
    }
    navigate("/self-service/leave-status");
  };

  return (
    <div className="h-[calc(100vh-90px)] flex flex-col overflow-hidden px-3 py-4 w-full">
      {/* Page header */}
      <div className="flex items-center gap-2 mb-4">
        <div
          style={{ backgroundColor: "#2eacb3" }}
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

      {/* Action bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Pending requests link */}
          <button
            onClick={handleNavigatePending}
            className="flex items-center gap-1.5 group w-fit select-none"
          >
            <PendingActionsIcon sx={{ color: "#f59e0b", fontSize: 18 }} />
            <span className="text-sm font-semibold text-gray-700 group-hover:underline transition-all">
              Pending Requests
            </span>
            <Chip
              label={pendingCount}
              size="small"
              sx={{
                height: 20,
                fontSize: 11,
                fontWeight: 700,
                bgcolor: pendingCount > 0 ? "#fef3c7" : "#f3f4f6",
                color: pendingCount > 0 ? "#d97706" : "#6b7280",
                border: "1px solid",
                borderColor: pendingCount > 0 ? "#fcd34d" : "#e5e7eb",
                "& .MuiChip-label": { px: 1 },
              }}
            />
          </button>

          {/* Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <CustomButton
              onClick={() => setOpen(true)}
              disabled={isBusy}
              className="cursor-pointer gap-1.5 px-4 text-sm font-semibold border border-[#2eacb3] text-[#2eacb3] hover:bg-[#e0f7fa] rounded-md transition-all duration-200 bg-transparent"
            >
              <EventIcon sx={{ fontSize: 15 }} />
              Holidays
            </CustomButton>

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
              title="You can update your leave starting on the 1st of each month."
              placement="bottom"
            >
              <CustomButton
                onClick={refetch}
                disabled={isBusy}
                className="cursor-pointer gap-1.5 px-4 text-sm font-semibold rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200"
              >
                <RefreshIcon sx={{ fontSize: 15 }} />
                Refresh
              </CustomButton>
            </CustomToolTip>
          </div>
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

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0)",
            backdropFilter: "blur(5px)",
            WebkitBackdropFilter: "blur(5px)",
          },
        }}
      >
        <Box sx={holidayModalStyle}>
          <HolidayPage openClose={() => setOpen(false)} open={open} />
        </Box>
      </Modal>
    </div>
  );
};

export default LeavePage;
