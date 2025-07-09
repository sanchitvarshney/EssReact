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

  const eventStyleGetter = (event: any) => {
    let backgroundColor = "";

    switch (event.status) {
      case "P":
        backgroundColor = "#4ade80";
        break;
      case "A":
        backgroundColor = "#f87171";
        break;
      case "WH":
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

  // console.log(mergedEvents)
  return (
    <div className="w-full ">
      <Calendar
        defaultView="month"
        components={{
          event: CalenderEvent,
        }}
        localizer={localizer}
        events={data}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "80vh", width: "100%" }}
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
