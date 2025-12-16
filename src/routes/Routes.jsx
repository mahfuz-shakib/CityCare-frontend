import { createBrowserRouter } from "react-router";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import MainLayout from "../layout/MainLayout";
// import Dashboard from "../pages/Dashboard/Dashboard/Dashboard";
import ReportIssue from "../pages/Dashboard/Citizen/ReportIssue";
import PrivateRoute from "./PrivateRoute";
import BeAStaff from "../pages/Dashboard/Staff/BeAStaff";
import DashboardLayout from "../layout/DashboardLayout";
import MyIssues from "../pages/Dashboard/Citizen/MyIssues";
import Issues from "../pages/All-Issues/Issues";
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
      {
        path: "all-issues",
       Component:Issues
      },
      {
        path: "dashboard",
        element: (
          <PrivateRoute>
            <DashboardLayout></DashboardLayout>
          </PrivateRoute>
        ),
        children:[
          {
            path:'/dashboard/report-issue',
            Component:ReportIssue
          },
          {
            path:'/dashboard/my-issues',
            Component:MyIssues
          }
        ]
      },

      // {
      //   path: "dashboard",
      //   element: (
      //     <PrivateRoute>
      //       <Dashboard></Dashboard>
      //     </PrivateRoute>
      //   ),
      //   children: [
      //     {
      //       path: "reportIssue",
      //       element: (
      //         <PrivateRoute>
      //           <ReportIssue></ReportIssue>
      //         </PrivateRoute>
      //       ),
      //     },
      //   ],
      // },
      // {path:'allIssues', Component:}
    ],
  },
]);
