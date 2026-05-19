"use client";

import { useState, useMemo, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { 
  Search, X, Star, MapPin, ChevronDown, SlidersHorizontal, 
  AlertCircle, Compass, Check, ShieldAlert, Zap, Filter
} from "lucide-react";
import type { MapLocation, MapCategory, LocationContinent } from "@/types";
import { cn } from "@/lib/utils";
import { ProposeSpotModal } from "@/components/map/propose-spot-modal";
import { 
  Sheet, 
  SheetTrigger, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetClose
} from "@/components/ui/sheet";
import { toast } from "sonner";

// ─── Config ──────────────────────────────────────────────────────────────────

const MAP_MARKER_LIMIT = 300;

const CATEGORY_CONFIG: Record<
  MapCategory,
  { label: string; color: string; icon: string }
> = {
  dispensary: {
    label: "Dispensario",
    color: "#10b981",
    icon: `<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" fill="none" stroke="currentColor" stroke-width="2"/><line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2"/><path d="M16 10a4 4 0 0 1-8 0" fill="none" stroke="currentColor" stroke-width="2"/>`,
  },
  association: {
    label: "Asociación",
    color: "#e11d48", // Rose-600 en lugar de indigo (para mantener consistencia y evitar el Purple Ban)
    icon: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor"/>`,
  },
  cannabis_club: {
    label: "Cannabis Club",
    color: "#f43f5e", // Rose-500 en lugar de violet/purple (Purple Ban)
    icon: `<circle cx="12" cy="12" r="10" fill="currentColor" opacity=".2"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="currentColor"/>`,
  },
  cbd_shop: {
    label: "CBD / Wellness",
    color: "#06b6d4",
    icon: `<path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z" fill="currentColor"/>`,
  },
  chill_spot: {
    label: "Chill Spot",
    color: "#22c55e",
    icon: `<path d="M12 2L3 15h6v7h6v-7h6z" fill="currentColor"/>`,
  },
  food: {
    label: "Munchies / Comida",
    color: "#f97316",
    icon: `<path d="M18 2h-2v7h-2V2h-2v7a4 4 0 0 0 3 3.87V22h2v-9.13A4 4 0 0 0 18 9V2zM5 2v10h3v10h2V2H5z" fill="currentColor"/>`,
  },
  nightlife: {
    label: "Noche / Bar",
    color: "#ec4899", // Pink-500 en lugar de violet/purple (Purple Ban)
    icon: `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"/>`,
  },
  point_of_interest: {
    label: "Punto de interés",
    color: "#94a3b8",
    icon: `<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 8v4m0 4h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
  },
};

const STATUS_CONFIG = {
  negocio_publico:    { label: "Negocio público/licenciado", bg: "#dcfce7", text: "#166534" },
  info_orientativa:   { label: "Información orientativa",    bg: "#fef9c3", text: "#854d0e" },
  verificar_normativa:{ label: "Verificar normativa local",  bg: "#ffedd5", text: "#9a3412" },
};

const LIVE_STATUS_CONFIG = {
  tranquilo:  { label: "Tranquilo 🟢", bg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", color: "#10b981" },
  moderado:   { label: "Normal 🟡",    bg: "bg-amber-500/10 text-amber-600 border-amber-500/20",    color: "#f59e0b" },
  concurrido: { label: "Concurrido 🔴", bg: "bg-red-500/10 text-red-600 border-red-500/20",        color: "#ef4444" },
  cerrado:    { label: "Cerrado 🛑",    bg: "bg-zinc-500/10 text-zinc-600 border-zinc-500/20",        color: "#71717a" },
};

const COUNTRY_FLAGS: Record<string, string> = {
  Spain: "🇪🇸", "United States": "🇺🇸", Netherlands: "🇳🇱",
  Germany: "🇩🇪", Portugal: "🇵🇹", "Czech Republic": "🇨🇿",
  Denmark: "🇩🇰", Switzerland: "🇨🇭", Italy: "🇮🇹", France: "🇫🇷",
  "United Kingdom": "🇬🇧", Austria: "🇦🇹", Belgium: "🇧🇪",
};

// ─── Marker icon ──────────────────────────────────────────────────────────────

function createMarkerIcon(category: MapCategory, isDemo?: boolean, liveStatus?: string) {
  const cfg = CATEGORY_CONFIG[category] ?? CATEGORY_CONFIG.point_of_interest;
  const { color, icon } = cfg;
  const opacity = isDemo ? "0.75" : "1";
  
  let liveIndicatorHtml = "";
  if (liveStatus) {
    const liveCfg = LIVE_STATUS_CONFIG[liveStatus as keyof typeof LIVE_STATUS_CONFIG];
    if (liveCfg) {
      liveIndicatorHtml = `
        <circle cx="20" cy="4" r="4.5" fill="${liveCfg.color}" stroke="#fff" stroke-width="1.2"/>
        <circle cx="20" cy="4" r="4.5" fill="${liveCfg.color}" class="animate-ping" opacity="0.65" style="transform-origin: 20px 4px;"/>
      `;
    }
  }

  const html = `
    <div style="filter:drop-shadow(0 3px 4px rgba(0,0,0,0.28));opacity:${opacity}">
      <svg width="36" height="44" viewBox="0 0 24 29" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.37 0 0 5.37 0 12C0 21 12 29 12 29C12 29 24 21 24 12C24 5.37 18.63 0 12 0Z"
              fill="${color}" stroke="#fff" stroke-width="1.5"/>
        <circle cx="12" cy="12" r="7" fill="#fff"/>
        <g transform="translate(6,6) scale(0.5)" style="color:${color}">
          ${icon}
        </g>
        ${liveIndicatorHtml}
      </svg>
    </div>`;
  return L.divIcon({
    className: "wc-spot-marker",
    html,
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -40],
  });
}

// Helper para calcular distancia
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radio de la Tierra en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ─── Location Popup Component (XSS Secure) ───────────────────────────────────

function LocationPopup({ 
  loc, 
  distance, 
  liveStatus, 
  onReportStatus 
}: { 
  loc: MapLocation; 
  distance: number | null; 
  liveStatus: { status: string; label: string; color: string; bg: string } | null;
  onReportStatus: (status: string) => void;
}) {
  const cat = CATEGORY_CONFIG[loc.category] ?? CATEGORY_CONFIG.point_of_interest;
  const st  = STATUS_CONFIG[loc.status];
  const flag = COUNTRY_FLAGS[loc.country] ?? "🌍";
  const displayDesc = loc.description.length > 110
    ? `${loc.description.substring(0, 110)}…`
    : loc.description;
  const stars = "★".repeat(Math.round(loc.rating)) + "☆".repeat(5 - Math.round(loc.rating));

  return (
    <div className="font-sans min-w-[210px] max-w-[250px] text-xs leading-relaxed text-neutral-900 select-text">
      <p className="m-0 mb-1.5 font-bold text-[13px] text-neutral-900 flex items-center gap-1.5 flex-wrap">
        {loc.isDemo && (
          <span className="bg-orange-100 text-orange-800 rounded px-1.5 py-0.5 text-[9px] font-bold">
            DEMO
          </span>
        )}
        {loc.name}
      </p>
      
      {/* Estado en vivo en Popup */}
      {liveStatus && (
        <div className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border mb-1.5", liveStatus.bg)}>
          <span className="size-1.5 rounded-full animate-pulse bg-current" />
          Vivo: {liveStatus.label}
        </div>
      )}

      <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
        <span
          style={{ backgroundColor: cat.color }}
          className="text-white rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider shrink-0"
        >
          {cat.label}
        </span>
        <span className="text-amber-500 font-bold text-xs">{stars}</span>
        <span className="text-[10px] text-neutral-500">
          ({loc.reviewCount})
        </span>
      </div>

      <p className="m-0 mb-1 text-[11px] text-neutral-500 flex items-center justify-between">
        <span>{flag} {loc.city}, {loc.country}</span>
        {distance !== null && (
          <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded border border-emerald-100/30">
            {distance < 10 ? `${distance.toFixed(1)} km` : `${Math.round(distance)} km`}
          </span>
        )}
      </p>
      
      <p className="m-0 mb-1.5 text-[11px] text-neutral-700 italic">
        {displayDesc}
      </p>

      {loc.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-1.5">
          {loc.tags.slice(0, 4).map((t) => (
            <span
              key={t}
              className="bg-neutral-100 text-neutral-600 rounded px-1.5 py-0.5 text-[9px] font-semibold"
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* Control interactivo de reporte de estado */}
      <div className="border-t border-neutral-100 pt-2 mt-2">
        <p className="m-0 mb-1 text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Reportar estado actual:</p>
        <div className="flex items-center gap-1">
          {(["tranquilo", "moderado", "concurrido", "cerrado"] as const).map((status) => {
            const sym = status === "tranquilo" ? "🟢" : status === "moderado" ? "🟡" : status === "concurrido" ? "🔴" : "🛑";
            return (
              <button
                key={status}
                onClick={() => onReportStatus(status)}
                title={status.toUpperCase()}
                className="hover:scale-125 transition-transform p-1 bg-neutral-50 hover:bg-neutral-100 rounded border border-neutral-200 cursor-pointer text-xs"
              >
                {sym}
              </button>
            );
          })}
        </div>
      </div>

      <p
        style={{ backgroundColor: st.bg, color: st.text }}
        className="m-0 mt-2 text-[9px] px-2 py-1 rounded font-semibold leading-normal"
      >
        ℹ️ {st.label}
      </p>
    </div>
  );
}

// ─── Location card (list view) ────────────────────────────────────────────────

function RatingStars({ rating }: { rating: number }) {
  return (
    <span className="text-amber-400 text-sm leading-none" aria-label={`${rating} de 5`}>
      {"★".repeat(Math.round(rating))}
      <span className="text-muted-foreground/30">{"★".repeat(5 - Math.round(rating))}</span>
    </span>
  );
}

function LocationCard({ 
  loc, 
  distance, 
  liveStatus, 
  onReportStatus 
}: { 
  loc: MapLocation; 
  distance: number | null; 
  liveStatus: { status: string; label: string; color: string; bg: string } | null;
  onReportStatus: (status: string) => void;
}) {
  const cat  = CATEGORY_CONFIG[loc.category] ?? CATEGORY_CONFIG.point_of_interest;
  const st   = STATUS_CONFIG[loc.status];
  const flag = COUNTRY_FLAGS[loc.country] ?? "🌍";

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-border/50 bg-background/70 p-4 hover:border-border hover:shadow-md transition-all duration-200 relative overflow-hidden">
      
      {/* Indicador lateral de Live Status */}
      {liveStatus && (
        <div 
          className="absolute left-0 top-0 bottom-0 w-1" 
          style={{ backgroundColor: liveStatus.color }}
        />
      )}

      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            <span
              className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shrink-0"
              style={{ backgroundColor: cat.color }}
            >
              {cat.label}
            </span>
            {loc.verified && (
              <span className="inline-block rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-950/20 dark:text-emerald-400">
                ✓ Verificado
              </span>
            )}
            {loc.isDemo && (
              <span className="inline-block rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 text-[10px] font-semibold text-orange-700 dark:border-orange-800/40 dark:bg-orange-950/20 dark:text-orange-400">
                Demo
              </span>
            )}

            {/* Badge de Live Status */}
            {liveStatus && (
              <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-extrabold", liveStatus.bg)}>
                <span className="size-1 bg-current rounded-full animate-ping" />
                {liveStatus.label.toUpperCase()}
              </span>
            )}
          </div>
          <h3 className="font-bold text-sm text-foreground leading-tight">{loc.name}</h3>
        </div>

        {/* Distancia Geoposicionada */}
        {distance !== null && (
          <span className="shrink-0 text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/30 px-2 py-0.5 rounded-full select-none">
            {distance < 10 ? `${distance.toFixed(1)} km` : `${Math.round(distance)} km`}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <RatingStars rating={loc.rating} />
        <span className="text-xs font-semibold text-foreground">{loc.rating}</span>
        <span className="text-xs text-muted-foreground">({loc.reviewCount.toLocaleString()} reseñas)</span>
      </div>

      <p className="flex items-center gap-1 text-xs text-muted-foreground">
        <MapPin className="size-3 shrink-0" />
        {flag} {loc.city}, {loc.country}
      </p>

      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
        {loc.description}
      </p>

      {loc.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {loc.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Control interactivo de reporte de estado en tarjeta */}
      <div className="border-t border-border/50 pt-2.5 mt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Reportar estado actual:</span>
        <div className="flex items-center gap-1.5">
          {(["tranquilo", "moderado", "concurrido", "cerrado"] as const).map((status) => {
            const sym = status === "tranquilo" ? "🟢" : status === "moderado" ? "🟡" : status === "concurrido" ? "🔴" : "🛑";
            return (
              <button
                key={status}
                onClick={() => onReportStatus(status)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onReportStatus(status);
                  }
                }}
                title={`Reportar como ${status}`}
                className="hover:scale-110 active:scale-95 transition-all px-2 py-1 bg-muted hover:bg-accent hover:text-accent-foreground rounded-lg border border-border/60 cursor-pointer text-xs"
              >
                {sym}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="rounded-lg px-2.5 py-1.5 text-[10px] font-semibold"
        style={{ backgroundColor: st.bg, color: st.text }}
      >
        ℹ️ {st.label}
      </div>
    </article>
  );
}

// ─── Stats bar ────────────────────────────────────────────────────────────────

function StatsBar({ locations }: { locations: MapLocation[] }) {
  const stats = useMemo(() => {
    const counts: Partial<Record<MapCategory, number>> = {};
    for (const loc of locations) {
      counts[loc.category] = (counts[loc.category] ?? 0) + 1;
    }
    return counts;
  }, [locations]);

  const items: { key: MapCategory; emoji: string }[] = [
    { key: "dispensary",   emoji: "🏪" },
    { key: "cannabis_club",emoji: "🛡️" },
    { key: "cbd_shop",     emoji: "🌿" },
    { key: "chill_spot",   emoji: "🌳" },
    { key: "food",         emoji: "🍔" },
  ];

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1.5 rounded-xl border border-border/60 bg-muted/40 px-4 py-2.5">
      {items.map(({ key, emoji }) => {
        const n = stats[key] ?? 0;
        if (n === 0) return null;
        const cfg = CATEGORY_CONFIG[key];
        return (
          <div key={key} className="flex items-center gap-1.5 text-xs">
            <span>{emoji}</span>
            <span className="font-bold" style={{ color: cfg.color }}>{n.toLocaleString()}</span>
            <span className="text-muted-foreground">{cfg.label}</span>
          </div>
        );
      })}
      <div className="flex items-center gap-1.5 text-xs ml-auto">
        <span className="font-bold text-foreground">{locations.length.toLocaleString()}</span>
        <span className="text-muted-foreground">total</span>
      </div>
    </div>
  );
}

// Recenter Component para enfocar ubicación en mapa
function MapRecenter({ coords }: { coords: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView([coords.lat, coords.lng], 13);
    }
  }, [coords, map]);
  return null;
}

// Marcador azul para ubicación del usuario
function UserLocationMarker({ coords }: { coords: { lat: number; lng: number } | null }) {
  if (!coords) return null;
  
  const userMarkerIcon = L.divIcon({
    className: "wc-user-marker",
    html: `
      <div style="position:relative; display:flex; align-items:center; justify-content:center; width:24px; height:24px;">
        <div style="position:absolute; width:100%; height:100%; background-color:#3b82f6; border-radius:50%; animation:ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; opacity:0.6;"></div>
        <div style="width:14px; height:14px; background-color:#2563eb; border:2px solid #ffffff; border-radius:50%; box-shadow:0 2px 4px rgba(0,0,0,0.25);"></div>
      </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  return (
    <Marker position={[coords.lat, coords.lng]} icon={userMarkerIcon}>
      <Popup>
        <div className="text-xs font-bold text-neutral-800 p-1">Tu ubicación actual</div>
      </Popup>
    </Marker>
  );
}

// Captura clics del mapa cuando el modo selección está activo
function MapClickHandler({
  active,
  onMapClick,
}: {
  active: boolean;
  onMapClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      if (active) onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// ─── Main component ───────────────────────────────────────────────────────────

const SORT_OPTIONS = [
  { value: "rating",   label: "Mejor puntuación" },
  { value: "reviews",  label: "Más reseñas" },
  { value: "name",     label: "Nombre A–Z" },
  { value: "distance", label: "Cerca de mí 📍" },
] as const;

type SortKey = (typeof SORT_OPTIONS)[number]["value"];

type ContinentFilter = "all" | LocationContinent;

const CONTINENT_BUTTONS: { value: ContinentFilter; label: string }[] = [
  { value: "all",           label: "🌍 Todo" },
  { value: "north_america", label: "🇺🇸 USA" },
  { value: "europe",        label: "🇪🇺 Europa" },
];

export function ClubsMap({ locations }: { locations: MapLocation[] }) {
  const [allLocations,    setAllLocations]    = useState<MapLocation[]>(locations);
  const [search,          setSearch]          = useState("");
  const [activeCategory,  setActiveCategory]  = useState<MapCategory | "all">("all");
  const [activeContinent, setActiveContinent] = useState<ContinentFilter>("all");
  const [activeCountry,   setActiveCountry]   = useState("all");
  const [minRating,       setMinRating]       = useState(0);
  const [sortBy,          setSortBy]          = useState<SortKey>("rating");
  const [showDemoOnly,    setShowDemoOnly]     = useState(false);
  const [showVerified,    setShowVerified]     = useState(false);

  // Geolocalización
  const [userCoords,      setUserCoords]      = useState<{ lat: number; lng: number } | null>(null);
  const [locatingUser,    setLocatingUser]    = useState(false);

  // Live status
  const [liveReports,     setLiveReports]     = useState<Record<string, { status: string; timestamp: number }>>({});

  // Filtros Avanzados
  const [filterAccess,    setFilterAccess]    = useState<"all" | "free" | "membership">("all");
  const [filterVerified,  setFilterVerified]  = useState<"all" | "official" | "community">("all");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [filterLiveStatus, setFilterLiveStatus] = useState<string>("all");

  const [selectionMode, setSelectionMode] = useState(false);
  const [pendingCoords, setPendingCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Cargar spots locales y live reports
  useEffect(() => {
    // 1. Cargar spots locales propuestos
    const savedSpots = localStorage.getItem("weedconnect_local_proposed_spots");
    const localSpots: MapLocation[] = savedSpots ? JSON.parse(savedSpots) : [];
    
    const combined = [...localSpots, ...locations];
    const unique = combined.filter(
      (loc, index, self) => self.findIndex((l) => l.id === loc.id) === index
    );
    setAllLocations(unique);

    // 2. Cargar reportes en vivo
    const savedReports = localStorage.getItem("weedconnect_live_reports");
    if (savedReports) {
      try {
        setLiveReports(JSON.parse(savedReports));
      } catch (e) {
        console.error("Error cargando live reports:", e);
      }
    }
  }, [locations]);

  // Cargar países únicos de la lista combinada
  const countries = useMemo(() => {
    const set = new Set(allLocations.map((l) => l.country));
    return Array.from(set).sort();
  }, [allLocations]);

  // Manejar el envío de reportes de actividad en vivo
  const handleReportStatus = (locId: string, status: string) => {
    const newReport = {
      status,
      timestamp: Date.now()
    };
    const updated = {
      ...liveReports,
      [locId]: newReport
    };
    setLiveReports(updated);
    localStorage.setItem("weedconnect_live_reports", JSON.stringify(updated));

    const spotName = allLocations.find((l) => l.id === locId)?.name || "Spot";
    const statusLabel = status === "tranquilo" ? "Tranquilo 🟢" : status === "moderado" ? "Normal 🟡" : status === "concurrido" ? "Concurrido 🔴" : "Cerrado 🛑";
    toast.success(`¡Reporte en vivo para "${spotName}" actualizado a: ${statusLabel}!`);
  };

  // Calcular la distancia a todas las locaciones al tener userCoords
  const locationsWithDistance = useMemo(() => {
    if (!userCoords) return allLocations.map((loc) => ({ ...loc, distance: null }));
    return allLocations.map((loc) => {
      const distance = getDistanceKm(userCoords.lat, userCoords.lng, loc.lat, loc.lng);
      return {
        ...loc,
        distance
      };
    });
  }, [allLocations, userCoords]);

  // Lógica de determinación de Live Status para render
  const getLiveStatusInfo = (locId: string) => {
    const report = liveReports[locId];
    // Expirar reportes locales viejos de más de 2 horas
    if (report && Date.now() - report.timestamp < 2 * 60 * 60 * 1000) {
      const cfg = LIVE_STATUS_CONFIG[report.status as keyof typeof LIVE_STATUS_CONFIG];
      return cfg ? { status: report.status, ...cfg } : null;
    }
    
    // Generar mock determinista basado en el ID para poblar la UI de forma premium
    const hash = locId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    // Solo un 45% de los locales mostrarán estado live por defecto para hacerlo realista
    if (hash % 100 > 45) return null;
    
    const statuses = ["tranquilo", "moderado", "concurrido"];
    const status = statuses[hash % statuses.length];
    const cfg = LIVE_STATUS_CONFIG[status as keyof typeof LIVE_STATUS_CONFIG];
    return cfg ? { status, ...cfg } : null;
  };

  // Solicitar Geolocalización
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      toast.error("La geolocalización no está soportada en este navegador.");
      return;
    }

    setLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setSortBy("distance"); // Auto ordenar por distancia al activarla
        setLocatingUser(false);
        toast.success("Ubicación activada. Los lugares se ordenarán de más cercano a más lejano.");
      },
      (err) => {
        setLocatingUser(false);
        console.error(err);
        toast.error("No se pudo obtener la ubicación. Por favor, concede permisos en tu navegador.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Filtrado de equipamiento por tags
  const matchAmenities = (tags: string[], selected: string[]) => {
    if (selected.length === 0) return true;
    const lowerTags = tags.map((t) => t.toLowerCase());
    return selected.every((amenity) => {
      if (amenity === "wifi") {
        return lowerTags.some((t) => t.includes("wifi") || t.includes("work") || t.includes("conexión"));
      }
      if (amenity === "terraza") {
        return lowerTags.some((t) => t.includes("terraza") || t.includes("exterior") || t.includes("aire") || t.includes("atardecer") || t.includes("vistas"));
      }
      if (amenity === "silla") {
        return lowerTags.some((t) => t.includes("accessible") || t.includes("silla") || t.includes("wheelchair") || t.includes("adaptado"));
      }
      if (amenity === "late") {
        return lowerTags.some((t) => t.includes("24h") || t.includes("late") || t.includes("tarde") || t.includes("madrugada") || t.includes("horario"));
      }
      if (amenity === "cafe") {
        return lowerTags.some((t) => t.includes("cafe") || t.includes("bebida") || t.includes("coffee") || t.includes("bar") || t.includes("munchies"));
      }
      return false;
    });
  };

  // Filtrado final
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return locationsWithDistance
      .filter((loc) => {
        // Filtros principales
        if (activeCategory !== "all" && loc.category !== activeCategory) return false;
        if (activeContinent !== "all" && loc.continent !== activeContinent) return false;
        if (activeCountry !== "all" && loc.country !== activeCountry) return false;
        if (minRating > 0 && loc.rating < minRating) return false;
        if (showDemoOnly && !loc.isDemo) return false;
        if (showVerified && !loc.verified) return false;

        // Filtro avanzado: Acceso
        if (filterAccess !== "all") {
          const isMembership = loc.category === "association" || loc.category === "cannabis_club";
          if (filterAccess === "membership" && !isMembership) return false;
          if (filterAccess === "free" && isMembership) return false;
        }

        // Filtro avanzado: Origen
        if (filterVerified !== "all") {
          if (filterVerified === "official" && !loc.verified) return false;
          if (filterVerified === "community" && loc.source !== "community") return false;
        }

        // Filtro avanzado: Equipamiento / Amenities
        if (!matchAmenities(loc.tags, selectedAmenities)) return false;

        // Filtro avanzado: Actividad en Vivo
        if (filterLiveStatus !== "all") {
          const info = getLiveStatusInfo(loc.id);
          if (!info || info.status !== filterLiveStatus) return false;
        }

        // Búsqueda de texto
        if (q) {
          return (
            loc.name.toLowerCase().includes(q) ||
            loc.city.toLowerCase().includes(q) ||
            loc.country.toLowerCase().includes(q) ||
            loc.tags.some((t) => t.toLowerCase().includes(q))
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "distance" && userCoords) {
          const distA = a.distance ?? 999999;
          const distB = b.distance ?? 999999;
          return distA - distB;
        }
        if (sortBy === "reviews") return b.reviewCount - a.reviewCount;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return b.rating - a.rating; // Default "rating"
      });
  }, [
    locationsWithDistance, activeCategory, activeContinent, activeCountry, minRating, 
    search, sortBy, showDemoOnly, showVerified, filterAccess, filterVerified, 
    selectedAmenities, filterLiveStatus, userCoords, liveReports
  ]);

  const mapMarkers  = filtered.slice(0, MAP_MARKER_LIMIT);
  const markersCapped = filtered.length > MAP_MARKER_LIMIT;
  const mapCenter: [number, number] = userCoords ? [userCoords.lat, userCoords.lng] : [41.3851, 2.1734]; // Centrado por defecto en Barcelona si no hay coords

  const handleSpotProposed = (newSpot: MapLocation) => {
    setAllLocations((prev) => {
      const combined = [newSpot, ...prev];
      return combined.filter(
        (loc, index, self) => self.findIndex((l) => l.id === loc.id) === index
      );
    });
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  function handleMapClick(lat: number, lng: number) {
    setPendingCoords({ lat, lng });
    setSelectionMode(false);
    setModalOpen(true);
  }

  function handleModalClose() {
    setModalOpen(false);
    setPendingCoords(null);
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* ── Stats bar ── */}
      <StatsBar locations={allLocations} />

      {/* ── Search & Filter layout ── */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, ciudad, país o tag…"
            className="w-full rounded-xl border border-border bg-background pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30 dark:focus:ring-emerald-500/30 transition-shadow"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label="Limpiar búsqueda"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          {/* Botón Geolocalización */}
          <button
            onClick={handleRequestLocation}
            disabled={locatingUser}
            className={cn(
              "flex items-center gap-1.5 rounded-xl border px-3.5 py-2.5 text-xs font-semibold cursor-pointer transition-all",
              userCoords
                ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-400"
                : "bg-background border-border/80 text-foreground hover:bg-muted"
            )}
          >
            <Compass className={cn("size-4 shrink-0", locatingUser && "animate-spin text-emerald-500")} />
            {locatingUser ? "Ubicando…" : userCoords ? "Cerca de mí" : "Ubicación"}
          </button>

          {/* Botón Filtros Avanzados (Trigger Sheet) */}
          <Sheet>
            <SheetTrigger
              type="button"
              className="flex items-center gap-1.5 rounded-xl border border-border bg-background hover:bg-muted px-3.5 py-2.5 text-xs font-semibold cursor-pointer transition-all"
            >
              <SlidersHorizontal className="size-4" />
              Filtros Avanzados
              {(filterAccess !== "all" || filterVerified !== "all" || selectedAmenities.length > 0 || filterLiveStatus !== "all") && (
                <span className="size-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
              )}
            </SheetTrigger>
            
            <SheetContent side="right" className="p-6 overflow-y-auto max-w-sm w-full">
              <SheetHeader className="p-0 border-b border-border/40 pb-4 mb-4">
                <SheetTitle className="text-base font-extrabold flex items-center gap-2">
                  <Filter className="size-4 text-emerald-600 dark:text-emerald-400" />
                  Filtros Avanzados
                </SheetTitle>
                <SheetDescription className="text-xs">
                  Ajusta la búsqueda de locaciones y servicios.
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6">
                {/* Tipo de acceso */}
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Acceso y Requisitos</h4>
                  <div className="space-y-2">
                    {[
                      { value: "all", label: "Cualquiera" },
                      { value: "free", label: "Público / Entrada Libre 🔓" },
                      { value: "membership", label: "Solo socios / Registro 🔑" },
                    ].map((opt) => (
                      <label key={opt.value} className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
                        <input
                          type="radio"
                          name="filterAccess"
                          checked={filterAccess === opt.value}
                          onChange={() => setFilterAccess(opt.value as any)}
                          className="accent-emerald-600 size-4 cursor-pointer"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Equipamiento / Servicios */}
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Equipamiento y Servicios</h4>
                  <div className="space-y-2">
                    {[
                      { value: "wifi", label: "Wi-Fi / Co-working 📶" },
                      { value: "terraza", label: "Terraza / Exterior ☀️" },
                      { value: "silla", label: "Acceso Silla Ruedas ♿" },
                      { value: "late", label: "Abierto 24h / Tarde 🌙" },
                      { value: "cafe", label: "Bebidas / Munchies ☕" },
                    ].map((opt) => (
                      <label key={opt.value} className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={selectedAmenities.includes(opt.value)}
                          onChange={() => toggleAmenity(opt.value)}
                          className="accent-emerald-600 size-4 rounded border-border bg-background cursor-pointer"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Actividad en vivo */}
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Actividad en Vivo</h4>
                  <div className="space-y-2">
                    {[
                      { value: "all", label: "Cualquiera" },
                      { value: "tranquilo", label: "Tranquilo 🟢" },
                      { value: "moderado", label: "Normal 🟡" },
                      { value: "concurrido", label: "Concurrido 🔴" },
                    ].map((opt) => (
                      <label key={opt.value} className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
                        <input
                          type="radio"
                          name="filterLiveStatus"
                          checked={filterLiveStatus === opt.value}
                          onChange={() => setFilterLiveStatus(opt.value)}
                          className="accent-emerald-600 size-4 cursor-pointer"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Verificación / Origen */}
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Origen del Spot</h4>
                  <div className="space-y-2">
                    {[
                      { value: "all", label: "Cualquiera" },
                      { value: "official", label: "Oficiales Verificados ✓" },
                      { value: "community", label: "Propuestos por Comunidad 👥" },
                    ].map((opt) => (
                      <label key={opt.value} className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
                        <input
                          type="radio"
                          name="filterVerified"
                          checked={filterVerified === opt.value}
                          onChange={() => setFilterVerified(opt.value as any)}
                          className="accent-emerald-600 size-4 cursor-pointer"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Botón de limpiar filtros en sheet */}
              <div className="border-t border-border/40 pt-4 mt-6 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setFilterAccess("all");
                    setFilterVerified("all");
                    setSelectedAmenities([]);
                    setFilterLiveStatus("all");
                    toast.info("Filtros avanzados restablecidos.");
                  }}
                  className="w-full text-center py-2 text-xs font-bold border border-border hover:bg-muted text-muted-foreground hover:text-foreground rounded-xl cursor-pointer"
                >
                  Restablecer filtros
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* ── Continent quick-filter ── */}
      <div className="flex items-center gap-2 flex-wrap">
        {CONTINENT_BUTTONS.map((btn) => (
          <button
            key={btn.value}
            onClick={() => { setActiveContinent(btn.value); setActiveCountry("all"); }}
            className={cn(
              "px-3.5 py-1.5 text-xs font-semibold rounded-full border cursor-pointer transition-all shrink-0",
              activeContinent === btn.value
                ? "bg-foreground text-background border-foreground shadow-sm"
                : "bg-muted/60 text-muted-foreground hover:bg-muted border-border/60",
            )}
          >
            {btn.label}
          </button>
        ))}
        <div className="w-px h-4 bg-border mx-1 shrink-0" />
        
        {/* Demo / Verified toggles */}
        <button
          onClick={() => setShowDemoOnly((v) => !v)}
          className={cn(
            "px-3 py-1.5 text-xs font-semibold rounded-full border cursor-pointer transition-all shrink-0",
            showDemoOnly
              ? "bg-orange-500 border-orange-500 text-white shadow-sm"
              : "bg-muted/60 text-muted-foreground hover:bg-muted border-border/60",
          )}
        >
          Solo demo
        </button>
        <button
          onClick={() => setShowVerified((v) => !v)}
          className={cn(
            "px-3 py-1.5 text-xs font-semibold rounded-full border cursor-pointer transition-all shrink-0",
            showVerified
              ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
              : "bg-muted/60 text-muted-foreground hover:bg-muted border-border/60",
          )}
        >
          ✓ Verificados
        </button>
      </div>

      {/* ── Category filters ── */}
      <div className="flex flex-wrap gap-2 overflow-x-auto no-scrollbar pb-0.5">
        <button
          onClick={() => setActiveCategory("all")}
          className={cn(
            "px-3.5 py-1.5 text-xs font-semibold rounded-full border cursor-pointer transition-all shrink-0",
            activeCategory === "all"
              ? "bg-foreground text-background border-foreground shadow-sm"
              : "bg-muted/60 text-muted-foreground hover:bg-muted border-border/60",
          )}
        >
          Todas las categorías
        </button>
        {(["dispensary", "cannabis_club", "association", "cbd_shop", "chill_spot", "food", "nightlife"] as MapCategory[]).map((cat) => {
          const { label, color } = CATEGORY_CONFIG[cat];
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={isActive ? { backgroundColor: color, borderColor: color, color: "#fff" } : undefined}
              className={cn(
                "px-3.5 py-1.5 text-xs font-semibold rounded-full border cursor-pointer transition-all flex items-center gap-1.5 shrink-0",
                isActive ? "shadow-sm" : "bg-muted/60 text-muted-foreground hover:bg-muted border-border/60",
              )}
            >
              <span className="size-2 rounded-full inline-block shrink-0" style={{ backgroundColor: isActive ? "#ffffff" : color }} />
              {label}
            </button>
          );
        })}
      </div>

      {/* ── Secondary filters + counter ── */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {/* Country */}
          <div className="relative">
            <select
              value={activeCountry}
              onChange={(e) => setActiveCountry(e.target.value)}
              className="appearance-none rounded-lg border border-border bg-background pl-3 pr-7 py-1.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-brand-green/30 cursor-pointer"
            >
              <option value="all">🌍 Todos los países</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {COUNTRY_FLAGS[c] ?? "🌍"} {c}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3 text-muted-foreground pointer-events-none" />
          </div>

          {/* Min rating */}
          <div className="flex items-center gap-1">
            <Star className="size-3 text-amber-400" />
            {[0, 4, 4.5].map((r) => (
              <button
                key={r}
                onClick={() => setMinRating(r)}
                className={cn(
                  "px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer",
                  minRating === r
                    ? "bg-amber-400 border-amber-400 text-white"
                    : "bg-muted/60 border-border/60 text-muted-foreground hover:bg-muted",
                )}
              >
                {r === 0 ? "Todos" : `${r}+`}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="appearance-none rounded-lg border border-border bg-background pl-3 pr-7 py-1.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-brand-green/30 cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => {
                // Deshabilitar opción distancia si no hay geolocalización
                if (o.value === "distance" && !userCoords) return null;
                return (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                );
              })}
            </select>
            <SlidersHorizontal className="absolute right-2 top-1/2 -translate-y-1/2 size-3 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Counter */}
        <p className="text-xs font-semibold text-muted-foreground shrink-0">
          {filtered.length === 0
            ? "Sin resultados"
            : `${filtered.length.toLocaleString()} lugar${filtered.length !== 1 ? "es" : ""}`}
        </p>
      </div>

      {/* ── Marker limit notice ── */}
      {markersCapped && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/80 px-3.5 py-2 text-xs dark:border-amber-800/40 dark:bg-amber-950/20">
          <AlertCircle className="size-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
          <span className="text-amber-800 dark:text-amber-200">
            Mostrando los primeros <strong>{MAP_MARKER_LIMIT}</strong> de <strong>{filtered.length.toLocaleString()}</strong> resultados en el mapa. Todos aparecen en la lista inferior.
          </span>
        </div>
      )}

      {/* ── Map ── */}
      <div
        className={cn(
          "h-[60vh] min-h-[420px] w-full overflow-hidden rounded-xl border border-border shadow-md relative z-10",
          selectionMode && "[&_.leaflet-container]:cursor-crosshair"
        )}
      >
        {filtered.length === 0 && (
          <div className="absolute inset-0 z-[400] flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl pointer-events-none">
            <div className="text-center space-y-2">
              <p className="text-4xl">🗺️</p>
              <p className="font-semibold text-foreground">Sin resultados en el mapa</p>
              <p className="text-sm text-muted-foreground">Prueba con otros filtros o amplía la búsqueda</p>
            </div>
          </div>
        )}

        {/* Banner de modo selección */}
        {selectionMode && (
          <div className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 z-[1000] rounded-full bg-amber-500/95 px-5 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur-sm whitespace-nowrap">
            📍 Haz clic en el mapa para ubicar el spot
          </div>
        )}

        {/* Botón flotante — Disponible para todos (los no-logueados proponen spots locales) */}
        <button
          onClick={() => setSelectionMode((prev) => !prev)}
          className={cn(
            "absolute bottom-6 right-4 z-[1000] flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer",
            selectionMode
              ? "bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700"
              : "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800"
          )}
        >
          <MapPin className="size-4" />
          {selectionMode ? "Cancelar" : "Proponer Spot"}
        </button>

        <MapContainer center={mapCenter} zoom={userCoords ? 13 : 3} className="size-full" scrollWheelZoom>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler active={selectionMode} onMapClick={handleMapClick} />
          <MapRecenter coords={userCoords} />
          <UserLocationMarker coords={userCoords} />
          
          {mapMarkers.map((loc) => {
            const liveInfo = getLiveStatusInfo(loc.id);
            const dist = loc.distance ?? null;
            return (
              <Marker
                key={loc.id}
                position={[loc.lat, loc.lng]}
                icon={createMarkerIcon(loc.category, loc.isDemo, liveInfo?.status)}
              >
                <Popup>
                  <div className="wc-popup">
                    <LocationPopup 
                      loc={loc} 
                      distance={dist} 
                      liveStatus={liveInfo}
                      onReportStatus={(status) => handleReportStatus(loc.id, status)}
                    />
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* ── Legend ── */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 px-1">
        {(["dispensary", "cannabis_club", "association", "cbd_shop", "chill_spot", "food", "nightlife"] as MapCategory[]).map((cat) => (
          <div key={cat} className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
            <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: CATEGORY_CONFIG[cat].color }} />
            {CATEGORY_CONFIG[cat].label}
          </div>
        ))}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold ml-2">
          <span className="inline-block rounded-full border border-orange-200 bg-orange-50 px-1.5 py-0 text-[10px] font-bold text-orange-700">Demo</span>
          dato de referencia
        </div>
      </div>

      {/* ── List view ── */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-foreground">
          {filtered.length > 0 ? `${filtered.length.toLocaleString()} lugares encontrados` : "Sin resultados"}
        </h2>

        {filtered.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((loc) => {
              const liveInfo = getLiveStatusInfo(loc.id);
              const dist = loc.distance ?? null;
              return (
                <LocationCard 
                  key={loc.id} 
                  loc={loc} 
                  distance={dist}
                  liveStatus={liveInfo}
                  onReportStatus={(status) => handleReportStatus(loc.id, status)}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
            <span className="text-5xl">🔍</span>
            <p className="font-semibold text-foreground">No se encontraron lugares</p>
            <p className="text-sm text-muted-foreground max-w-xs">
              Prueba con otra categoría, país o amplía los términos de búsqueda.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setActiveCategory("all");
                setActiveContinent("all");
                setActiveCountry("all");
                setMinRating(0);
                setShowDemoOnly(false);
                setShowVerified(false);
                setFilterAccess("all");
                setFilterVerified("all");
                setSelectedAmenities([]);
                setFilterLiveStatus("all");
              }}
              className="mt-1 rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold hover:bg-muted transition-colors cursor-pointer"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* Modal de propuesta de spot */}
      {pendingCoords && (
        <ProposeSpotModal
          open={modalOpen}
          lat={pendingCoords.lat}
          lng={pendingCoords.lng}
          onClose={handleModalClose}
          onSpotProposed={handleSpotProposed}
        />
      )}
    </div>
  );
}
