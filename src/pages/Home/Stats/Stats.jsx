import { motion } from "framer-motion";
import { TrendingDown, TrendingUp } from "lucide-react";
import useResolution from "../../../hooks/useResolution";

const Stats = () => {
  const { data, loading } = useResolution();

  if (loading) return;

  const {
    allSize = 0,
    resolvedSize = 0,
    pendingSize = 0,
    overallAverageResolution = null,
    resolutionPerformance = [],
  } = data || {};
  const currentMonth = resolutionPerformance[resolutionPerformance.length - 1];
  const resolutionChange = currentMonth?.resolutionChangePercent ?? null;

  const stats = [
    {
      label: "Total Issues",
      value: allSize,
      color: "primary",
      progress: "100%",
    },
    {
      label: "Resolved",
      value: resolvedSize,
      color: "emerald-500",
      progress: allSize > 0 ? (resolvedSize / allSize) * 100 : 0,
    },
    {
      label: "Pending",
      value: pendingSize,
      color: "orange-400",
      progress: allSize > 0 ? (pendingSize / allSize) * 100 : 0,
    },
    {
      label: "Avg Resolution",
      value: overallAverageResolution === null ? "N/A" : overallAverageResolution.toFixed(1),
      unit: overallAverageResolution === null ? "" : "",
      color: "blue-800",
      trend:
        resolutionChange === null
          ? "Across all resolved issues"
          : resolutionChange >= 0
            ? `${resolutionChange.toFixed(1)}% faster than last month`
            : `${Math.abs(resolutionChange).toFixed(1)}% slower than last month`,
    },
  ];
  return (
    <section className="px-6 py-12 md:py-24 bg-surface-container-low mt-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-4xl font-bold  tracking-wider text-primary"> City Imapct Overview</h2>
            <span className="md:text-xl tracking-widest text-secondary">
              Your reports are moving the ciry forward.
            </span>
          </div>
          <div className="px-4 py-2 bg-white rounded-lg shadow-sm md:flex items-center gap-2 hidden ">
            <motion.span
              animate={{ opacity: [1, 0], scale: [0, 3] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"
            ></motion.span>
            <span className="text-sm font-semibold ">Live System Status</span>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-5 md:p-8 rounded-2xl text-center"
            >
              <p className="text-xs md:text-sm uppercase tracking-wider text-secondary mb-2">{stat.label}</p>
              <div className="flex items-baseline justify-center gap-2">
                <p className={`text-sm flex items-end gap-1 font-black text-${stat.color}`}> <p className="text-2xl md:text-5xl">{stat.value}</p>  {stat.value>0 && i==3 && "Days"}</p>
                {stat.unit && <span className="text-xl font-bold text-secondary">{stat.unit}</span>}
              </div>
              {stat.progress ? (
                <div className="mt-4 h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div className={`h-full bg-${stat.color}`} style={{ width: stat.progress }}></div>
                </div>
              ) : (
                <p className="mt-3 text-xs font-semibold text-emerald-600 flex items-center justify-center gap-1">
                  {resolutionChange >= 0 ? <TrendingUp  className="hidden md:block" size={14} /> : <TrendingDown className="hidden md:block" size={14} />}
                  {stat.trend}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
