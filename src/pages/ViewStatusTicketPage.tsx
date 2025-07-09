import {
  Box,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";

import CheckBoxIcon from "@mui/icons-material/CheckBox";
import PendingIcon from "@mui/icons-material/Pending";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

import { leaveLogData } from "../dummydata/LeaveSentData";
import CustomSearch from "../components/reuseable/CustomSearch";
import { customColor } from "../constants/themeConstant";

// Styled components
const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: customColor.bgColor,
    color: "#fff",
    
   
     fontSize: 18,
  fontWeight: 600,
 
  letterSpacing: 2,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    borderBottom: "1px solid #e5e7eb",
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  "&:hover": {
    backgroundColor: "#f9fafb",
    transition: "background-color 0.3s ease-in-out",
  },
}));

const getStatus = (status: string) => {
  switch (status) {
    case "Approved":
      return (
        <Box className="flex items-center text-green-700 text-sm font-medium">
          <CheckBoxIcon sx={{ fontSize: 18, mr: 0.5 }} />
          Approved
        </Box>
      );
    case "Pending":
      return (
        <Box className="flex items-center text-yellow-700 text-sm font-medium">
          <PendingIcon sx={{ fontSize: 18, mr: 0.5 }} />
          Pending
        </Box>
      );
    default:
      return (
        <Box className="flex items-center text-red-700 text-sm font-medium">
          <ThumbDownIcon sx={{ fontSize: 18, mr: 0.5 }} />
          Rejected
        </Box>
      );
  }
};

const ViewStatusTicketPage = () => {
  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Ticket Status
        </Typography>
        <CustomSearch
          bgColor="#8a8a8a"
          textColor="#000"
          width="40ch"
          placeholder="Search ID, name or status"
          onChange={() => {}}
        />
      </Box>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: 2,
          maxHeight: "72vh",
          overflow: "auto",
        }}
      >
        <Table stickyHeader>
          <TableHead sx={{backgroundColor: customColor.bgColor}}>
            <TableRow>
              {["ID", "Requester", "Subject", "Status"].map((header) => (
                <StyledTableCell
                  key={header}
                  sx={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#f3f4f6",
                    zIndex: 1,
                  }}
                >
                  {header}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {leaveLogData?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="body2" sx={{ py: 3 }}>
                    No Leave Sent Yet.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              leaveLogData.map((row: any) => (
                <StyledTableRow key={row.applicationId}>
                  <StyledTableCell>{row.applicationId}</StyledTableCell>
                  <StyledTableCell>
                    <Typography sx={{ fontWeight: 500, color: "#1f2937" }}>
                      {row.reportingTo}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Typography sx={{ fontWeight: 500, color: "#1f2937" }}>
                      {row.subject || row.reportingTo}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell>{getStatus(row.status)}</StyledTableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ViewStatusTicketPage;
