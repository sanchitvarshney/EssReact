import { RouterProvider } from "react-router-dom";
import { route } from "../routes";
import { AuthProvider } from "./contextapi/AuthContext";

import { ToastContext } from "./contextapi/ToastContext";
import { ThemeProvider } from "@mui/material";
import { theme } from "./styles/theme";
import { GoogleOAuthProvider } from "@react-oauth/google";

const googleId = import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID;



function App() {
  return (
      <GoogleOAuthProvider clientId={googleId}>
    <ThemeProvider theme={theme}>
      <ToastContext>
        <AuthProvider>
          <RouterProvider router={route} />
       {/* <PWARegistration /> */}
        </AuthProvider>
      </ToastContext>
    </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
