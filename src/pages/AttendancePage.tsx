import CustomCalender from "../components/CustomCalender";
import { Card, CardContent, Typography } from "@mui/material";
import { flexProperty } from "../constants/themeConstant";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { CustomButton } from "../components/ui/CustomButton";
import AttendancePageTable from "../components/AttendancePageTable";
// import dayjs from "dayjs";

const AttendancePage = () => {
  // Convert moment date to dayjs for DatePicker
  //   const dayjsDate = useMemo(() => {
  //     return dayjs(date);
  //   }, [date]);
  return (
    <div className="w-full flex flex-wrap b">
      <div className="w-full sm:w-[70%] ">
        <CustomCalender />
      </div>
      <div className={`w-full sm:w-[30%] p-4  flex-col  self-center space-y-5`}>
        <Card
          sx={{
            minWidth: { xs: "100%", sm: 180 },
            borderRadius: 2,
            boxShadow: 3,
            // m: 1,
          }}
        >
          <CardContent>
            <div className="grid grid-cols-2 place-items-center ">
              <div className={`${flexProperty} flex-col flex-wrap`}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: "0.9rem", sm: "1.1rem" },
                  }}
                >
                  TodayIn
                </Typography>
                <Typography>--</Typography>
              </div>
              <div className={`${flexProperty} flex-col`}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: "0.9rem", sm: "1.1rem" },
                  }}
                >
                  Total Hours
                </Typography>
                <Typography>-- h & -- m</Typography>
              </div>
            </div>
          </CardContent>
        </Card>
        <AttendancePageTable value={""} />
        <Card
          sx={{
            minWidth: { xs: "100%", sm: 180 },
            borderRadius: 2,
            boxShadow: 3,
            // m: 1,
          }}
        >
          <CardContent>
            <div className={` ${flexProperty} flex-col gap-y-1`}>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "0.9rem", sm: "1.1rem" },
                }}
              >
                Download Report
              </Typography>

              <div className={`${flexProperty} flex-row gap-2 flex-wrap`}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    format="DD-MM-YYYY"
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                        variant: "outlined",
                        placeholder: "Select Date",
                        InputProps: {
                          disableUnderline: true,
                          className:
                            "border border-black rounded-md text-sm focus:outline-none",
                          sx: {
                            "& .MuiInputBase-input::placeholder": {
                              color: "#94a3b8",
                              opacity: 1,
                            },
                          },
                        },
                        sx: {
                          width: "100%",
                          maxWidth: {
                            xs: "100%",
                            sm: "160px",
                            md: "180px",
                          },
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#000",
                            },
                            "&.Mui-focused": {
                              boxShadow: "none",
                            },
                          },
                        },
                      },
                    }}
                  />
                </LocalizationProvider>

                <CustomButton
                  onClick={() => {}}
                  className="bg-[#2a2929] text-white py-5 rounded"
                >
                  Download
                </CustomButton>
              </div>
            </div>
          </CardContent>
        </Card>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default AttendancePage;
