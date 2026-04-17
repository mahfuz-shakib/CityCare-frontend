import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const Transparency_Analytics = () => {
  return (
    <section className="px-6 py-24 bg-primary text-white">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white/10 p-8 rounded-3xl border border-white/10 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs uppercase opacity-70 mb-1">Current Efficiency</p>
              <h3 className="text-3xl font-black">Resolution Performance</h3>
            </div>
            <div className="w-20 h-20 rounded-full border-4 border-white/20 flex items-center justify-center">
              <span className="text-xl font-black">88%</span>
            </div>
          </div>
          <div className="flex items-end gap-3 h-48">
            {[40, 65, 55, 80, 70, 90, 100].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-white/20 rounded-t-lg transition-all duration-1000"
                style={{ height: `${h}%` }}
              ></div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs font-bold opacity-60">
            {["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL"].map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">Data-Driven Transparency</h2>
          <p className="text-xl opacity-80 mb-8 leading-relaxed">
            We believe in radical honesty. Every report and its resolution timeline is public record, ensuring your
            taxes are used where they are needed most.
          </p>
          <ul className="space-y-4 mb-10">
            {[
              "Blockchain-verified report integrity",
              "Open-data API for civic researchers",
              "Monthly municipal accountability audits",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <CheckCircle size={20} className="text-emerald-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <button className="px-8 py-4 bg-white text-primary font-bold rounded-lg hover:bg-surface-container-low transition-all">
            Explore Full Analytics
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Transparency_Analytics;
