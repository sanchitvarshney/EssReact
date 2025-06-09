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

const holidayData = {
  2024: [], // Add dummy data if needed
  2025: [
    {
      no: 1,
      occasion: "Makara Sankranti /Pongal/Uttarayana Punyakala/Bihu",
      date: "14-01-2025",
      day: "Tuesday",
    },
    {
      no: 2,
      occasion: "Republic Day",
      date: "26-01-2025 (National Holiday)",
      day: "Sunday",
    },
    {
      no: 3,
      occasion: "Maha Shivaratri",
      date: "26-02-2025",
      day: "Wednesday",
    },
    {
      no: 4,
      occasion: "Yaoshang Meitei Festival/Holi/Doljatra",
      date: "14-03-2025",
      day: "Friday",
    },
    {
      no: 5,
      occasion: "Id-Ul-Fitar/Khutub-E-Ramzan",
      date: "31-03-2025",
      day: "Monday",
    },
    { no: 6, occasion: "Raksha Bandhan", date: "09-08-2025", day: "Saturday" },
    { no: 7, occasion: "Independence Day", date: "15-08-2025", day: "Friday" },
    {
      no: 8,
      occasion: "Gandhi Jayanti/Dussehra/Vijaya Dashami",
      date: "02-10-2025",
      day: "Thursday",
    },
  ],
  2026: [], // Add dummy data if needed
};

const years = [2024, 2025, 2026];

const HolidayPage = () => {
  const [selectedYear, setSelectedYear] = useState(2025);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedYear(newValue);
  };

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Tabs
        value={selectedYear}
        onChange={handleChange}
        aria-label="Holiday Year Tabs"
        sx={{ mb: 2 }}
      >
        {years.map((year) => (
          <Tab key={year} label={year} value={year} />
        ))}
      </Tabs>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>S.No</b>
              </TableCell>
              <TableCell>
                <b>Occasion/Festival</b>
              </TableCell>
              <TableCell>
                <b>Date</b>
              </TableCell>
              <TableCell>
                <b>day</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {holidayData[selectedYear].length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="body2">
                    No holidays listed for this year.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              holidayData[selectedYear].map((row) => (
                <TableRow key={row.no}>
                  <TableCell>{row.no}</TableCell>
                  <TableCell>{row.occasion}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.day}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default HolidayPage;
