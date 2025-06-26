import {
  Box,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  // IconButton,
  // Tooltip,
} from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

import PendingIcon from "@mui/icons-material/Pending";
import { leaveLogData } from "../dummydata/LeaveSentData";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import CustomSearch from "../components/reuseable/CustomSearch";

// Styled components for better visual appeal
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
    borderBottom:"none"
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
//   "&:nth-of-type(even)": {
//     backgroundColor: theme.palette.action.hover,
//   },

//   // "&:hover": {
//   //   backgroundColor: "#f3f4g9",
//   //   transition: "background-color 0.4s ease-in-out",
//   // },
//   "&:last-child td, &:last-child th": {
//     border: 0,
//   },
}));

const ViewStatusTicketPage = () => {
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
         {/* <div className="w-full flex justify-between items-center p-0 mb-3 ">
        <Typography sx={{ fontWeight: "n", fontSize: 18 }}>
          Ticket Status 
        </Typography> */}
        <div>
        <CustomSearch bgColor="#000000" textColor="#" width="600" placeholder={"Search id, name or status"} onChange={()=>{}} />
        </div>
      {/* </div> */}

      {/* <Divider sx={{ backgroundColor: "#000000" }} /> */}
      <div>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            borderRadius: "0px",
            maxHeight: "67vh",
            overflow: "auto",
            // border: "1px solid #000",
          }}
        >
          <Table
            sx={{
                
              borderCollapse: "separate",
              borderSpacing: 0,
              "& th, & td": {
                borderBottom: "1px solid gray",
              },
              "& tr:last-child td": {
                borderBottom: "1px solid gray",
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
                  <b>ID</b>
                </StyledTableCell>
                <StyledTableCell
                  sx={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#e5e7eb",
                    zIndex: 1,
                  }}
                >
                  <b>REQUESTER</b>
                </StyledTableCell>
                <StyledTableCell
                  sx={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#e5e7eb",
                    zIndex: 1,
                  }}
                >
                  <b>SUBJECT</b>
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
                      </Box>
                    </TableCell>
                    <TableCell sx={{  }}>
                   
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
                    
                    </TableCell>
                    <TableCell sx={{  }}>
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
                    </TableCell>
                    <TableCell sx={{  }}>
                    
                   
                   
                        {getStatus(row?.status)}
                 

                      
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

export default ViewStatusTicketPage;
