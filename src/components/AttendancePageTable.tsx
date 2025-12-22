import Card from "@mui/material/Card";

import Typography from "@mui/material/Typography";
import { Divider, Box, CircularProgress } from "@mui/material";
import { useEffect, type FC } from "react";
import { CustomButton } from "./ui/CustomButton";
import CustomToolTip from "./reuseable/CustomToolTip";
import { btnstyle } from "../constants/themeConstant";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import type { ShiftDetailsTypes } from "../types/dataTypes/shiftDetailsTypes";
import { useDownloadAttendanceMutation } from "../services/shift";
import moment from "moment";
import { useToast } from "../hooks/useToast";


type AttendancePageTablePropsType = {
  value: ShiftDetailsTypes;
  date: any;
};

const AttendancePageTable: FC<AttendancePageTablePropsType> = ({
  value,
  date,
}:any) => {
  const [downloadAttendance, { data, error, isLoading }] =
    useDownloadAttendanceMutation();
  const { showToast } = useToast();
  const downloadPDF = (
    bufferData: any,
    filename: string = "document.pdf" 
  ) => {
   
    const byteArray = new Uint8Array(bufferData);


    const file = new Blob([byteArray], { type: "application/pdf" });

    const url = URL.createObjectURL(file);
   
   
    
    
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
     URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (data?.buffer) {
      downloadPDF(data.buffer.data, data.filename);
    }
    if (error) {
      //@ts-ignore
      showToast(error?.data.message || "We're Sorry An unexpected error has occured. Our technical staff has been automatically notified and will be looking into this with utmost urgency.", "error");
    }
  }, [data?.buffer, error]);

  const handleDownloadAttendance = () => {
    const formatted = moment(date).format("YYYY-MM");
    downloadAttendance({ period: formatted });
  };

  

  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
        borderRadius: 0,
        boxShadow: 0,
        // p: 2,
        backgroundColor: "#fff",
       py:1
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
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
              {value?.today_in ? value?.today_in : "--"}
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
              {value?.total_hours ? value?.total_hours : "--"}
            </Typography>
          </Box>
        </Box>
        <CustomToolTip
          title={[
            {
              label: "Shift Code (Division)",
              value: value?.shift
                ? `${value?.shift} (${value?.division})`
                : "--",
            },
            {
              label: "Start Time",
              value: value?.start_time ? value?.start_time : "--",
            },
            {
              label: "End Time",
              value: value?.end_time ? value?.end_time : "--",
            },
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
          <CustomButton className={btnstyle} onClick={handleDownloadAttendance}>
            {isLoading ? (
              <CircularProgress sx={{ color: "#ffffff" }} size={"20px"} />
            ) : (
              <FileDownloadIcon sx={{ color: "#ffffff" }} />
            )}

            <span className="text-white ml-2">Download</span>
            {/* </>
            )} */}
          </CustomButton>
        </div>
      </Box>

      <Divider sx={{ mt: 2 }} />
    </Card>
  );
};

export default AttendancePageTable;
