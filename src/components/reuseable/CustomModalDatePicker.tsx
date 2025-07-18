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
};

const CustomModalDatePicker: React.FC<CustomModalDatePickerProps> = ({
  field,
  openTo,
  view,
  label,
}) => {
  const value = field.value ? dayjs(field.value) : null;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MobileDatePicker
        minDate={dayjs("2000-01-01")}
        {...field}
        openTo={openTo}
        views={view}
        format="DD/MM/YYYY"
        value={value}
        onChange={(date) => {
          const nativeDate = date?.toDate?.();

          field.onChange(nativeDate);
        }}
        label={label}
        // slots={{
        //   toolbar: () => null,
        // }}
        slotProps={{
          layout: {
            sx: {
              color: "#1565c0",
              borderRadius: "14px",
              borderWidth: "0px",
              borderColor: "red",
              border: "0px solid",
            },
          },
          textField: {
            fullWidth: true,
            size: "small",
            sx: {
              "& .MuiOutlinedInput-root": {
                borderRadius: "4px",
                backgroundColor: "#f9fafb",
                transition: "all 0.2s",
                "& fieldset": {
                  borderColor: "#d1d5db",
                },
                "&:hover fieldset": {
                  borderColor: "#9ca3af",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#2eacb3",
                },
              },
              "& label.Mui-focused": {
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

/* Because of the structure of the DesktopDatePicker, the `sx` prop needs to be applied to
the `layout` slot */
