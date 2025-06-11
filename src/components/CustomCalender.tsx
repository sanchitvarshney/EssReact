import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment-timezone";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
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
import { CustomButton } from "./ui/CustomButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

export const VIEW_OPTIONS = [
  { id: Views.DAY, label: "Day" },
  { id: Views.WEEK, label: "Week" },
  { id: Views.MONTH, label: "Month" },
];
const CustomCalender = () => {
  const [view, setView] = useState<any>(Views.MONTH);
  const [date, setDate] = useState<any>(moment("2025-06-10").toDate());
  const localizer = momentLocalizer(moment);

  // Convert moment date to dayjs for DatePicker
  const dayjsDate = useMemo(() => {
    return dayjs(date);
  }, [date]);

  const onTodayClick = useCallback(() => {
    setDate(moment().toDate());
  }, []);

  const dateText = useMemo(() => {
    if (view === Views.DAY) return moment(date).format("dddd, MMMM DD");
    if (view === Views.WEEK) {
      const from = moment(date)?.startOf("week");
      const to = moment(date)?.endOf("week");
      return `${from.format("MMMM DD")} to ${to.format("MMMM DD")}`;
    }
    if (view === Views.MONTH) {
      return moment(date).format("MMMM YYYY");
    }
  }, [view, date]);

  const onPrevClick = useCallback(() => {
    if (view === Views.DAY) {
      setDate(moment(date).subtract(1, "d").toDate());
    } else if (view === Views.WEEK) {
      setDate(moment(date).subtract(1, "w").toDate());
    } else {
      setDate(moment(date).subtract(1, "M").toDate());
    }
  }, [view, date]);

  const onNextClick = useCallback(() => {
    if (view === Views.DAY) {
      setDate(moment(date).add(1, "d").toDate());
    } else if (view === Views.WEEK) {
      setDate(moment(date).add(1, "w").toDate());
    } else {
      setDate(moment(date).add(1, "M").toDate());
    }
  }, [view, date]);

  // Handle date picker change
  const handleDateChange = useCallback((newDate: any) => {
    if (newDate) {
      // Convert dayjs to moment to Date
      setDate(newDate.toDate());
    }
  }, []);

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
    <div className=" ">
      <div className="flex justify-between items-center p-2">
        {/* <Box p={2} width="300px"></Box> */}
        <ButtonGroup
          variant="contained"
          disableElevation
          sx={{
            "& .MuiButtonGroup-grouped": {
              borderColor: "#fff",
              margin: 0,
            },
          }}
        >
          {VIEW_OPTIONS.map(({ id, label }) => (
            <Button
              key={id}
              onClick={() => setView(id)}
              sx={{
                backgroundColor: view === id ? "#2a2929" : "grey.300",
                color: view === id ? "white" : "black",
                "&:hover": {
                  backgroundColor: view === id ? "50545a" : "grey.400",
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
        <div className="gap-1 flex items-center">
          <div className="flex gap-2">
            <div
              onClick={onPrevClick}
              className="text-[#000] flex items-center justify-center"
            >
              <ArrowBackIosIcon style={{ fontSize: 18 }} />
            </div>
            <div className="text-[#000] flex items-center justify-center w-[250px]">
              <Typography fontSize={"medium"} fontWeight={"bold"}>
                {dateText}
              </Typography>
            </div>
            <div
              onClick={onNextClick}
              className="text-[#000] flex items-center justify-center "
            >
              <ArrowBackIosIcon
                style={{ transform: "rotate(180deg)", fontSize: 18 }}
              />
            </div>
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-2">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                      "border-1 border-[#000000] rounded-md  text-sm focus:outline-none",
                    sx: {
                      "& .MuiInputBase-input::placeholder": {
                        color: "#94a3b8",
                        opacity: 1,
                        margin: 0,
                      },
                      "& .MuiInputBase-input:focus::placeholder": {
                        color: "#94a3b8",
                        borderRadius: "0px",
                        opacity: 1,
                      },
                    },
                  },
                  sx: {
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#000", // your custom color or transparent
                      },
                      "&.Mui-focused": {
                        boxShadow: "none",
                      },
                    },
                    "& .MuiInputBase-input::selection": {
                      background: "transparent", // or your custom color
                      color: "#000", // text color when selected
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>

          <CustomButton
            onClick={onTodayClick}
            className="bg-[#2a2929] py-3 text-[#ffffff]"
          >
            Today
          </CustomButton>
        </div>
      </div>
      <Calendar
        defaultView={"month"}
        components={{
          event: CalenderEvent,
        }}
        localizer={localizer}
        events={[
          {
            title: "John - Absent",
            start: moment.tz("2025-06-10T09:00:00", "Asia/Kolkata").toDate(),
            end: moment.tz("2025-06-10T18:00:00", "Asia/Kolkata").toDate(),
            status: "absent",
          },
        ]}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "82vh" }}
        eventPropGetter={eventStyleGetter}
        views={view}
        toolbar={false}
        view={view}
        onView={setView}
        onNavigate={setDate}
        date={date}
      />
    </div>
  );
};

export default CustomCalender;
