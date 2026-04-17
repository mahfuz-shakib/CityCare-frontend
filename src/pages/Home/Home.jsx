import Banner from "./Banner/Banner";
import QuickActions from "./QuickActions/QuickActions";
import Stats from "./Stats/Stats";
import Categories from "./Categories/Categories";
import Map from "./Map/Map";
import IssueLifecycle from "./IssueLifecycle/IssueLifecycle";
import Transparency_Analytics from "./Analytics/Transparency_Analytics";
import Testimonials from "./Testimonials/Testimonials";
import LatestResolvedIssues from "./ResolvedIssues/LatestResolvedIssues";

export default function Home() {
  return (
    <>
      <Banner />
      <QuickActions />
      <Stats />
      <Categories />
      <LatestResolvedIssues />
      <Map />
      <IssueLifecycle />
      <Transparency_Analytics />
      <Testimonials />
    </>
  );
}
