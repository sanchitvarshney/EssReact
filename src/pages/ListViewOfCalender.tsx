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
import { getTitleStyle } from "../helper/getcolor";

const formatTimeOnly = (value?: string) => {
  if (!value) return "";
  const parsed = moment(value, "DD-MM-YYYY HH:mm:ss");
  return parsed.isValid() ? parsed.format("hh:mm A") : value;
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
        in_time: string;
        out_time: string;
        total_time: string;
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
          startTime: "",
          in_time: "",
          out_time: "",
          total_time: "",
        },
      });
    }

    return days;
  }, [currentMonth, data]);

  const today = moment().startOf("day");

  return (
    <div className="w-full">
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          border: "1px solid #f1f5f9",
          overflow: "hidden",
        }}
      >
        <Table
          sx={{
            borderCollapse: "separate",
            borderSpacing: 0,
            "& th, & td": { borderRight: "1px solid #f1f5f9" },
            "& tr:last-child td": { borderBottom: "none" },
          }}
        >
          <TableHead>
            <TableRow>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell align="center">Status</StyledTableCell>
              <StyledTableCell>In Time</StyledTableCell>
              <StyledTableCell>Out Time</StyledTableCell>
              <StyledTableCell>Total Time</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {daysInMonth.map(({ date, event }) => {
              const isToday = date.isSame(today, "day");
              const isSunday = date.day() === 0;
              const { bg, color, label } = getTitleStyle(event.status);

              return (
                <StyledTableRow
                  key={date.format("YYYY-MM-DD")}
                  sx={isToday ? { bgcolor: "#f0fdfe !important" } : {}}
                >
                  {/* Date cell */}
                  <TableCell
                    sx={{
                      py: 1.25,
                      px: 2,
                      fontSize: 13,
                      fontWeight: isToday ? 700 : 500,
                      color: isToday
                        ? "#2eacb3"
                        : isSunday
                        ? "#ef4444"
                        : "#374151",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span>{date.format("DD MMM YYYY")}</span>
                    {isToday && (
                      <span
                        className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ backgroundColor: "#e0f7fa", color: "#0097a7" }}
                      >
                        Today
                      </span>
                    )}
                  </TableCell>

                  {/* Status badge */}
                  <TableCell align="center" sx={{ py: 1.25, px: 2 }}>
                    {event.status ? (
                      <span
                        style={{
                          backgroundColor: bg,
                          color,
                          padding: "3px 14px",
                          borderRadius: 999,
                          fontWeight: 600,
                          fontSize: 12,
                          display: "inline-block",
                          minWidth: 72,
                          textAlign: "center",
                        }}
                      >
                        {label}
                      </span>
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </TableCell>
                    {/* Total time */}
                  <TableCell
                    sx={{
                      py: 1.25,
                      px: 2,
                      fontSize: 13,
                      color: "#475569",
                      fontFamily: "monospace",
                    }}
                  >
                    {event.in_time ? (
                      formatTimeOnly(event.in_time)
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </TableCell>
                    {/* Total time */}
                  <TableCell
                    sx={{
                      py: 1.25,
                      px: 2,
                      fontSize: 13,
                      color: "#475569",
                      fontFamily: "monospace",
                    }}
                  >
                    {event.out_time ? (
                      formatTimeOnly(event.out_time)
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </TableCell>

                  {/* Total time */}
                  <TableCell
                    sx={{
                      py: 1.25,
                      px: 2,
                      fontSize: 13,
                      color: "#475569",
                      fontFamily: "monospace",
                    }}
                  >
                    {event.total_time || (
                      <span className="text-gray-300">—</span>
                    )}
                  </TableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CalendarListView;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#2eacb3",
    color: theme.palette.common.white,
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: 0.5,
    padding: "12px 16px",
    borderBottom: "none",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
    borderBottom: "1px solid #f8fafc",
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  "&:nth-of-type(even)": {
    backgroundColor: "#fafafa",
  },
  "&:hover": {
    backgroundColor: "#f0fdfe !important",
    transition: "background-color 0.15s",
  },
}));
