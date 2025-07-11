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

import {  useMemo } from "react";
import { customColor } from "../constants/themeConstant";


const getTextColor = (key: string) => {
  const statusLower = key.toLowerCase();
  switch (statusLower) {
    case "p":
      return {
        backgroundColor: "#d1fae5",
        textColor: "#065f46",
      };
    case "a":
      return {
        backgroundColor: "#fee2e2",
        textColor: "#991b1b",
      };
    case "work from home":
    case "wfh":
      return {
        backgroundColor: "#dbeafe",
        textColor: "#1e40af",
      };
    case "mis":
      return {
        backgroundColor: "#fef9c3",
        textColor: "#ca8a04",
      };
    case "hd":
      return {
        backgroundColor: "#ccfbf1",
        textColor: "#0f766e",
      };
    case "p/sl":
    case "sick leave":
      return {
        backgroundColor: "#ffedd5", // bg-orange-100
        textColor: "#c2410c", // text-orange-800
      };
    case "srt":
      return {
        backgroundColor: "#f3f4f6", // bg-gray-100
        textColor: "#1f2937", // text-gray-800
      };
    case "el":
    case "earned leave":
      return {
        backgroundColor: "#e0e7ff", // bg-indigo-100
        textColor: "#3730a3", // text-indigo-800
      };
    case "weekly off":
    case "off":
      return {
        backgroundColor: "#f3f4f6", // bg-gray-100
        textColor: "#1f2937", // text-gray-800
      };
    default:
      return {
        textColor: "red",
      };
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

    return days;
  }, [currentMonth,data]);

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
                <TableCell
                  sx={{
                    color: getTextColor(event.status).textColor,

                    fontWeight: 600,
                    textAlign: "center",
                  }}
                >
                  <span
                    style={{
                      backgroundColor: getTextColor(event.status)
                        .backgroundColor,
                      padding: 4,
                    }}
                  >
                    {" "}
                    {event.status || "N/A"}
                  </span>
                </TableCell>

                <StyledTableCell>
                  {/* @ts-ignore */}
                  {event?.total_time || "--"}
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

const StyledTableRow = styled(TableRow)(() => ({
  // "&:nth-of-type(odd)": {
  //   backgroundColor: theme.palette.action.hover,
  // },
  // "&:last-child td, &:last-child th": {
  //   border: 0,
  // },
}));
