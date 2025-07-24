import {
  Box,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
} from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
// import { CustomButton } from "../components/ui/CustomButton";
// import DescriptionIcon from "@mui/icons-material/Description";
import UndoIcon from "@mui/icons-material/Undo";
import PendingIcon from "@mui/icons-material/Pending";
import UnarchiveIcon from "@mui/icons-material/Unarchive";

import ThumbDownIcon from "@mui/icons-material/ThumbDown";
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

// Styled components for better visual appeal
export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#232324",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {},
  fontSize: 15,
  fontWeight: 600,
  color: "#374151",
  letterSpacing: 2,
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.action.hover,
  },

  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export const getStatus = (status: any) => {
  switch (status) {
    case "APR":
      return (
        <span className="text-[16px] text-green-700 flex items-center text-center">
          <CheckBoxIcon sx={{ fontSize: 24 }} className=" mr-1" />
          Approved
        </span>
      );
    case "PEN":
      return (
        <span className="text-[16px] text-yellow-700">
          <PendingIcon sx={{ fontSize: 24 }} className="mr-1" />
          Pending
        </span>
      );
    case "REJ":
      return (
        <span className="text-[16px] text-red-700">
          <ThumbDownIcon sx={{ fontSize: 24 }} className="mr-1" />
          Rejected
        </span>
      );

    default:
      return (
        <span className="text-[16px] text-blue-500 ">
          <UnarchiveIcon sx={{ fontSize: 22 }} className="mr-1" />
          Withdraw
        </span>
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
        "error"
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
        console.log(res);
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
          "error"
        );
      });
  };

  if (leaveStatusLoading) {
    return <LeaveStatusPageSkeleton />;
  }

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <div className="w-full flex justify-between items-center p-0 mb-3 ">
        <Typography sx={{ fontWeight: 600, fontSize: 18 }}>
          {`Leave Sent (${data?.totalrequest})`}
        </Typography>
        {/* <div>
          <CustomButton className="bg-[#000000] text-white">
            {" "}
            <DescriptionIcon className="mr-1" /> Leave Log
          </CustomButton>
        </div> */}
      </div>

      <div>
        <TableContainer
          elevation={0}
          component={Paper}
          sx={{
            borderRadius: "0px",
            maxHeight: "78vh",
            height: "78vh",
            overflow: "auto",
            boxShadow: 6,
            // border: "1px solid #000",
          }}
        >
          <Table
            sx={{
              borderCollapse: "separate",
              borderSpacing: 0,
              "& th, & td": {
                borderRight: "1px solid #e0e0e0",
              },
              "& tr:last-child td": {
                borderRight: "1px solid #e0e0e0",
              },
            }}
          >
            {" "}
            {/* Add stickyHeader prop */}
            <TableHead className="bg-gray-200 ">
              <TableRow>
                <StyledTableCell
                  sx={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#e5e7eb",
                    zIndex: 1,
                  }}
                >
                  <b>APPLICATION</b>
                </StyledTableCell>
                <StyledTableCell
                  sx={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#e5e7eb",
                    zIndex: 1,
                  }}
                >
                  <b>FROM DATE - TO DATE</b>
                </StyledTableCell>
                <StyledTableCell
                  sx={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#e5e7eb",
                    zIndex: 1,
                  }}
                >
                  <b>REQUESTED DATE AND TIME</b>
                </StyledTableCell>
                <StyledTableCell
                  sx={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#e5e7eb",
                    zIndex: 1,
                  }}
                >
                  <b>REPORTING TO</b>
                </StyledTableCell>
                <StyledTableCell
                  sx={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#e5e7eb",
                    zIndex: 1,
                  }}
                >
                  <b>STATUS</b>
                </StyledTableCell>
                <StyledTableCell
                  sx={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#e5e7eb",
                    zIndex: 1,
                  }}
                >
                  <b>REMARK</b>
                </StyledTableCell>
                <StyledTableCell
                  sx={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#e5e7eb",
                    zIndex: 1,
                  }}
                >
                  <b>ACTION</b>
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body2">No Leave Sent Yet.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                data?.data?.map((row: any) => (
                  <StyledTableRow key={row.trackid}>
                    <TableCell sx={{ py: 1 }}>
                      <Box>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            color: "#1f2937",
                          }}
                        >
                          {row?.leavetype}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#6b7280",
                            backgroundColor: "#f3f4f6",
                            px: 2,
                            py: 0.5,
                            borderRadius: "8px",
                            display: "inline-block",
                          }}
                        >
                          {row?.totalday}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 1 }}>
                      <Box>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                            color: "#1f2937",
                            mb: 0.5,
                          }}
                        >
                          {`${row.fromdt} To ${row.todt}`}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell sx={{ py: 1 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          color: "#1f2937",
                          mb: 1,
                        }}
                      >
                        {row.regdate}
                      </Typography>
                      {/* {getStatus(row?.status)} */}
                    </TableCell>
                    <TableCell sx={{ py: 1 }}>
                      <Box>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                            color: "#1f2937",
                          }}
                        >
                          {row.reportto}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 1 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          color: "#1f2937",
                          mb: 1,
                        }}
                      >
                        {getStatus(row?.status)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          color: "#1f2937",
                          mb: 1,
                        }}
                      >
                        {row?.remark}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1 }}>
                      {rejectLeaveLoading && trackId === row?.trackid ? (
                        <DotLoading />
                      ) : (
                        <IconButton
                          sx={{ color: "gray", "&:hover": { color: "red" } }}
                          disabled={
                            row?.status === "APR" || row?.status === "RTN"
                          }
                          onClick={() => {
                            setTrackId(row?.trackid);
                            setIsConfirm(true);
                          }}
                        >
                          <UndoIcon
                            sx={{
                              fontSize: 26,
                              color:
                                row?.status === "APR" || row?.status === "REJ" ||row?.status === "RTN"
                                  ? "gray"
                                  : "red",
                            }}
                          />
                        </IconButton>
                      )}
                    </TableCell>
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
    </Box>
  );
};

export default LeaveStatusPage;
