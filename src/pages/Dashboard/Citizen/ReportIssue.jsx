import React from "react";
import { useQuery } from "@tanstack/react-query";
import Container from "../../../container/Container";
import ReportIssueForm from "../../../components/Form/ReportIssueForm";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import BlockedWarning from "../../../components/Modal/BlockedWarning";
import PremiumSubscriptionWarning from "../../../components/Modal/PremiumSubscriptionWarning";
import Loader from "../../../components/Loader";

const ReportIssue = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: userData, isLoading } = useQuery({
    queryKey: ['users', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/?email=${user?.email}`);
      return res.data?.[0];
    },
    enabled: !!user?.email,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (userData?.isBlocked) {
    return <BlockedWarning />;
  }

  if (!userData?.isPremium && (userData?.freeReport || 0) <= 0) {
    return <PremiumSubscriptionWarning />;
  }

  return (
    <Container>
      <ReportIssueForm />
    </Container>
  );
};

export default ReportIssue;
