import { FaLocationDot } from "react-icons/fa6";
import { BiSolidLike } from "react-icons/bi";
import { Link, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";

import useAuth from "../hooks/useAuth";
import { condition } from "../utils/DisableCondition";
import useAxiosSecure from "../hooks/useAxiosSecure";

const IssueCard = ({ issue }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { _id, title, category, image, location, priority, status, reporter } =
    issue;

  const isDisabled = condition(user?.email, reporter);

  const queries = {
    email: user?.email || "",
    issueId: _id,
  };

  const params = new URLSearchParams(queries).toString();
  const queryKey = ["upvotes", user?.email, _id];

  const { data } = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await axiosSecure.get(`/upvotes/?${params}`);
      return res.data; // { allVotes: [], myVote: boolean }
    },
    
  });
  const isLiked =user && !!data?.myVote;
  const voteCount = data?.allVotes?.length || 0;
  
  const addUpvote = useMutation({
    mutationFn: async () => {
      const res = await axiosSecure.post("/upvotes", queries);
      return res.data;
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(queryKey, context.previous);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

 
  const removeUpvote = useMutation({
    mutationFn: async () => {
      const res = await axiosSecure.delete(`/upvotes?${params}`);
      return res.data;
    },

    onError: (_err, _vars, context) => {
      queryClient.setQueryData(queryKey, context.previous);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  /* =======================
     HANDLE CLICK
  ======================= */
  const handleUpvote = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (isLiked) {
      removeUpvote.mutate();
    } else {
      addUpvote.mutate();
    }
  };

  /* =======================
     UI
  ======================= */
  const getStatusBadgeClass = (status) => {
    const statusMap = {
      pending: "badge-warning",
      "in-progress": "badge-info",
      working: "badge-primary",
      resolved: "badge-success",
      closed: "badge-ghost",
      rejected: "badge-error",
    };
    return statusMap[status] || "badge-outline";
  };

  const getPriorityBadgeClass = (priority) => {
    return priority === "high" ? "badge-error" : "badge-outline";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="card bg-base-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
    >
      <figure className="relative overflow-hidden">
        <motion.img
          src={image}
          alt={title}
          className="h-48 w-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        {priority === "high" && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg"
          >
            BOOSTED
          </motion.div>
        )}
      </figure>

      <div className="card-body p-4">
        <motion.h3
          className="card-title text-lg font-bold line-clamp-2 min-h-[3rem]"
          whileHover={{ color: "#3b82f6" }}
          transition={{ duration: 0.2 }}
        >
          {title}
        </motion.h3>

        <p className="text-sm text-gray-600 flex items-center gap-2 mb-3">
          <FaLocationDot className="text-red-500 flex-shrink-0" />
          <span className="truncate">{location}</span>
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`badge ${getStatusBadgeClass(status)}`}>
            {status}
          </span>
          <span className="badge badge-outline">{category}</span>
          <span className={`badge ${getPriorityBadgeClass(priority)}`}>
            {priority}
          </span>
        </div>

        <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-200">
          <motion.span
            className="flex items-center gap-2 text-sm font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.button
              onClick={handleUpvote}
              disabled={isDisabled}
              className={`${
                isDisabled
                  ? "cursor-not-allowed text-gray-400"
                  : isLiked
                  ? "text-blue-600 cursor-pointer"
                  : "text-gray-700 cursor-pointer hover:text-blue-600"
              } transition-colors duration-200`}
              whileHover={!isDisabled ? { scale: 1.2 } : {}}
              whileTap={!isDisabled ? { scale: 0.9 } : {}}
            >
              <BiSolidLike className="text-[26px]" />
            </motion.button>
            <span className="text-gray-700">{voteCount}</span>
          </motion.span>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to={`/all-issues/${_id}`}
              className="btn btn-sm btn-primary shadow-md hover:shadow-lg transition-shadow"
            >
              View Details
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

IssueCard.displayName = "IssueCard";

export default IssueCard;
