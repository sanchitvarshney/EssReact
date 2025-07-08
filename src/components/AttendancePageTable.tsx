import Card from "@mui/material/Card";

import Typography from "@mui/material/Typography";
import { Divider, Box } from "@mui/material";
import type { FC } from "react";
import { CustomButton } from "./ui/CustomButton";
import CustomToolTip from "./reuseable/CustomToolTip";
import { btnstyle } from "../constants/themeConstant"
import FileDownloadIcon from "@mui/icons-material/FileDownload";

type AttendancePageTablePropsType = {
  value: string | number;
};

const AttendancePageTable: FC<AttendancePageTablePropsType> = ({ value }) => {
  console.log(value);

  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
        borderRadius: 2,
        boxShadow: 0,
        // p: 2,
      }}
    >
      {/* <CardContent> */}
      {/* Header Row */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
        // sx={{pt:2}}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, fontSize: { xs: "1rem", sm: "1.2rem" } }}
        >
          Present Shift
        </Typography>

        {/* In/Out Stats */}
        <Box display="flex" gap={4}>
          <Box textAlign="center">
            <Typography
              fontWeight={600}
              fontSize={{ xs: "0.9rem", sm: "1rem" }}
            >
              Today In
            </Typography>
            <Typography variant="body2" color="text.secondary">
              --
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography
              fontWeight={600}
              fontSize={{ xs: "0.9rem", sm: "1rem" }}
            >
              Total Hours
            </Typography>
            <Typography variant="body2" color="text.secondary">
              -- h & -- m
            </Typography>
          </Box>
        </Box>
        <CustomToolTip
          title={[
            { label: "Shift Code (Division)", value: "D1 (MS01)" },
            { label: "Start Time", value: "09:00 AM" },
            { label: "End Time", value: "06:00 PM" },
          ].map((item, index) => (
            <Box
              key={index}
              display="flex"
              // justifyContent="space-between"
              // gap={3}
              alignItems="center"
              px={1}
              py={1}
            >
              <Typography variant="body2" flex={0.5} color="#fff">
                {item.label}
              </Typography>
              <Typography
                flex={0.5}
                variant="body2"
                color="#fff"
                fontWeight={500}
              >
                {item.value}
              </Typography>
            </Box>
          ))}
          placement={"bottom"}
        >
          <span className=" text-black select-none font-semibold text-[18px] border-b-1 ">
            Shift Details
          </span>
        </CustomToolTip>
        <div className="mr-1">
          <CustomButton className={btnstyle}>
          <FileDownloadIcon sx={{ color: "#ffffff" }} />
          <span className="text-white">Download</span>
        </CustomButton>
        </div>
      </Box>

      <Divider sx={{ mt: 2 }} />
    </Card>
  );
};

export default AttendancePageTable;
