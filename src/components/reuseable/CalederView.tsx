import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { isBefore, isAfter, parseISO } from "date-fns";
import { useEffect, type FC } from "react";
import dayjs from "dayjs";

type CalenderViewPropsType = {
  startDate: any;
  endDate: any;
};

const CalenderView: FC<CalenderViewPropsType> = ({ startDate, endDate }) => {
  
  const fromDate = parseISO(dayjs(startDate).format("YYYY-MM-DD"));
  const toDate = parseISO(dayjs(endDate).format("YYYY-MM-DD"));
  const isOutsideRange = (date: Date) =>
    isBefore(date, fromDate) || isAfter(date, toDate);


  function countSundays() {
  let count = 0;
  let currentDate = new Date(fromDate);

  while (currentDate <= toDate) {
    if (currentDate.getDay() === 0) {
      count++; // Sunday is 0
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

console.log(count)
}
useEffect(() => {
countSundays()
}, [fromDate,toDate])


  return (
    <div className="p-4 border rounded shadow flex justify-center  bg-white flex relative z-[1300]">
      <DayPicker
        mode="single"
        selected={fromDate}
        defaultMonth={fromDate}
  
        fromMonth={fromDate}
        toMonth={toDate}
        disabled={isOutsideRange}
        showOutsideDays={false}
        components={{
          //@ts-ignore
          Caption: () => null,

    
        }}
        // onSelect={countSundays}
        
      />
    </div>
  );
};

export default CalenderView;
