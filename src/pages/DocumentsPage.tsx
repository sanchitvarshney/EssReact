import {
  Box,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  ButtonGroup,
  IconButton,
} from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import VisibilityIcon from "@mui/icons-material/Visibility";

import PendingIcon from "@mui/icons-material/Pending";
import { leaveLogData } from "../dummydata/LeaveSentData";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import CustomToolTip from "../components/reuseable/CustomToolTip";

// Styled components for better visual appeal
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.action.hover,
  },

  // "&:hover": {
  //   backgroundColor: "#f3f4g9",
  //   transition: "background-color 0.4s ease-in-out",
  // },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const DocumentsPage = () => {
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
    <div className="w-full p-3 h-[calc(100vh-100px)]">
      <Typography sx={{ fontWeight: 600, fontSize: 18, py: 2 }}>
        Documents
      </Typography>

      {/* <Divider sx={{ backgroundColor: "#000000" }} /> */}
      <div>
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: "0px",
            maxHeight: "75vh",
            overflow: "auto",
            border: "1px solid #000",
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
                  <b>FILE NAME</b>
                </StyledTableCell>
                <StyledTableCell
                  sx={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#e5e7eb",
                    zIndex: 1,
                  }}
                >
                  <b>SIZE</b>
                </StyledTableCell>
                <StyledTableCell
                  sx={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#e5e7eb",
                    zIndex: 1,
                  }}
                >
                  <b>LAST UPDATE</b>
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
                      <Box display={"flex"}>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            color: "#1f2937",

                            // mb: 0.5,
                          }}
                        >
                          {row?.applicationId}
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
                    <TableCell sx={{ py: 3 }}>
                      <ButtonGroup
                        variant="outlined"
                        aria-label="Basic button group"
                      >
                        <CustomToolTip
                          title={"View"}
                          placement={"bottom"}
                        >
                          <IconButton >
                            <VisibilityIcon
                              sx={{ fontSize: 26, color: "#000" }}
                            />
                          </IconButton>
                        </CustomToolTip>
                        <CustomToolTip title={"Download"} placement={"bottom"}>
                          <IconButton>
                            <CloudDownloadIcon
                              sx={{ fontSize: 26, color: "#000" }}
                            />
                          </IconButton>
                        </CustomToolTip>
                      </ButtonGroup>
                    </TableCell>
                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default DocumentsPage;
