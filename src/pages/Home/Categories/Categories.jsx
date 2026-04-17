import React from "react";
import { categories } from "../../../Data/Data";
import { motion } from "framer-motion";

const Categories = () => {
  return (
    <section className="px-6 py-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold mb-4">Browse by Category</h2>
          <p className="text-secondary max-w-2xl mx-auto">
            Select a category to view reports or submit a new issue specifically related to that sector.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center p-8 bg-surface-container-low rounded-2xl hover:bg-primary hover:text-white transition-all group"
            >
              <cat.icon size={36} className="mb-4 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-sm">{cat.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
