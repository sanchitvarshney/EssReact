import TodayHero from "../components/attendance/TodayHero";
import MonthPulse from "../components/attendance/MonthPulse";
import AttendanceMonthGrid from "../components/attendance/AttendanceMonthGrid";
import { useCallback, useEffect, useMemo, useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TimelineIcon from "@mui/icons-material/Timeline";
import ListIcon from "@mui/icons-material/List";
import moment from "moment";
import CalendarListView from "./ListViewOfCalender";
import { dotColor } from "../staticData/headerofattendance";
import {
  useGetShiftDetailsMutation,
  useGetShiftsMutation,
} from "../services/shift";
import { useToast } from "../hooks/useToast";
import AttendencePageSkeleton from "../skeleton/AttendencePageSkeleton";
import ChartofAttendenece from "./ChartofAttendenece";
import { useAttendanceStatisticsQuery } from "../services/Leave";

const VIEW_OPTIONS = [
  { id: "calendar", icon: CalendarMonthIcon, label: "Calendar" },
  { id: "listview", icon: ListIcon, label: "List" },
  { id: "graph", icon: TimelineIcon, label: "Graph" },
];

const AttendancePage = () => {
  const { showToast } = useToast();
  const [tabvalue, setTabvalue] = useState<string>("calendar");
  const [formattedEvents, setFormattedEvents] = useState<any>([]);
  const [date, setDate] = useState<any>(moment().toDate());

  const [
    getShiftDetails,
    { data: shiftDetails, isLoading: shiftDetailsLoading, error: shiftDetailsError },
  ] = useGetShiftDetailsMutation();
  const [
    getShifts,
    { data: shifts, isLoading: shiftsLoading, error: shiftsError },
  ] = useGetShiftsMutation();

  const { data, isLoading } = useAttendanceStatisticsQuery();

  const onTodayClick = useCallback(() => setDate(moment().toDate()), []);
  const onPrevClick = useCallback(() => setDate(moment(date).subtract(1, "M").toDate()), [date]);
  const onNextClick = useCallback(() => setDate(moment(date).add(1, "M").toDate()), [date]);

  const dateText = useMemo(() => moment(date).format("MMMM YYYY"), [date]);

  const switchTab = (id: string) => {
    setTabvalue(id);
    localStorage.setItem("tabvalue", id);
  };

  useEffect(() => {
    const range = {
      start: moment(date).startOf("month").format("YYYY-MM-DD"),
      end: moment(date).endOf("month").format("YYYY-MM-DD"),
    };
    getShiftDetails(range);
    getShifts(range);
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
    if (shifts?.data) {
      const parsedEvents = shifts.data.map((item: any) => {
        const start = new Date(item.start);
        const end = new Date(start);
        end.setHours(end.getHours() + 1);
        return {
          title: item.title,
          start,
          end,
          status: item.title,
          total_time: item.total_time,
          in_time: item.in_time,
          out_time: item.out_time,
        };
      });
      setFormattedEvents(parsedEvents);
    }
  }, [shifts?.data]);

  useEffect(() => {
    const tabData = localStorage.getItem("tabvalue");
    if (tabData) setTabvalue(tabData);
  }, []);

  if (shiftDetailsLoading || shiftsLoading || isLoading) {
    return <AttendencePageSkeleton />;
  }

  return (
    <div className="h-full overflow-y-auto custom-scrollbar-for-menu px-3 py-4 flex flex-col gap-4 [&>*]:flex-shrink-0">
      <div className="grid grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)] gap-4 items-start">
        {/* Left: today + month pulse (stacked vertically) */}
        <div className="flex flex-col gap-4 xl:sticky xl:top-0">
          <TodayHero value={shiftDetails} date={date} />
          <MonthPulse stats={shifts} events={formattedEvents} />
        </div>

        {/* Right: toolbar, legend and calendar / list / graph */}
        <div className="flex flex-col gap-4 min-w-0">
      {/* Toolbar: month switcher + view toggle */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {tabvalue !== "graph" ? (
          <div className="flex items-center bg-white border border-gray-100 shadow-sm rounded-2xl p-1 gap-1">
            <button
              onClick={onPrevClick}
              title="Previous month"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:bg-[#e0f6f6] hover:text-[#007f86] transition-colors cursor-pointer"
            >
              <ChevronLeftIcon sx={{ fontSize: 20 }} />
            </button>
            <span className="px-3 min-w-[150px] text-center text-sm font-bold text-gray-800">{dateText}</span>
            <button
              onClick={onNextClick}
              title="Next month"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:bg-[#e0f6f6] hover:text-[#007f86] transition-colors cursor-pointer"
            >
              <ChevronRightIcon sx={{ fontSize: 20 }} />
            </button>
            <button
              onClick={onTodayClick}
              className="ml-1 px-3 h-9 rounded-xl text-xs font-semibold text-[#007f86] bg-[#e0f6f6] hover:brightness-95 transition cursor-pointer"
            >
              Today
            </button>
          </div>
        ) : (
          <span className="text-sm font-bold text-gray-800">Yearly overview</span>
        )}

        <div className="flex items-center bg-white border border-gray-100 shadow-sm rounded-2xl p-1 gap-0.5">
          {VIEW_OPTIONS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              title={label}
              onClick={() => switchTab(id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                tabvalue === id
                  ? "text-white shadow-sm bg-gradient-to-r from-[#00a0a0] to-[#007f86]"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon sx={{ fontSize: 16 }} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      {tabvalue !== "graph" && (
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar-for-menu pb-0.5 -mt-1">
          {dotColor.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-gray-100 flex-shrink-0 select-none"
            >
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.color}`} />
              <span className="text-[11px] font-medium text-gray-600 whitespace-nowrap">{item.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="pb-2">
        {tabvalue === "calendar" ? (
          <AttendanceMonthGrid date={date} events={formattedEvents} />
        ) : tabvalue === "listview" ? (
          <CalendarListView currentMonth={date} data={formattedEvents} />
        ) : (
          <ChartofAttendenece data={data} />
        )}
      </div>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
