import React from "react";
import Container from "../../../container/Container";
import { AiOutlineFall } from "react-icons/ai";

const Statistics = () => {
  return (
    <div className="bg-sky-50">
      <Container>
        <div className="py-16">
          <h1 className="text-sm text-primary mb-1">TRANSPARENCY INDEX</h1>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Real-Time Impact Metrics</h1>
            <p className="bg-white text-sm px-2 py-1 rounded-lg hidden md:flex justify-between items-center gap-2">
              <span className="size-2 rounded-full bg-cyan-300"></span>
              Live System Status
            </p>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg px-8 py-6 text-center space-y-2">
              <p className="text-slate-600 text-sm">TOTAL ISSUES</p>
              <h1 className="text-4xl text-indigo-600 font-semibold">24,561</h1>
              <div className="h-1 w-full bg-indigo-600 mt-3 rounded"></div>
            </div>
            <div className="bg-white rounded-lg px-8 py-6 text-center space-y-2">
              <p className="text-slate-600 text-sm">RESOLVED</p>
              <h1 className="text-4xl text-emerald-500 font-semibold">18,942</h1>
              <div className="h-1 w-48 bg-emerald-500 mt-3 rounded"></div>
            </div>
            <div className="bg-white rounded-lg px-8 py-6 text-center space-y-2">
              <p className="text-slate-600 text-sm">PENDING</p>
              <h1 className="text-4xl text-orange-500 font-semibold">3,450</h1>
              <div className="h-1 w-12 bg-orange-500 mt-3 rounded"></div>
            </div>
            <div className="bg-white rounded-lg px-8 py-6 text-center space-y-2">
              <p className="text-slate-600 text-sm">AVG RESOLUTION</p>
              <h1 className="flex justify-center items-end gap-1">
                <span className="text-4xl text-indigo-600 font-semibold"> 3.4</span>
                <span>days</span>
              </h1>
              <p className="text-sm text-emerald-500 flex justify-center items-center gap-1"><AiOutlineFall/> 12% faster than last month</p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Statistics;
