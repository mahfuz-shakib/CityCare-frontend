import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  User,
  CheckCircle2,
  AlertTriangle,
  Settings2,
  Zap,
  PlusCircle,
  ChevronDown,
  Activity,
} from "lucide-react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import IssueStatusBadge from "../../components/IssueStatusBadge";

/* ── Helper: pick icon + color per status / message keyword ── */
const getTimelineIcon = (item) => {
  const msg = (item.message || "").toLowerCase();
  const status = (item.issueStatus || "").toLowerCase();

  if (msg.includes("dispatch") || msg.includes("repair"))
    return { Icon: Settings2, bg: "bg-blue-100", color: "text-blue-600", ring: "ring-blue-200" };
  if (msg.includes("boost") || msg.includes("priority"))
    return { Icon: Zap, bg: "bg-orange-100", color: "text-orange-500", ring: "ring-orange-200" };
  if (msg.includes("creat") || msg.includes("filed") || msg.includes("submit"))
    return { Icon: PlusCircle, bg: "bg-slate-100", color: "text-slate-500", ring: "ring-slate-200" };
  if (status === "resolved" || status === "closed")
    return { Icon: CheckCircle2, bg: "bg-emerald-100", color: "text-emerald-600", ring: "ring-emerald-200" };
  if (status === "pending")
    return { Icon: AlertTriangle, bg: "bg-amber-100", color: "text-amber-500", ring: "ring-amber-200" };

  return { Icon: Activity, bg: "bg-violet-100", color: "text-violet-600", ring: "ring-violet-200" };
};

/* ── Relative time ── */
const relativeTime = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h > 1 ? "s" : ""} ago`;
  const d = Math.floor(h / 24);
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: d > 365 ? "numeric" : undefined,
  });
};

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
    return (
      <div className="py-12 flex flex-col items-center gap-3">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-[3px] border-blue-500 border-t-transparent rounded-full"
        />
        <p className="text-sm text-slate-400">Loading timeline…</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-6 py-5 space-y-2 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
            <Clock size={17} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base leading-none">Activity Timeline</h3>
            <p className="text-xs text-slate-400 mt-0.5">Issue life-cycle history</p>
          </div>
        </div>
        <span className="w-fit text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
          {timeline.length} update{timeline.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Empty state */}
      {timeline.length === 0 && (
        <div className="py-16 text-center text-slate-400 text-sm">No activity recorded yet.</div>
      )}

      {/* Timeline entries */}
      <div className="divide-y divide-slate-50">
        {timeline.map((item, index) => {
          const { message, updatedAt, updatedBy, issueStatus, _id } = item;
          const { Icon, bg, color, ring } = getTimelineIcon(item);
          const isExpanded = expandedRow === index;
          const isFirst = index === 0;

          return (
            <motion.div
              key={_id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className={`group ${isFirst ? "bg-emerald-50/60" : "hover:bg-slate-50/80"} transition-colors`}
            >
              <button
                onClick={() => setExpandedRow(isExpanded ? null : index)}
                className="w-full flex items-start gap-4 px-4 md:px-6 py-4 text-left"
              >
                {/* Timeline dot + line */}
                <div className="flex flex-col items-center shrink-0 mt-0.5">
                  <div className={`w-9 h-9 rounded-full ${bg} ring-2 ${ring} flex items-center justify-center z-10`}>
                    <Icon size={15} className={color} />
                  </div>
                  {index < timeline.length - 1 && <div className="w-px flex-1 min-h-[24px] bg-slate-100 mt-1.5" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-semibold ${
                          isFirst ? "text-emerald-700" : "text-slate-800"
                        } leading-snug`}
                      >
                        {/* Extract a short title from message */}
                        {message?.split(".")[0] || "Status Update"}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 truncate max-w-xs hidden md:block">{message}</p>
                    </div>

                    <div className="flex md:flex-col items-end gap-1.5 shrink-0">
                      <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap hid">By {updatedBy}</span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wide">
                        {relativeTime(updatedAt)}
                      </span>
                    </div>
                  </div>

                  {/* Badges row */}
                  <div className="flex items-center gap-2 mt-2">
                    <IssueStatusBadge status={issueStatus} />
                    {isFirst && (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Latest
                      </span>
                    )}
                  </div>
                </div>

                {/* Expand chevron */}
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0 mt-1 text-slate-300 group-hover:text-slate-400"
                >
                  <ChevronDown size={16} />
                </motion.div>
              </button>

              {/* Expanded detail row */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 pl-[4.5rem]">
                      <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-2.5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                              Full Message
                            </p>
                            <p className="text-slate-700 leading-relaxed">{message}</p>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                                Updated By
                              </p>
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                                  <User size={11} className="text-slate-500" />
                                </div>
                                <span className="text-slate-700 font-medium">{updatedBy}</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                                Timestamp
                              </p>
                              <p className="text-slate-700">
                                {new Date(updatedAt).toLocaleString("en-US", {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default IssueTimeline;
