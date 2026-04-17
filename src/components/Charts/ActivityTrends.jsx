import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { motion } from "framer-motion";

// import { RechartsDevtools } from "@recharts/devtools";
const ActivityTrends = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <h1 className="text-xl font-bold">Activity Trends</h1>
      <p className="text-secondary text-sm mt-2 mb-5">Reports vs Resolutions (last few months)</p>
      <BarChart
        style={{ width: "100%", maxWidth: "700px", maxHeight: "700vh", aspectRatio: 1.618 }}
        responsive
        data={data}
      >
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis dataKey="month" />
        <YAxis width="auto" />
        <Tooltip />
        <Legend />
        <Bar dataKey="reports" fill="#8884d8" />
        <Bar dataKey="resolved" fill="#82ca9d" />
        {/* <RechartsDevtools /> */}
      </BarChart>
    </motion.div>
  );
};

export default ActivityTrends;
