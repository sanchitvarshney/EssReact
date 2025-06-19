import CustomCalender from "../components/CustomCalender";

import AttendancePageTable from "../components/AttendancePageTable";
import { useState } from "react";
import { Box, ButtonGroup, IconButton, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import moment from "moment";
import CalendarListView from "./ListViewOfCalender";
import ListIcon from "@mui/icons-material/List";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CustomToolTip from "../components/reuseable/CustomToolTip";
const AttendancePage = () => {
  const [tabvalue, setTabvalue] = useState<string>("calendar");
  const [currentMonth, setCurrentMonth] = useState(moment());
  return (
    <div className="w-full px-4 py-2">
      <AttendancePageTable value={""} />
      <div className="w-full flex justify-end py-3 px-4">
        <ButtonGroup variant="outlined" aria-label="Basic button group">
          <CustomToolTip title={"Calendar View"} placement={"bottom"}>
            <IconButton onClick={() => setTabvalue("calendar")}>
              <CalendarMonthIcon sx={{ fontSize: 32, color: "#000" }} />
            </IconButton>
          </CustomToolTip>
          <CustomToolTip title={"List View"} placement={"bottom"}>
            <IconButton onClick={() => setTabvalue("listview")}>
              <ListIcon sx={{ fontSize: 32, color: "#000" }} />
            </IconButton>
          </CustomToolTip>
        </ButtonGroup>
      </div>
      <div className="w-full ">
        {tabvalue === "calendar" ? (
          <CustomCalender />
        ) : (
          <>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={4}
              sx={{ backgroundColor: "#f5f5f5", p: 2, borderRadius: 2 }}
            >
              <IconButton
                onClick={() =>
                  setCurrentMonth((prev) => prev.clone().subtract(1, "month"))
                }
                sx={{ color: "#1976d2" }}
              >
                <ArrowBackIosNewIcon />
              </IconButton>
              <Typography variant="h5" fontWeight={600} color="#1976d2">
                {currentMonth.format("MMMM YYYY")}
              </Typography>
              <IconButton
                onClick={() =>
                  setCurrentMonth((prev) => prev.clone().add(1, "month"))
                }
                sx={{ color: "#1976d2" }}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </Box>
            <CalendarListView currentMonth={currentMonth} />
          </>
        )}
      </div>
    </div>
  );
};

export default AttendancePage;
