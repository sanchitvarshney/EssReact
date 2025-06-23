import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import { CustomButton } from "../ui/CustomButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CustomToolTip from "./CustomToolTip";
import type { FC } from "react";

interface LeaveGrantCardPropsType {
  open?: any;
  maxWidth: any;
  isView: boolean;
}
const LeaveGrantCard: FC<LeaveGrantCardPropsType> = ({
  open,
  maxWidth,
  isView,
}) => {
  return (
    <Card
      elevation={isView ? 0 : 1}
      sx={{
        maxWidth: maxWidth,
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
          <div className="flex">
            <Avatar
              sx={{ width: isView ? 60 : 40, height: isView ? 60 : 40 }}
            />
            <div className="ml-3">
              {" "}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "0.8rem", sm: "1rem" },
             
                }}
              >
                Name
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
            fontWeight:600
                }}
              >
                Designation: <span className="font-[300]">role</span>
              </Typography>
                <Typography
                variant="subtitle2"
                sx={{
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
            fontWeight:600
                }}
              >
                Department: <span className="font-[300]">IT</span>
              </Typography>
            </div>
          </div>

          <div>
            <Typography variant="subtitle1" fontWeight={600} fontSize={15}>
              Leave Type
            </Typography>

            <div className="flex items-center space-x-2 mb-1">
              <div className={`w-3 h-3 rounded-full ${"bg-green-700"}`} />
              <span className="text-[14px]">{"Leave"}</span>
            </div>
          </div>

          <Typography variant="subtitle1" fontWeight={600}>
            Leave Request
          </Typography>
        </Box>
        <div className="flex space-x-15 my-3">
          <div>
            <Typography variant="subtitle1" fontWeight={600}>
              From
            </Typography>
            <Typography>23-06-2025 / second half</Typography>
          </div>
          <div>
            <Typography variant="subtitle1" fontWeight={600}>
              To
            </Typography>
            <Typography>26-06-2025 / first half</Typography>
          </div>
        </div>
        {isView ? null : (
          <>
            <Divider sx={{ mt: 2 }} />
            <div className="flex justify-between items-center">
              <div className="space-x-4 mt-4">
                <CustomButton className="bg-[#2eacb3]  transition-transform duration-300 ease-in-out hover:scale-105  cursor-pointer">
                  Approve
                </CustomButton>
                <CustomButton className="border-2 border-[#2eacb3] transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer">
                  Rejected
                </CustomButton>
              </div>
              <CustomToolTip title={"More Details"} placement={"bottom"}>
                <IconButton onClick={open}>
                  <VisibilityIcon sx={{ fontSize: 26, color: "#000" }} />
                </IconButton>
              </CustomToolTip>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default LeaveGrantCard;
