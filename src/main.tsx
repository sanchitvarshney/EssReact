import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./App.css";
import App from "./App.tsx";

import { Provider } from "react-redux";
import { store } from "./features/store";
import { DrawerContextApi } from "./contextapi/DrawerContextApi.tsx";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <DrawerContextApi>
      <StrictMode>
        <App />
      </StrictMode>
    </DrawerContextApi>
  </Provider>
);
