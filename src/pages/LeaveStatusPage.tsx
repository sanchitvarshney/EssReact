
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
  Divider,
} from "@mui/material";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { CustomButton } from "../components/ui/CustomButton";
import DescriptionIcon from "@mui/icons-material/Description";
import MessageIcon from "@mui/icons-material/Message";
import PendingIcon from '@mui/icons-material/Pending';
import { leaveLogData } from "../dummydata/LeaveSentData";
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

const LeaveStatusPage = () => {
  const getStatus = (status: any) => {
    switch (status) {
      case "Approved":
        return (
          <span className="text-[12px] text-green-700" >
            <CheckBoxIcon  sx={{fontSize:20}}  className=" mr-1"/>
            Approved
          </span>
        );
      case "Pending":
        return (
          <span className="text-[12px] text-yellow-700" >
            <PendingIcon sx={{fontSize:20}}  className="mr-1"/>
            Pending
          </span>
        );

      default:
        return (
          <span className="text-[12px] text-red-700 " >
            <ThumbDownIcon  sx={{fontSize:20}} className="mr-1"/>
            Rejected
          </span>
        );
    }
  };

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <div className="w-full flex justify-between items-center bg-gray-200 p-4 ">
        <Typography>Leave Sent (60)</Typography>
        <div>
          <CustomButton className="bg-[#000000] text-white">
            {" "}
            <DescriptionIcon className="mr-1" /> Leave Log
          </CustomButton>
        </div>
      </div>
      <Divider sx={{ backgroundColor: "#000000" }} />
      <div className="h-[75vh]  overflow-y-auto">
        <TableContainer component={Paper} sx={{ borderRadius: "0px" }}>
          <Table>
            <TableHead className="bg-gray-200 ">
              <TableRow>
                <TableCell>
                  <b>APPLICATION</b>
                </TableCell>
                <TableCell>
                  <b>FROM TO</b>
                </TableCell>
                <TableCell>
                  <b>REPORTING TO</b>
                </TableCell>
                <TableCell>
                  <b>ACTION</b>
                </TableCell>
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
                  <TableRow key={row.applicationId}>
                    <TableCell>
                      <>
                        <h4>{row?.applicationId}</h4>
                        <span>{`Applied for: ${row?.appliedFor}`}</span>
                      </>
                    </TableCell>
                    <TableCell>{`${row.fromDate} to ${row.toDate}`}</TableCell>
                    <TableCell>
                      <h4>
                        {row.reportingTo}
                        
                      </h4>
                      {getStatus(row?.status)}
                    </TableCell>
                    <TableCell>
                      <>
                        <span>--</span>
                        <MessageIcon className="ml-2" />
                      </>
                    </TableCell>
                  </TableRow>
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
