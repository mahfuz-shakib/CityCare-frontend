import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Container from "../../../container/Container";
import Loader from "../../../components/Loader";
import { Link } from "react-router";
import ResilvedIssueCard from "../../../components/ResilvedIssueCard";
import { ArrowRight } from "lucide-react";

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

  return (
    <section className="bg-white py-16">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center mb-10"
        >
          <div className="space-y-3">
            <h2 className="text-4xl font-extrabold">Recent Wins</h2>
            <p className="text-gray-600">See how our community is making a difference</p>
          </div>
          <a href="#" className="text-primary font-bold hover:underline flex items-center gap-1">
            View All Success Stories
            <ArrowRight size={18} />
          </a>
        </motion.div>

        {issues.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {issues.map((issue, index) => (
                <motion.div
                  key={issue._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ResilvedIssueCard issue={issue} />
                </motion.div>
              ))}
            </div>
            {/* <div className="text-center">
              <Link to="/all-issues?status=resolved" className="btn btn-primary btn-lg">
                View All Resolved Issues
              </Link>
            </div> */}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-xl">No resolved issues yet. Be the first to report one!</p>
          </div>
        )}
      </Container>
    </section>
  );
};

export default LatestResolvedIssues;
