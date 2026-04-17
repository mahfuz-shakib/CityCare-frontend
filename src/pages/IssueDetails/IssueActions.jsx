import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, Zap, Loader2, Download, ExternalLink } from "lucide-react";

import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useRef } from "react";
import UpdateIssueForm from "../../components/Form/UpdateIssueForm";

/**
 * IssueActions — redesigned sidebar-native action panel.
 *
 * When `sidebar` prop is passed (from IssueDetails col-3), renders compact
 * vertical stacked buttons matching the Figma design.
 * When rendered standalone (legacy usage), renders the original horizontal row.
 */
const IssueActions = ({ issue}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const modalRef = useRef();
  const location = useLocation();

  const isOwner = user?.email === issue.reporter;
  const canEdit = isOwner && issue.status === "pending";
  const canBoost = issue.priority !== "high";
  // const haveActions = canEdit || isOwner || canBoost;

  const { mutateAsync: deleteMutation, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      const res = await axiosSecure.delete(`/issues/${issue._id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      Swal.fire({ title: "Deleted!", text: "Issue has been removed.", icon: "success" });
      navigate("/all-issues");
    },
    onError: () => toast.error("Failed to delete issue. Please try again."),
  });

  const handleUpdate = () => {
    modalRef.current?.showModal();
    queryClient.invalidateQueries(["issueDetails", issue._id]);
  };

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
    }).then((result) => {
      if (result.isConfirmed) deleteMutation();
    });
  };

  const handleBoost = async () => {
    if (!user) return navigate("/login", { state: location.pathname, replace: true });
    try {
      const issueInfo = {
        issueId: issue._id,
        issueTitle: issue.title,
        issueImage: issue.image,
        senderEmail: issue.reporter,
      };
      const res = await axiosSecure.post("/boost-payment-session", issueInfo);
      window.location.replace(res.data.url);
    } catch (error) {
      Swal.fire("Payment Error", error.message, "error");
    }
  };

  // if (!haveActions) return null;

  /* ── Sidebar variant (used inside col-3 of IssueDetails) ── */
    return (
      <>
        <div className="space-y-2.5">
          {/* Boost button */}
          {canBoost && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleBoost}
              className="w-full flex items-center justify-between gap-3 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl px-4 py-3 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center shrink-0 shadow-sm">
                  <Zap size={15} className="text-white fill-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-800 leading-none">
                    Boost Priority
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Move to front of queue
                  </p>
                </div>
              </div>
              <span className="text-sm font-bold text-orange-600 bg-orange-100 border border-orange-200 rounded-lg px-2.5 py-1 shrink-0">
                ৳100
              </span>
            </motion.button>
          )}

          {/* Edit button */}
          {canEdit && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleUpdate}
              className="w-full flex items-center gap-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 transition-colors"
            >
              <Pencil size={15} className="text-slate-500" />
              <span className="text-sm font-semibold text-slate-700">Edit Issue</span>
            </motion.button>
          )}

          {/* Delete button */}
          {isOwner && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleDelete}
              disabled={isDeleting}
              className="w-full flex items-center gap-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl px-4 py-3 transition-colors disabled:opacity-60"
            >
              {isDeleting ? (
                <Loader2 size={15} className="text-red-500 animate-spin" />
              ) : (
                <Trash2 size={15} className="text-red-500" />
              )}
              <span className="text-sm font-semibold text-red-600">
                {isDeleting ? "Removing…" : "Remove Report"}
              </span>
            </motion.button>
          )}

          {/* Divider + Download receipt
          <div className="pt-1 border-t border-slate-100 mt-1">
            <button className="w-full flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-semibold py-2.5 transition-colors">
              <Download size={14} />
              Download Official Receipt
            </button>
          </div> */}

          {/* Community awareness */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mt-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
              Community Awareness
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Verified Neighbors</span>
                <span className="text-sm font-bold text-slate-800">24</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Similar Reports</span>
                <span className="text-sm font-bold text-slate-800">03</span>
              </div>
              {/* Progress bar */}
              <div className="mt-2">
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "65%" }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                    className="h-full bg-blue-500 rounded-full"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5">
                  65% Consensus reached for immediate repair
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
          <div className="p-2 md:p-4 rounded scale-90 md:scale-100 mx-auto">
            <UpdateIssueForm updateItem={issue} modalRef={modalRef} />
          </div>
        </dialog>
      </>
    );
  }

export default IssueActions;