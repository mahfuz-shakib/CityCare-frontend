import { createBrowserRouter } from "react-router";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import MainLayout from "../layout/MainLayout";
import ReportIssue from "../pages/Dashboard/Citizen/ReportIssue";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../layout/DashboardLayout";
import MyIssues from "../pages/Dashboard/Citizen/MyIssues";
import Issues from "../pages/All-Issues/Issues";
import IssueDetails from "../pages/IssueDetails/IssueDetails";
import AllIssues from "../pages/Dashboard/Admin/AllIssues";
import ManageStaffs from "../pages/Dashboard/Admin/ManageStaffs";
import ManageUsers from "../pages/Dashboard/Admin/ManageUsers";
import Payments from "../pages/Dashboard/Admin/Payments";
import AssignedIssues from "../pages/Dashboard/Staff/AssignedIssues";
import DashboardHomepage from "../pages/Dashboard/Common/DashboardHomepage";
import MyProfile from "../pages/Dashboard/Common/MyProfile";
import CitizenProfile from "../pages/Dashboard/Citizen/CitizenProfile";
import PaymentSuccess from "../pages/Dashboard/Payments/PaymentSuccess";
import PaymentCancelled from "../pages/Dashboard/Payments/PaymentCancelled";
import PaymentHistory from "../pages/Dashboard/Payments/PaymentHistory";
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
            index: true,
            path: "/dashboard/homepage",
            Component: DashboardHomepage,
          },
          {
            path: "/dashboard/report-issue",
            Component: ReportIssue,
          },
          {
            path: "/dashboard/my-issues",
            Component: MyIssues,
          },
          {
            path: "/dashboard/assigned-issues",
            Component: AssignedIssues,
          },
          {
            path: "/dashboard/all-issues",
            Component: AllIssues,
          },
          {
            path: "/dashboard/manage-staffs",
            Component: ManageStaffs,
          },
          {
            path: "/dashboard/manage-users",
            Component: ManageUsers,
          },
          {
            path: "/dashboard/payment-success",
            Component: PaymentSuccess,
          },
          {
            path: "/dashboard/payment-cancelled",
            Component: PaymentCancelled,
          },
          {
            path: "/dashboard/payment-history",
            Component: PaymentHistory,
          },
          {
            path: "/dashboard/myProfile",
            Component: CitizenProfile,
          },
        ],
      },
    ],
  },
]);
