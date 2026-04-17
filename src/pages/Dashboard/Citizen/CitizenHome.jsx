import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FaClipboardList, FaClock, FaSpinner, FaCheckCircle, FaCreditCard, FaPlus } from "react-icons/fa";
import { MdOutlinePayment, MdOutlineReportProblem } from "react-icons/md";

import { Link } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Container from "../../../container/Container";
import Loader from "../../../components/Loader";
import { getChartData } from "../../../Data/Data";
import ActivityTrends from "../../../components/Charts/ActivityTrends";
import IssueStatusBadge from "../../../components/IssueStatusBadge";
import { FaLocationDot, FaLocationPin } from "react-icons/fa6";

const CitizenHome = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: issuesResponse, isLoading: issuesLoading } = useQuery({
    queryKey: ["issues", "citizen", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/issues/?email=${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });
  const issues = issuesResponse?.data || [];

  const { data: payments = [], isLoading: paymentsLoading } = useQuery({
    queryKey: ["payments", "citizen", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });
  //   console.log(payments);
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ["users", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/?email=${user?.email}`);
      return res.data?.[0];
    },
    enabled: !!user?.email,
  });

  if (loading || issuesLoading || paymentsLoading || userLoading) {
    return <Loader />;
  }

  const stats = {
    totalIssues: issues?.length,
    pending: issues?.filter((i) => i.status === "pending").length,
    inProgress: issues?.filter((i) => i.status === "in-progress" || i.status === "working").length,
    resolved: issues?.filter((i) => i.status === "resolved" || i.status === "closed").length,
    totalPayments: payments?.length,
  };
  const currentMonthReports = issues?.filter((issue) => {
    return issue.createdAt.slice(0, 7) === new Date().toISOString().slice(0, 7);
  });
  const latestIssues = issues?.slice(0, 4);

  const latestPayments = payments?.slice(0, 4);
  console.log(latestPayments);
  const boostedPayments = payments.filter(
    (p) => p.purpose?.toLowerCase().includes("boost") || p.metadata?.issueId,
  ).length;

  const statCards = [
    {
      title: "TOTAL REPORTS",
      value: stats.totalIssues,
      icon: FaClipboardList,
      color: "bg-blue-500",
      analytics: `+ ${currentMonthReports.length} this month`,
      analyticsColor: "text-green-500",
    },
    {
      title: "RESOLVED",
      value: stats.resolved,
      icon: FaCheckCircle,
      color: "bg-green-500",
      analytics: `${parseInt((stats.resolved / stats.totalIssues) * 100)}% completion`,
      analyticsColor: "text-slate-500",
    },
    {
      title: "IN PROGRESS",
      value: stats.inProgress,
      icon: FaSpinner,
      color: "bg-purple-500",
      analytics: ``,
      analyticsColor: "text-slate-500",
    },
    {
      title: "PENDING ISSUES",
      value: stats.pending,
      icon: FaClock,
      color: "bg-yellow-500",
      analytics: ``,
      analyticsColor: "text-slate-500",
    },
    {
      title: "TOTAL PAYMENTS",
      value: `৳${boostedPayments * 100 + (payments.length - boostedPayments) * 1000} `,
      icon: FaCreditCard,
      color: "bg-indigo-500",
      analytics: "",
      analyticsColor: "text-slate-500",
    },
  ];
  const data = getChartData(issues);
  return (
    <Container>
      <title>Dashboard</title>

      <div className="space-y-8 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Welcome back, {userData?.displayName || user?.displayName}!
            </h1>
            <Link
              to="/dashboard/report-issue"
              className="btn bg-primary text-white hidden md:flex items-center gap-2 hover:shadow-2xl"
            >
              {" "}
              <FaPlus /> Report New Issue
            </Link>
          </div>
          <p className="text-gray-600">Here's an overview of your reported issues</p>
        </motion.div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div className={`${stat.color} p-2 rounded-lg text-white`}>
                      <stat.icon className="text-lg" />
                    </div>
                    <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                  </div>
                  <div className="flex items-end gap-2">
                    <p className="text-3xl md:text-4xl font-bold text-gray-800">{stat.value}</p>
                    <span className={`text-xs ${stat.analyticsColor} font-semibold`}>{stat.analytics}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Distribution Chart */}
          <ActivityTrends data={data} />

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">Issue Status Distribution</h3>
            <div className="space-y-4">
              {[
                { label: "Resolved", value: stats.resolved, color: "bg-green-500", total: stats.totalIssues },
                { label: "In Progress", value: stats.inProgress, color: "bg-purple-500", total: stats.totalIssues },
                { label: "Pending", value: stats.pending, color: "bg-yellow-500", total: stats.totalIssues },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    <span className="text-sm text-gray-600">{item.value}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${item.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${stats.totalIssues > 0 ? (item.value / stats.totalIssues) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Payment Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">Payment Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                <span className="font-medium text-gray-700">Total Payments</span>
                <span className="text-2xl font-bold text-blue-600">{stats.totalPayments}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <span className="font-medium text-gray-700">Boost Payments</span>
                <span className="text-xl font-bold text-green-600">{boostedPayments} </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                <span className="font-medium text-gray-700">Subscription</span>
                <span className="text-xl font-bold text-purple-600">{payments.length - boostedPayments}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Latest Issues */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl flex items-center gap-1 font-bold text-gray-800">
              Latest Issues <MdOutlineReportProblem />
            </h3>
            <Link to="/dashboard/my-issues" className="text-blue-600 hover:underline text-sm font-medium">
              View All →
            </Link>
          </div>
          {latestIssues.length > 0 ? (
            <div className="space-y-3">
              {latestIssues.map((issue) => (
                <div
                  key={issue._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-bold text-gray-800 flex items-center gap-1">{issue.title}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <FaLocationDot /> {issue.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <IssueStatusBadge status={issue.status} />
                    <Link to={`/all-issues/${issue._id}`} className="text-blue-600 hover:underline text-sm">
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No issues reported yet</p>
          )}
        </motion.div>

        {/* Latest Payments */}
        {latestPayments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl flex items-center gap-1 font-bold text-gray-800">
                Recent Payments <MdOutlinePayment />
              </h3>
              <Link to="/dashboard/payment-history" className="text-blue-600 hover:underline text-sm font-medium">
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {latestPayments.map((payment) => (
                <div
                  key={payment._id || payment.sessionId}
                  className="md:flex md items-center justify-between py-3 px-4 space-y-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-bold text-gray-800">
                      {payment.purpose || (payment.metadata?.issueId ? "Issue Boost" : "Premium Subscription")} Payment
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <FaClock />
                      {new Date(payment.createdAt || payment.created).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 flex items-center gap-1">
                      <MdOutlineReportProblem /> {payment.metadata.issueTitle}
                    </p>
                    <p>{payment.metadata.issueId}</p>
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    ৳{payment.amount || payment.amount_total / 100 || 0}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </Container>
  );
};

export default CitizenHome;
