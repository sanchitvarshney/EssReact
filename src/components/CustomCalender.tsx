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
  let backgroundImage = "";

  switch (event.status) {
    default:
      backgroundImage = "linear-gradient(to right,rgb(240, 245, 247),rgb(235, 245, 244))";
      break;
  }

  return {
    style: {
      backgroundImage,
      borderRadius: "5px",
      opacity: 0.8,
      color: "white",
      border: "0px",
      display: "block",
    },
  };
};


  
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
