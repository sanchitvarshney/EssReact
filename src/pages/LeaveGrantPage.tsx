import { useEffect, useState } from "react";
import DocView from "../components/reuseable/DocView";
import LeaveGrantCard from "../components/reuseable/LeaveGrantCard";
import { CircularProgress, IconButton } from "@mui/material";
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
import EventNoteIcon from "@mui/icons-material/EventNote";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SessionTable from "../components/reuseable/SessionTable";
import { Textarea } from "../components/ui/textarea";
import ConfirmationModal from "../components/reuseable/ConfirmationModal";

/* ── Info row used inside the drawer ── */
const InfoRow = ({ label, value }: { label: string; value?: any }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{label}</span>
    <span className="text-sm font-medium text-gray-800">{value || "—"}</span>
  </div>
);

const LeaveGrantPage = () => {
  const [view, setView] = useState(false);
  const { showToast } = useToast();
  const [reason, setReason] = useState<string>("");
  const [rejectedData, setRejectedData] = useState<any | null>(null);
  const [isRejected, setIsRejected] = useState(false);

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

  useEffect(() => {
    getLeaveList();
  }, [isSuccess]);

  const fetchGrantDetails = (data: any) => {
    getleaveGrantDetails({
      empcode: data?.empcode,
      leavetype: data?.leavetype,
      status: data?.status,
      trackid: data?.trackid,
    });
  };

  const handleReject = (data: any, type: string) => {
    approvalGrantLeave({
      url: type === "approve" ? "LeaveApprove" : "LeaveReject",
      body: { empcode: data?.empcode, trackid: data?.trackid, status: data?.status, reason },
    })
      .then((res: any) => {
        if (res?.status === "error") {
          showToast(res?.data?.message, "error");
          return;
        }
        showToast(res?.data?.message, "success");
        setIsRejected(false);
        setReason("");
        setView(false);
      })
      .catch((err) => {
        showToast(
          err?.data?.message?.msg || err?.message ||
          "An unexpected error has occurred.",
          "error"
        );
      });
  };

  if (leaveGrantLoading) return <LeaveGrantPageSkeleton />;

  const details = leaveGrantDetailsData?.data;

  return (
    <div className="h-[calc(100vh-78px)] flex flex-col overflow-hidden px-3 py-4 w-full">

      {/* Page header */}
      <div className="flex items-center gap-2 mb-3 flex-shrink-0">
        <div className="w-1 h-7 rounded-full bg-[#2eacb3]" />
        <EventNoteIcon sx={{ fontSize: 20, color: "#2eacb3" }} />
        <span className="text-lg font-bold text-gray-800">Leave Requests</span>
        {leaveGrantData?.totalrequest != null && (
          <span className="ml-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#e0f7fa] text-[#2eacb3] border border-[#2eacb3]/20">
            {leaveGrantData.totalrequest} total
          </span>
        )}
      </div>

      {/* Grid */}
      {leaveGrantData?.data?.length === 0 || leaveGrantData?.status === "error" ? (
        <div className="flex-1 flex items-center justify-center">
          <EmptyData />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto custom-scrollbar-for-menu grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 content-start py-1 pr-1">
          {leaveGrantData?.data?.map((item: any) => (
            <LeaveGrantCard
              key={item?.trackid}
              data={item}
              maxWidth="100%"
              isView={false}
              open={() => {
                setView(true);
                fetchGrantDetails(item);
              }}
            />
          ))}
        </div>
      )}

      {/* ── Detail drawer ── */}
      <DocView
        open={view}
        close={() => setView(false)}
        vertical="bottom"
        horizontal="center"
        transformOrigin="bottom"
      >
        {leaveGrantDetailsLoading ? (
          <div className="w-full h-full flex items-center justify-center py-16">
            <DotLoading />
          </div>
        ) : (
          <div className="w-full flex flex-col h-full">

            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-full bg-[#2eacb3]" />
                <EventNoteIcon sx={{ fontSize: 16, color: "#2eacb3" }} />
                <span className="text-sm font-bold text-gray-800">Leave Grant Details</span>
              </div>
              <IconButton
                size="small"
                onClick={() => setView(false)}
                sx={{ color: "#94a3b8", "&:hover": { bgcolor: "#f1f5f9", color: "#475569" } }}
              >
                <CloseIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar-for-menu px-5 py-4">

              {/* Employee card (view mode) */}
              <LeaveGrantCard maxWidth="100%" isView={true} data={details} />

              {/* Key info grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1 mb-0.5">
                    <AccountBalanceWalletIcon sx={{ fontSize: 12, color: "#2eacb3" }} />
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Leave Balance</span>
                  </div>
                  <span className="text-lg font-bold text-[#2eacb3]">{details?.leavebalance ?? "—"}</span>
                </div>
                <InfoRow label="Leave Type" value={details?.leavetype ? `${details.leavetype} Leave` : undefined} />
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1 mb-0.5">
                    <CalendarMonthIcon sx={{ fontSize: 12, color: "#94a3b8" }} />
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">From Date</span>
                  </div>
                  <span className="text-sm font-medium text-gray-800">{details?.fromdt || "—"}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1 mb-0.5">
                    <CalendarMonthIcon sx={{ fontSize: 12, color: "#94a3b8" }} />
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">To Date</span>
                  </div>
                  <span className="text-sm font-medium text-gray-800">{details?.todt || "—"}</span>
                </div>
              </div>

              {/* Reason */}
              {details?.reason && (
                <div className="mt-4 p-4 bg-white rounded-2xl border border-gray-100">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1">Reason</span>
                  <p className="text-sm text-gray-700 leading-relaxed">{details.reason}</p>
                </div>
              )}

              {/* Session table */}
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-4 rounded-full bg-[#2eacb3]" />
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Breakup</span>
                </div>
                <SessionTable rows={details?.breakup} />
              </div>
            </div>

            {/* Footer: rejection textarea + action buttons */}
            <div className="flex-shrink-0 border-t border-gray-100 px-5 py-4 bg-white">
              <Textarea
                className="w-full border border-gray-200 text-sm rounded-xl bg-gray-50 focus:border-[#2eacb3] focus:ring-2 focus:ring-[#2eacb3]/30 transition-all resize-none mb-3"
                placeholder="Add a note or rejection reason (optional)…"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={2}
              />
              <div className="flex gap-2 justify-end">
                {rejectGrantLeaveLoading ? (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <CircularProgress size={18} sx={{ color: "#2eacb3" }} />
                    <span>Processing…</span>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => handleReject(details, "approve")}
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 transition-all duration-200 cursor-pointer shadow-sm"
                    >
                      <CheckCircleIcon sx={{ fontSize: 16 }} />
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        setRejectedData(details);
                        setIsRejected(true);
                      }}
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 transition-all duration-200 cursor-pointer shadow-sm"
                    >
                      <CancelIcon sx={{ fontSize: 16 }} />
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </DocView>

      <ConfirmationModal
        open={isRejected}
        close={() => setIsRejected(false)}
        aggree={() => handleReject(rejectedData, "reject")}
        title="Confirm Rejection"
        description="Are you sure you want to reject this leave request?"
      />
    </div>
  );
};

export default LeaveGrantPage;
