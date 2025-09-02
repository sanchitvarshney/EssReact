import { Avatar, Box, Card, Chip, Typography } from "@mui/material";
import { CustomButton } from "../ui/CustomButton";

import type { FC } from "react";

interface LeaveGrantCardPropsType {
  open?: any;
  maxWidth: any;
  isView: boolean;
  data: any;
}
const LeaveGrantCard: FC<LeaveGrantCardPropsType> = ({
  open,
  maxWidth,
  isView,
  data,
}) => {
  return (
    <Card
      elevation={isView ? 0 : 1}
      sx={{
        maxWidth: maxWidth,
        borderRadius: 2,
        boxShadow: isView ? 0 : 2,
        p: 2,
      }}
    >
      {/* <CardContent> */}
      <Box
        display="flex"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={2}
        py={1}
      >
        <div className="w-full flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Typography
              variant="subtitle2"
              sx={{
                fontSize: { xs: "0.8rem", sm: "0.9rem" },
                fontWeight: 600,
              }}
            >
              Total Day/Time :
            </Typography>

            <span className="text-[14px]">{`${
              data?.totalday ? data?.totalday : data?.totalDuration
            } `}</span>
          </div>
          <div>
            <Chip
              label={data?.regago}
              size="small"
              sx={{
                backgroundColor: "#e6f4ea",
                color: "#388e3c",
                fontWeight: 600,
              }}
            />
          </div>
        </div>

        <div className="flex">
          <Avatar
            src={data?.photo}
            alt={data?.empname}
            sx={{
              width: isView ? 60 : 40,
              height: isView ? 60 : 40,
              pointerEvents: "none",
              userSelect: "none",
            }}
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
              {`${data?.empname} (${data?.empcode})`}
            </Typography>
            <div className="flex gap-2 items-center">
              <Typography
                variant="subtitle2"
                sx={{
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                  fontWeight: 600,
                }}
              >
                Designation:
              </Typography>

              <span className="text-[14px]">{`${data?.designation}`}</span>
            </div>
            <div className="flex gap-2 items-center">
              <Typography
                variant="subtitle2"
                sx={{
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                  fontWeight: 600,
                }}
              >
                Designation:
              </Typography>

              <span className="text-[14px]">{`${data?.department}`}</span>
            </div>
          </div>
        </div>

        <div>
          <Typography variant="subtitle1" fontWeight={600} fontSize={15}>
            Leave Type
          </Typography>

          <div className="flex items-center space-x-2 mb-1">
            <div className={`w-3 h-3 rounded-full ${"bg-green-700"}`} />
            <span className="text-[14px]">{`${data?.leavetype} Leave`}</span>
          </div>
        </div>

        <div>
          <Typography variant="subtitle1" fontWeight={600} fontSize={15}>
            Request Date
          </Typography>

          <div className="flex items-center space-x-2 mb-1">
            <span className="text-[14px]">{`${data?.regdate}`}</span>
          </div>
        </div>
      </Box>

      {isView ? null : (
        <div className="w-full flex justify-center mt-1">
          <CustomButton
            className="cursor-pointer bg-stone-950  text-[#fff] rounded-md hover:bg-neutral-800/90"
            onClick={open}
          >
            View Details
          </CustomButton>
        </div>
      )}
      {/* </CardContent> */}
    </Card>
  );
};

export default LeaveGrantCard;
