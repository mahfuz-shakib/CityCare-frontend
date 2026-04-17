import {
  Map as MapIcon,
  Layers,
  Filter,
  Search,
  Navigation,
  Maximize2,
  Minimize2,
  Info,
  Hammer,
  Droplets,
  Zap,
  Trash2,
  Shield,
  MoreHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function MapView() {
  const [isHeatmapOn, setIsHeatmapOn] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");

  const issues = [
    {
      id: 1,
      x: "30%",
      y: "40%",
      title: "Pothole on Main St",
      category: "Roads",
      status: "In Progress",
      urgency: "High",
      icon: Hammer,
    },
    {
      id: 2,
      x: "60%",
      y: "50%",
      title: "Broken Streetlight",
      category: "Electricity",
      status: "Resolved",
      urgency: "Medium",
      icon: Zap,
    },
    {
      id: 3,
      x: "45%",
      y: "70%",
      title: "Water Leak",
      category: "Water",
      status: "Pending",
      urgency: "Low",
      icon: Droplets,
    },
    {
      id: 4,
      x: "20%",
      y: "60%",
      title: "Illegal Dumping",
      category: "Waste",
      status: "In Progress",
      urgency: "Medium",
      icon: Trash2,
    },
    {
      id: 5,
      x: "75%",
      y: "30%",
      title: "Exposed Wiring",
      category: "Public Safety",
      status: "Pending",
      urgency: "Emergency",
      icon: Shield,
    },
  ];

  const filteredIssues = activeFilter === "All" ? issues : issues.filter((i) => i.category === activeFilter);

  return (
    <div className="h-[calc(100vh-80px)] relative overflow-hidden bg-surface-container-low">
      {/* Map Background */}
      <div className="absolute inset-0 grayscale opacity-40 pointer-events-none">
        <img
          className="w-full h-full object-cover"
          src="https://picsum.photos/seed/fullmap/1920/1080"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="absolute inset-0 bg-blue-900/5 pointer-events-none"></div>

      {/* Map Controls */}
      <div className="absolute top-6 left-6 z-10 space-y-4">
        <div className="bg-white p-4 rounded-2xl shadow-xl border border-surface-container-high w-80">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <MapIcon size={20} />
            </div>
            <div>
              <h2 className="font-bold text-lg">Interactive Map</h2>
              <p className="text-xs text-secondary">Real-time civic data</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" size={16} />
              <input
                type="text"
                placeholder="Search location..."
                className="w-full rounded-xl border border-surface-container-high bg-surface-container-low py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary/50 transition-all"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl border border-surface-container-high">
              <div className="flex items-center gap-2">
                <Layers size={18} className="text-primary" />
                <span className="text-sm font-bold">Heatmap View</span>
              </div>
              <button
                onClick={() => setIsHeatmapOn(!isHeatmapOn)}
                className={`w-10 h-5 rounded-full relative transition-colors ${isHeatmapOn ? "bg-primary" : "bg-surface-container-highest"}`}
              >
                <motion.div
                  animate={{ x: isHeatmapOn ? 20 : 4 }}
                  className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm"
                />
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] uppercase font-bold tracking-widest text-secondary opacity-60">
                Filter by Category
              </p>
              <div className="grid grid-cols-3 gap-2">
                {["All", "Roads", "Water", "Electricity", "Waste", "Safety"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`py-2 rounded-lg text-[10px] font-bold border transition-all ${activeFilter === cat ? "bg-primary text-white border-primary shadow-md" : "bg-white text-secondary border-surface-container-high hover:bg-surface-container-low"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-xl border border-surface-container-high w-80">
          <h3 className="text-xs font-bold uppercase text-secondary mb-3">Map Legend</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-[10px] font-bold">
              <span className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></span>
              <span>Emergency</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold">
              <span className="w-3 h-3 rounded-full bg-orange-400 shadow-sm"></span>
              <span>High Priority</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold">
              <span className="w-3 h-3 rounded-full bg-blue-500 shadow-sm"></span>
              <span>In Progress</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm"></span>
              <span>Resolved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Pins */}
      <div className="absolute inset-0">
        {filteredIssues.map((issue) => (
          <motion.button
            key={issue.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.2 }}
            onClick={() => setSelectedIssue(issue)}
            className="absolute p-2 rounded-full border-2 border-white shadow-lg transition-transform z-20"
            style={{
              left: issue.x,
              top: issue.y,
              backgroundColor:
                issue.urgency === "Emergency"
                  ? "#ef4444"
                  : issue.urgency === "High"
                    ? "#fb923c"
                    : issue.status === "Resolved"
                      ? "#10b981"
                      : "#3b82f6",
              color: "white",
            }}
          >
            <issue.icon size={16} />
          </motion.button>
        ))}

        {/* Heatmap Overlay */}
        <AnimatePresence>
          {isHeatmapOn && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 30% 40%, #ef4444 0%, transparent 20%), radial-gradient(circle at 60% 50%, #3b82f6 0%, transparent 15%), radial-gradient(circle at 20% 60%, #fb923c 0%, transparent 25%)",
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Issue Detail Panel */}
      <AnimatePresence>
        {selectedIssue && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            className="absolute top-6 right-6 bottom-6 w-96 bg-white rounded-3xl shadow-2xl border border-surface-container-high z-30 overflow-hidden flex flex-col"
          >
            <div className="h-48 relative">
              <img
                className="w-full h-full object-cover"
                src={`https://picsum.photos/seed/${selectedIssue.id}/400/300`}
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setSelectedIssue(null)}
                className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all"
              >
                <Minimize2 size={20} />
              </button>
              <div className="absolute bottom-4 left-4 flex gap-2">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold bg-white/90 text-primary shadow-sm`}>
                  {selectedIssue.category.toUpperCase()}
                </span>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold bg-white/90 text-emerald-600 shadow-sm`}>
                  {selectedIssue.status.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="p-8 flex-1 overflow-y-auto">
              <h3 className="text-2xl font-extrabold mb-4">{selectedIssue.title}</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Navigation size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-secondary opacity-60">Location</p>
                    <p className="font-bold">Downtown District, Zone 4</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase text-secondary opacity-60">Description</p>
                  <p className="text-sm text-secondary leading-relaxed">
                    Citizens have reported a significant issue here. Local authorities have been notified and the status
                    is currently {selectedIssue.status.toLowerCase()}.
                  </p>
                </div>

                <div className="pt-6 border-t border-surface-container-high">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase text-secondary opacity-60">Urgency Level</span>
                    <span
                      className={`text-sm font-bold ${selectedIssue.urgency === "Emergency" ? "text-red-600" : "text-orange-600"}`}
                    >
                      {selectedIssue.urgency}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                    <div
                      className={`h-full ${selectedIssue.urgency === "Emergency" ? "bg-red-500" : "bg-orange-400"}`}
                      style={{ width: selectedIssue.urgency === "Emergency" ? "100%" : "75%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 bg-surface-container-low border-t border-surface-container-high flex gap-3">
              <button className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-all">
                Track Progress
              </button>
              <button className="p-3 bg-white text-secondary rounded-xl border border-surface-container-high hover:bg-surface-container-high transition-all">
                <Info size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-4">
        <button className="px-6 py-3 bg-white rounded-full shadow-xl border border-surface-container-high font-bold text-sm flex items-center gap-2 hover:bg-surface-container-low transition-all">
          <Navigation size={18} className="text-primary" />
          My Location
        </button>
        <button className="px-6 py-3 bg-primary text-white rounded-full shadow-xl font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-all">
          <Maximize2 size={18} />
          Full View
        </button>
      </div>
    </div>
  );
}
