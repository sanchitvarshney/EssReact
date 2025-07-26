import { RouterProvider } from "react-router-dom";
import { route } from "../routes";
import { AuthProvider } from "./contextapi/AuthContext";

import { ToastContext } from "./contextapi/ToastContext";
import { ThemeProvider } from "@mui/material";
import { theme } from "./styles/theme";
import PWARegistration from "./components/PWARegistration";


function App() {
  return (
    <ThemeProvider theme={theme}>
      <ToastContext>
        <AuthProvider>
          <RouterProvider router={route} />
       <PWARegistration />
        </AuthProvider>
      </ToastContext>
    </ThemeProvider>
  );
}

export default App;
