import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Avatar, CircularProgress } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ListIcon from "@mui/icons-material/List";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import moment from "moment";
import MonthPulse from "../components/attendance/MonthPulse";
import AttendanceMonthGrid from "../components/attendance/AttendanceMonthGrid";
import CalendarListView from "./ListViewOfCalender";
import EmptyData from "../components/reuseable/EmptyData";
import EmployeeInfoDrawer from "../components/team/EmployeeInfoDrawer";
import { dotColor } from "../staticData/headerofattendance";
import { useToast } from "../hooks/useToast";
import { useGetTeamMemberMonthMutation, type TeamMemberMonth } from "../services/teamAttendance";

const VIEWS = [
  { id: "calendar", icon: CalendarMonthIcon, label: "Calendar" },
  { id: "listview", icon: ListIcon, label: "List" },
] as const;

const initials = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";

/** One team member's full month - the same calendar / list / summary the employee sees on their own Attendance page. */
const TeamMemberAttendancePage = () => {
  const { empCode = "" } = useParams();
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const startMonth = /^\d{4}-\d{2}$/.test(search.get("month") || "") ? (search.get("month") as string) : moment().format("YYYY-MM");
  const [month, setMonth] = useState(startMonth);
  const [view, setView] = useState<"calendar" | "listview">("calendar");
  const [data, setData] = useState<TeamMemberMonth | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [getMonth, { isLoading }] = useGetTeamMemberMonthMutation();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setError(null);
      const res: any = await getMonth({ empCode, month });
      if (cancelled) return;
      if (res?.data?.code === 200) setData(res.data.data);
      else {
        const msg = res?.data?.message || res?.error?.data?.message || "Could not load this attendance";
        setError(msg);
        showToast(msg, "error");
      }
    })();
    return () => { cancelled = true; };
  }, [empCode, month]);

  const date = useMemo(() => moment(month, "YYYY-MM").toDate(), [month]);
  const isThisMonth = month === moment().format("YYYY-MM");
  const step = (n: number) => setMonth(moment(month, "YYYY-MM").add(n, "month").format("YYYY-MM"));

  // Same event shape AttendancePage builds from its own /attendance/view/punch data.
  const events = useMemo(
    () =>
      (data?.events ?? []).map((item) => {
        const start = new Date(item.start as string);
        const end = new Date(start);
        end.setHours(end.getHours() + 1);
        return { title: item.title, start, end, status: item.title, total_time: item.total_time, in_time: item.in_time, out_time: item.out_time };
      }),
    [data],
  );

  const emp = data?.emp;

  return (
    <div className="h-full overflow-y-auto custom-scrollbar-for-menu px-3 py-4 flex flex-col gap-4 [&>*]:flex-shrink-0">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate("/team-attendance")}
            title="Back to Team Attendance"
            className="w-9 h-9 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-500 hover:text-[#007f86] cursor-pointer"
          >
            <ArrowBackIcon sx={{ fontSize: 18 }} />
          </button>
          <Avatar src={emp?.photo || undefined} sx={{ width: 40, height: 40, bgcolor: "#00a0a01f", color: "#007f86", fontWeight: 700 }}>
            {emp ? initials(emp.name) : ""}
          </Avatar>
          <div className="min-w-0">
            <p className="text-base font-bold text-gray-800 truncate">{emp?.name || empCode}</p>
            <p className="text-[11px] text-gray-400">{empCode}{emp ? ` · ${emp.direct ? "Direct report" : `Level ${emp.level}`}` : ""}</p>
          </div>
        </div>
        <button
          onClick={() => setInfoOpen(true)}
          className="flex items-center gap-1.5 px-3 h-9 rounded-xl bg-white border border-gray-100 shadow-sm text-xs font-semibold text-gray-600 hover:text-[#007f86] cursor-pointer"
        >
          <PersonOutlineIcon sx={{ fontSize: 16 }} /> View profile
        </button>
      </div>

      {error && !data ? (
        <div className="py-16"><EmptyData title="Can't show this attendance" subtitle={error} /></div>
      ) : (
        <>
          <MonthPulse stats={data?.stats} events={events} />

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center bg-white border border-gray-100 shadow-sm rounded-2xl p-1 gap-1">
              <button onClick={() => step(-1)} title="Previous month" className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:bg-[#e0f6f6] hover:text-[#007f86] transition-colors cursor-pointer">
                <ChevronLeftIcon sx={{ fontSize: 20 }} />
              </button>
              <span className="px-3 min-w-[150px] text-center text-sm font-bold text-gray-800">{moment(month, "YYYY-MM").format("MMMM YYYY")}</span>
              <button onClick={() => step(1)} title="Next month" className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:bg-[#e0f6f6] hover:text-[#007f86] transition-colors cursor-pointer">
                <ChevronRightIcon sx={{ fontSize: 20 }} />
              </button>
              <button
                onClick={() => setMonth(moment().format("YYYY-MM"))}
                disabled={isThisMonth}
                className="ml-1 px-3 h-9 rounded-xl text-xs font-semibold text-[#007f86] bg-[#e0f6f6] hover:brightness-95 transition cursor-pointer disabled:opacity-40 disabled:cursor-default"
              >
                This month
              </button>
              {isLoading && <CircularProgress size={16} sx={{ color: "#00a0a0", mx: 1 }} />}
            </div>

            <div className="flex items-center bg-white border border-gray-100 shadow-sm rounded-2xl p-1 gap-0.5">
              {VIEWS.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  title={label}
                  onClick={() => setView(id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    view === id ? "text-white shadow-sm bg-gradient-to-r from-[#00a0a0] to-[#007f86]" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon sx={{ fontSize: 16 }} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center flex-wrap gap-2 -mt-1">
            {dotColor.map((item, index) => (
              <div key={index} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-gray-100 flex-shrink-0 select-none">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.color}`} />
                <span className="text-[11px] font-medium text-gray-600 whitespace-nowrap">{item.name}</span>
              </div>
            ))}
          </div>

          <div className="pb-2">
            {view === "calendar" ? <AttendanceMonthGrid date={date} events={events} /> : <CalendarListView currentMonth={moment(date)} data={events} />}
          </div>
        </>
      )}

      <EmployeeInfoDrawer open={infoOpen} empCode={empCode} onClose={() => setInfoOpen(false)} />
    </div>
  );
};

export default TeamMemberAttendancePage;
