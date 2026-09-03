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
  MapPin,
  ArrowRight,
} from "lucide-react";
import { ISSUE_CATEGORIES, formatCategory } from "../../constants/categories";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import Loader from "../../components/Loader";
import L from "leaflet";

const getMarkerIcon = (issue) => {
  const color =
    issue.priority === "high"
      ? "red"
      : issue.status === "resolved"
        ? "#10b981"
        : issue.status === "in-progress"
          ? "blue"
          : issue.status === "pending"
            ? "orange"
            : "";
  return L.divIcon({
    className: "custom-marker-pin",
    html: `
      <svg width="27" height="41" viewBox="0 0 27 41" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M13.5 0C6.05 0 0 6.16 0 13.73c0 10.12 13.5 27.27 13.5 27.27S27 23.85 27 13.73C27 6.16 20.95 0 13.5 0Z"
          fill="${color}"
          stroke="white"
          stroke-width="2"
        />
        <circle cx="13.5" cy="13.5" r="5" fill="white" />
      </svg>
    `,
    iconSize: [27, 41],
    iconAnchor: [13.5, 41],
    popupAnchor: [0, -35],
  });
};
const FlyTo = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 10, { duration: 1.2 });
    }
  }, [position, map]);
};
export default function MapView() {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchError, setSearchError] = useState("");
  const [position, setPosition] = useState(null);
  const axiosInstance = useAxios();
  const { data: issues = [], isLoading } = useQuery({
    queryKey: ["issues", activeFilter, "map"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/issues/map/?category=${activeFilter.toLowerCase()}`);
      return res.data;
    },
  });
  if (isLoading) return <Loader />;
  const handleSearch = async (e) => {
    e.preventDefault();
    const query = e.target.search.value.trim();
    if (!query) return;
    try {
      // No custom headers — Nominatim CORS only allows simple requests
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&accept-language=en`,
      );
      const data = await res.json();
      if (!data.length) {
        setSearchError("Location not found. Try a more specific name.");
        return;
      }
      const { lat, lon } = data[0] || [];
      setPosition([lat, lon]);
      e.target.reset();
      return;
    } catch {
      setSearchError("Search failed. Check your connection and try again.");
    }
  };
  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(({ coords }) => setPosition([coords.latitude, coords.longitude]));
  };
  return (
    <div className="h-[calc(100vh-80px)] relative overflow-hidden">
      <MapContainer className="h-full w-full absolute" center={[23.8103, 90.4125]} zoom={9} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {position && <FlyTo position={position} />}
        {issues.map((issue, i) => {
          const pos = issue.position ? [issue.position.lat, issue.position.lng] : [23.8103, 90.4125];

          return (
            <Marker
              key={i}
              position={pos}
              eventHandlers={{
                click: () => setSelectedIssue(issue),
              }}
              icon={getMarkerIcon(issue)}
            >
              <Popup>{issue.title}</Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Controls */}
      <div className=" w-56 md:w-80 absolute top-18 left-6 z-505 space-y-4">
        <div className=" bg-white p-4 rounded-2xl shadow-xl border border-surface-container-high">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-8 md:size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <MapIcon className=" md:size-7" />
            </div>
            <div>
              <h2 className="font-bold md:text-lg">Interactive Map</h2>
              <p className="text-xs text-secondary">Real-time civic data</p>
            </div>
          </div>

          <div className="space-y-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <label className="input">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                  </g>
                </svg>
                <input type="search" name="search" required placeholder="Search location" />
              </label>
              <button className="btn px-2 cursor-pointer text-blue-800 hover:bg-indigo-100">Search</button>
            </form>
            {searchError && <p className="text-sm text-red-500">{searchError}</p>}
            <div className="space-y-2">
              <p className="text-[10px] uppercase font-bold tracking-widest text-secondary opacity-60">
                Filter by Category
              </p>
              <div className="grid grid-cols-3 gap-2">
                {["All", ...ISSUE_CATEGORIES].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`py-2 rounded-lg text-[10px] font-bold border transition-all ${activeFilter === cat ? "bg-primary text-white border-primary shadow-md" : "bg-white text-secondary border-surface-container-high hover:bg-surface-container-low"}`}
                  >
                    {cat === "All" ? cat : formatCategory(cat)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-xl border border-surface-container-high">
          <h3 className="text-xs font-bold uppercase text-secondary mb-3">Map Legend</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-[10px] font-bold">
              <span className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></span>
              <span>Emergency</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold">
              <span className="w-3 h-3 rounded-full bg-orange-400 shadow-sm"></span>
              <span>Pending</span>
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
      {/* Issue Detail Panel */}
      <AnimatePresence>
        {selectedIssue && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            className="absolute scale-50 md:scale-100 sm:top-12 sm:right-6 w-96 bg-white rounded-3xl shadow-2xl border border-surface-container-high z-1000 overflow-hidden flex flex-col"
          >
            <div className="h-48 relative">
              <img className="w-full h-full object-cover" src={selectedIssue.image} referrerPolicy="no-referrer" />
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
            <div className="p-5">
              <h3 className="text-xl font-extrabold mb-4">{selectedIssue.title}</h3>
              <div className="space-y-4 ">
                <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-secondary opacity-60">Location</p>
                    <p className="font-bold">{selectedIssue.location}</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-surface-container-high">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-secondary opacity-60">Urgency Level</span>
                    <span
                      className={`text-sm font-bold ${selectedIssue.priority === "high" ? "text-red-600" : "text-orange-600"}`}
                    >
                      {selectedIssue.priority}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                    <div
                      className={`h-full ${selectedIssue.priority === "high" ? "bg-red-500" : "bg-orange-400"}`}
                      style={{ width: selectedIssue.priority === "high" ? "100%" : "75%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-5 bg-surface-container-low border-t border-surface-container-high gap-3">
              <Link
                to={`/all-issues/${selectedIssue._id}`}
                className="py-3 flex justify-center  gap-1 bg-indigo-800 text-white font-bold rounded-xl hover:opacity-90  cursor-pointer"
              >
                View Details <ArrowRight />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-500 flex gap-4">
        <button
          onClick={getCurrentLocation}
          className="px-6 py-3 bg-white rounded-full shadow-xl border border-surface-container-high font-bold text-sm flex items-center gap-2 hover:bg-surface-container-low transition-all cursor-pointer"
        >
          <Navigation size={18} className="text-primary" />
          My Location
        </button>
      </div>
    </div>
  );
}
