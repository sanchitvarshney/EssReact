import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { CustomButton } from "../components/ui/CustomButton";
import DescriptionIcon from "@mui/icons-material/Description";
import MessageIcon from "@mui/icons-material/Message";
import PendingIcon from "@mui/icons-material/Pending";
import { leaveLogData } from "../dummydata/LeaveSentData";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { styled } from "@mui/material/styles";

// Styled components for better visual appeal
const StyledTableCell = styled(TableCell)(() => ({
  fontWeight: 600,
  fontSize: "0.9rem",
  color: "#000",
  borderBottom: "2px solid #e5e7eb",
  padding: "16px 24px",
}));

const StyledTableRow = styled(TableRow)(() => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#f9fafb",
  },
  "&:hover": {
    backgroundColor: "#f3f4f6",
    transition: "background-color 0.2s ease-in-out",
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const LeaveStatusPage = () => {
  const getStatus = (status: any) => {
    switch (status) {
      case "Approved":
        return (
          <span className="text-[12px] text-green-700">
            <CheckBoxIcon sx={{ fontSize: 20 }} className=" mr-1" />
            Approved
          </span>
        );
      case "Pending":
        return (
          <span className="text-[12px] text-yellow-700">
            <PendingIcon sx={{ fontSize: 20 }} className="mr-1" />
            Pending
          </span>
        );

      default:
        return (
          <span className="text-[12px] text-red-700 ">
            <ThumbDownIcon sx={{ fontSize: 20 }} className="mr-1" />
            Rejected
          </span>
        );
    }
  };

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <div className="w-full flex justify-between items-center mb-2 p-4 ">
        <Typography>Leave Sent (60)</Typography>
        <div>
          <CustomButton className="bg-[#000000] text-white">
            {" "}
            <DescriptionIcon className="mr-1" /> Leave Log
          </CustomButton>
        </div>
      </div>

      {/* <Divider sx={{ backgroundColor: "#000000" }} /> */}
      <div>
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: "0px",
            maxHeight: "75vh",
            overflow: "auto",
          }}
        >
          <Table stickyHeader>
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
                  <b>FROM TO</b>
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
                  <b>ACTION</b>
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaveLogData?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body2">No Leave Sent Yet.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                leaveLogData?.map((row: any) => (
                  <StyledTableRow key={row.applicationId}>
                    <TableCell sx={{ py: 0 }}>
                      <Box>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            color: "#1f2937",
                            // mb: 0.5,
                          }}
                        >
                          {row?.applicationId}
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
                          {row?.appliedFor}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 3 }}>
                      <Box>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                            color: "#1f2937",
                            mb: 0.5,
                          }}
                        >
                          {`${row.fromDate} to ${row.toDate}`}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 3 }}>
                      <Box>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                            color: "#1f2937",
                            mb: 1,
                          }}
                        >
                          {row.reportingTo}
                        </Typography>
                        {getStatus(row?.status)}
                      </Box>
                    </TableCell>
                    <TableCell align="center" sx={{ py: 3 }}>
                      <Tooltip title="Send Message">
                        <IconButton
                          sx={{
                            backgroundColor: "#f3f4f6",
                            color: "#6b7280",
                            "&:hover": {
                              backgroundColor: "#e5e7eb",
                              color: "#374151",
                              transform: "scale(1.1)",
                            },
                            transition: "all 0.2s ease",
                          }}
                        >
                          <MessageIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Box>
  );
};

export default LeaveStatusPage;
