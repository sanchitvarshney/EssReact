import CustomCalender from "../components/CustomCalender";
import accept from "../assets/accept.png";
import clock from "../assets/clock (1).png";
import warning from "../assets/warning.png";
import cancel from "../assets/multiply.png";
import AttendancePageTable from "../components/AttendancePageTable";
import { useCallback, useMemo, useState } from "react";
import { ButtonGroup, IconButton, Typography } from "@mui/material";
// import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import moment from "moment";
import CalendarListView from "./ListViewOfCalender";
import ListIcon from "@mui/icons-material/List";
import { Button } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CustomToolTip from "../components/reuseable/CustomToolTip";
import CardForAttendance from "../components/reuseable/CardForAttendance";
import { dotColor } from "../staticData/headerofattendance";

export const Button_OPTIONS = [
  { id: "back", label: "Back" },
  { id: "next", label: "Next" },
  { id: "today", label: "Today" },
];
const AttendancePage = () => {
  const [tabvalue, setTabvalue] = useState<string>("calendar");
  // const [currentMonth, setCurrentMonth] = useState(moment());
  const [date, setDate] = useState<any>(moment("2025-06-10").toDate());

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
  return (
    <div className="w-full px-4 py-2 ">
      <AttendancePageTable value={""} />
      <div className="w-full flex justify-between flex-wrap gap-y-5 gap-x-1 py-3 px-4">
        <div className="flex gap-x-8 gap-y-4 flex-wrap">
          {dotColor.map((item, index) => (
            <div key={index} className="flex items-center space-x-2 mb-1">
              <div className={`w-3 h-3 rounded-full ${item.color}`} />
              <span className=" select-none ">{item.name}</span>
            </div>
          ))}
        </div>

        <ButtonGroup variant="outlined" aria-label="Basic button group">
          <CustomToolTip title={"Calendar View"} placement={"bottom"}>
            <IconButton onClick={() => setTabvalue("calendar")}>
              <CalendarMonthIcon sx={{ fontSize: 32, color: "#000" }} />
            </IconButton>
          </CustomToolTip>
          <CustomToolTip title={"List View"} placement={"bottom"}>
            <IconButton onClick={() => setTabvalue("listview")}>
              <ListIcon sx={{ fontSize: 32, color: "#000" }} />
            </IconButton>
          </CustomToolTip>
        </ButtonGroup>
      </div>
      <div className="w-full ">
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

          <div className="">
            <Typography fontSize={"1.5rem"} fontWeight="bold">
              {dateText}
            </Typography>
          </div>

          <div className="flex items-center flex-wrap gap-x-2">
            <CardForAttendance title={"Present"} icon={accept} value={6} />
            <CardForAttendance title={"Absent"} icon={cancel} value={6} />
            <CardForAttendance title={"Mispunch"} icon={warning} value={6} />
            <CardForAttendance title={"Short"} icon={clock} value={1} />
          </div>
        </div>
        {tabvalue === "calendar" ? (
          <CustomCalender date={date} setDate={setDate} />
        ) : (
          <CalendarListView currentMonth={date} />
        )}
      </div>
    </div>
  );
};

export default AttendancePage;
