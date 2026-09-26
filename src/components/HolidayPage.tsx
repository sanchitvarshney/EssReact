import { useEffect, useMemo, useRef, useState, type FC } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import moment from "moment";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CelebrationOutlinedIcon from "@mui/icons-material/CelebrationOutlined";
import EventUpcomingIcon from "@mui/icons-material/Upcoming";
import HistoryIcon from "@mui/icons-material/History";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useGetHolidaysListMutation } from "../services/Leave";
import { useToast } from "../hooks/useToast";
import HolidayPageSkeleton from "../skeleton/HolidayPageSkeleton";
import ComingSoon from "./reuseable/ComingSoon";
import "../css/AttendanceFullCalendar.css";

const currentYear = new Date().getFullYear();
const years = [currentYear - 1, currentYear, currentYear + 1];

interface HolidayProps {
  openClose?: any;
  open?: boolean;
}

type SectionProps = {
  title: string;
  subtitle: string;
  count: number;
  tone: "upcoming" | "elapsed";
  items: any[];
  emptyText: string;
  onPick: (d: moment.Moment) => void;
  collapsible?: boolean;
  open?: boolean;
  onToggle?: () => void;
};

const relative = (d: moment.Moment) => {
  const diff = d.clone().startOf("day").diff(moment().startOf("day"), "days");
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff > 1) return `in ${diff} days`;
  if (diff === -1) return "Yesterday";
  return `${Math.abs(diff)} days ago`;
};

