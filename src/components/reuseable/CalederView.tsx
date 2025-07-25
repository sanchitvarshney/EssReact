import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css"; // must come first
import "../../css/ViewCalenderCss.css";
import { isBefore, isAfter, parseISO, isSameDay } from "date-fns";
import { useEffect, useState, type FC } from "react";
import dayjs from "dayjs";


type CalenderViewPropsType = {
  startDate: any;
  endDate: any;
  paid: any;
  type?: any;
};

const CalenderView: FC<CalenderViewPropsType> = ({
  startDate,
  endDate,
  paid,
  type,
}) => {
  const [unpaid, setUnpaid] = useState<number>(0);

  const fromDate = parseISO(dayjs(startDate).format("YYYY-MM-DD"));
  const toDate = parseISO(dayjs(endDate).format("YYYY-MM-DD"));
  const today = parseISO(dayjs().format("YYYY-MM-DD"));

  
  const isOutsideRange = (date: Date) => {
  const isBeforeRange = isBefore(date, fromDate);
  const isAfterRange = isAfter(date, toDate);
  const isToday = isSameDay(date, today);

  return (isBeforeRange || isAfterRange || isToday );
};



  function countSundays() {
    let count = 0;
    let currentDate = new Date(fromDate);

    while (currentDate <= toDate) {
      if (currentDate.getDay() === 0) {
        count++; // Sunday is 0
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setUnpaid(count);
  }
  useEffect(() => {
    countSundays();
  }, [fromDate, toDate]);

  // const defaultClassNames = getDefaultClassNames();

  return (
    <div className=" p-3 border rounded shadow flex flex-col justify-center items-center bg-white flex relative ">
      <DayPicker
      onSelect={() => {}} 
        mode="range"
        navLayout="around"
        selected={{ from: fromDate, to: toDate }}
        defaultMonth={fromDate}
        fromMonth={fromDate}
        toMonth={toDate}
        disabled={isOutsideRange}
        showOutsideDays={false}
        classNames={{
          chevron: "text-white",
        }}
        modifiersClassNames={{
          range_start:
            "bg-[#2eacb3] border-0 text-white rounded-full font-bold",
          range_end: "bg-[#2eacb3] text-white rounded-full font-bold",
          range_middle: "bg-[#2eacb3] text-white  font-bold rounded-full",
          selected: "border-none text-gray-900",
          today: "text-white font-bold ",
        }}
        components={{
          //@ts-ignore
          Caption: () => null,
        }}
      />
      <div className="border-t-1 mt-3 flex justify-center gap-x-4">
       {
        type==="OD" ? (
          <span>OD time : {paid}</span>
        ):(
          <>
           {/* //@ts-ignore */}
        <span className="mt-1">Paid Off: {paid - unpaid}</span>
        <span className="mt-1">Unpaid: {unpaid}</span></>
        )
       }
      </div>
    </div>
  );
};

export default CalenderView;
