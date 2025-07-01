// import { helperFun } from "../../helper/helpermethod";

import { getStatusStyle } from "../../helper/getcolor";
import { helperFun } from "../../helper/helpermethod";

const CalenderEvent = ({ event }: { event: any }) => {
  

  const statusStyle = getStatusStyle(event.title);

  return (
    <div className={`flex flex-col p-2 w-full overflow-auto`}>
      <div
        className={`flex items-center justify-center   ${statusStyle.textColor} `}
      >
        <span className={`text-sm font-bold uppercase p-1 ${statusStyle.bgColor} `}>{event.title}</span>
      </div>
      <div className=" hidden sm:hidden lg:block">
        {event.start && event.end && event.status && (
          <div className="  flex flex-col items-center">
            <span className="text-sm text-gray-600 font-bold break-all">
              {helperFun.formatTimeRange(event.start, event.end)}
            </span>
            <span className="text-xs text-gray-600 break-all">
              {event.status}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalenderEvent;