const HolidaySection = ({
  title,
  subtitle,
  count,
  tone,
  items,
  emptyText,
  onPick,
  collapsible,
  open = true,
  onToggle,
}: SectionProps) => {
  const upcoming = tone === "upcoming";
  const accent = upcoming ? "#00a0a0" : "#94a3b8";

  return (
    <section className="bg-white rounded-3xl border border-gray-100 shadow-[0_1px_4px_rgba(16,24,40,0.05)] overflow-hidden">
      <button
        type="button"
        onClick={collapsible ? onToggle : undefined}
        className={`w-full flex items-center justify-between gap-3 px-5 py-4 text-left ${collapsible ? "cursor-pointer hover:bg-gray-50" : "cursor-default"}`}
        style={{ borderBottom: open ? "1px solid #f3f4f6" : "none" }}
      >
        <div className="flex items-center gap-3">
          <span
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: upcoming ? "#e0f6f6" : "#f1f5f9", color: accent }}
          >
            {upcoming ? <EventUpcomingIcon sx={{ fontSize: 19 }} /> : <HistoryIcon sx={{ fontSize: 19 }} />}
          </span>
          <div>
            <p className="text-sm font-bold text-gray-800 leading-tight">{title}</p>
            <p className="text-[11px] text-gray-400">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-[11px] font-bold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: upcoming ? "#e0f6f6" : "#f1f5f9", color: upcoming ? "#007f86" : "#64748b" }}
          >
            {count}
          </span>
          {collapsible && (
            <ExpandMoreIcon
              sx={{ fontSize: 20, color: "#9ca3af", transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }}
            />
          )}
        </div>
      </button>

      {open && (
        <div className="p-3 max-h-[360px] overflow-y-auto custom-scrollbar-for-menu">
          {items.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-6">{emptyText}</p>
          ) : (
            <div className="space-y-2">
              {items.map((h) => {
                const d = moment(h.start);
                const today = d.isSame(moment(), "day");
                const weekend = d.day() === 0 || d.day() === 6;
                return (
                  <button
                    key={h.id}
                    onClick={() => onPick(d)}
                    className={`w-full flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition-colors cursor-pointer hover:border-[#00a0a0] ${
                      today ? "border-[#00a0a0] bg-[#f0fbfb]" : "border-gray-100 bg-white"
                    } ${upcoming ? "" : "opacity-70"}`}
                  >
                    <span
                      className="w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0 text-white"
                      style={{ background: upcoming ? "linear-gradient(135deg, #00a0a0, #007f86)" : "#cbd5d5" }}
                    >
                      <span className="text-base font-bold leading-none">{d.format("DD")}</span>
                      <span className="text-[9px] uppercase tracking-wide mt-0.5">{d.format("MMM")}</span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-gray-800 truncate">{h.title}</span>
                      <span className="block text-[11px] text-gray-400">
                        {d.format("dddd")}
                        {weekend && " · weekend"}
                      </span>
                    </span>
                    <span
                      className="text-[10px] font-bold rounded-full px-2.5 py-1 whitespace-nowrap flex-shrink-0"
                      style={
                        today
                          ? { backgroundColor: "#00a0a0", color: "#fff" }
                          : upcoming
                            ? { backgroundColor: "#e0f6f6", color: "#007f86" }
                            : { backgroundColor: "#f1f5f9", color: "#64748b" }
                      }
                    >
                      {relative(d)}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

const HolidayPage: FC<HolidayProps> = ({ openClose, open = false }) => {
  const { showToast } = useToast();
  const calRef = useRef<FullCalendar>(null);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [calMonth, setCalMonth] = useState(moment());
  const [showElapsed, setShowElapsed] = useState(false);
  const [getHolidaysList, { data, isLoading, error }] = useGetHolidaysListMutation();

  useEffect(() => {
    if (error) {
      //@ts-ignore
      showToast(error?.error || error.message, "error");
    }
  }, [error]);

  useEffect(() => {
    getHolidaysList({ start: `${selectedYear}-01-01`, end: `${selectedYear}-12-31` });
    const m = selectedYear === currentYear ? moment() : moment({ year: selectedYear, month: 0, day: 1 });
    setCalMonth(m);
  }, [selectedYear]);

  useEffect(() => {
    calRef.current?.getApi().gotoDate(calMonth.toDate());
  }, [calMonth]);

  const holidays = useMemo(
    () =>
      ((data as any[]) ?? [])
        .filter((row) => row.title)
        .sort((a, b) => moment(a.start).valueOf() - moment(b.start).valueOf()),
    [data],
  );

  // Today counts as upcoming; everything before today has elapsed.
  const upcoming = useMemo(
    () => holidays.filter((h) => !moment(h.start).isBefore(moment(), "day")),
    [holidays],
  );
  const elapsed = useMemo(
    () => holidays.filter((h) => moment(h.start).isBefore(moment(), "day")).reverse(),
    [holidays],
  );

  const next = upcoming[0];
  const daysToNext = next ? moment(next.start).startOf("day").diff(moment().startOf("day"), "days") : null;

  const fcEvents = useMemo(
    () => holidays.map((h) => ({ id: String(h.id), title: h.title, start: moment(h.start).format("YYYY-MM-DD"), allDay: true })),
    [holidays],
  );

  const rootClass = open
    ? "w-full max-h-[85vh] overflow-y-auto custom-scrollbar-for-menu p-4 bg-[#f1f7f7] rounded-2xl"
    : "h-full overflow-y-auto custom-scrollbar-for-menu px-3 py-4";

  return (
    <div className={`${rootClass} flex flex-col gap-4 [&>*]:flex-shrink-0`}>
      {/* Hero */}
      <section
        className="relative overflow-hidden rounded-3xl text-white p-5 sm:p-7"
        style={{ background: "linear-gradient(120deg, #0f2f3a 0%, #0b5563 50%, #00a0a0 100%)" }}
      >
        <div className="pointer-events-none absolute -right-14 -top-20 w-64 h-64 rounded-full border-[28px] border-white/5" />
        <div className="pointer-events-none absolute left-1/3 -bottom-24 w-56 h-56 rounded-full bg-white/5" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4 min-w-0">
            <span className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center flex-shrink-0">
              <CelebrationOutlinedIcon sx={{ fontSize: 28 }} />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-widest text-white/60">Next holiday</p>
              {next ? (
                <>
                  <p className="text-xl sm:text-2xl font-bold leading-tight truncate">{next.title}</p>
                  <p className="text-sm text-white/75">
                    {moment(next.start).format("dddd, DD MMMM YYYY")} ·{" "}
                    <span className="font-semibold text-teal-200">
                      {daysToNext === 0 ? "Today" : daysToNext === 1 ? "Tomorrow" : `in ${daysToNext} days`}
                    </span>
                  </p>
                </>
              ) : (
                <p className="text-lg font-semibold">No upcoming holidays in {selectedYear}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-2xl font-bold leading-none tabular-nums">{holidays.length}</p>
              <p className="text-[10px] uppercase tracking-wider text-white/60">holidays</p>
            </div>
            <div className="flex items-center bg-white/15 rounded-2xl p-1 gap-0.5">
              {years.map((y) => (
                <button
                  key={y}
                  onClick={() => setSelectedYear(y)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    selectedYear === y ? "bg-white text-[#007f86] shadow" : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
            {open && (
              <button
                onClick={() => openClose()}
                aria-label="Close"
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center cursor-pointer"
              >
                <CloseIcon sx={{ fontSize: 18 }} />
              </button>
            )}
          </div>
        </div>
      </section>

      {isLoading ? (
        <HolidayPageSkeleton />
      ) : holidays.length === 0 ? (
        <ComingSoon />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-4 items-start">
          {/* Month calendar */}
          <div className="att-fc bg-white rounded-3xl border border-gray-100 shadow-[0_1px_4px_rgba(16,24,40,0.05)] p-3 sm:p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-base font-bold text-gray-800">{calMonth.format("MMMM YYYY")}</p>
              <div className="flex items-center gap-1 bg-[#f0fbfb] rounded-2xl p-1">
                <button
                  aria-label="Previous month"
                  onClick={() => setCalMonth((m) => m.clone().subtract(1, "month"))}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-[#007f86] hover:bg-white cursor-pointer"
                >
                  <ChevronLeftIcon sx={{ fontSize: 20 }} />
                </button>
                <button
                  onClick={() => setCalMonth(moment())}
                  className="px-2.5 h-8 rounded-xl text-xs font-semibold text-[#007f86] hover:bg-white cursor-pointer"
                >
                  Today
                </button>
                <button
                  aria-label="Next month"
                  onClick={() => setCalMonth((m) => m.clone().add(1, "month"))}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-[#007f86] hover:bg-white cursor-pointer"
                >
                  <ChevronRightIcon sx={{ fontSize: 20 }} />
                </button>
              </div>
            </div>

            <FullCalendar
              ref={calRef}
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              initialDate={calMonth.toDate()}
              headerToolbar={false}
              firstDay={1}
              height="auto"
              fixedWeekCount={false}
              showNonCurrentDates={false}
              dayHeaderFormat={{ weekday: "short" }}
              events={fcEvents}
              eventInteractive={false}
              dayMaxEvents={2}
              dayCellContent={(arg) => <span className="att-fc-daynum">{arg.date.getDate()}</span>}
              eventContent={(arg) => (
                <div
                  className="mx-1 mb-1 w-[calc(100%-8px)] truncate rounded-lg px-2 py-1 text-[10px] sm:text-[11px] font-semibold"
                  style={{ backgroundColor: "#e0f6f6", color: "#007f86" }}
                  title={arg.event.title}
                >
                  {arg.event.title}
                </div>
              )}
            />
          </div>

          {/* Upcoming / Elapsed */}
          <div className="flex flex-col gap-4">
            <HolidaySection
              title="Upcoming"
              subtitle="Still to come"
              count={upcoming.length}
              tone="upcoming"
              items={upcoming}
              emptyText={`No more holidays left in ${selectedYear}.`}
              onPick={(d) => setCalMonth(d.clone())}
            />
            <HolidaySection
              title="Elapsed"
              subtitle="Already gone by"
              count={elapsed.length}
              tone="elapsed"
              items={elapsed}
              emptyText="No holidays have passed yet."
              collapsible
              open={showElapsed}
              onToggle={() => setShowElapsed((v) => !v)}
              onPick={(d) => setCalMonth(d.clone())}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HolidayPage;
