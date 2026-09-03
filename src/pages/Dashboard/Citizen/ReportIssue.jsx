import React from "react";
import { useQuery } from "@tanstack/react-query";
import Container from "../../../container/Container";
import ReportIssueForm from "../../../components/Form/ReportIssueForm";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import BlockedWarning from "../../../components/Modal/BlockedWarning";
import PremiumSubscriptionWarning from "../../../components/Modal/PremiumSubscriptionWarning";
import { motion } from "framer-motion";
import ListingSkeleton from "../../../components/ListingSkeleton";

const ReportIssue = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: userData, isLoading } = useQuery({
    queryKey: ["users", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/?email=${user?.email}`);
      return res.data?.[0];
    },
    enabled: !!user?.email,
  });

  if (isLoading) {
    return <ListingSkeleton/>
  }

  if (userData?.isBlocked) {
    return <BlockedWarning />;
  }

  if (!userData?.isPremium && (userData?.freeReport || 0) <= 0) {
    return <PremiumSubscriptionWarning />;
  }

  return (
    <Container>
      <title>Report Issues</title>
      <motion.div
        className="mt-5"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-xs font-semibold text-indigo-700">NEW SUBMISSION</span>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1">Report New Issue</h1>
        <p className=" md:text-lg text-slate-600 leading-relaxed">
          Help us improve your city by reporting issues. Share details about problems you've noticed in your community.
        </p>
      </motion.div>
      <ReportIssueForm />
    </Container>
  );
};

export default ReportIssue;
