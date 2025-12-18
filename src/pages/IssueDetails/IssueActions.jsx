import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { FaEdit, FaTrash, FaRocket, FaExclamationTriangle, FaSpinner } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useRef } from "react";
import Container from "../../container/Container"
import UpdateIssueForm from "../../components/Form/UpdateIssueForm"
const IssueActions = ({ issue }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const modalRef = useRef();

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
      Swal.fire({
        title: "Deleted!",
        text: "Your issue item has been deleted.",
        icon: "success",
      });
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
  const handleUpdate = () => {
    modalRef.current.showModal();
  };
  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(issue._id);
        deleteMutation();
      }
    });
  };

  return (
    <Container>
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
            className="btn bg-yellow-600/50 btn-lg pr-6 py-3 flex items-center gap-2 hover:bg-yellow-600/20 transition-colors"
            onClick={handleUpdate}
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
            className="btn bg-red-300 btn-lg px-6 py-3 flex items-center gap-2 hover:bg-red-700/20 transition-colors"
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
            className="btn btn-primary btn-lg pl-6 py-3 flex items-center gap-2 hover:bg-blue-700 transition-colors"
            onClick={() => boostMutation.mutate()}
            disabled={boostMutation.isPending}
            title="Boost priority to high for faster resolution (costs ৳100)"
          >
            {boostMutation.isPending ? <FaSpinner className="animate-spin" /> : <FaRocket />}
            {boostMutation.isPending ? "Boosting..." : "Boost Now (৳100)"}
          </motion.button>
        )}
      </motion.div>
      <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
        <div className={`p-2 md:p-4 rounded scale-85 md:scale-100 mx-auto`}>
          <h1 className="text-center font-bold mb-2 md:mb-3">Update Information</h1>
          <UpdateIssueForm updateItem={issue} modalRef={modalRef} />
          
        </div>
      </dialog>
    </Container>
  );
};

export default IssueActions;
