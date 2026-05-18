"use client";

import { useState, useMemo, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Search, X, Star, MapPin, ChevronDown, SlidersHorizontal, AlertCircle } from "lucide-react";
import type { MapLocation, MapCategory, LocationContinent } from "@/types";
import { cn } from "@/lib/utils";
import { ProposeSpotModal } from "@/components/map/propose-spot-modal";

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
    color: "#6366f1",
    icon: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor"/>`,
  },
  cannabis_club: {
    label: "Cannabis Club",
    color: "#7c3aed",
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
    color: "#8b5cf6",
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

const COUNTRY_FLAGS: Record<string, string> = {
  Spain: "🇪🇸", "United States": "🇺🇸", Netherlands: "🇳🇱",
  Germany: "🇩🇪", Portugal: "🇵🇹", "Czech Republic": "🇨🇿",
  Denmark: "🇩🇰", Switzerland: "🇨🇭", Italy: "🇮🇹", France: "🇫🇷",
  "United Kingdom": "🇬🇧", Austria: "🇦🇹", Belgium: "🇧🇪",
};

// ─── Marker icon ──────────────────────────────────────────────────────────────

function createMarkerIcon(category: MapCategory, isDemo?: boolean) {
  const cfg = CATEGORY_CONFIG[category] ?? CATEGORY_CONFIG.point_of_interest;
  const { color, icon } = cfg;
  const opacity = isDemo ? "0.75" : "1";
  const html = `
    <div style="filter:drop-shadow(0 3px 4px rgba(0,0,0,0.28));opacity:${opacity}">
      <svg width="36" height="44" viewBox="0 0 24 29" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.37 0 0 5.37 0 12C0 21 12 29 12 29C12 29 24 21 24 12C24 5.37 18.63 0 12 0Z"
              fill="${color}" stroke="#fff" stroke-width="1.5"/>
        <circle cx="12" cy="12" r="7" fill="#fff"/>
        <g transform="translate(6,6) scale(0.5)" style="color:${color}">
          ${icon}
        </g>
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

// ─── Popup HTML ───────────────────────────────────────────────────────────────

function starsHtml(rating: number): string {
  const full = Math.round(rating);
  return "★".repeat(full) + "☆".repeat(5 - full);
}

function makePopupHtml(loc: MapLocation): string {
  const cat = CATEGORY_CONFIG[loc.category] ?? CATEGORY_CONFIG.point_of_interest;
  const st  = STATUS_CONFIG[loc.status];
  const flag = COUNTRY_FLAGS[loc.country] ?? "🌍";
  const tagsHtml = loc.tags
    .slice(0, 4)
    .map(
      (t) =>
        `<span style="background:#f3f4f6;border-radius:4px;padding:1px 6px;font-size:9px;font-weight:600;color:#6b7280">#${t}</span>`,
    )
    .join(" ");
  const demoBadge = loc.isDemo
    ? `<span style="background:#fed7aa;color:#9a3412;border-radius:4px;padding:1px 6px;font-size:9px;font-weight:700">DEMO</span> `
    : "";

  return `
    <div style="font-family:system-ui,sans-serif;min-width:200px;max-width:240px;line-height:1.4">
      <p style="margin:0 0 6px;font-weight:700;font-size:13px;color:#111">${demoBadge}${loc.name}</p>
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;flex-wrap:wrap">
        <span style="background:${cat.color};color:#fff;border-radius:20px;padding:2px 8px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.5px">
          ${cat.label}
        </span>
        <span style="color:#f59e0b;font-size:12px;font-weight:700">${starsHtml(loc.rating)}</span>
        <span style="font-size:10px;color:#6b7280">${loc.rating} (${loc.reviewCount.toLocaleString()})</span>
      </div>
      <p style="margin:0 0 5px;font-size:11px;color:#6b7280">${flag} ${loc.city}, ${loc.country}</p>
      <p style="margin:0 0 7px;font-size:11px;color:#374151;font-style:italic">${loc.description.substring(0, 110)}${loc.description.length > 110 ? "…" : ""}</p>
      <div style="display:flex;flex-wrap:wrap;gap:3px;margin-bottom:6px">${tagsHtml}</div>
      <p style="margin:0;font-size:9px;padding:3px 7px;border-radius:4px;background:${st.bg};color:${st.text};font-weight:600">
        ℹ️ ${st.label}
      </p>
    </div>`;
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

function LocationCard({ loc }: { loc: MapLocation }) {
  const cat  = CATEGORY_CONFIG[loc.category] ?? CATEGORY_CONFIG.point_of_interest;
  const st   = STATUS_CONFIG[loc.status];
  const flag = COUNTRY_FLAGS[loc.country] ?? "🌍";

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-border/50 bg-background/70 p-4 hover:border-border hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
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
          </div>
          <h3 className="font-bold text-sm text-foreground leading-tight">{loc.name}</h3>
        </div>
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
] as const;

type SortKey = (typeof SORT_OPTIONS)[number]["value"];

type ContinentFilter = "all" | LocationContinent;

const CONTINENT_BUTTONS: { value: ContinentFilter; label: string }[] = [
  { value: "all",           label: "🌍 Todo" },
  { value: "north_america", label: "🇺🇸 USA" },
  { value: "europe",        label: "🇪🇺 Europa" },
];

export function ClubsMap({ locations }: { locations: MapLocation[] }) {
  const [search,          setSearch]          = useState("");
  const [activeCategory,  setActiveCategory]  = useState<MapCategory | "all">("all");
  const [activeContinent, setActiveContinent] = useState<ContinentFilter>("all");
  const [activeCountry,   setActiveCountry]   = useState("all");
  const [minRating,       setMinRating]       = useState(0);
  const [sortBy,          setSortBy]          = useState<SortKey>("rating");
  const [showDemoOnly,    setShowDemoOnly]     = useState(false);
  const [showVerified,    setShowVerified]     = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [pendingCoords, setPendingCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const countries = useMemo(() => {
    const set = new Set(locations.map((l) => l.country));
    return Array.from(set).sort();
  }, [locations]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return locations
      .filter((loc) => {
        if (activeCategory !== "all" && loc.category !== activeCategory) return false;
        if (activeContinent !== "all" && loc.continent !== activeContinent) return false;
        if (activeCountry !== "all" && loc.country !== activeCountry) return false;
        if (minRating > 0 && loc.rating < minRating) return false;
        if (showDemoOnly && !loc.isDemo) return false;
        if (showVerified && !loc.verified) return false;
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
        if (sortBy === "rating")  return b.rating - a.rating;
        if (sortBy === "reviews") return b.reviewCount - a.reviewCount;
        return a.name.localeCompare(b.name);
      });
  }, [locations, activeCategory, activeContinent, activeCountry, minRating, search, sortBy, showDemoOnly, showVerified]);

  const mapMarkers  = filtered.slice(0, MAP_MARKER_LIMIT);
  const markersCapped = filtered.length > MAP_MARKER_LIMIT;
  const mapCenter: [number, number] = [45, 8];

  // Detecta sesión activa usando el cliente browser de Supabase
  useEffect(() => {
    const supabaseConfigured = !!(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    if (!supabaseConfigured) return;

    // Importación dinámica para no romper si Supabase no está configurado
    import("@/lib/supabase/client").then(({ createClient }) => {
      const supabase = createClient();

      supabase.auth.getSession().then(({ data: { session } }) => {
        setIsLoggedIn(!!session);
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_, session) => {
        setIsLoggedIn(!!session);
      });

      return () => subscription.unsubscribe();
    });
  }, []);

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
      <StatsBar locations={locations} />

      {/* ── Search bar ── */}
      <div className="relative">
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
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Limpiar búsqueda"
          >
            <X className="size-4" />
          </button>
        )}
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
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
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
          "h-[60vh] min-h-[420px] w-full overflow-hidden rounded-xl border border-border shadow-md relative",
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

        {/* Botón flotante — solo para usuarios autenticados */}
        {isLoggedIn && (
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
        )}

        <MapContainer center={mapCenter} zoom={3} className="size-full" scrollWheelZoom>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler active={selectionMode} onMapClick={handleMapClick} />
          {mapMarkers.map((loc) => (
            <Marker
              key={loc.id}
              position={[loc.lat, loc.lng]}
              icon={createMarkerIcon(loc.category, loc.isDemo)}
            >
              <Popup>
                <div className="wc-popup" dangerouslySetInnerHTML={{ __html: makePopupHtml(loc) }} />
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* ── Legend ── */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 px-1">
        {(["dispensary", "cannabis_club", "association", "cbd_shop", "chill_spot", "food", "nightlife"] as MapCategory[]).map((cat) => (
          <div key={cat} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: CATEGORY_CONFIG[cat].color }} />
            {CATEGORY_CONFIG[cat].label}
          </div>
        ))}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground ml-2">
          <span className="inline-block rounded-full border border-orange-200 bg-orange-50 px-1.5 py-0 text-[10px] font-semibold text-orange-700">Demo</span>
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
            {filtered.map((loc) => (
              <LocationCard key={loc.id} loc={loc} />
            ))}
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
              }}
              className="mt-1 rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold hover:bg-muted transition-colors"
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
        />
      )}
    </div>
  );
}
