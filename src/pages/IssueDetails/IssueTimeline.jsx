import { motion } from "framer-motion";
import { FaClock, FaUser, FaCheckCircle, FaExclamationTriangle, FaCog, FaArrowUp } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../components/Loader";
import Container from "../../container/Container";
import { useState } from "react";

const IssueTimeline = ({ issueId }) => {
  const axiosSecure = useAxiosSecure();
  const [expandedRow, setExpandedRow] = useState(null);
  const { data: timeline = [], isLoading } = useQuery({
    queryKey: ["timelines", issueId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/timelines/?issueId=${issueId}`);
      return res.data;
    },
  });

  if (isLoading) {
    return <Loader />;
  }

  const toggleRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mt-10"
      >
        <div className="flex items-center justify-center mb-6">
          <FaArrowUp className="text-blue-500 mr-2" />
          <h3 className="text-2xl font-bold text-center text-gray-800">Issue Life-Cycles</h3>
          <span className="ml-2 badge badge-info">{timeline.length} updates</span>
        </div>
      </motion.div>
      <div className="overflow-x-auto">
        <motion.table
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="table max-w-5xl mx-auto shadow-lg rounded-lg overflow-hidden"
        >
          <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white sticky top-0">
            <tr>
              <th className="flex items-center  gap-2">
                <FaClock />
                Updated At
              </th>
              <th>Actioned/Message</th>
              <th className="flex items-center  gap-2">
                <FaUser />
                Updated By
              </th>
              <th>Current Status</th>
            </tr>
          </thead>
          {/* <div className="max-h-96 overflow-y-auto"> */}
          <tbody>
            {timeline?.map((item, index) => {
              const { message, updatedAt, updatedBy, issueStatus, _id } = item;
              return (
                <motion.tr
                  key={_id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className={`  ${index % 2 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50 transition-colors ${
                    index === 0 ? " !bg-green-100" : ""
                  }`}
                >
                  <td className=" font-medium">{new Date(updatedAt).toLocaleString()}</td>
                  <td className="max-w-xs truncate" title={message}>
                    {message}
                  </td>
                  <td>{updatedBy}</td>
                  <td>
                    <span
                      className={`badge  ${
                        issueStatus === "resolved"
                          ? "badge-success"
                          : issueStatus === "pending"
                          ? "badge-warning"
                          : issueStatus === "in-progress"
                          ? "badge-info"
                          : "badge-error"
                      }`}
                    >
                      {issueStatus === "resolved" ? (
                        <FaCheckCircle className="inline mr-1" />
                      ) : issueStatus === "pending" ? (
                        <FaClock className="inline mr-1" />
                      ) : issueStatus === "in-progress" ? (
                        <FaCog className="inline mr-1" />
                      ) : (
                        <FaExclamationTriangle className="inline mr-1" />
                      )}
                      {issueStatus}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </motion.table>
      </div>
    </Container>
  );
};

export default IssueTimeline;
