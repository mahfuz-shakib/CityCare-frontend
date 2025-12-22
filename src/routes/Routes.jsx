import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";
import Loader from "../components/Loader";
import MainLayout from "../layout/MainLayout";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../layout/DashboardLayout";

// Lazy load components for better performance
const Home = lazy(() => import("../pages/Home/Home"));
const Login = lazy(() => import("../pages/Login/Login"));
const Register = lazy(() => import("../pages/Register/Register"));
const Issues = lazy(() => import("../pages/All-Issues/Issues"));
const IssueDetails = lazy(() => import("../pages/IssueDetails/IssueDetails"));
const DashboardHomepage = lazy(() => import("../pages/Dashboard/Common/DashboardHomepage"));
const ReportIssue = lazy(() => import("../pages/Dashboard/Citizen/ReportIssue"));
const MyIssues = lazy(() => import("../pages/Dashboard/Citizen/MyIssues"));
const AssignedIssues = lazy(() => import("../pages/Dashboard/Staff/AssignedIssues"));
const AllIssues = lazy(() => import("../pages/Dashboard/Admin/AllIssues"));
const ManageStaffs = lazy(() => import("../pages/Dashboard/Admin/ManageStaffs"));
const ManageUsers = lazy(() => import("../pages/Dashboard/Admin/ManageUsers"));
const Payments = lazy(() => import("../pages/Dashboard/Admin/Payments"));
const PaymentSuccess = lazy(() => import("../pages/Dashboard/Payments/PaymentSuccess"));
const PaymentCancelled = lazy(() => import("../pages/Dashboard/Payments/PaymentCancelled"));
const PaymentHistory = lazy(() => import("../pages/Dashboard/Payments/PaymentHistory"));
const MyProfile = lazy(() => import("../pages/Dashboard/Common/MyProfile"));
const NotFound = lazy(() => import("../pages/NotFound/NotFound"));
const About = lazy(() => import("../pages/About/About"));
const Contact = lazy(() => import("../pages/Contact/Contact"));

const LazyWrapper = ({ children }) => (
  <Suspense fallback={<Loader />}>{children}</Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    errorElement: (
      <Suspense fallback={<Loader />}>
        <NotFound />
      </Suspense>
    ),
    children: [
      {
        path: "/",
        element: (
          <LazyWrapper>
            <Home />
          </LazyWrapper>
        ),
      },
      {
        path: "/login",
        element: (
          <LazyWrapper>
            <Login />
          </LazyWrapper>
        ),
      },
      {
        path: "/register",
        element: (
          <LazyWrapper>
            <Register />
          </LazyWrapper>
        ),
      },
      {
        path: "/about",
        element: (
          <LazyWrapper>
            <About />
          </LazyWrapper>
        ),
      },
      {
        path: "/contact",
        element: (
          <LazyWrapper>
            <Contact />
          </LazyWrapper>
        ),
      },
      {
        path: "all-issues",
        element: (
          <LazyWrapper>
            <Issues />
          </LazyWrapper>
        ),
      },
      {
        path: "all-issues/:_id",
        element: (
          <PrivateRoute>
            <LazyWrapper>
              <IssueDetails />
            </LazyWrapper>
          </PrivateRoute>
        ),
      },
      {
        path: "dashboard",
        element: (
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        ),
        children: [
          {
            index: true,
            element: (
              <LazyWrapper>
                <DashboardHomepage />
              </LazyWrapper>
            ),
          },
          {
            path: "/dashboard/homepage",
            element: (
              <LazyWrapper>
                <DashboardHomepage />
              </LazyWrapper>
            ),
          },
          {
            path: "/dashboard/report-issue",
            element: (
              <LazyWrapper>
                <ReportIssue />
              </LazyWrapper>
            ),
          },
          {
            path: "/dashboard/my-issues",
            element: (
              <LazyWrapper>
                <MyIssues />
              </LazyWrapper>
            ),
          },
          {
            path: "/dashboard/assigned-issues",
            element: (
              <LazyWrapper>
                <AssignedIssues />
              </LazyWrapper>
            ),
          },
          {
            path: "/dashboard/all-issues",
            element: (
              <LazyWrapper>
                <AllIssues />
              </LazyWrapper>
            ),
          },
          {
            path: "/dashboard/manage-staffs",
            element: (
              <LazyWrapper>
                <ManageStaffs />
              </LazyWrapper>
            ),
          },
          {
            path: "/dashboard/manage-users",
            element: (
              <LazyWrapper>
                <ManageUsers />
              </LazyWrapper>
            ),
          },
          {
            path: "/dashboard/payments",
            element: (
              <LazyWrapper>
                <Payments />
              </LazyWrapper>
            ),
          },
          {
            path: "/dashboard/payment-success",
            element: (
              <LazyWrapper>
                <PaymentSuccess />
              </LazyWrapper>
            ),
          },
          {
            path: "/dashboard/payment-cancelled",
            element: (
              <LazyWrapper>
                <PaymentCancelled />
              </LazyWrapper>
            ),
          },
          {
            path: "/dashboard/payment-history",
            element: (
              <LazyWrapper>
                <PaymentHistory />
              </LazyWrapper>
            ),
          },
          {
            path: "/dashboard/myProfile",
            element: (
              <LazyWrapper>
                <MyProfile />
              </LazyWrapper>
            ),
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<Loader />}>
        <NotFound />
      </Suspense>
    ),
  },
]);
