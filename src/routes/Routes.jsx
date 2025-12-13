import { createBrowserRouter } from "react-router";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import MainLayout from "../layout/MainLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    // errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        Component: Home,
      },
      { path: "/login", Component: Login },
      { path: "/register", Component: Register },
      // {path:'allIssues', Component:}
    ],
  },
]);
