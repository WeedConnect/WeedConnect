"use client";

import dynamic from "next/dynamic";
import type { MapLocation } from "@/types";

const ClubsMap = dynamic(() => import("./clubs-map").then((m) => m.ClubsMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-[60vh] min-h-[420px] w-full items-center justify-center rounded-xl border border-border bg-muted/30 text-sm text-muted-foreground">
      Cargando mapa…
    </div>
  ),
});

export function MapView({ locations }: { locations: MapLocation[] }) {
  return <ClubsMap locations={locations} />;
}
