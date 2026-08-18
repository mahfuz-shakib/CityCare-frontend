import Banner from "./Banner/Banner";
import QuickActions from "./QuickActions/QuickActions";
import Stats from "./Stats/Stats";
import Categories from "./Categories/Categories";
import Map from "./Map/Map";
import IssueLifecycle from "./IssueLifecycle/IssueLifecycle";
import Transparency_Analytics from "./Analytics/Transparency_Analytics";
import Testimonials from "./Testimonials/Testimonials";
import LatestResolvedIssues from "./ResolvedIssues/LatestResolvedIssues";
import { useState } from "react";
import FeedbackForm from "./Feedback/FeedbackForm";

export default function Home() {
  const [lastResolvedIssue, setLastResolvedIssue] = useState({});
  const [loading, setLoading] = useState(false);
  const getLastIssue = (issue, loading) => {
    (setLastResolvedIssue(issue), setLoading(loading));
  };
  return (
    <>
      <Banner lastResolvedIssue={lastResolvedIssue} loading={loading} />
      <QuickActions />
      <Stats />
      <Categories />
      <LatestResolvedIssues getLastIssue={getLastIssue} />
      <Map />
      <IssueLifecycle />
      <Transparency_Analytics />
      <Testimonials />
      <FeedbackForm/>
    </>
  );
}
