// import { useQuery } from "@tanstack/react-query";
// import { getLatestResolvedIssues } from "../../services/issueApi";
import { useEffect, useState } from "react";
import axios from "axios";
import IssueCard from "../../../components/IssueCard";
const LatestResolvedIssues = () => {
  //   const { data = [], isLoading } = useQuery({
  //     queryKey: ["latestResolvedIssues"],
  //     queryFn: getLatestResolvedIssues,
  //   });

  //   if (isLoading) {
  //     return <p className="text-center my-10">Loading latest issues...</p>;
  //   }
  const [issues, setIssues] = useState([]);
  useEffect(() => {
    axios
      .get("/issues.json")
      .then((data) => {
        setIssues(data.data);
      })
      .catch((err) => console.log(err));
  }, []);
  console.log(issues);
  return (
    <section className="py-16 max-w-7xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-10">Latest Resolved Issues</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {issues.map((issue) => (
          <IssueCard key={issue._id} issue={issue} />
        ))}
      </div>
    </section>
  );
};

export default LatestResolvedIssues;
