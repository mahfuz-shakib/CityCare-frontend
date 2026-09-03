import { useState, useCallback, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Search, MapPin, Navigation, X } from "lucide-react";

// ── Fix Leaflet's broken default icon paths in Vite/Webpack builds ──────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const DEFAULT_CENTER = [23.8103, 90.4125]; // Dhaka
const DEFAULT_ZOOM = 8;

// ── Fly to a position when it changes ────────────────────────────────────────
function FlyTo({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], 10, { duration: 1.2 });
    }
  }, [position, map]);
  return null;
}

// ── Handle map click — but skip clicks that originate inside a Popup ─────────
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      // e.originalEvent.target is the DOM element clicked
      // If it's inside a leaflet popup container, ignore
      const target = e.originalEvent?.target;
      if (target?.closest?.(".leaflet-popup")) return;
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// ── Reverse geocode lat/lng → human address via Nominatim ────────────────────
async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`,
    );
    const data = await res.json();
    return data?.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  } catch {
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }
}

/**
 * IssueLocationPicker
 *
 * Props:
 *   value    – current location object { address, lat, lng } or null
 *   onChange – called with { address, lat, lng } whenever user picks a location
 *   error    – validation error string from react-hook-form
 */
export default function IssueLocationPicker({ value, onChange, error }) {
  const [searchText, setSearchText] = useState("");
  const [searching, setSearching] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [searchError, setSearchError] = useState("");
  const searchRef = useRef(null);

  // ── Core: pick a lat/lng, reverse geocode, then call parent onChange ────
  const pickLocation = useCallback(
    async (lat, lng) => {
      setLoadingAddress(true);
      const address = await reverseGeocode(lat, lng);
      setLoadingAddress(false);
      onChange({ lat, lng, address });
    },
    [onChange],
  );

  // ── Search by text ────────────────────────────────────────────────────────
  const handleSearch = async () => {
    const q = searchText.trim();
    if (!q) return;
    setSearchError("");
    setSearching(true);
    try {
      // No custom headers — Nominatim CORS only allows simple requests
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&accept-language=en`,
      );
      const data = await res.json();
      if (!data.length) {
        setSearchError("Location not found. Try a more specific name.");
        return;
      }
      const { lat, lon, display_name } = data[0] || [];
      onChange({ lat: Number(lat), lng: Number(lon), address: display_name });
      setSearchText("");
    } catch {
      setSearchError("Search failed. Check your connection and try again.");
    } finally {
      setSearching(false);
    }
  };

  // ── Current GPS location ──────────────────────────────────────────────────
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      setSearchError("Geolocation is not supported by your browser.");
      return;
    }
    setLoadingAddress(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        await pickLocation(coords.latitude, coords.longitude);
      },
      () => {
        setLoadingAddress(false);
        setSearchError("Could not access your location. Please allow location access.");
      },
      { timeout: 8000 },
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
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
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
            placeholder="Search address or place…"
            className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
          />
        </div>
        <button
          type="button"
          onClick={handleSearch}
          disabled={searching || !searchText.trim()}
          className="px-3 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
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
          onClick={handleCurrentLocation}
          disabled={loadingAddress}
          title="Use my current location"
          className="px-3 py-2 text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-1.5 whitespace-nowrap"
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
      <div className={`relative rounded-xl overflow-hidden border ${error ? "border-red-400" : "border-slate-200"}`}>
        {/* Loading overlay */}
        {loadingAddress && (
          <div className="absolute inset-0 z-[9999] bg-white/60 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <MapContainer
          center={DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          scrollWheelZoom={true}
          className="h-56 sm:h-64 md:h-72 w-full"
          // Prevent map drag turning into form scroll on touch
          dragging={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>'
          />

          {/* Fly to selected location */}
          {value && <FlyTo position={value} />}

          {/* Click to pick */}
          <MapClickHandler onMapClick={pickLocation} />

          {/* Marker */}
          {value && (
            <Marker position={[value.lat, value.lng]}>
              <Popup closeButton={false} className="text-xs">
                <p className="font-semibold text-slate-700 mb-0.5">Selected Location</p>
                <p className="text-slate-500 max-w-[160px] break-words">{value.address}</p>
              </Popup>
            </Marker>
          )}
        </MapContainer>

        {/* Hint label */}
        {!value && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[999] bg-white/90 backdrop-blur-sm text-xs text-slate-500 px-3 py-1 rounded-full border border-slate-200 pointer-events-none whitespace-nowrap">
            Click on map to select location
          </div>
        )}
      </div>

      {/* Selected location display */}
      {value ? (
        <div className="flex items-start justify-between gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
          <div className="flex items-start gap-2 min-w-0">
            <MapPin size={14} className="text-blue-600 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-blue-800 truncate">{value.address}</p>
              <p className="text-[11px] text-blue-500 mt-0.5">
                {value.lat.toFixed(5)}, {value.lng.toFixed(5)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="shrink-0 w-5 h-5 rounded-full bg-blue-200 hover:bg-blue-300 flex items-center justify-center transition-colors"
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
}
