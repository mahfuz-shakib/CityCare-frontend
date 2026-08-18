import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";

import { Hammer, Droplets, Zap, Trash2, Shield, MoreHorizontal } from "lucide-react";
const categories = [
  { icon: Hammer, label: "Road Damage", category: "road" },
  { icon: Droplets, label: "Water Supply", category: "water" },
  { icon: Zap, label: "Electricity", category: "electricity" },
  { icon: Trash2, label: "Waste Mgmt", category: "waste" },
  { icon: Shield, label: "Public Safety", category: "safety" },
  // { icon: MoreHorizontal, label: "Others", category: "" },
];

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
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((cat, i) => (
            <Link className="mx-auto" key={i} to={`/all-issues/?category=${cat.category}`}>
              <motion.button
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center p-8 bg-surface-container-low rounded-2xl hover:bg-primary hover:text-white transition-all group cursor-pointer"
              >
                <cat.icon size={36} className="mb-4 group-hover:scale-110 transition-transform animate-bounce" />
                <span className="font-bold text-sm">{cat.label}</span>
              </motion.button>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
