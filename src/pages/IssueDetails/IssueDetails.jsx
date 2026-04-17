import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { MapPin, CalendarDays, User, Tag, ShieldCheck, ArrowUpRight, Hash } from "lucide-react";
import IssueActions from "./IssueActions";
import IssueTimeline from "./IssueTimeline";
import Container from "../../container/Container";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import IssueStatusBadge from "../../components/IssueStatusBadge";
import IssuePriorityBadge from "../../components/IssuePriorityBadge";
import IssueCategoryBadge from "../../components/IssueCategoryBadge";
import useAuth from "../../hooks/useAuth";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

const IssueDetails = () => {
  const { _id } = useParams();
  const { user } = useAuth();

  const axiosSecure = useAxiosSecure();

  const { data: issue, isLoading } = useQuery({
    queryKey: ["issueDetails", _id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/issues/${_id}`);
      return res.data;
    },
  });
  const isOwner = user?.email === issue?.reporter;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-[3px] border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!issue) {
    return <div className="text-center py-24 text-slate-400 text-lg font-medium">Issue not found.</div>;
  }

  const refId = `#CV-${issue._id?.slice(-4)?.toUpperCase()}-NY`;

  return (
    <div className="min-h-screen ">
      <title>{issue.title}</title>
      <Container>
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-7xl mx-auto px-1 sm:px-6 py-10"
        >
          {/* ── Top Header Bar ── */}
          <motion.div {...fadeUp(0)} className="flex flex-wrap items-start justify-between gap-4 mb-7">
            <div>
              {/* Badges row */}
              <div className="flex flex-wrap gap-2 mb-3">
                <IssueCategoryBadge category={issue.category} />
                <IssuePriorityBadge priority={issue.priority} />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                {issue.title}
              </h1>
              <p className="mt-1.5 flex items-center gap-1.5 text-slate-500 text-sm">
                <MapPin size={14} className="text-slate-400" />
                {issue.location}
              </p>
            </div>

            {/* Current Status pill */}
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Current Status</span>
              <IssueStatusBadge status={issue.status} />
            </div>
          </motion.div>

          {/* ── 3-column grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_320px] gap-6">
            {/* ── Col 1: Images ── */}

            <motion.div {...fadeUp(0.1)} className="space-y-4">
              {/* Primary image */}
              <div className="relative overflow-hidden rounded-2xl shadow-md group">
                <img
                  src={issue.image}
                  alt={issue.title}
                  className="w-full h-42 md:h-78 object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
              </div>

              {/* Thumbnail placeholders (secondary images if available) */}
              <div className="grid grid-cols-2 gap-3">
                {[0, 1].map((i) => (
                  <div
                    key={i}
                    className="h-28 rounded-xl bg-slate-200/70 overflow-hidden flex items-center justify-center text-slate-300"
                  >
                    <Tag size={28} />
                  </div>
                ))}
              </div>

              {/* Assigned Staff */}
              {issue.assignedStaff && (
                <motion.div
                  {...fadeUp(0.2)}
                  className="flex items-center gap-3 bg-whit borde border-slate-100 rounded-xl px-4 py-3 shadow-sm"
                >
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <User size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Staff Assigned</p>
                    <p className="text-sm font-semibold text-slate-800">
                      {issue.assignedStaff?.displayName || issue.assignedStaff?.name || "—"}
                    </p>
                    {issue.assignedStaff?.email && (
                      <p className="text-xs text-slate-500">{issue.assignedStaff.email}</p>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* ── Col 2: Description + Details ── */}
            <motion.div {...fadeUp(0.15)} className="space-y-5">
              {/* Description card */}
              <div className="bg-whit rounded-2xl p-5 shadow-sm borde border-slate-100">
                <h3 className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 rounded-full bg-blue-600 inline-block" />
                  Issue Description
                </h3>
                <p className="text-slate-700 text-sm leading-relaxed">{issue.description}</p>

                {/* Created by / ref */}
                <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">
                      Created By
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                        <User size={12} className="text-slate-500" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">{issue.reporter || "Anonymous"}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">
                      Reference ID
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-lg">
                      <Hash size={12} />
                      {refId}
                    </span>
                  </div>
                </div>
              </div>

              {/* Precise Location card */}
              <div className="bg-whit rounded-2xl p-5 shadow-sm borde border-slate-100">
                <h3 className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 rounded-full bg-blue-600 inline-block" />
                  Precise Location
                </h3>
                {/* Map placeholder — swap with real map embed */}
                <div className="w-full h-44 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center relative overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(0deg,transparent,transparent 20px,#94a3b8 20px,#94a3b8 21px),repeating-linear-gradient(90deg,transparent,transparent 20px,#94a3b8 20px,#94a3b8 21px)",
                    }}
                  />
                  <div className="relative flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-red-500 shadow-lg flex items-center justify-center mb-1">
                      <MapPin size={18} className="text-white" />
                    </div>
                    <span className="text-xs font-medium text-slate-600 bg-white/80 rounded-full px-2.5 py-0.5 shadow">
                      {issue.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Meta chips row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-whit rounded-xl p-4 shadow-sm borde border-slate-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                    <MapPin size={16} className="text-red-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Location</p>
                    <p className="text-xs font-semibold text-slate-700 truncate">{issue.location}</p>
                  </div>
                </div>
                <div className="bg-whit rounded-xl p-4 shadow-sm borde border-slate-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <CalendarDays size={16} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Reported On</p>
                    <p className="text-xs font-semibold text-slate-700">
                      {new Date(issue.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── Col 3: Sidebar ── */}
            <motion.div {...fadeUp(0.2)} className="space-y-4">
              {/* Manage Issue card */}

              <div className="bg-surface-container-high/50 rounded-2xl p-5 shadow-sm border border-slate-100">
                {isOwner && (
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Manage Issue</h3>
                )}
                <IssueActions issue={issue} sidebar />
              </div>

              {/* Status / Priority / Category chips */}
              <div className="bg-surface-container-high/50 rounded-2xl p-5 shadow-sm border border-slate-100 space-y-3">
                {[
                  { label: "Status", node: <IssueStatusBadge status={issue.status} /> },
                  { label: "Priority", node: <IssuePriorityBadge priority={issue.priority} /> },
                  { label: "Category", node: <IssueCategoryBadge category={issue.category} /> },
                ].map(({ label, node }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</span>
                    {node}
                  </div>
                ))}
              </div>

              {/* Civic Guarantee card */}
              <div className="h-fit bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white shadow-md">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck size={18} className="text-blue-200" />
                  <h4 className="font-bold text-sm">Civic Guarantee</h4>
                </div>
                <p className="text-blue-100 text-xs leading-relaxed mb-4">
                  Every report on CivicLedger is immutable. Once repair is complete, photos and inspection logs will be
                  posted here for transparency.
                </p>
                <button className="w-full bg-white/15 hover:bg-white/25 transition-colors text-white text-xs font-semibold rounded-lg py-2 px-3 flex items-center justify-center gap-1.5">
                  Learn more about our integrity policy
                  <ArrowUpRight size={13} />
                </button>
              </div>
            </motion.div>
          </div>

          {/* ── Timeline Section ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-10 "
          >
            <IssueTimeline issueId={_id} />
          </motion.div>
        </motion.section>
      </Container>
    </div>
  );
};

export default IssueDetails;
