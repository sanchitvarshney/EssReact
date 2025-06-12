import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment-timezone";
import accept from "../assets/accept.png"
import clock from "../assets/clock (1).png"
import warning from "../assets/warning.png"
// import dayjs from "dayjs";


// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CalenderEvent from "./calenderEvent/CalenderEvent";
import "../css/CalenderCss.css";
import { useCallback, useMemo, useState } from "react";
import {
  //   Box,
  ButtonGroup,
  Typography,
  Button,
 
} from "@mui/material";
// import DatePicker from "react-datepicker";
// import { CustomButton } from "./ui/CustomButton";
// import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CardForAttendance from "./reuseable/CardForAttendance";

export const Button_OPTIONS = [
  { id: "back", label: "Back" },
  { id: "next", label: "Next" },
  { id: "today", label: "Today" },
];
const CustomCalender = () => {
  const [date, setDate] = useState<any>(moment("2025-06-10").toDate());
  const localizer = momentLocalizer(moment);

  // Convert moment date to dayjs for DatePicker
  // const dayjsDate = useMemo(() => {
  //   return dayjs(date);
  // }, [date]);

  const onTodayClick = useCallback(() => {
    setDate(moment().toDate());
  }, []);

  const dateText = useMemo(() => {
    return moment(date).format("MMMM YYYY");
  }, [date]);

  const onPrevClick = useCallback(() => {
    setDate(moment(date).subtract(1, "M").toDate());
  }, [date]);

  const onNextClick = useCallback(() => {
    setDate(moment(date).add(1, "M").toDate());
  }, [date]);

  const handleCalender = (id: string) => {
    if (id === "back") {
      onPrevClick();
    } else if (id === "next") {
      onNextClick();
    } else {
      onTodayClick();
    }
  };
  // Handle date picker change
  // const handleDateChange = useCallback((newDate: any) => {
  //   if (newDate) {
  //     // Convert dayjs to moment to Date
  //     setDate(newDate.toDate());
  //   }
  // }, []);

  const eventStyleGetter = (event: any) => {
    let backgroundColor = "";

    switch (event.status) {
      case "Present":
        backgroundColor = "#4ade80";
        break;
      case "Absent":
        backgroundColor = "#f87171";
        break;
      case "WFH":
        backgroundColor = "#60a5fa";
        break;
      case "Off":
        backgroundColor = "#fbbf24";
        break;
      default:
        backgroundColor = "#d1d5db";
    }

    return {
      style: {
        backgroundColor,
        borderRadius: "5px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
      },
    };
  };
  return (
    <div className="w-full b">
      <div className="flex flex-wrap justify-between items-center p-2    ">
        {/* Button Group */}
        <div className="flex flex-wrap">
          <ButtonGroup
            size="small"
            variant="contained"
            disableElevation
            sx={{
              "& .MuiButtonGroup-grouped": {
                borderColor: "#fff",
                margin: 0,
              },
            }}
          >
            {Button_OPTIONS.map(({ id, label }) => (
              <Button
                key={id}
                onClick={() => handleCalender(id)}
                sx={{
                  backgroundColor: "#2a2929",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "grey.800",
                    color: "white",
                  },
                  borderRadius: 0,
                  textTransform: "none",
                }}
              >
                {label}
              </Button>
            ))}
          </ButtonGroup>
        </div>

        {/* Navigation Arrows & Date Text */}
        {/* <div className="flex items-center gap-2 flex-wrap">
          <div onClick={onPrevClick} className="text-black cursor-pointer">
            <ArrowBackIosIcon style={{ fontSize: 18 }} />
          </div> */}
        <div className="">
          <Typography fontSize={"1.5rem"} fontWeight="bold" color="gray">
            {dateText}
          </Typography>
        </div>
        {/* <div onClick={onNextClick} className="text-black cursor-pointer">
            <ArrowBackIosIcon
              style={{ transform: "rotate(180deg)", fontSize: 18 }}
            />
          </div>
        </div> */}

        {/* Date Picker & Today Button */}
        <div className="flex items-center flex-wrap gap-x-2">
          <CardForAttendance title={"Present"} icon={accept} value={6} />
           <CardForAttendance title={"Mispunch"} icon={warning} value={6} />
            <CardForAttendance title={"Short"} icon={clock} value={1} />
         
          {/*   <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={dayjsDate}
              onChange={handleDateChange}
              format="DD-MM-YYYY"
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: false,
                  variant: "outlined",
                  placeholder: "Select Date",
                  InputProps: {
                    disableUnderline: true,
                    className:
                      "border-1 border-black rounded-md text-sm focus:outline-none",
                    sx: {
                      "& .MuiInputBase-input::placeholder": {
                        color: "#94a3b8",
                        opacity: 1,
                      },
                    },
                  },
                  sx: {
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
            onClick={onTodayClick}
            className="bg-[#2a2929] text-white px-4 py-2 rounded"
          >
            Today
          </CustomButton>*/}
        </div>
      </div>

      {/* Calendar Component */}
      <Calendar
        defaultView="month"
        components={{
          event: CalenderEvent,
          
        }}
        localizer={localizer}
        events={[
          {
            title: "Present",
            start: moment.tz("2025-06-10T09:00:00", "Asia/Kolkata").toDate(),
            end: moment.tz("2025-06-10T18:00:00", "Asia/Kolkata").toDate(),
            status: "Work from home",
          },
        ]}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "80vh", width: "100%" }}
        eventPropGetter={eventStyleGetter}
        views={["month"]}
        toolbar={false}
        // view={view}
        // onView={setView}
        onNavigate={setDate}
        date={date}
      />
    </div>
  );
};

export default CustomCalender;
