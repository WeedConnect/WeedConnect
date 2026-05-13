"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Club } from "@/types";

// Fix para que los iconos por defecto de Leaflet funcionen con bundlers (Next.js).
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export function ClubsMap({ clubs }: { clubs: Club[] }) {
  // Centro inicial: media aritmética de los clubes (España centrada).
  const center: [number, number] = clubs.length
    ? [
        clubs.reduce((sum, c) => sum + c.lat, 0) / clubs.length,
        clubs.reduce((sum, c) => sum + c.lng, 0) / clubs.length,
      ]
    : [40.4168, -3.7038];

  return (
    <div className="h-[70vh] min-h-[480px] w-full overflow-hidden rounded-lg border border-border">
      <MapContainer center={center} zoom={6} className="size-full" scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {clubs.map((c) => (
          <Marker key={c.id} position={[c.lat, c.lng]} icon={icon}>
            <Popup>
              <div className="space-y-1">
                <p className="font-semibold">{c.name}</p>
                <p className="text-xs text-muted-foreground">
                  {c.address}, {c.city}
                </p>
                {c.description && <p className="text-xs">{c.description}</p>}
                {c.membershipRequired && (
                  <p className="text-[10px] uppercase tracking-wide text-emerald-700">
                    Solo socios · +18
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
