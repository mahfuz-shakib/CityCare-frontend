import React from "react";
import { quickActions } from "../../../Data/Data";
import { motion } from "framer-motion";

const QuickActions = () => {
  return (
    <section className="px-6 -mt-16 relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {quickActions?.map((action, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className={`bg-white p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border-b-4 border-${action.color} group `}
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-10 h-10 md:w-12 md:h-12 ${action.bg} rounded-xl flex items-center justify-center text-${action.color} group-hover:scale-110 transition-transform`}
              >
                <action.icon className="size-5 md:size-7" />
              </div>
              <h3 className="font-headline font-bold text-lg md:text-xl">{action.title}</h3>
            </div>
            <p className="text-sm text-secondary leading-relaxed mt-4">{action.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;
