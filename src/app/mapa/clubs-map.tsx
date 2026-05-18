"use client";

import { useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Club, SpotCategory } from "@/types";
import { cn } from "@/lib/utils";

// Colores por categoría (HEX)
const CATEGORY_COLORS: Record<SpotCategory, string> = {
  asociacion: "#10b981", // emerald-500
  mirador: "#0ea5e9",   // sky-500
  parque: "#22c55e",    // green-500
  banco: "#f59e0b",     // amber-500
  playa: "#06b6d4",     // cyan-500
  spot_relax: "#6366f1", // indigo-500
  comida: "#f97316",    // orange-500
  noche: "#8b5cf6",     // violet-500
  otro: "#64748b",      // slate-500
};

const CATEGORY_LABEL: Record<SpotCategory, string> = {
  asociacion: "Asociación",
  mirador: "Mirador",
  parque: "Parque",
  banco: "Banco chill",
  playa: "Playa / Cala",
  spot_relax: "Zona relax",
  comida: "Comida",
  noche: "Noche / Bar",
  otro: "Punto de interés",
};

// Iconos internos por categoría (SVG paths estándar 24x24)
const CATEGORY_INNER_ICONS: Record<SpotCategory, string> = {
  asociacion: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor"/>`,
  mirador: `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" fill="currentColor"/>`,
  parque: `<path d="M12 2L3 15h6v7h6v-7h6z" fill="currentColor"/>`,
  banco: `<path d="M3 9h18v3H3zm2-5h14v3H5zm-4 9v8h3v-6h12v6h3v-8H1z" fill="currentColor"/>`,
  playa: `<path d="M2 18c4 0 4-3 8-3s4 3 8 3 4-3 8-3v4H2v-4z" fill="currentColor"/><circle cx="8" cy="7" r="4" fill="currentColor"/>`,
  spot_relax: `<path d="M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18zm0-15a6 6 0 1 0 0 12 6 6 0 0 0 0-12z" fill="currentColor"/>`,
  comida: `<path d="M18 2h-2v7h-2V2h-2v7a4 4 0 0 0 3 3.87V22h2v-9.13A4 4 0 0 0 18 9V2zM5 2v10h3v10h2V2H5z" fill="currentColor"/>`,
  noche: `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"/>`,
  otro: `<circle cx="12" cy="12" r="6" fill="currentColor"/>`,
};

// Generador de pines dinámicos mediante SVG embebido
function createSpotIcon(category: SpotCategory) {
  const color = CATEGORY_COLORS[category] || CATEGORY_COLORS.otro;
  const innerIcon = CATEGORY_INNER_ICONS[category] || CATEGORY_INNER_ICONS.otro;
  
  const html = `
    <div style="filter: drop-shadow(0px 3px 4px rgba(0,0,0,0.3));">
      <svg width="36" height="44" viewBox="0 0 24 29" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Pin de fondo -->
        <path d="M12 0C5.37 0 0 5.37 0 12C0 21 12 29 12 29C12 29 24 21 24 12C24 5.37 18.63 0 12 0Z" fill="${color}" stroke="#ffffff" stroke-width="1.5"/>
        <!-- Círculo blanco central -->
        <circle cx="12" cy="12" r="7" fill="#ffffff"/>
        <!-- Icono a color escalado y centrado -->
        <g transform="translate(6, 6) scale(0.5)" style="color: ${color};">
          ${innerIcon}
        </g>
      </svg>
    </div>
  `;
  
  return L.divIcon({
    className: "custom-spot-marker",
    html: html,
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -40],
  });
}

export function ClubsMap({ clubs }: { clubs: Club[] }) {
  const [activeCategory, setActiveCategory] = useState<SpotCategory | "todos">("todos");

  // Filtrado reactivo
  const filteredClubs = useMemo(() => {
    if (activeCategory === "todos") return clubs;
    return clubs.filter(c => c.category === activeCategory);
  }, [clubs, activeCategory]);

  // Centro inicial basado en TODOS los clubes para no descolocar al filtrar
  const center: [number, number] = useMemo(() => {
    return clubs.length
      ? [
          clubs.reduce((sum, c) => sum + c.lat, 0) / clubs.length,
          clubs.reduce((sum, c) => sum + c.lng, 0) / clubs.length,
        ]
      : [40.4168, -3.7038];
  }, [clubs]);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Filtros superiores de categoría */}
      <div className="flex flex-wrap gap-2 items-center pb-1 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveCategory("todos")}
          className={cn(
            "px-3.5 py-1.5 text-xs font-semibold rounded-full border cursor-pointer transition-all",
            activeCategory === "todos"
              ? "bg-foreground text-background border-foreground shadow-sm"
              : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border-border/60"
          )}
        >
          🌍 Todos los spots
        </button>
        
        {(Object.keys(CATEGORY_LABEL) as SpotCategory[]).map((cat) => {
          const isActive = activeCategory === cat;
          const color = CATEGORY_COLORS[cat];
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                borderColor: isActive ? color : undefined,
                backgroundColor: isActive ? color : undefined,
                color: isActive ? "#ffffff" : undefined,
              }}
              className={cn(
                "px-3.5 py-1.5 text-xs font-semibold rounded-full border cursor-pointer transition-all flex items-center gap-2",
                isActive
                  ? "shadow-sm border-transparent"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border-border/60"
              )}
            >
              <span 
                className="size-2 rounded-full inline-block shrink-0"
                style={{ backgroundColor: isActive ? "#ffffff" : color }}
              />
              {CATEGORY_LABEL[cat]}
            </button>
          );
        })}
      </div>

      {/* Contenedor del Mapa */}
      <div className="h-[70vh] min-h-[480px] w-full overflow-hidden rounded-lg border border-border shadow-md relative">
        <MapContainer center={center} zoom={6} className="size-full" scrollWheelZoom>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredClubs.map((c) => (
            <Marker key={c.id} position={[c.lat, c.lng]} icon={createSpotIcon(c.category)}>
              <Popup>
                <div className="min-w-[180px] space-y-2 font-sans">
                  <div className="flex items-center justify-between gap-2 border-b border-border pb-1">
                    <p className="m-0 font-semibold text-foreground">{c.name}</p>
                  </div>
                  
                  <span 
                    className="inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white"
                    style={{ backgroundColor: CATEGORY_COLORS[c.category] }}
                  >
                    {CATEGORY_LABEL[c.category]}
                  </span>

                  <p className="m-0 text-xs text-muted-foreground leading-tight">
                    {c.address}, {c.city}
                  </p>

                  {c.description && (
                    <p className="m-0 text-xs text-muted-foreground italic leading-tight">
                      &quot;{c.description}&quot;
                    </p>
                  )}

                  {c.tags && c.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {c.tags.map(tag => (
                        <span key={tag} className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {c.membershipRequired ? (
                    <p className="m-0 pt-1 text-[9px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                      🔒 Solo socios · +18
                    </p>
                  ) : (
                    <p className="m-0 pt-1 text-[9px] font-semibold uppercase tracking-wide text-sky-600 dark:text-sky-400">
                      🌳 Acceso libre
                    </p>
                  )}
                  {(c.category === "comida" || c.category === "noche" || c.category === "mirador" || c.category === "parque" || c.category === "playa" || c.category === "banco" || c.category === "spot_relax") && (
                    <p className="m-0 pt-1 text-[9px] text-muted-foreground italic">
                      ℹ️ Información orientativa. Respeta la normativa local.
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

