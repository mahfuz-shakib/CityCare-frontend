import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import IssueCard from "../../../components/IssueCard";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Container from "../../../container/Container";
import Loader from "../../../components/Loader";
import { Link } from "react-router";

const LatestResolvedIssues = () => {
  const axiosSecure = useAxiosSecure();
  
  const { data: issuesResponse, isLoading } = useQuery({
    queryKey: ["latestResolvedIssues"],
    queryFn: async () => {
      const res = await axiosSecure.get("/issues/?status=resolved&limit=6");
      return res.data?.data || res.data || [];
    },
  });
  if (isLoading) {
    return <Loader />;
  }
  
  const issues = issuesResponse || [];
  console.log("resolved: ",issues?.length,issues)

  // const resolvedIssues = issues
  //   .filter(issue => issue.status === 'resolved' || issue.status === 'closed')
  //   .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
  //   .slice(0, 6);

  return (
    <section className="py-16 max-w-7xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Latest Resolved Issues</h2>
        <p className="text-gray-600 text-lg">See how our community is making a difference</p>
      </motion.div>

      {issues.length > 0 ? (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {issues.map((issue, index) => (
              <motion.div
                key={issue._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <IssueCard issue={issue} />
              </motion.div>
            ))}
          </div>
          <div className="text-center">
            <Link
              to="/all-issues?status=resolved"
              className="btn btn-primary btn-lg"
            >
              View All Resolved Issues
            </Link>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-xl">No resolved issues yet. Be the first to report one!</p>
        </div>
      )}
    </section>
  );
};

export default LatestResolvedIssues;
