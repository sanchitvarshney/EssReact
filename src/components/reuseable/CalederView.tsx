import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { isBefore, isAfter, parseISO } from "date-fns";
import { useEffect, useState, type FC } from "react";
import dayjs from "dayjs";

type CalenderViewPropsType = {
  startDate: any;
  endDate: any;
  paid: any;
};

const CalenderView: FC<CalenderViewPropsType> = ({
  startDate,
  endDate,
  paid,
}) => {
  const [unpaid, setUnpaid] = useState<number>(0);

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

    setUnpaid(count);
  }
  useEffect(() => {
    countSundays();
  }, [fromDate, toDate]);

  return (
    <div className="p-4 border rounded shadow flex flex-col justify-center  bg-white flex relative z-[1300]">
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
      <div className="border-t-1 mt-3 flex justify-center gap-x-4">
        {/* //@ts-ignore */}
        <span className="mt-1">Paid Off: {paid - unpaid}</span>
        <span className="mt-1">Unpaid: {unpaid}</span>
      </div>
    </div>
  );
};

export default CalenderView;
