import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import useResolution from "../../../hooks/useResolution";
import ListingSkeleton from "../../../components/ListingSkeleton";
const Transparency_Analytics = () => {
  const { data, loading } = useResolution();
  if (loading) return <ListingSkeleton />;
  const { resolutionPerformance } = data || {};
  const currentMonth = resolutionPerformance?.at(-1);
  const hasCurrentMonthData = currentMonth?.averageResolution !== null && currentMonth?.averageResolution !== undefined;
  return (
    <section className="px-6  py-16 md:py-24 bg-primary text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white/10 p-8 rounded-3xl border border-white/10 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs uppercase opacity-70 mb-1">Current Efficiency</p>
              <h3 className="text-xl md:text-3xl font-black">Resolution Performance</h3>
            </div>
            <div className="h-12 w-16 md:h-20 md:w-20 rounded-full border-4 border-white/20 flex items-center justify-center">
              <span className="md:text-xl font-black">
                {hasCurrentMonthData ? `${currentMonth.averageResolution}d` : "N/A"}
              </span>
            </div>
          </div>
          <div className="flex items-end gap-3 h-28 md:h-48">
            {resolutionPerformance?.map((m, i) => (
              <div
                key={m.monthKey}
                className={`flex-1 rounded-t-lg transition-all duration-1000 ${m.resolvedCount === 0 ? "bg-white/20" : i === 5 ? "bg-gray-100" : i === 4 ? "bg-gray-200" : i === 3 ? "bg-gray-300" : "bg-white/50"}`}
                style={{
                  height: `${m.resolvedCount === 0 ? 2 : Math.max((m.resolvedCount / Math.max(...resolutionPerformance.map((item) => item.resolvedCount), 1)) * 100, 8)}%`,
                }}
                title={`${m.resolvedCount} resolved issue${m.resolvedCount === 1 ? "" : "s"}`}
              >
                {m.resolvedCount === 0 && (
                  <span className="block -mt-5 text-center text-[10px] font-bold opacity-70">0</span>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs font-bold opacity-60">
            {resolutionPerformance?.map((m) => (
              <span key={m.monthKey}>{m.month}</span>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <h2 className="text-xl lg:text-5xl font-extrabold mb-6 leading-tight">Data-Driven Transparency</h2>
          <p className="text-sm md:text-xl opacity-80 mb-8 leading-relaxed">
            We believe in radical honesty. Every report and its resolution timeline is public record, ensuring your
            taxes are used where they are needed most.
          </p>
          <ul className="space-y-4">
            {["Blockchain-verified report integrity", "Monthly municipal accountability audits"].map((item, i) => (
              <li key={i} className="text-sm md:text-base flex items-center gap-3">
                <CheckCircle size={20} className="text-emerald-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          {/* <button className="px-8 py-4 bg-white text-primary font-bold rounded-lg hover:bg-surface-container-low transition-all">
            Explore Full Analytics
          </button> */}
        </motion.div>
      </div>
    </section>
  );
};

export default Transparency_Analytics;
