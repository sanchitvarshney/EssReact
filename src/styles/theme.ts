import { createTheme } from "@mui/material/styles";
import "@mui/x-date-pickers/themeAugmentation";


export const theme = createTheme({
  typography: {
    fontFamily: "'Google Sans', sans-serif",
  },
  components: {
    // App-wide date input format: DD-MM-YYYY (pickers default to the US MM/DD/YYYY otherwise).
    MuiDatePicker: { defaultProps: { format: "DD-MM-YYYY" } },
    MuiDesktopDatePicker: { defaultProps: { format: "DD-MM-YYYY" } },
    MuiMobileDatePicker: { defaultProps: { format: "DD-MM-YYYY" } },
    // Same row hover colour as the .row-hover utility (see index.css).
    MuiTableRow: {
      styleOverrides: {
        hover: { "&:hover": { backgroundColor: "var(--row-hover-bg)" } },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputLabel-root": {
            color: "gray", // Default label color
           
          },
          "& .MuiOutlinedInput-root": {
            "&:focus-within": {
              backgroundColor: "#fff", // Background color on focus
            },
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#404040", // Focused label color
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        listbox: {
          fontSize: "0.830rem", // Set your desired global font size for dropdown options
        },
        root: {
          "& .MuiOutlinedInput-root": {
            "&:focus-within": {
              backgroundColor: "#fff", // Background color on focus
            },
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "0.830rem", // Set your desired font size here
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          fontSize: "0.830rem", // Adjust the size as needed
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: "0.830rem", // Adjust the size as needed
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: "16px",
          "&.Mui-disabled": {
            cursor: "not-allowed !important",
            backgroundColor: "#fff",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "16px", // Set your global font size here
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderWidth: "1px", // Global border width
        },
        root: {
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "gray", // Change border color on hover
          },
          "&.Mui-focused": {
            backgroundColor: "#fff", // Background color on focus
           
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: "12px",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          fontSize: "13px",
          "&:focus-within": {
            backgroundColor: "#fffbebs",
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          fontFamily: "'Google Sans', sans-serif",
          fontSize: "14px",
        },
        content: {
          fontFamily: "'Google Sans', sans-serif",
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          fontFamily: "'Google Sans', sans-serif",
          fontSize: "13px",
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          fontFamily: "'Google Sans', sans-serif",
        },
      },
    },
  },
  palette: {
    primary: {
      light: "#4fd1c5", // Light indigo
      main: "#00a0a0", // Main indigo (dashboard theme)
      dark: "#007f86", // Dark indigo
      contrastText: "#fff",
    },
    secondary: {
      light: "#e5e5e5", // Light secondary teal
      main: "#d4d4d8", // Main secondary teal
      dark: "#1de9b6", // Dark secondary teal
      contrastText: "#000",
    },
  },
});
