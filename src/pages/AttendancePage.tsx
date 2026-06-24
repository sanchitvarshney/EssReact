import CustomCalender from "../components/CustomCalender";
import AttendancePageTable from "../components/AttendancePageTable";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Typography } from "@mui/material";
import EventNoteIcon from "@mui/icons-material/EventNote";
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

const STAT_CHIPS = [
  { key: "total_present", label: "Present", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  { key: "total_misspunch", label: "Mispunch", color: "#ca8a04", bg: "#fefce8", border: "#fde68a" },
  { key: "srtCount", label: "Short", color: "#64748b", bg: "#f8fafc", border: "#e2e8f0" },
  { key: "lateCount", label: "Late", color: "#ea580c", bg: "#fff7ed", border: "#fed7aa" },
];

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
    if (shifts?.data?.length > 0) {
      const parsedEvents = shifts.data.map((item: any) => {
        const start = new Date(item.start);
        const end = new Date(start);
        end.setHours(end.getHours() + 1);
        return { title: item.title, start, end, status: item.title, total_time: item.total_time };
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
    <div className="h-[calc(100vh-78px)] flex flex-col overflow-hidden px-3 py-4 w-full">

      {/* Page header */}
      <div className="flex items-center gap-2 mb-3 flex-shrink-0">
        <div className="w-1 h-7 rounded-full bg-[#2eacb3]" />
        <EventNoteIcon sx={{ fontSize: 20, color: "#2eacb3" }} />
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b", fontSize: 18 }}>
          Attendance
        </Typography>
      </div>

      {/* Attendance summary table */}
      <div className="flex-shrink-0">
        <AttendancePageTable value={shiftDetails} date={date} />
      </div>

      {/* Toolbar: legend + view toggle */}
      <div className="flex-shrink-0 mt-3 bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Legend pills */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar-for-menu pb-0.5">
          {dotColor.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100 flex-shrink-0 select-none"
            >
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.color}`} />
              <span className="text-[11px] font-medium text-gray-600 whitespace-nowrap">
                {item.name}
              </span>
            </div>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1 gap-0.5 flex-shrink-0">
          {VIEW_OPTIONS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              title={label}
              onClick={() => switchTab(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                tabvalue === id
                  ? "bg-[#2eacb3] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon sx={{ fontSize: 15 }} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Date nav + stats (hidden in graph view) */}
      {tabvalue !== "graph" && (
        <div className="flex-shrink-0 mt-3 flex items-center justify-between gap-4 flex-wrap">
          {/* Date navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={onPrevClick}
              title="Previous month"
              className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:border-[#2eacb3] hover:text-[#2eacb3] transition-all"
            >
              <ChevronLeftIcon sx={{ fontSize: 20 }} />
            </button>
            <button
              onClick={onTodayClick}
              className="px-3 h-8 rounded-full bg-white border border-gray-200 shadow-sm text-xs font-semibold text-gray-600 hover:border-[#2eacb3] hover:text-[#2eacb3] transition-all"
            >
              Today
            </button>
            <button
              onClick={onNextClick}
              title="Next month"
              className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:border-[#2eacb3] hover:text-[#2eacb3] transition-all"
            >
              <ChevronRightIcon sx={{ fontSize: 20 }} />
            </button>
            <Typography sx={{ fontWeight: 700, color: "#1e293b", fontSize: 17, ml: 0.5 }}>
              {dateText}
            </Typography>
          </div>

          {/* Stats chips */}
          <div className="flex items-center gap-2 flex-wrap">
            {STAT_CHIPS.map(({ key, label, color, bg, border }) => (
              <div
                key={key}
                className="flex items-center gap-2 px-3 py-2 rounded-xl shadow-sm select-none"
                style={{ backgroundColor: bg, border: `1px solid ${border}` }}
              >
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                <span className="text-xs font-medium text-gray-500">{label}</span>
                <span className="text-sm font-bold tabular-nums" style={{ color }}>
                  {(shifts as any)?.[key] ?? "--"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content area */}
      <div className="flex-1 min-h-[calc(100vh-364px)] mt-3 overflow-auto custom-scrollbar-for-menu">
        {tabvalue === "calendar" ? (
          <CustomCalender data={formattedEvents} setDate={setDate} date={date} />
        ) : tabvalue === "listview" ? (
          <CalendarListView currentMonth={date} data={formattedEvents} />
        ) : (
          <ChartofAttendenece data={data} />
        )}
      </div>
    </div>
  );
};

export default AttendancePage;
