import { MenuItem, TextField } from "@mui/material";


import React from "react";

interface CustomTextInputProps {
  field: any;
  label: string;
  type?: string | number;
  select?: boolean;
  options?:any[] 
  isDisabled?:boolean
}
const CustomTextInput: React.FC<CustomTextInputProps> = ({
  field,
  label,
  type = "text",
  select = false,
  options,
  isDisabled
}) => {
  
  return (
    <TextField
    disabled={isDisabled ? true : false}
      fullWidth
      id="outlined-basic"
      label={label}
      variant="outlined"
   
      {...field}
       onChange={(e) => {
       
        field.onChange(e.target.value)}}
      size="small"
      type={type}
      select={select}
      sx={{
        
        "& .MuiOutlinedInput-root": {
          borderRadius: "4px",
          backgroundColor: "#f9fafb",
        
          transition: "all 0.2s",
          // "& fieldset": {
          //   borderColor: "#000",
          // },
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
         "& label": {
        
          fontWeight: "bold",
        },
      }}
    >
      {select && (
         options?.map((option,index) => (
        <MenuItem key={option.value||index} value={option.value || option} >
          {option.label || option}
        </MenuItem>
      ))
      )}
    </TextField>
  );
};

export default CustomTextInput;
