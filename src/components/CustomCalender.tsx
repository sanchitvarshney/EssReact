import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment-timezone";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CalenderEvent from "./calenderEvent/CalenderEvent";
import "../css/CalenderCss.css";
import type { FC } from "react";

interface customcalendartypes {
  date: any;
  setDate: any;
  data: any;
}

const CustomCalender: FC<customcalendartypes> = ({ date, setDate, data }) => {
  const localizer = momentLocalizer(moment);

  const eventStyleGetter = () => ({
    style: {
      background: "transparent",
      border: "none",
      padding: 0,
      borderRadius: "4px",
    },
  });

  return (
    <div
      className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      <Calendar
        defaultView="month"
        components={{ event: CalenderEvent }}
        localizer={localizer}
        events={data}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "calc(100vh - 80px)", width: "100%" }}
        eventPropGetter={eventStyleGetter}
        views={["month"]}
        toolbar={false}
        onNavigate={setDate}
        date={date}
      />
    </div>
  );
};

export default CustomCalender;
