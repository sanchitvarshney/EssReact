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

import { useMemo } from "react";
import { customColor } from "../constants/themeConstant";

const getTextColor = (key: string) => {
  const statusLower = key.toLowerCase();
  switch (statusLower) {
    case "p":
      return "green";
    case "a":
      return "red";
    case "wfh":
      return "blue";
    case "off":
      return "gray";
    default:
      return "black";
  }
};

const CalendarListView = ({
  currentMonth,
  data,
}: {
  currentMonth: moment.Moment;
  data: any;
}) => {
  const safeMonth = useMemo(() => moment(currentMonth), [currentMonth]);

  const daysInMonth = useMemo(() => {
    const days: {
      date: moment.Moment;
      event: {
        title: string;
        start: Date | null;
        end: Date | null;
        status: string;
        startTime: string;
      };
    }[] = [];

    const start = safeMonth.clone().startOf("month");
    const end = safeMonth.clone().endOf("month");

    for (let day = start.clone(); day.isSameOrBefore(end); day.add(1, "day")) {
      const matched = data.find((ev: any) =>
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
    console.log(days);
    return days;
  }, [currentMonth]);

  return (
    <div className="w-full p-4">
      <TableContainer component={Paper}>
        <Table
          sx={{
            borderCollapse: "separate",
            borderSpacing: 0,
            "& th, & td": {
              borderRight: "1px solid #e0e0e0",
            },
            "& tr:last-child td": {
              borderRight: "1px solid #e0e0e0",
            },
          }}
        >
          <TableHead>
            <TableRow>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              {/* <StyledTableCell>Time In</StyledTableCell> */}
              <StyledTableCell>Total Time</StyledTableCell>
              {/* <StyledTableCell>Assignment</StyledTableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {daysInMonth.map(({ date, event }) => (
              <StyledTableRow key={date.format("YYYY-MM-DD")}>
                <StyledTableCell>{date.format("DD MMM YYYY")}</StyledTableCell>
                {/*@ts-ignore */}
                <TableCell
                  sx={{ color: getTextColor(event.title), fontWeight: 600 }}
                >
                  {event.status || "N/A"}
                </TableCell>
                {/* <StyledTableCell>
                  {event.startTime}
                </StyledTableCell> */}
                <StyledTableCell>
                  {/* @ts-ignore */}
                  {event?.total_time || "--"}
                </StyledTableCell>

                {/* <StyledTableCell>{event.title || "N/A"}</StyledTableCell> */}
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
    backgroundColor: customColor?.bgColor,
    color: theme.palette.common.white,
    fontSize: 17,
  fontWeight: 600,
  
  letterSpacing: 2,
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
