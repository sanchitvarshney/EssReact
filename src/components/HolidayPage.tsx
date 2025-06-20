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
import { motion } from "framer-motion";

const years = [2024, 2025, 2026];

const HolidayPage = () => {
  const [selectedYear, setSelectedYear] = useState(2025);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedYear(newValue);
    console.log(event);
  };

  return (
    <Box sx={{ width: "100%", paddingRight: 3, paddingLeft: 3, paddingTop: 1 }}>
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
            mb:2,
            "& .MuiTab-root": {
              color: "#333",
            },
            "& .Mui-selected": {
              color: "#2eacb3",
            },
          }}
      >
        {years.map((year) => (
          <Tab  sx={{ fontSize: 16, fontWeight: "bold" }} key={year} label={year} value={year} />
        ))}
      </Tabs>

      <motion.div
        initial={{ opacity: 0, x: 100, scaleX: 0.95 }}
        animate={{ opacity: 1, x: 0, scaleX: 1 }}
        exit={{ opacity: 0, x: -40, scaleX: 0.95 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        key={selectedYear}
        className="h-[75vh] overflow-y-auto"
      >
        <TableContainer component={Paper}>
          <Table>
            <TableHead className="bg-gray-200">
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
      </motion.div>
    </Box>
  );
};

export default HolidayPage;
