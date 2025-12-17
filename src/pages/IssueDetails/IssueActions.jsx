import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { FaEdit, FaTrash, FaRocket, FaExclamationTriangle, FaSpinner } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-toastify";

const IssueActions = ({ issue }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isOwner = user?.email === issue.reporter;
  const canEdit = isOwner && issue.status === "pending";
  const axiosSecure = useAxiosSecure();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosSecure.delete(`/issues/${issue._id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Issue deleted successfully!");
      navigate("/all-issues");
    },
    onError: () => {
      toast.error("Failed to delete issue. Please try again.");
    },
  });

  const boostMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosSecure.post(`/issues/boost/${issue._id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["issueDetails", issue._id]);
      toast.success("Issue priority boosted!");
    },
    onError: () => {
      toast.error("Failed to boost priority.");
    },
  });

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the issue "${issue.title}"? This action cannot be undone and will permanently remove the issue and all its data.`
    );
    if (confirmed) {
      deleteMutation.mutate();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-wrap gap-4"
    >
      {canEdit && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-warning btn-lg px-6 py-3 flex items-center gap-2 hover:bg-yellow-600 transition-colors"
          onClick={() => navigate(`/edit-issue/${issue._id}`)}
          title="Edit this issue details"
        >
          <FaEdit />
          Edit
        </motion.button>
      )}

      {isOwner && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-error btn-lg px-6 py-3 flex items-center gap-2 hover:bg-red-700/10 transition-colors"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          title="Permanently delete this issue"
        >
          {deleteMutation.isPending ? <FaSpinner className="animate-spin" /> : <FaTrash />}
          {deleteMutation.isPending ? "Deleting..." : "Delete"}
        </motion.button>
      )}

      {issue.priority !== "high" && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-primary btn-lg px-6 py-3 flex items-center gap-2 hover:bg-blue-700 transition-colors"
          onClick={() => boostMutation.mutate()}
          disabled={boostMutation.isPending}
          title="Boost priority to high for faster resolution (costs ৳100)"
        >
          {boostMutation.isPending ? <FaSpinner className="animate-spin" /> : <FaRocket />}
          {boostMutation.isPending ? "Boosting..." : "Boost Now (৳100)"}
        </motion.button>
      )}
    </motion.div>
  );
};

export default IssueActions;
