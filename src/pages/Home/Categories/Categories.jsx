import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";

import { Construction, Leaf, Shield, Trash2, TrainFront, Wrench } from "lucide-react";
import { ISSUE_CATEGORIES, formatCategory } from "../../../constants/categories";

const icons = [Wrench, Shield, Leaf, Trash2, TrainFront, Construction];

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
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {ISSUE_CATEGORIES.map((category, i) => {
            const Icon = icons[i];
            return (
              <Link className="mx-auto" key={category} to={`/all-issues/?category=${encodeURIComponent(category)}`}>
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center p-8 bg-surface-container-low rounded-2xl hover:bg-primary hover:text-white transition-all group cursor-pointer"
                >
                  <Icon size={36} className="mb-4 text-indigo-500 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-sm">{formatCategory(category)}</span>
                </motion.button>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;
