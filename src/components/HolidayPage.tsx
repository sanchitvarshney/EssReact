import React, { useEffect, useState, type FC } from "react";
import {
  Box,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
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

  const d = dayjs(date);

  const dayName = d.format("dddd");
  return dayName;
};

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

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedYear(newValue);
    console.log(event);
  };

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

  return (
    <Box
      sx={{
        width: "100%",
        p: 2,
        overflow: "hidden",
        height: "85vh",
      }}
    >
      {isLoading ? (
        <HolidayPageSkeleton />
      ) : (
        <>
          {" "}
          <div className="flex justify-between items-center">
            <Tabs
              value={selectedYear}
              onChange={handleChange}
              aria-label="Holiday Year Tabs"
              TabIndicatorProps={{
                style: {
                  backgroundColor: "#2eacb3",
                },
              }}
              textColor="inherit"
              sx={{
                width: "100%",
                mb: 2,
                "& .MuiTab-root": {
                  color: "#333",
                },
                "& .Mui-selected": {
                  color: "#2eacb3",
                },
              }}
            >
              {years.map((year) => (
                <Tab
                  sx={{ fontSize: 16, fontWeight: "bold" }}
                  key={year}
                  label={year}
                  value={year}
                />
              ))}
            </Tabs>
            {open && (
              <div className="flex ">
                <IconButton onClick={() => openClose()}>
                  <CloseIcon />
                </IconButton>
              </div>
            )}
          </div>
          {/* <div key={selectedYear} className="h-[75vh] overflow-y-auto custom-scrollbar-for-menu"> */}
          {data?.length === 0 ? (
            <Box
              sx={{
                width: "100%",
                display:"grid",
                placeItems:"center"
              }}
            >
              <EmptyData />
            </Box>
          ) : (
            <TableContainer
              component={Paper}
              sx={{
                maxHeight: "75vh",
                height: "75vh",
                overflow: "auto",
                pb: 1.5,
              }}
              className="custom-scrollbar-for-menu "
            >
              <Table>
                <TableHead
                  style={{
                    backgroundColor: customColor.bgColor,
                  }}
                >
                  <TableRow
                    sx={{
                      position: "sticky",
                      top: 0,
                      zIndex: 999,
                      backgroundColor: customColor.bgColor,
                    }}
                  >
                    <TableCell
                      sx={{
                        fontSize: 18,
                        fontWeight: 600,
                        color: "#fff",
                        letterSpacing: 2,
                      }}
                    >
                      <b>S.No</b>
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: 18,
                        fontWeight: 600,
                        color: "#fff",
                        letterSpacing: 2,
                      }}
                    >
                      <b>Occasion/Festival</b>
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: 18,
                        fontWeight: 600,
                        color: "#fff",
                        letterSpacing: 2,
                      }}
                    >
                      <b>Date</b>
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: 18,
                        fontWeight: 600,
                        color: "#fff",
                        letterSpacing: 2,
                      }}
                    >
                      <b>Day</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.map((row: any, index: any) => (
                    <TableRow key={row.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.title}</TableCell>
                      <TableCell>
                        {moment(row.start).format("DD-MM-YYYY")}
                      </TableCell>
                      <TableCell>{getDay(row.start)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}
    </Box>
  );
};

export default HolidayPage;
