import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./src/layouts/MainLayout";

export const route = createBrowserRouter([
  { path: "/", element: <MainLayout /> },
]);
