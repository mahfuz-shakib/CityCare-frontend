import { Map, Marker, useMarkerRef, useMap } from "@vis.gl/react-google-maps";
import React, { useRef, useState } from "react";
import { Search, MapPin, Navigation, X } from "lucide-react";

const DEFAULT_CENTER = { lat: 23.8103, lng: 90.4125 };
const MapLocation = ({ value, onChange, error }) => {
  const [location, setLocation] = useState(DEFAULT_CENTER);
  const [searchText, setSearchText] = useState("");
  const [searching, setSearching] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [searchError, setSearchError] = useState("");
  const markerRef = useMarkerRef();
  const searchRef = useRef(null);
  const map = useMap();
  // get address
  async function reverseGeocode(location) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${location.lat}&lon=${location.lng}&format=json&accept-language=en`,
      );
      const data = await res.json();
      return data?.display_name || `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`;
    } catch {
      return `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`;
    }
  }
  // move to position
  const moveLocation = async (location) => {
    setLocation(location);
    if (map) {
      map.panTo(location);
      setLoadingAddress(true);
      const address = await reverseGeocode(location);
      setLoadingAddress(false);
      const addr = address.split(",");
      let shortAddress;
      if (addr.at(-4).includes("District")) {
        shortAddress = `${addr[0]}, ${addr.at(-4)}, ${addr.at(-3)}`;
      } else {
        shortAddress = `${addr[0]}, ${addr.at(-3)}, ${addr.at(-2)}`;
      }
      onChange({ ...location, address:shortAddress });
    }
  };
  // ── Search by text ────────────────────────────────────────────────────────
  const handleSearch = async () => {
    const query = searchText.trim();
    if (!query) return;
    setSearchError("");
    setSearching(true);
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
      moveLocation({ lat: Number(lat), lng: Number(lon) });
      setSearchText("");
    } catch {
      setSearchError("Search failed. Check your connection and try again.");
    } finally {
      setSearching(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setSearchError("Geolocation is not supported by your browser.");
      return;
    }
    setLoadingAddress(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        moveLocation(location);
      },
      () => {
        alert("Unable to get location");
      },
    );
  };
  // ── Clear selection ───────────────────────────────────────────────────────
  const handleClear = () => {
    onChange(null);
    setSearchText("");
    setSearchError("");
  };
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-700">
        Issue Location <span className="text-red-500">*</span>
      </label>

      {/* Search bar — NOT a <form> since this lives inside ReportIssueForm's <form> */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          {!searchText && (
            <Search
              size={14}
              className="absolute z-5 left-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none"
            />
          )}
          <input
            ref={searchRef}
            type="text"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setSearchError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // stop outer form submit
                e.stopPropagation();
                handleSearch();
              }
            }}
            placeholder="     Search address or place…"
            className="input-field w-full"
          />
        </div>
        <button
          type="button"
          onClick={handleSearch}
          disabled={searching || !searchText.trim()}
          className="px-3 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
        >
          {searching ? (
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
              Searching
            </span>
          ) : (
            "Search"
          )}
        </button>
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={loadingAddress}
          title="Use my current location"
          className="px-3 py-2 text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
        >
          <Navigation size={14} />
          <span className="hidden sm:inline">My Location</span>
        </button>
      </div>

      {/* Search / geocode error */}
      {searchError && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <X size={11} /> {searchError}
        </p>
      )}

      {/* Map */}
      <div className={`relative rounded overflow-hidden border ${error ? "border-red-400" : "border-slate-200"}`}>
        {/* Loading overlay */}
        {loadingAddress && (
          <div className="absolute inset-0 z-[9999] bg-white/60 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <Map
          className="h-36 sm:h-42 md:h-56 w-full"
          style={{ width: "400px", height: "400px" }}
          defaultCenter={location}
          defaultZoom={8}
          gestureHandling="greedy"
          disableDefaultUI
          onClick={(e) => moveLocation(e.detail.latLng)}
        >
          <Marker ref={markerRef} position={location} />
        </Map>
        {/* Hint label */}
        {!value && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[999] bg-white/90 backdrop-blur-sm text-xs text-slate-500 px-3 py-1 rounded-full border border-slate-200 pointer-events-none whitespace-nowrap">
            Drag & click on map to select location
          </div>
        )}
      </div>

      {/* Selected location display */}
      {value ? (
        <div className="flex items-start justify-between gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
          <div className="flex items-start gap-2 min-w-0">
            <MapPin size={14} className="text-red-600 mt-0.5 shrink-0 animate-ping" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-blue-800 truncate">{value.address}</p>
              {/* <p className="text-[11px] text-blue-500 mt-0.5">
                {value.lat.toFixed(5)}, {value.lng.toFixed(5)}
              </p> */}
            </div>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="shrink-0 w-5 h-5 rounded-full bg-blue-200 hover:bg-blue-300 flex items-center justify-center transition-colors cursor-pointer"
            title="Clear location"
          >
            <X size={10} className="text-blue-700" />
          </button>
        </div>
      ) : (
        <p className="text-xs text-slate-400">No location selected yet.</p>
      )}

      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <X size={11} /> {error}
        </p>
      )}
    </div>
  );
};
export default MapLocation;
