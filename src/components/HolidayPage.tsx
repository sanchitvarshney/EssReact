import React, { useState, type FC } from "react";
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
  IconButton,
} from "@mui/material";
import { holidayData } from "../dummydata/HolidayData";
import CloseIcon from "@mui/icons-material/Close";
import { customColor } from "../constants/themeConstant";

const years = [2024, 2025, 2026];
interface HolidayProps {
  openClose?: any;
  open?: boolean;
}

const HolidayPage: FC<HolidayProps> = ({ openClose, open = false }) => {
  const [selectedYear, setSelectedYear] = useState(2025);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedYear(newValue);
    console.log(event);
  };

  return (
    <Box
      sx={{
        width: "100%",
        p: 2,
        overflow: "hidden",
        height: "85vh",
      }}
    >
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
      <TableContainer
        component={Paper}
        sx={{ maxHeight: "75vh", height: "75vh", overflow: "auto", pb: 1.5 }}
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
      {/* </div> */}
    </Box>
  );
};

export default HolidayPage;
