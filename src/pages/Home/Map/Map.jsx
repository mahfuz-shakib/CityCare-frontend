import { Layers } from "lucide-react";
import React from "react";

const Map = () => {
  return (
    <section className="px-6 py-24 bg-surface-container-low">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-12 items-center">
          <div className="lg:col-span-1">
            <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">
              Live Geospatial View
            </span>
            <h2 className="text-4xl font-extrabold mb-6">Interactive Issue Map</h2>
            <p className="text-secondary mb-8 leading-relaxed">
              Visualize civic issues in real-time. Use the heatmap toggle to identify critical zones requiring urgent
              municipal intervention.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                  <Layers size={20} className="text-primary" />
                  <span className="font-bold">Heatmap View</span>
                </div>
                <div className="w-12 h-6 bg-primary rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="p-4 bg-white rounded-xl shadow-sm">
                <p className="text-xs font-bold uppercase text-secondary mb-3">Map Legend</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span>High Urgency</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-3 h-3 rounded-full bg-orange-400"></span>
                    <span>In Progress</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <span>Recently Fixed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 relative h-[500px] rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
            <img
              className="w-full h-full object-cover grayscale opacity-50"
              src="https://picsum.photos/seed/map/1200/800"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-blue-900/10"></div>
            {/* Dummy Pins */}
            <div className="absolute top-1/4 left-1/3 p-1.5 bg-red-500 rounded-full border-2 border-white shadow-lg animate-bounce"></div>
            <div className="absolute top-1/2 left-2/3 p-1.5 bg-orange-400 rounded-full border-2 border-white shadow-lg"></div>
            <div className="absolute bottom-1/4 left-1/2 p-1.5 bg-emerald-500 rounded-full border-2 border-white shadow-lg"></div>
            <div className="absolute top-1/3 right-1/4 p-1.5 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
              <div className="glass-effect bg-white/80 px-4 py-2 rounded-lg text-xs font-bold border border-white/40">
                42 ACTIVE ISSUES NEARBY
              </div>
              <button className="px-6 py-2 bg-primary text-white font-bold rounded-lg shadow-lg">Fullscreen Map</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Map;
