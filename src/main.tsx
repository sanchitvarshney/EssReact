import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import { Provider } from "react-redux";
import { store } from "./features/Store.ts";
import { DrawerContextApi } from "./contextapi/DrawerContextApi.tsx";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <DrawerContextApi>
      <StrictMode>
        <App />
      </StrictMode>
    </DrawerContextApi>
  </Provider>
);
