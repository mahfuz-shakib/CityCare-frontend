import React from "react";
import { issueLifecycles } from "../../../Data/Data";
import { motion } from "framer-motion";

const IssueLifecycle = () => {
  return (
    <section className="px-6 py-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold mb-4">The Lifecycle of a Report</h2>
          <p className="text-secondary max-w-2xl mx-auto">
            Simple, transparent, and efficient. See how your contribution moves through the system.
          </p>
        </div>
        <div className="relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-surface-container-high -translate-y-1/2 hidden lg:block"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12 relative">
            {issueLifecycles.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center group"
              >
                <div
                  className={`w-16 h-16 bg-white rounded-full shadow-lg border-4 ${i === 0 ? "border-primary text-primary" : "border-surface-container-high text-secondary"} flex items-center justify-center mb-6 z-10 group-hover:border-primary group-hover:text-primary transition-all`}
                >
                  <step.icon size={30} />
                </div>
                <h4 className="font-bold mb-2">{step.title}</h4>
                <p className="text-xs text-secondary">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default IssueLifecycle;
