import { MenuItem, TextField } from "@mui/material";
import React from "react";

interface CustomTextInputProps {
  field: any;
  label?: string;
  type?: string | number;
  select?: boolean;
  options?: any[];
  isDisabled?: boolean;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  field,
  label,
  type = "text",
  select = false,
  options,
  isDisabled,
}) => {
  const safeOptions = Array.isArray(options) ? options : [];

  return (
    <TextField
      disabled={isDisabled ?? false}
      fullWidth
      label={label}
      variant="outlined"
      {...field}
      onChange={(e) => {
        const raw = e.target.value;
        const parsed = Number(raw);
        field.onChange(!isNaN(parsed) && raw !== "" && select ? parsed : raw);
      }}
      size="small"
      type={type}
      select={select}
      sx={{
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
        },
        "& .MuiInputLabel-root": {
          color: "#9ca3af",
          fontSize: "0.875rem",
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: "#2eacb3",
        },
        "& .MuiSelect-icon": {
          color: "#9ca3af",
        },
      }}
    >
      {select &&
        safeOptions.map((option, index) => (
          <MenuItem key={option?.value ?? index} value={option?.value ?? option}>
            {option?.label ?? option}
          </MenuItem>
        ))}
    </TextField>
  );
};

export default CustomTextInput;
