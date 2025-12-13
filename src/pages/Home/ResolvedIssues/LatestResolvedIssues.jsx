// import { useQuery } from "@tanstack/react-query";
// import { getLatestResolvedIssues } from "../../services/issueApi";
import IssueCard from "../../components/IssueCard";

const LatestResolvedIssues = () => {
//   const { data = [], isLoading } = useQuery({
//     queryKey: ["latestResolvedIssues"],
//     queryFn: getLatestResolvedIssues,
//   });

//   if (isLoading) {
//     return <p className="text-center my-10">Loading latest issues...</p>;
//   }

  return (
    <section className="py-16 max-w-7xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-10">
        Latest Resolved Issues
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {/* {data.map((issue) => (
          <IssueCard key={issue._id} issue={issue} />
        ))} */}
        <IssueCard/>
        <IssueCard/>
        <IssueCard/>
        <IssueCard/>
        <IssueCard/>
        <IssueCard/>
      </div>
    </section>
  );
};

export default LatestResolvedIssues;
