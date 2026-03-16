import Card from "@mui/material/Card";

import Typography from "@mui/material/Typography";
import { Divider, Box, CircularProgress } from "@mui/material";
import { useEffect, type FC } from "react";
import { CustomButton } from "./ui/CustomButton";
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
const fontStyle = { fontSize: "13px", fontWeight: "bold" };

const AttendancePageTable: FC<AttendancePageTablePropsType> = ({
  value,
  date,
}: any) => {
  const [downloadAttendance, { data, error, isLoading }] =
    useDownloadAttendanceMutation();
  const { showToast } = useToast();
  const downloadPDF = (bufferData: any, filename: string = "document.pdf") => {
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
      showToast(
        //@ts-ignore
        error?.data.message ||
          "We're Sorry An unexpected error has occured. Our technical staff has been automatically notified and will be looking into this with utmost urgency.",
        "error",
      );
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
     
        backgroundColor: "#fff",
        pt: 1,
        px: 0.8,
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {/* {[
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
              gap={3}
              alignItems="center"
             
            >
              <Typography variant="body2" flex={2} color="#000">
                {item.label}
              </Typography>
              <Typography
                flex={1}
                variant="body2"
                color="#000"
                fontWeight={500}
              >
                {item.value}
              </Typography>
            </Box>
          ))} */}
          <span style={fontStyle}>
            {" "}
            Shift Code:{" "}
            {value?.shift ? `${value?.shift} (${value?.division})` : "--"}
          </span>{" "}
          <span style={fontStyle}>
            {" "}
            Start Time: {value?.start_time ? value?.start_time : "--"}
          </span>{" "}
          <span style={fontStyle}>
            {" "}
            End Time: {value?.end_time ? value?.end_time : "--"}
          </span>
        </Box>

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
              {value?.today_in ?? "--"}
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
              {value?.total_hour ?? "--"}
            </Typography>
          </Box>
        </Box>
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
