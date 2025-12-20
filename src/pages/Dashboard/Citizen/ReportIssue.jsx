import React from "react";
import Container from "../../../container/Container";
import ReportIssueForm from "../../../components/Form/ReportIssueForm";
import useAuth from "../../../hooks/useAuth";
// import BlockedWarning from "../../../components/BlockedWarning";
// import PremiumSubscriptionWarning from "../../../components/PremiumSubscriptionWarning";
const ReportIssue = () => {
  const { user } = useAuth();
  return (
    <Container>
      {/* {user.isBlocked ? (
        <BlockedWarning />
      ) : user.freeReport < 0 && !user.isPremiumm ? (
        <PremiumSubscriptionWarning />
      ) : ( */}
        <ReportIssueForm />
      {/* )} */}
    </Container>
  );
};

// name,email,photo,freeReport(3),isPremium,isBlocked
export default ReportIssue;
