import {
  Avatar,
  Box,
  Card,
  CardContent,
 
  IconButton,
  Typography,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import CustomToolTip from "./CustomToolTip";
import type { FC } from "react";

interface ReimbursementGrantCardProps {
  data: any;
  open?: any;
  maxWidth: any;
  isView: boolean;
}

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  Approved: "bg-green-100 text-green-800 border-green-300",
  Rejected: "bg-red-100 text-red-800 border-red-300",
};

const ReimbursementGrantCard: FC<ReimbursementGrantCardProps> = ({
  data,
  open,
  maxWidth,
  isView,
}) => {
  return (
    <Card
      elevation={0}
      sx={{
        maxWidth:  maxWidth,
        height:240,
        borderRadius: 2,
        boxShadow: isView ? 0 : 2,
      }}
    >
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={2}
          py={1}
        >
          <div className="flex items-center">
            <Avatar
              src={data.receipt}
              sx={{
                width: isView ? 60 : 40,
                height: isView ? 60 : 40,
                bgcolor: "#2eacb3",
                           pointerEvents: "none",
                      userSelect: "none",
              }}
            />
            <div className="ml-3">
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, fontSize: { xs: "0.8rem", sm: "1rem" } }}
              >
                {data.name}
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                  fontWeight: 600,
                }}
              >
                Designation:{" "}
                <span className="font-[300]">{data.designation}</span>
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                  fontWeight: 600,
                }}
              >
                Department:{" "}
                <span className="font-[300]">{data.department}</span>
              </Typography>
            </div>
          </div>
          <div>
            <Typography variant="subtitle1" fontWeight={600} fontSize={15}>
              Amount
            </Typography>
            <div className="flex items-center space-x-2 mb-1">
              <div className={`w-3 h-3 rounded-full bg-green-700`} />
              <span className="text-[14px]">${data.amount.toFixed(2)}</span>
            </div>
          </div>
          <Typography variant="subtitle1" fontWeight={600}>
            {data.purpose}
          </Typography>
        </Box>
        <div className="flex space-x-10 my-3 justify-between">
          <div>
            <Typography variant="subtitle1" fontWeight={600}>
              Date
            </Typography>
            <Typography>{data.date}</Typography>
          </div>
          <div>
            <Typography variant="subtitle1" fontWeight={600}>
              Status
            </Typography>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full border text-sm font-semibold ${
                statusColors[data.status]
              }`}
            >
              {data.status}
            </span>
          </div>
          <div>
            {" "}
            <CustomToolTip title={"More Details"} placement={"bottom"}>
              <IconButton onClick={open}>
                <VisibilityIcon sx={{ fontSize: 26, color: "#000" }} />
              </IconButton>
            </CustomToolTip>
          </div>
        </div>
        {/* {isView ? null : (
          <>
            <Divider sx={{ mt: 2 }} />
            <div className="flex justify-between items-center">
              <div className="space-x-4 mt-4">
                <CustomButton className="bg-[#2eacb3] transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer">
                  Approve
                </CustomButton>
                <CustomButton className="border-2 border-[#2eacb3] transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer">
                  Reject
                </CustomButton>
              </div>
              <CustomToolTip title={"More Details"} placement={"bottom"}>
                <IconButton onClick={open}>
                  <VisibilityIcon sx={{ fontSize: 26, color: "#000" }} />
                </IconButton>
              </CustomToolTip>
            </div>
          </>
        )} */}
      </CardContent>
    </Card>
  );
};

export default ReimbursementGrantCard;
