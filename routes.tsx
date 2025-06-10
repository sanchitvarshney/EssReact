import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./src/layouts/MainLayout";
import HolidayPage from "./src/components/HolidayPage";
import Custom404Page from "./src/pages/Custom404Page";

export const route = createBrowserRouter([
  { path: "/", element: <MainLayout /> },
  { path: "/holidays", element: <HolidayPage /> },

  {
    path: "*",
    element: <Custom404Page />,
  },
]);
