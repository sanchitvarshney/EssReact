import React, { forwardRef } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";

type CustomSearchPropsType = {
  width: string;
  placeholder: string;
  onChange: (e: any) => void;
  ref: any;
};
const CustomSearch: React.FC<CustomSearchPropsType> = forwardRef(
  ({ width, placeholder, onChange }, ref) => {
    return (
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder={placeholder}
          inputProps={{ "aria-label": "search" }}
          sx={{ width: width }}
          onChange={onChange}
          ref={ref}
        />
      </Search>
    );
  }
);

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: 10,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(2),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1.5, 1.5, 1.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    color: theme.palette.common.white,
    "::placeholder": {
      color: theme.palette.grey[300],
      opacity: 0.8,
      transition: "opacity 0.2s ease-in-out",
    },
    "&:focus::placeholder": {
      opacity: 0, // hide placeholder when input is focused
    },
  },
}));

export default CustomSearch;
