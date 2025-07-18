import { useEffect, useState } from "react";
import DocView from "../components/reuseable/DocView";
import LeaveGrantCard from "../components/reuseable/LeaveGrantCard";
import {
  CircularProgress,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import {
  useApprovalGrantLeaveMutation,
  useGetleaveGrantDetailsMutation,
  useGetLeaveListMutation,
} from "../services/Leave";
import { useToast } from "../hooks/useToast";
import EmptyData from "../components/reuseable/EmptyData";
import LeaveGrantPageSkeleton from "../skeleton/LeaveGrantPageSkeleton";
import DotLoading from "../components/reuseable/DotLoading";
import CloseIcon from "@mui/icons-material/Close";
import SessionTable from "../components/reuseable/SessionTable";

import { CustomButton } from "../components/ui/CustomButton";
import { Textarea } from "../components/ui/textarea";

const LeaveGrantPage = () => {
  const [view, setView] = useState(false);
  
  const { showToast } = useToast();
  const [reason, setReason] = useState<string>("");
  const [getLeaveList, { data: leaveGrantData, isLoading: leaveGrantLoading }] =
    useGetLeaveListMutation();
  const [
    getleaveGrantDetails,
    { data: leaveGrantDetailsData, isLoading: leaveGrantDetailsLoading },
  ] = useGetleaveGrantDetailsMutation();
  const [
    approvalGrantLeave,
    { isLoading: rejectGrantLeaveLoading, isSuccess },
  ] = useApprovalGrantLeaveMutation();

  //

  useEffect(() => {
    getLeaveList();
  }, [isSuccess]);

  //fetch grant details
  const fetchGrantDetails = (data: any) => {
    const payload = {
      empcode: data?.empcode,
      leavetype: data?.leavetype,
      status: data?.status,
      trackid: data?.trackid,
    };
    getleaveGrantDetails(payload);
  };

  //handle reject leave
  const handleReject = (data: any, type: string) => {
    const payload = {
      empcode: data?.empcode,
      trackid: data?.trackid,
      status: data?.status,
      reason: reason,
    };
    let url;
    if (type === "approve") {
      url = "LeaveApprove";
    } else {
      url = "LeaveReject";
    }

    approvalGrantLeave({ url: url, body: payload })
      .then((res: any) => {
        if (res?.status === "error") {
          showToast(res?.data?.message, "error");
          return;
        }
        showToast(res?.data?.message, "success");
        setReason("");
        setView(false);
      })
      .catch((err) => {
        showToast(
          err?.data?.message?.msg || err?.message || "We're Sorry An unexpected error has occured. Our technical staff has been automatically notified and will be looking into this with utmost urgency.",
          "error"
        );
      });
  };

  if (leaveGrantLoading) {
    return <LeaveGrantPageSkeleton />;
  }

  return (
    <div className="w-full p-4 h-[calc(100vh-90px)]  overflow-hidden flex flex-col ">
      <Typography variant="subtitle1" fontWeight={600}>{`Total Request (${
        leaveGrantData?.totalrequest ? leaveGrantData?.totalrequest : 0
      })`}</Typography>
      { leaveGrantData?.data?.length === 0 ||
      leaveGrantData?.status === "error" ? (
        <div className="w-full h-full flex items-center justify-center">
          <EmptyData />
        </div>
      ) : (
        <div className="w-full grid  grid-cols-1  sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 px-2 overflow-y-auto mt-2  mx-auto will-change-transform py-2  ">
          {leaveGrantData?.data?.map((item: any) => (
            <LeaveGrantCard
              key={item?.trackid}
              data={item}
              maxWidth={"100%"}
              isView={false}
              open={() => {
                setView(true);
                fetchGrantDetails(item);
              }}
            />
          ))}
        </div>
      )}

      <DocView
        open={view}
        close={() => setView(false)}
        vertical={"bottom"}
        horizontal={"center"}
        transformOrigin={"bottom"}
      >
        {leaveGrantDetailsLoading ? (
          <div className="w-full h-[100%] flex items-center justify-center">
            <DotLoading />
          </div>
        ) : (
          <div className="w-full p-4 ">
            <div className="w-full flex items-center justify-between ">
              <Typography
                variant="subtitle1"
                fontWeight={600}
                sx={{ fontSize: { xs: "1rem", sm: "1.1rem" } }}
              >
                Leave Grant Details
              </Typography>
              <IconButton
                aria-label="close"
                onClick={() => setView(false)}
                sx={{
                  color: (theme) => theme.palette.grey[800],
                }}
              >
                <CloseIcon />
              </IconButton>
            </div>
            <Divider sx={{ mt: 1 }} />

            <div className="h-[66vh] sm:h-[68vh] overflow-y-auto will-change-transform">
              <LeaveGrantCard
                maxWidth={"100%"}
                isView={true}
                data={leaveGrantDetailsData?.data}
              />
              <Divider />
              <Typography
                variant="subtitle1"
                fontWeight={600}
                fontSize={15}
                textAlign={"center"}
                my={1}
              >
                Leave Balance : {leaveGrantDetailsData?.data?.leavebalance}
              </Typography>
              <div className="flex justify-between items-center my-1">
                <div className="flex items-center  gap-2 ">
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    fontSize={15}
                  >
                    From Date :
                  </Typography>

                  <span className="text-[14px]">{`${leaveGrantDetailsData?.data?.fromdt}`}</span>
                </div>
                <div className="flex items-center gap-2 ">
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    fontSize={15}
                  >
                    To Date :
                  </Typography>

                  <span className="text-[14px]">{`${leaveGrantDetailsData?.data?.todt}`}</span>
                </div>
              </div>
              <Typography
                variant="subtitle2"
                sx={{
                  fontSize: { xs: "1rem", sm: "1.1rem" },
                  fontWeight: 600,
                }}
              >
                Reason:{" "}
                <span className="font-[400] text-[16px]">
                  {leaveGrantDetailsData?.data?.reason}
                </span>
              </Typography>
              <Divider sx={{ my: 2 }} />
              <SessionTable rows={leaveGrantDetailsData?.data?.breakup} />
            </div>
            <div className="flex justify-center  flex-wrap items-center mt-4 gap-2">
              <div className="w-full">
                <Textarea
                  className="border border-gray-500 text-md rounded-sm focus:border-[#2eacb3] focus:ring-2 focus:ring-[#2eacb3] transition-all max-h-[30px]"
                  placeholder="Enter Reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                />
              </div>

              {rejectGrantLeaveLoading ? (
                <CircularProgress sx={{ color: "#ffffff" }} size={"35px"} />
              ) : (
                <div className="flex gap-2">
                  <CustomButton
                    onClick={() =>
                      handleReject(leaveGrantDetailsData?.data, "approve")
                    }
                    className="bg-green-700 text-white  hover:bg-green-600  transition-transform duration-300 ease-in-out hover:scale-105  cursor-pointer"
                  >
                    Approved
                  </CustomButton>
                  <CustomButton
                    onClick={() =>
                      handleReject(leaveGrantDetailsData?.data, "reject")
                    }
                    className="bg-red-700 text-white hover:bg-red-600    transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer"
                  >
                    Rejected
                  </CustomButton>
                </div>
              )}
            </div>
          </div>
        )}
      </DocView>
    </div>
  );
};

export default LeaveGrantPage;
