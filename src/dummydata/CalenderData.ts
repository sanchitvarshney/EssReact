import moment from "moment-timezone";

const generateMonthlyEvents = (year: number, month: number) => {
  const daysInMonth = moment({ year, month }).daysInMonth();

  const events = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = moment.tz({ year, month, day }, "Asia/Kolkata");

    events.push({
      title: "N/A",
      start: date.toDate(),
      end: date.toDate(),
      status: "",
    });
  }

  return events;
};

// Example usage:
export const dummyEvents = generateMonthlyEvents(2025, 5); 
