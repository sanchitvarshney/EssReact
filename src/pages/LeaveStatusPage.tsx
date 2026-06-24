import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import {
  useGetLeaveStatusMutation,
  useRejectLeaveMutation,
} from "../services/Leave";
import { useAuth } from "../contextapi/AuthContext";
import { useEffect, useState } from "react";
import { useToast } from "../hooks/useToast";
import LeaveStatusPageSkeleton from "../skeleton/LeaveStatusPageSkeleton";
import ConfirmationModal from "../components/reuseable/ConfirmationModal";
import DotLoading from "../components/reuseable/DotLoading";
import CustomToolTip from "../components/reuseable/CustomToolTip";

export const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#f8fafc",
    color: "#475569",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    padding: "10px 16px",
    whiteSpace: "nowrap",
    borderBottom: "2px solid #e2e8f0",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
    padding: "12px 16px",
    color: "#374151",
    borderBottom: "1px solid #f3f4f6",
  },
}));

export const StyledTableRow = styled(TableRow)(() => ({
  transition: "background-color 0.15s",
  "&:hover": { backgroundColor: "#f8fafc" },
  "&:last-child td, &:last-child th": { border: 0 },
}));

export const getStatus = (status: any) => {
  switch (status) {
    case "APR":
      return (
        <Chip
          label="Approved"
          size="small"
          sx={{ bgcolor: "#dcfce7", color: "#15803d", fontWeight: 700, fontSize: 11, height: 22, "& .MuiChip-icon": { color: "#15803d" } }}
        />
      );
    case "PEN":
      return (
        <Chip
          label="Pending"
          size="small"
          sx={{ bgcolor: "#fef9c3", color: "#854d0e", fontWeight: 700, fontSize: 11, height: 22, "& .MuiChip-icon": { color: "#854d0e" } }}
        />
      );
    case "REJ":
      return (
        <Chip
          label="Rejected"
          size="small"
          sx={{ bgcolor: "#fee2e2", color: "#b91c1c", fontWeight: 700, fontSize: 11, height: 22, "& .MuiChip-icon": { color: "#b91c1c" } }}
        />
      );
    default:
      return (
        <Chip
          label="Withdrawn"
          size="small"
          sx={{ bgcolor: "#dbeafe", color: "#1d4ed8", fontWeight: 700, fontSize: 11, height: 22, "& .MuiChip-icon": { color: "#1d4ed8" } }}
        />
      );
  }
};

const LEAVE_TYPE_COLORS: Record<string, string> = {
  EL: "#2eacb3", SL: "#f59e0b", WFH: "#8b5cf6",
  OD: "#3b82f6", CL: "#10b981", ACL: "#ec4899", LWP: "#ef4444",
};

const getLeaveDot = (type: string) => {
  const color = Object.entries(LEAVE_TYPE_COLORS).find(([k]) =>
    type?.toUpperCase().includes(k)
  )?.[1] ?? "#94a3b8";
  return <span className="inline-block w-2 h-2 rounded-full mr-1.5 flex-shrink-0" style={{ backgroundColor: color }} />;
};

const LeaveStatusPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [trackId, setTrackId] = useState<string>("");

  const [getLeaveStatus, { data, isLoading: leaveStatusLoading, error: leaveStatusError }] =
    useGetLeaveStatusMutation();
  const [rejectLeave, { isLoading: rejectLeaveLoading, isSuccess }] =
    useRejectLeaveMutation();

  const [isConfirm, setIsConfirm] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      //@ts-ignore
      getLeaveStatus({ empcode: user?.id }).unwrap();
    }
  }, [user, isSuccess]);

  useEffect(() => {
    if (leaveStatusError) {
      showToast(
        //@ts-ignore
        leaveStatusError?.message || leaveStatusError?.data?.message ||
          "An unexpected error occurred.",
        "error",
      );
    }
  }, [leaveStatusError]);

  const handleDelete = () => {
    setIsConfirm(false);
    rejectLeave({ trackid: trackId, status: "PEN", type: "CAN" })
      .then((res) => {
        if (res?.data?.status === "success") showToast(res?.data?.message, "success");
        if (res?.data?.status === "error") showToast(res?.data?.message?.msg, "error");
      })
      .catch((err) => {
        showToast(err?.data?.message?.msg || err?.message || "An unexpected error occurred.", "error");
      });
  };

  if (leaveStatusLoading) return <LeaveStatusPageSkeleton />;

  const rows: any[] = data?.data ?? [];
  const totalCount = data?.totalrequest ?? rows.length;

  return (
    <div className="h-[calc(100vh-78px)] flex flex-col overflow-hidden px-3 py-4 w-full gap-4">

      {/* ── Page header ── */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-1 h-7 rounded-full bg-[#2eacb3]" />
        <EventBusyIcon sx={{ fontSize: 20, color: "#2eacb3" }} />
        <span className="text-base sm:text-lg font-bold text-gray-800">Leave Applications</span>
        <Chip
          label={totalCount}
          size="small"
          sx={{ height: 20, fontSize: 11, fontWeight: 700, bgcolor: "#e0f7fa", color: "#0097a7", "& .MuiChip-label": { px: 1 } }}
        />
      </div>

      {/* ── Table card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col flex-1 overflow-hidden">


        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ flex: 1, overflow: "auto", borderRadius: 0, boxShadow: "none" }}
          className="custom-scrollbar-for-menu"
        >
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell>Leave Type</StyledTableCell>
                <StyledTableCell>Duration</StyledTableCell>
                <StyledTableCell>Date Range</StyledTableCell>
                <StyledTableCell>Requested On</StyledTableCell>
                <StyledTableCell>Reporting To</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Remark</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {!rows.length ? (
                <StyledTableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 10, borderBottom: 0 }}>
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                        <EventBusyIcon sx={{ fontSize: 28, color: "#d1d5db" }} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-gray-500">No leave applications yet</p>
                        <p className="text-xs text-gray-400 mt-0.5">Your submitted leave requests will appear here</p>
                      </div>
                    </div>
                  </TableCell>
                </StyledTableRow>
              ) : (
                rows.map((row: any) => (
                  <StyledTableRow key={row.trackid}>

                    {/* Leave type */}
                    <StyledTableCell>
                      <div className="flex items-center gap-1.5">
                        {getLeaveDot(row?.leavetype)}
                        <span className="font-semibold text-gray-800 text-xs whitespace-nowrap">
                          {row?.leavetype}
                        </span>
                      </div>
                    </StyledTableCell>

                    {/* Duration */}
                    <StyledTableCell>
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                        style={{ backgroundColor: "#e0f7fa", color: "#0097a7" }}
                      >
                        {row?.totalday}
                      </span>
                    </StyledTableCell>

                    {/* Date range */}
                    <StyledTableCell>
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <span className="text-xs font-semibold text-gray-700">{row.fromdt}</span>
                        <span className="text-gray-300 text-[10px]">→</span>
                        <span className="text-xs font-semibold text-gray-700">{row.todt}</span>
                      </div>
                    </StyledTableCell>

                    {/* Requested on */}
                    <StyledTableCell>
                      <span className="text-xs text-gray-600">{row.regdate}</span>
                    </StyledTableCell>

                    {/* Reporting to */}
                    <StyledTableCell>
                      <span className="text-xs font-medium text-gray-700">{row.reportto}</span>
                    </StyledTableCell>

                    {/* Status */}
                    <StyledTableCell>{getStatus(row?.status)}</StyledTableCell>

                    {/* Remark */}
                    <StyledTableCell>
                      {row?.remark ? (
                      <CustomToolTip title={row?.remark} placement={"top"}>
                        <span className="text-xs text-gray-600 max-w-[140px] line-clamp-2">{row.remark}</span>
                      </CustomToolTip>
                      ) : (
                        <span className="text-gray-300 text-xs italic">—</span>
                      )}
                    </StyledTableCell>

                    {/* Action */}
                    <StyledTableCell align="center">
                      {rejectLeaveLoading && trackId === row?.trackid ? (
                        <DotLoading />
                      ) : (
                        <Tooltip
                          title={
                            row?.status === "APR" || row?.status === "RTN" || row?.status === "REJ"
                              ? "Cannot withdraw this request"
                              : "Withdraw request"
                          }
                          placement="left"
                        >
                          <span>
                            <IconButton
                              size="small"
                              disabled={
                                row?.status === "APR" ||
                                row?.status === "RTN" ||
                                row?.status === "REJ"
                              }
                              onClick={() => {
                                setTrackId(row?.trackid);
                                setIsConfirm(true);
                              }}
                              sx={{
                                color: "#9ca3af",
                                "&:hover": { color: "#ef4444", bgcolor: "#fee2e2" },
                                "&.Mui-disabled": { opacity: 0.25 },
                                transition: "all 0.2s",
                              }}
                            >
                              <UndoIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </span>
                        </Tooltip>
                      )}
                    </StyledTableCell>

                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>


      <ConfirmationModal
        open={isConfirm}
        close={() => setIsConfirm(false)}
        aggree={handleDelete}
        title="Withdraw Leave Request"
        description="Are you sure you want to withdraw this leave application? This action cannot be undone."
      />
    </div>
  );
};

export default LeaveStatusPage;
