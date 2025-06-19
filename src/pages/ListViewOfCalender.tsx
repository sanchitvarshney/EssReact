import moment from "moment-timezone";
import {
  Paper,
  TableContainer,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";

import { dummyEvents } from "../dummydata/CalenderData";
import { useMemo } from "react";

// Sample real events
const realEvent = [
  {
    title: "P",
    start: moment.tz("2025-06-10T09:00:00", "Asia/Kolkata").toDate(),
    end: moment.tz("2025-06-10T18:00:00", "Asia/Kolkata").toDate(),
    status: "WFH",
  },
  {
    title: "A",
    start: moment.tz("2025-06-11T09:00:00", "Asia/Kolkata").toDate(),
    end: moment.tz("2025-06-11T18:00:00", "Asia/Kolkata").toDate(),
    status: "Off",
  },
  {
    title: "P",
    start: moment.tz("2025-06-12T09:00:00", "Asia/Kolkata").toDate(),
    end: moment.tz("2025-06-12T18:00:00", "Asia/Kolkata").toDate(),
    status: "WFO",
  },
];

const CalendarListView = ({
  currentMonth,
}: {
  currentMonth: moment.Moment;
}) => {
  const safeMonth = useMemo(() => moment(currentMonth), [currentMonth]);
  const mergedEvents = useMemo(() => {
    return dummyEvents.map((event) => {
      const match = realEvent.find((real) =>
        moment(real.start).isSame(event.start, "day")
      );
      return match || event;
    });
  }, [dummyEvents, realEvent]);

  const daysInMonth = useMemo(() => {
    const days: {
      date: moment.Moment;
      event: {
        title: string;
        start: Date | null;
        end: Date | null;
        status: string;
      };
    }[] = [];

    const start = safeMonth.clone().startOf("month");
    const end = safeMonth.clone().endOf("month");

    for (let day = start.clone(); day.isSameOrBefore(end); day.add(1, "day")) {
      const matched = mergedEvents.find((ev) =>
        moment(ev.start).isSame(day, "day")
      );

      days.push({
        date: day.clone(),
        event: matched || {
          title: "N/A",
          start: null,
          end: null,
          status: "",
        },
      });
    }

    return days;
  }, [currentMonth, mergedEvents]);

  return (
    <div className="w-full p-4">
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell align="right">Status</StyledTableCell>
              <StyledTableCell align="right">Time In</StyledTableCell>
              <StyledTableCell align="right">Time Out</StyledTableCell>
              <StyledTableCell align="right">Assignment</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {daysInMonth.map(({ date, event }) => (
              <StyledTableRow key={date.format("YYYY-MM-DD")}>
                <StyledTableCell>{date.format("DD MMM YYYY")}</StyledTableCell>
                <StyledTableCell align="right">
                  {event.status || "N/A"}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {event.start ? moment(event.start).format("hh:mm A") : "--"}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {event.end ? moment(event.end).format("hh:mm A") : "--"}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {event.title || "N/A"}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CalendarListView;

// Styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#000",
    color: theme.palette.common.white,
    fontWeight: 600,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
