import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaCalendarAlt, FaUser, FaTag, FaClock, FaCheckCircle, FaExclamationTriangle, FaCog } from "react-icons/fa";
import IssueActions from "./IssueActions";
import IssueTimeline from "./IssueTimeline";
import Container from "../../container/Container";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const IssueDetails = () => {
  const { _id } = useParams();
  const axiosSecure = useAxiosSecure();
  const { data: issue, isLoading } = useQuery({
    queryKey: ["issueDetails", _id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/issues/${_id}`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <Container>
        <div className="flex justify-center items-center min-h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
          />
        </div>
      </Container>
    );
  }

  if (!issue) {
    return (
      <Container>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-500">Issue not found</h2>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 py-12"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">{issue.title}</h1>
        </motion.div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column: Image and Assigned Staff */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative"
            >
              <img
                src={issue.image}
                alt={issue.title}
                className="w-full h-96 object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              />
              <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-medium">
                <FaTag className="inline mr-1" />
                {issue.category}
              </div>
            </motion.div>

            {/* Assigned Staff Below Image */}
            {!issue.assignedStaff && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg shadow-sm border-l-4 border-blue-500"
              >
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <FaUser className="mr-2 text-blue-600" />
                  Assigned Staff
                </h4>
                <p className="text-gray-700">{issue?.assignedStaff?.name}</p>
                <p className="text-sm text-gray-500">{issue?.assignedStaff?.email}</p>
              </motion.div>
            )}
          </div>

          {/* Right Column: Issue Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6 bg-gray-50 p-6 rounded-lg shadow-inner"
          >
            {/* Three Separate Cards: Status, Priority, Category */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm  text-center">
                {/* <div className="flex justify-center mb-2">
                  {issue.status === "pending" ? (
                    <FaClock className="text-yellow-500 text-2xl" />
                  ) : issue.status === "resolved" ? (
                    <FaCheckCircle className="text-green-500 text-2xl" />
                  ) : issue.status === "in-progress" ? (
                    <FaCog className="text-blue-500 text-2xl" />
                  ) : (
                    <FaExclamationTriangle className="text-red-500 text-2xl" />
                  )}
                </div> */}
                <h4 className="font-semibold text-gray-800 mb-2">Status</h4>
                <span
                  className={`badge badge-lg px-3 py-1 text-sm font-medium ${
                    issue.status === "pending"
                      ? "badge-warning bg-yellow-100 text-yellow-800"
                      : issue.status === "resolved"
                      ? "badge-success bg-green-100 text-green-800"
                      : "badge-info bg-blue-100 text-blue-800"
                  }`}
                >
                  {issue.status}
                </span>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                {/* <div className="flex justify-center mb-2">
                  <FaExclamationTriangle className={`text-2xl ${issue.priority === "high" ? "text-red-500" : "text-green-500"}`} />
                </div> */}
                <h4 className="font-semibold text-gray-800 mb-2">Priority</h4>
                <span
                  className={`badge badge-lg px-3 py-1 text-sm font-medium ${
                    issue.priority === "high"
                      ? "badge-error bg-red-100 text-red-800"
                      : "badge-success bg-green-100 text-green-800"
                  }`}
                >
                  {issue.priority}
                </span>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm  text-center">
                {/* <div className="flex justify-center mb-2">
                  <FaTag className="text-purple-500 text-2xl" />
                </div> */}
                <h4 className="font-semibold text-gray-800 mb-2">Category</h4>
                <span className="badge badge-lg px-3 py-1 text-sm font-medium badge-outline bg-gray-100 text-gray-800">
                  {issue.category}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-lg shadow-sm ">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Description</h3>
              <p className="text-gray-700 leading-relaxed">{issue.description}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
                <FaMapMarkerAlt className="text-2xl text-red-500 mx-auto mb-2" />
                <p className="font-medium text-gray-800">Location</p>
                <p className="text-sm text-gray-600">{issue.location}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm  text-center hover:shadow-md transition-shadow">
                <FaCalendarAlt className="text-2xl text-blue-500 mx-auto mb-2" />
                <p className="font-medium text-gray-800">Reported On</p>
                <p className="text-sm text-gray-600">{new Date(issue.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Reporter Info */}
            <div className="bg-white p-4 rounded-lg shadow-sm ">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                <FaUser className="mr-2 text-gray-600" />
                Reported By
              </h4>
              <p className="text-gray-700">{issue.reporter || "Anonymous"}</p>
              {/* <p className="text-sm text-gray-500">{issue.creator}</p> */}
            </div>

            {/* Divider */}
            <hr className="border-gray-300" />

            {/* Actions */}
            <div className="pt-4">
              <IssueActions issue={issue} />
            </div>
          </motion.div>
        </div>

        {/* Timeline Below */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Issue Timeline</h3>
          <IssueTimeline timeline={issue.timeline || []} />
        </motion.div>
      </motion.section>
    </Container>
  );
};

export default IssueDetails;
