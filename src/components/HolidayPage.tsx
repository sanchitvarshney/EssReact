import { useEffect, useState, useMemo, type FC } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import EventIcon from "@mui/icons-material/Event";
import { customColor } from "../constants/themeConstant";
import { useGetHolidaysListMutation } from "../services/Leave";
import { useToast } from "../hooks/useToast";
import moment from "moment";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localizedFormat from "dayjs/plugin/localizedFormat";
import HolidayPageSkeleton from "../skeleton/HolidayPageSkeleton";
import EmptyData from "./reuseable/EmptyData";

const getDay = (date: string) => {
  dayjs.extend(weekday);
  dayjs.extend(localizedFormat);
  return dayjs(date).format("dddd");
};

const isWeekend = (date: string) => {
  const day = dayjs(date).day();
  return day === 0 || day === 6;
};

const isToday = (date: string) => moment(date).isSame(moment(), "day");

const currentYear = new Date().getFullYear();
const years = [currentYear - 1, currentYear, currentYear + 1];

interface HolidayProps {
  openClose?: any;
  open?: boolean;
}

const HolidayPage: FC<HolidayProps> = ({ openClose, open = false }) => {
  const { showToast } = useToast();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [getHolidaysList, { data, isLoading, error }] =
    useGetHolidaysListMutation();

  useEffect(() => {
    if (error) {
      //@ts-ignore
      showToast(error?.error || error.message, "error");
    }
  }, [error]);

  useEffect(() => {
    getHolidaysList({
      start: `${selectedYear}-01-01`,
      end: `${selectedYear}-12-31`,
    });
  }, [selectedYear]);

  const filtered = useMemo(() => {
    if (!data) return [];
    return (data as any[]).filter((row) => row.title?.toLowerCase());
  }, [data]);

  return (
    <Box
      sx={{
        width: "100%",
        p: 2,
        overflow: "hidden",
        height: "calc(100vh - 90px)",
      }}
    >
      {/* Page Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div
            style={{ backgroundColor: "#2eacb3" }}
            className="w-1 h-7 rounded-full"
          />
          <Typography sx={{ fontSize: 19, fontWeight: 700, color: "#232324" }}>
            Holiday Calendar
          </Typography>
          {!isLoading && data && (
            <Chip
              label={`${filtered.length} holidays`}
              size="small"
              sx={{
                backgroundColor: "#e0f7f8",
                color: "#2eacb3",
                fontWeight: 600,
                fontSize: 11,
                height: 22,
                ml: 0.5,
              }}
            />
          )}
        </div>

        <div className="flex items-center gap-2">
          <Tabs
            value={selectedYear}
            onChange={(_e, val) => setSelectedYear(val)}
            TabIndicatorProps={{
              style: { backgroundColor: "#2eacb3", height: 3, borderRadius: 2 },
            }}
            textColor="inherit"
            sx={{
              minHeight: 36,
              "& .MuiTab-root": {
                minHeight: 36,
                py: 0,
                fontSize: 13,
                fontWeight: 600,
                color: "#888",
                textTransform: "none",
              },
              "& .Mui-selected": { color: "#2eacb3" },
            }}
          >
            {years.map((year) => (
              <Tab key={year} label={year} value={year} />
            ))}
          </Tabs>

          {open && (
            <IconButton onClick={() => openClose()} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <HolidayPageSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyData />
      ) : (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            maxHeight: "calc(100vh - 170px)",
            minHeight: "calc(100vh - 170px)",
            overflow: "auto",
            borderRadius: 2,
            border: "1px solid #eeeeee",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
          className="custom-scrollbar-for-menu"
        >
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {["#", "Occasion / Festival", "Date", "Day"].map((heading) => (
                  <TableCell
                    key={heading}
                    sx={{
                      backgroundColor: customColor.bgColor,
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 13,
                      letterSpacing: 1,
                      py: 1.8,
                      borderBottom: "none",
                    }}
                  >
                    {heading}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((row: any, index: number) => {
                const today = isToday(row.start);
                const weekend = isWeekend(row.start);
                return (
                  <TableRow
                    key={row.id}
                    sx={{
                      backgroundColor: today
                        ? "#e8f9fa"
                        : index % 2 === 0
                          ? "#ffffff"
                          : "#fafafa",
                      "&:hover": { backgroundColor: "#f0fbfc" },
                      transition: "background-color 0.12s",
                      borderLeft: today
                        ? "3px solid #2eacb3"
                        : "3px solid transparent",
                    }}
                  >
                    <TableCell
                      sx={{
                        color: "#bbb",
                        fontWeight: 500,
                        width: 50,
                        fontSize: 13,
                      }}
                    >
                      {index + 1}
                    </TableCell>

                    <TableCell sx={{ py: 1.5 }}>
                      <div className="flex items-center gap-2">
                        <EventIcon
                          sx={{
                            color: today ? "#2eacb3" : "#ccc",
                            fontSize: 16,
                            flexShrink: 0,
                          }}
                        />
                        <span
                          style={{
                            fontWeight: today ? 700 : 500,
                            fontSize: 13,
                            color: "#333",
                          }}
                        >
                          {row.title}
                        </span>
                        {today && (
                          <Chip
                            label="Today"
                            size="small"
                            sx={{
                              height: 17,
                              fontSize: 10,
                              backgroundColor: "#2eacb3",
                              color: "#fff",
                              fontWeight: 700,
                              "& .MuiChip-label": { px: 1 },
                            }}
                          />
                        )}
                      </div>
                    </TableCell>

                    <TableCell
                      sx={{ fontSize: 13, color: "#555", fontWeight: 500 }}
                    >
                      {moment(row.start).format("DD MMM YYYY")}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={getDay(row.start)}
                        size="small"
                        sx={{
                          backgroundColor: weekend ? "#fff4ed" : "#e8f9fa",
                          color: weekend ? "#f97316" : "#2eacb3",
                          fontWeight: 600,
                          fontSize: 11,
                          height: 22,
                          border: `1px solid ${weekend ? "#f9731640" : "#2eacb340"}`,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default HolidayPage;
