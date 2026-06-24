import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import React from "react";

type CustomModalDatePickerProps = {
  field: any;
  openTo: string;
  view: any;
  label: string;
  isDisabled?: boolean;
};

const CustomModalDatePicker: React.FC<CustomModalDatePickerProps> = ({
  field,
  openTo,
  view,
  label,
  isDisabled = false,
}) => {
  const value = field.value ? dayjs(field.value) : null;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MobileDatePicker
        minDate={dayjs("2000-01-01")}
        {...field}
        openTo={openTo}
        views={view}
        closeOnSelect
        format={
          Array.isArray(view) &&
          view.length === 2 &&
          view.includes("month") &&
          view.includes("year")
            ? "MM/YYYY"
            : "DD/MM/YYYY"
        }
        value={value}
        onChange={(date) => {
          const nativeDate = date?.toDate?.();
          field.onChange(nativeDate);
        }}
        label={label}
        disabled={isDisabled}
        slotProps={{
          actionBar: {
            actions: [],
          },
          layout: {
            sx: {
              borderRadius: "20px",
              overflow: "hidden",
              "& .MuiPickersDay-root": {
                borderRadius: "10px",
                fontWeight: 500,
                "&.Mui-selected": {
                  backgroundColor: "#2eacb3",
                  color: "#fff",
                  fontWeight: 700,
                  "&:hover": { backgroundColor: "#0097a7" },
                  "&:focus": { backgroundColor: "#2eacb3" },
                },
                "&:not(.Mui-selected):hover": {
                  backgroundColor: "#e0f7fa",
                  color: "#006064",
                },
                "&.MuiPickersDay-today:not(.Mui-selected)": {
                  border: "2px solid #2eacb3",
                  color: "#2eacb3",
                },
              },
              "& .MuiPickersYear-yearButton.Mui-selected": {
                backgroundColor: "#2eacb3",
                color: "#fff",
                "&:hover": { backgroundColor: "#0097a7" },
              },
              "& .MuiPickersMonth-monthButton.Mui-selected": {
                backgroundColor: "#2eacb3",
                color: "#fff",
                "&:hover": { backgroundColor: "#0097a7" },
              },
              "& .MuiPickersCalendarHeader-switchViewButton": {
                color: "#2eacb3",
              },
              "& .MuiPickersArrowSwitcher-button": {
                color: "#2eacb3",
              },
              "& .MuiDayCalendar-weekDayLabel": {
                color: "#94a3b8",
                fontWeight: 600,
                fontSize: "0.7rem",
              },
            },
          },
          textField: {
            fullWidth: true,
            size: "small",
            sx: {
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: "#f9fafb",
                fontSize: "0.875rem",
                transition: "all 0.2s",
                "& fieldset": {
                  borderColor: "#e5e7eb",
                },
                "&:hover fieldset": {
                  borderColor: "#9ca3af",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#2eacb3",
                  borderWidth: "2px",
                },
                "& .MuiInputAdornment-root .MuiSvgIcon-root": {
                  fontSize: "1.1rem",
                  color: "#9ca3af",
                  transition: "color 0.2s",
                },
                "&:hover .MuiInputAdornment-root .MuiSvgIcon-root": {
                  color: "#2eacb3",
                },
                "&.Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root": {
                  color: "#2eacb3",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#9ca3af",
                fontSize: "0.875rem",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#2eacb3",
              },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default CustomModalDatePicker;
