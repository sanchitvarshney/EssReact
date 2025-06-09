import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./src/layouts/MainLayout";
import HolidayPage from "./src/components/HolidayPage";

export const route = createBrowserRouter([
  { path: "/", element: <MainLayout /> },
  { path: "/holidays", element: <HolidayPage /> },
  // {path:"/holidays", element: <Holidays/>}
]);
