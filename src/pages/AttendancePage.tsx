import CustomCalender from "../components/CustomCalender";
import accept from "../assets/accept.png";
import clock from "../assets/clock (1).png";
import warning from "../assets/warning.png";
// import cancel from "../assets/multiply.png";
import AttendancePageTable from "../components/AttendancePageTable";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ButtonGroup, IconButton, Typography } from "@mui/material";
import TimelineIcon from "@mui/icons-material/Timeline";
import moment from "moment";
import CalendarListView from "./ListViewOfCalender";
import ListIcon from "@mui/icons-material/List";
import { Button } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CustomToolTip from "../components/reuseable/CustomToolTip";
import CardForAttendance from "../components/reuseable/CardForAttendance";
import { dotColor } from "../staticData/headerofattendance";
import {
  useGetShiftDetailsMutation,
  useGetShiftsMutation,
} from "../services/shift";
import { useToast } from "../hooks/useToast";
import AttendencePageSkeleton from "../skeleton/AttendencePageSkeleton";
import ChartofAttendenece from "./ChartofAttendenece";
import { useAttendanceStatisticsQuery } from "../services/Leave";

export const Button_OPTIONS = [
  { id: "back", label: "Back" },
  { id: "next", label: "Next" },
  { id: "today", label: "Today" },
];
const AttendancePage = () => {
  const { showToast } = useToast();
  const [tabvalue, setTabvalue] = useState<string>("calendar");
  const [formattedEvents, setFormattedEvents] = useState<any>([]);

  const [date, setDate] = useState<any>(moment().toDate());
  const [
    getShiftDetails,
    {
      data: shiftDetails,
      isLoading: shiftDetailsLoading,
      error: shiftDetailsError,
    },
  ] = useGetShiftDetailsMutation();
  const [
    getShifts,
    { data: shifts, isLoading: shiftsLoading, error: shiftsError },
  ] = useGetShiftsMutation();

  const { data, isLoading } = useAttendanceStatisticsQuery();

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

  useEffect(() => {
    getShiftDetails({
      start: moment(date).startOf("month").format("YYYY-MM-DD"),
      end: moment(date).endOf("month").format("YYYY-MM-DD"),
    });
    getShifts({
      start: moment(date).startOf("month").format("YYYY-MM-DD"),
      end: moment(date).endOf("month").format("YYYY-MM-DD"),
    });
  }, [date]);

  useEffect(() => {
    if (shiftDetailsError) {
      // @ts-ignore
      showToast(shiftDetailsError.data?.message || "Shift Not Found!", "error");
    }
    if (shiftsError) {
      // @ts-ignore
      showToast(shiftsError?.data?.message || "Shift Not Found!", "error");
    }
  }, [shiftDetailsError, shiftsError]);

  useEffect(() => {
    if (shifts?.data?.length > 0) {
      const parsedEvents = shifts?.data?.map((item: any) => {
        const start = new Date(item.start);
        const end = new Date(start);
        end.setHours(end.getHours() + 1);

        return {
          title: item.title,
          start,
          end,
          status: item.title,
          total_time: item.total_time,
        };
      });
      setFormattedEvents(parsedEvents);
    }
  }, [shifts?.data]);

  return (
    <div className=" relative w-full p-2 h-full overflow-y-scroll  will-change-transform ">
      {shiftDetailsLoading || shiftsLoading || isLoading ? (
        <AttendencePageSkeleton />
      ) : (
        <>
          <div className="sticky top-[-8px] z-10  ">
             <AttendancePageTable value={shiftDetails} date={date} />
            </div>
         
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
              <CustomToolTip title={"Graph View"} placement={"bottom"}>
                <IconButton onClick={() => setTabvalue("graph")}>
                  <TimelineIcon sx={{ fontSize: 32, color: "#000" }} />
                </IconButton>
              </CustomToolTip>
            </ButtonGroup>
          </div>
          <div className="w-full ">
            {!(tabvalue === "graph") && (
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
                  <CardForAttendance
                    title={"Present"}
                    icon={accept}
                    value={shifts?.total_present ? shifts?.total_present : "--"}
                  />

                  <CardForAttendance
                    title={"Mispunch"}
                    icon={warning}
                    value={
                      shifts?.total_misspunch ? shifts?.total_misspunch : "--"
                    }
                  />
                  <CardForAttendance
                    title={"Short"}
                    icon={clock}
                    value={shifts?.srtCount ? shifts?.srtCount : "--"}
                  />
                </div>
              </div>
            )}
            {tabvalue === "calendar" ? (
              <CustomCalender
                data={formattedEvents}
                setDate={setDate}
                date={date}
              />
            ) : tabvalue === "listview" ? (
              <CalendarListView currentMonth={date} data={formattedEvents} />
            ) : (
              <ChartofAttendenece data={data} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AttendancePage;
