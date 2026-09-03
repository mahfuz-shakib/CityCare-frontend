import { Layers } from "lucide-react";
import React from "react";
import MapLocation from "../../../components/MapLocation";

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
          <div className="lg:col-span-2 relative h-125 rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
            <MapLocation/>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Map;
