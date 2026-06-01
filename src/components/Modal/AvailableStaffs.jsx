import React from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { UserPlus, X } from "lucide-react";

/* ── avatar color helper ── */
const avatarColor = (name = "") => {
  const palette = ["bg-blue-500", "bg-violet-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500"];
  return palette[(name.charCodeAt(0) || 0) % palette.length];
};

const AvailableStaffs = ({ issue, staffModalRef }) => {
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();

  const { data: staffsResult, isPending, isLoading } = useQuery({
    queryKey: ["staffs"],
    queryFn: async () => {
      const res = await axiosSecure.get("/staffs");
      return res.data;
    },
  });

  const staffs = staffsResult?.data || [];

  const handleAssign = async (staff) => {
    try {
      await axiosSecure.patch(`/issues/admin/${issue._id}`, { staffEmail: staff.email });
      toast.success("Staff assigned successfully");
      staffModalRef.current.close();
      queryClient.invalidateQueries(["issues", "adminPage"]);
    } catch (err) {
      toast.error("Assignment failed");
      console.error(err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-2xl border border-slate-100 shadow-xl w-full md:min-w-[640px] max-w-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-blue-600 mb-0.5">Assignment</p>
          <h2 className="font-bold text-slate-800 text-base">Select Available Staff</h2>
        </div>
        <form method="dialog">
          <button className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
            <X size={14} className="text-slate-500" />
          </button>
        </form>
      </div>

      {/* Issue context */}
      {issue?.title && (
        <div className="px-6 py-3 bg-blue-50 border-b border-blue-100">
          <p className="text-xs text-blue-600 font-medium">
            Assigning staff to: <span className="font-bold">{issue.title}</span>
          </p>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        {isLoading || isPending ? (
          <div className="flex justify-center items-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-[3px] border-blue-600 border-t-transparent rounded-full"
            />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {["#", "Staff Member", "Email", "Phone", "Action"].map((h) => (
                  <th
                    key={h}
                    className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 px-5 py-3"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {staffs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-400 text-sm">
                    No staff available
                  </td>
                </tr>
              ) : (
                staffs.map((staff, index) => (
                  <tr
                    key={staff._id}
                    className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-xs text-slate-400 font-medium">{index + 1}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        {staff.photoURL ? (
                          <img src={staff.photoURL} alt={staff.displayName} className="w-8 h-8 rounded-full object-cover shrink-0" />
                        ) : (
                          <div className={`w-8 h-8 rounded-full ${avatarColor(staff.displayName || "")} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                            {(staff.displayName || "??").slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <p className="font-semibold text-slate-800 text-sm">{staff.displayName}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-500">{staff.email}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-500">{staff.phone || "—"}</td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => handleAssign(staff)}
                        className="flex items-center gap-1.5 text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        {isPending ? (
                          <>
                            <span className="w-3 h-3 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                            Assigning…
                          </>
                        ) : (
                          <>
                            <UserPlus size={12} /> Assign
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
        <form method="dialog">
          <button className="text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl px-4 py-2 hover:bg-slate-50 transition-colors">
            Cancel
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default AvailableStaffs;
