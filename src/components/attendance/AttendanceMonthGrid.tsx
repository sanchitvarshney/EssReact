import { useEffect, useMemo, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import type { EventContentArg, EventInput } from "@fullcalendar/core";
import moment from "moment";
import { getTitleStyle } from "../../helper/getcolor";
import { isUpcomingAbsent } from "../../helper/attendance";
import "../../css/AttendanceFullCalendar.css";

const timeOnly = (v?: string) => {
  if (!v) return "";
  const m = moment(v, "DD-MM-YYYY HH:mm:ss");
  return m.isValid() ? m.format("hh:mm A") : v;
};

type Props = { date: any; events: any[] };

const AttendanceMonthGrid = ({ date, events }: Props) => {
  const calRef = useRef<FullCalendar>(null);

  // Each attendance day becomes a tinted background event + a content event (status, times).
  const fcEvents = useMemo(
    () =>
      events.flatMap((e, i): EventInput[] => {
        const day = moment(e.start).format("YYYY-MM-DD");
        if (isUpcomingAbsent(e.start, e.title)) {
          return [{ id: `ev-${i}`, start: day, allDay: true, extendedProps: { raw: e, upcoming: true } }];
        }
        const style = getTitleStyle(e.title);
        return [
          { id: `bg-${i}`, start: day, allDay: true, display: "background", backgroundColor: `${style.bg}99` },
          { id: `ev-${i}`, start: day, allDay: true, extendedProps: { raw: e, style } },
        ];
      }),
    [events],
  );

  useEffect(() => {
    calRef.current?.getApi().gotoDate(moment(date).toDate());
  }, [date]);

  const renderEvent = (arg: EventContentArg) => {
    const { raw, style, upcoming } = arg.event.extendedProps as any;
    // Background (tint) events carry no attendance payload - let FullCalendar draw them by default.
    if (!raw) return true;
    if (upcoming) {
      return (
        <div className="w-full px-1.5 pb-1.5">
          <span className="text-sm font-semibold text-gray-300" title="Upcoming day">
            –
          </span>
        </div>
      );
    }
    const inT = timeOnly(raw?.in_time);
    const outT = timeOnly(raw?.out_time);
    return (
      <div className="w-full flex flex-col gap-1 px-1.5 pb-1.5">
        <span
          className="self-start text-[9px] sm:text-[10px] font-bold uppercase rounded-full px-1.5 sm:px-2 py-0.5 truncate max-w-full"
          style={{ backgroundColor: style.bg, color: style.color }}
          title={style.label}
        >
          <span className="sm:hidden">{String(raw.title).slice(0, 3)}</span>
          <span className="hidden sm:inline">{style.label}</span>
        </span>
        {raw?.total_time && (
          <span className="hidden md:block text-[11px] font-semibold text-gray-600 tabular-nums">{raw.total_time}</span>
        )}
        {(inT || outT) && (
          <span className="hidden xl:block text-[10px] text-gray-500 tabular-nums leading-tight">
            {inT || "--"} → {outT || "--"}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="att-fc att-fc-head-accent bg-white rounded-3xl border border-gray-100 shadow-[0_1px_4px_rgba(16,24,40,0.05)] p-3 sm:p-4">
      <FullCalendar
        ref={calRef}
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        initialDate={moment(date).toDate()}
        headerToolbar={false}
        firstDay={1}
        height="auto"
        fixedWeekCount={false}
        showNonCurrentDates={false}
        dayHeaderFormat={{ weekday: "short" }}
        events={fcEvents}
        eventContent={renderEvent}
        dayCellContent={(arg) => <span className="att-fc-daynum">{arg.date.getDate()}</span>}
        eventInteractive={false}
      />
    </div>
  );
};

export default AttendanceMonthGrid;
