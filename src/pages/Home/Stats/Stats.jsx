import { motion } from "framer-motion";
import { stats } from "../../../Data/Data";
import { TrendingDown } from "lucide-react";

const Stats = () => {
  return (
        <section className="px-6 py-24 bg-surface-container-low mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">
                Transparency Index
              </span>
              <h2 className="text-4xl font-extrabold">Real-Time Impact Metrics</h2>
            </div>
            <div className="px-4 py-2 bg-white rounded-lg shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-sm font-semibold">Live System Status</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl text-center"
              >
                <p className="text-sm uppercase tracking-wider text-secondary mb-2">{stat.label}</p>
                <div className="flex items-baseline justify-center gap-2">
                  <p className={`text-5xl font-black text-${stat.color}`}>{stat.value}</p>
                  {stat.unit && <span className="text-xl font-bold text-secondary">{stat.unit}</span>}
                </div>
                {stat.progress ? (
                  <div className="mt-4 h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                    <div className={`h-full bg-${stat.color}`} style={{ width: stat.progress }}></div>
                  </div>
                ) : (
                  <p className="mt-4 text-xs font-semibold text-emerald-600 flex items-center justify-center gap-1">
                    <TrendingDown size={14} />
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