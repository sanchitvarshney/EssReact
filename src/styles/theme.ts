import { createTheme } from "@mui/material/styles";


export const theme = createTheme({
  typography: {
    fontFamily: "MsCorpres EmberFont, sans-serif",
  },
  components: {
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
          fontFamily: "MsCorpres EmberFont, sans-serif",
          fontSize: "14px",
        },
        content: {
          fontFamily: "MsCorpres EmberFont, sans-serif",
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          fontFamily: "MsCorpres EmberFont, sans-serif",
          fontSize: "13px",
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          fontFamily: "MsCorpres EmberFont, sans-serif",
        },
      },
    },
  },
  palette: {
    primary: {
      light: "#22d3ee", // Light teal
      main: "#0891b2", // Main teal
      dark: "#0e7490", // Dark teal
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
