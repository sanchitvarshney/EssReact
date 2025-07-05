import { RouterProvider } from "react-router-dom";
import { route } from "../routes";
import { AuthProvider } from "./contextapi/AuthContext";
import { Provider } from "react-redux";
import { store } from "./features/store";
import { ToastContext } from "./contextapi/ToastContext";

function App() {
  return (
    <Provider store={store}>
      <ToastContext>
        <AuthProvider>
          <RouterProvider router={route} />
        </AuthProvider>
      </ToastContext>
    </Provider>
  );
}

export default App;
