import { RouterProvider } from "react-router-dom";
import { route } from "../routes";
import { AuthProvider } from "./contextapi/AuthContext";

import { ToastContext } from "./contextapi/ToastContext";

function App() {
  return (
    <ToastContext>
      <AuthProvider>
        <RouterProvider router={route} />
      </AuthProvider>
    </ToastContext>
  );
}

export default App;
