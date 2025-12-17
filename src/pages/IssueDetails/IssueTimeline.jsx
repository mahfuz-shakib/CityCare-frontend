import { motion } from "framer-motion";
import { FaClock, FaUser, FaCheckCircle, FaExclamationTriangle, FaCog, FaArrowUp } from "react-icons/fa";

const IssueTimeline = ({ timeline }) => {
  if (!timeline || timeline.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mt-10 text-center bg-gray-50 p-8 rounded-lg"
      >
        <FaClock className="text-4xl text-gray-400 mx-auto mb-4" />
        <h4 className="text-lg font-semibold text-gray-600 mb-2">No Updates Yet</h4>
        <p className="text-gray-500">Timeline will show progress updates here.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-10"
    >
      <div className="flex items-center justify-center mb-6">
        <FaArrowUp className="text-blue-500 mr-2" />
        <h3 className="text-2xl font-bold text-center text-gray-800">Issue Timeline</h3>
        <span className="ml-2 badge badge-info">{timeline.length} updates</span>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Vertical Animated Line */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "100%" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute left-8 top-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500"
        ></motion.div>

        <div className="space-y-8">
          {timeline
            .slice()
            .reverse()
            .map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex items-start space-x-4 ${index === 0 ? "bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500" : ""}`}
              >
                {/* Timeline Dot with Pulse */}
                <div className="flex-shrink-0 relative">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-16 h-16 bg-white border-4 border-blue-500 rounded-full flex items-center justify-center shadow-lg"
                  >
                    {item.status === "resolved" ? (
                      <FaCheckCircle className="text-green-500 text-xl" />
                    ) : item.status === "pending" ? (
                      <FaClock className="text-yellow-500 text-xl" />
                    ) : item.status === "in-progress" ? (
                      <FaCog className="text-blue-500 text-xl animate-spin" />
                    ) : (
                      <FaExclamationTriangle className="text-red-500 text-xl" />
                    )}
                  </motion.div>
                  {index === 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, duration: 0.3 }}
                      className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                    >
                      <span className="text-white text-xs font-bold">!</span>
                    </motion.div>
                  )}
                </div>

                {/* Content Card */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex-1 bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`badge badge-lg px-3 py-1 ${
                        item.status === "pending"
                          ? "badge-warning bg-yellow-100 text-yellow-800"
                          : item.status === "resolved"
                          ? "badge-success bg-green-100 text-green-800"
                          : item.status === "in-progress"
                          ? "badge-info bg-blue-100 text-blue-800"
                          : "badge-error bg-red-100 text-red-800"
                      }`}
                    >
                      {item.status}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center bg-gray-100 px-2 py-1 rounded">
                      <FaClock className="mr-1" />
                      {new Date(item.date).toLocaleString()}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-800 mb-2 text-lg">{item.message}</p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <FaUser className="mr-1 text-blue-500" />
                    Updated by <span className="font-medium ml-1">{item.updatedBy}</span>
                  </p>
                  {index === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="mt-3 text-xs text-blue-600 font-semibold"
                    >
                      Latest Update
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            ))}
        </div>
      </div>
    </motion.div>
  );
};

export default IssueTimeline;
