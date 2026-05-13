"use client";

import dynamic from "next/dynamic";
import type { Club } from "@/types";

const ClubsMap = dynamic(() => import("./clubs-map").then((m) => m.ClubsMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-[70vh] min-h-[480px] w-full items-center justify-center rounded-lg border border-border bg-muted/30 text-sm text-muted-foreground">
      Cargando mapa…
    </div>
  ),
});

export function MapView({ clubs }: { clubs: Club[] }) {
  return <ClubsMap clubs={clubs} />;
}
