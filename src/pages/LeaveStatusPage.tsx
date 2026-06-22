import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import UndoIcon from "@mui/icons-material/Undo";
import PendingIcon from "@mui/icons-material/Pending";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
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

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#1e293b",
    color: theme.palette.common.white,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    padding: "12px 16px",
    whiteSpace: "nowrap",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
    padding: "10px 16px",
    color: "#374151",
    borderBottom: "1px solid #f3f4f6",
  },
}));

export const StyledTableRow = styled(TableRow)(() => ({
  transition: "background-color 0.15s",
  "&:hover": {
    backgroundColor: "#f8fafc",
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export const getStatus = (status: any) => {
  switch (status) {
    case "APR":
      return (
        <Chip
          icon={<CheckCircleIcon sx={{ fontSize: "15px !important" }} />}
          label="Approved"
          size="small"
          sx={{
            bgcolor: "#dcfce7",
            color: "#15803d",
            fontWeight: 700,
            fontSize: 11,
            height: 24,
            "& .MuiChip-icon": { color: "#15803d" },
          }}
        />
      );
    case "PEN":
      return (
        <Chip
          icon={<PendingIcon sx={{ fontSize: "15px !important" }} />}
          label="Pending"
          size="small"
          sx={{
            bgcolor: "#fef9c3",
            color: "#854d0e",
            fontWeight: 700,
            fontSize: 11,
            height: 24,
            "& .MuiChip-icon": { color: "#854d0e" },
          }}
        />
      );
    case "REJ":
      return (
        <Chip
          icon={<ThumbDownIcon sx={{ fontSize: "14px !important" }} />}
          label="Rejected"
          size="small"
          sx={{
            bgcolor: "#fee2e2",
            color: "#b91c1c",
            fontWeight: 700,
            fontSize: 11,
            height: 24,
            "& .MuiChip-icon": { color: "#b91c1c" },
          }}
        />
      );
    default:
      return (
        <Chip
          icon={<UnarchiveIcon sx={{ fontSize: "15px !important" }} />}
          label="Withdrawn"
          size="small"
          sx={{
            bgcolor: "#dbeafe",
            color: "#1d4ed8",
            fontWeight: 700,
            fontSize: 11,
            height: 24,
            "& .MuiChip-icon": { color: "#1d4ed8" },
          }}
        />
      );
  }
};

const LeaveStatusPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [trackId, setTrackId] = useState<string>("");

  const [
    getLeaveStatus,
    { data, isLoading: leaveStatusLoading, error: leaveStatusError },
  ] = useGetLeaveStatusMutation();
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
        leaveStatusError?.message ||
          //@ts-ignore
          leaveStatusError?.data?.message ||
          "We're Sorry An unexpected error has occured. Our technical staff has been automatically notified and will be looking into this with utmost urgency.",
        "error",
      );
    }
  }, [leaveStatusError]);

  const handleDelete = () => {
    setIsConfirm(false);
    const payload = {
      trackid: trackId,
      status: "PEN",
      type: "CAN",
    };

    rejectLeave(payload)
      .then((res) => {
        if (res?.data?.status === "success") {
          showToast(res?.data?.message, "success");
        }
        if (res?.data?.status === "error") {
          showToast(res?.data?.message?.msg, "error");
        }
      })
      .catch((err) => {
        showToast(
          err?.data?.message?.msg ||
            err?.message ||
            "We're Sorry An unexpected error has occured. Our technical staff has been automatically notified and will be looking into this with utmost urgency.",
          "error",
        );
      });
  };

  if (leaveStatusLoading) {
    return <LeaveStatusPageSkeleton />;
  }

  const totalCount = data?.totalrequest ?? 0;

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
          Leave History
        </Typography>
      </div>

      {/* Main content card */}
      <div className="bg-white  border border-gray-100 shadow-sm flex flex-col flex-1 overflow-hidden">
        {/* Card header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Typography
              sx={{ fontWeight: 700, fontSize: 14, color: "#1e293b" }}
            >
              Leave Applications
            </Typography>
            <Chip
              label={totalCount}
              size="small"
              sx={{
                height: 20,
                fontSize: 11,
                fontWeight: 700,
                bgcolor: "#e0f7fa",
                color: "#0097a7",
                "& .MuiChip-label": { px: 1 },
              }}
            />
          </div>
          <Typography sx={{ fontSize: 12, color: "#9ca3af" }}>
            Showing all requests
          </Typography>
        </div>

        {/* Table */}
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            flex: 1,
            overflow: "auto",
            borderRadius: 0,
            boxShadow: "none",
          }}
          className="custom-scrollbar-for-menu"
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <StyledTableCell>Application</StyledTableCell>
                <StyledTableCell>Date Range</StyledTableCell>
                <StyledTableCell>Requested On</StyledTableCell>
                <StyledTableCell>Reporting To</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Remark</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!data?.data?.length ? (
                <StyledTableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                    sx={{ py: 10, borderBottom: 0 }}
                  >
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <EventBusyIcon sx={{ fontSize: 44, color: "#d1d5db" }} />
                      <Typography
                        sx={{ fontWeight: 600, color: "#9ca3af", fontSize: 14 }}
                      >
                        No leave applications yet
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: "#d1d5db" }}>
                        Your submitted leave requests will appear here
                      </Typography>
                    </div>
                  </TableCell>
                </StyledTableRow>
              ) : (
                data?.data?.map((row: any) => (
                  <StyledTableRow key={row.trackid}>
                    <StyledTableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-gray-800 text-sm">
                          {row?.leavetype}
                        </span>
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full w-fit"
                          style={{
                            backgroundColor: "#f3f4f6",
                            color: "#6b7280",
                          }}
                        >
                          {row?.totalday}
                        </span>
                      </div>
                    </StyledTableCell>

                    <StyledTableCell>
                      <span className="font-semibold text-gray-700 text-sm whitespace-nowrap">
                        {row.fromdt}
                      </span>
                      <span className="mx-1.5 text-gray-400 text-xs">→</span>
                      <span className="font-semibold text-gray-700 text-sm whitespace-nowrap">
                        {row.todt}
                      </span>
                    </StyledTableCell>

                    <StyledTableCell>
                      <span className="text-sm text-gray-700">
                        {row.regdate}
                      </span>
                    </StyledTableCell>

                    <StyledTableCell>
                      <span className="font-medium text-gray-700 text-sm">
                        {row.reportto}
                      </span>
                    </StyledTableCell>

                    <StyledTableCell>{getStatus(row?.status)}</StyledTableCell>

                    <StyledTableCell>
                      {row?.remark ? (
                        <span className="text-sm text-gray-600">
                          {row.remark}
                        </span>
                      ) : (
                        <span className="text-gray-300 italic text-xs">—</span>
                      )}
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      {rejectLeaveLoading && trackId === row?.trackid ? (
                        <DotLoading />
                      ) : (
                        <Tooltip
                          title={
                            row?.status === "APR" ||
                            row?.status === "RTN" ||
                            row?.status === "REJ"
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
                                "&:hover": {
                                  color: "#ef4444",
                                  bgcolor: "#fee2e2",
                                },
                                "&.Mui-disabled": { opacity: 0.3 },
                                transition: "all 0.2s",
                              }}
                            >
                              <UndoIcon sx={{ fontSize: 20 }} />
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
        title="Cancel Leave Request"
        description="Do you want to cancel your submitted leave application?"
      />
    </div>
  );
};

export default LeaveStatusPage;
