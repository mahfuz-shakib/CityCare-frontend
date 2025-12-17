import { createBrowserRouter } from "react-router";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import MainLayout from "../layout/MainLayout";
// import Dashboard from "../pages/Dashboard/Dashboard/Dashboard";
import ReportIssue from "../pages/Dashboard/Citizen/ReportIssue";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../layout/DashboardLayout";
import MyIssues from "../pages/Dashboard/Citizen/MyIssues";
import Issues from "../pages/All-Issues/Issues";
import IssueDetails from '../pages/IssueDetails/IssueDetails'
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
      { path: "all-issues", Component: Issues },
      {
        path: "all-issues/:_id",
        element: (
          <PrivateRoute>
            <IssueDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "dashboard",
        element: (
          <PrivateRoute>
            <DashboardLayout></DashboardLayout>
          </PrivateRoute>
        ),
        children: [
          {
            path: "/dashboard/report-issue",
            Component: ReportIssue,
          },
          {
            path: "/dashboard/my-issues",
            Component: MyIssues,
          },
        ],
      },
    ],
  },
]);
