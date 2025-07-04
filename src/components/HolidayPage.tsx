import React, { useState } from "react";
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
  Typography,
} from "@mui/material";
import { holidayData } from "../dummydata/HolidayData";

const years = [2024, 2025, 2026];

const HolidayPage = () => {
  const [selectedYear, setSelectedYear] = useState(2025);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedYear(newValue);
    console.log(event);
  };

  return (
    <Box
      sx={{
        width: "100%",
        p:2,
        overflow: "hidden",
      }}
    >
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

      <div key={selectedYear} className="h-[75vh] overflow-y-auto custom-scrollbar-for-menu">
        <TableContainer component={Paper}>
          <Table>
            <TableHead className="bg-gray-200">
              <TableRow sx={{ backgroundColor: "#000" }}>
                <TableCell sx={{ color: "#fff" }}>
                  <b>S.No</b>
                </TableCell>
                <TableCell sx={{ color: "#fff" }}>
                  <b>Occasion/Festival</b>
                </TableCell>
                <TableCell sx={{ color: "#fff" }}>
                  <b>Date</b>
                </TableCell>
                <TableCell sx={{ color: "#fff" }}>
                  <b>Day</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {holidayData[selectedYear as keyof typeof holidayData]?.length ===
              0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body2">
                      No holidays listed for this year.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                holidayData[selectedYear as keyof typeof holidayData]?.map(
                  (row: any) => (
                    <TableRow key={row.no}>
                      <TableCell>{row.no}</TableCell>
                      <TableCell>{row.occasion}</TableCell>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.day}</TableCell>
                    </TableRow>
                  )
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Box>
  );
};

export default HolidayPage;
