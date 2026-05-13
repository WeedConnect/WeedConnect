import type { Metadata } from "next";
import { MOCK_CLUBS } from "@/data/clubs";
import { MapView } from "./map-view";

export const metadata: Metadata = {
  title: "Mapa de clubes",
  description:
    "Encuentra asociaciones y clubes cannábicos cercanos. Datos comunitarios y verificados.",
};

export default function MapaPage() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Mapa de clubes</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Asociaciones cannábicas registradas. Pulsa un marcador para ver más información.
          Los datos actuales son de muestra — en breve permitirá proponer nuevos clubes.
        </p>
      </header>

      <MapView clubs={MOCK_CLUBS} />

      <p className="rounded-md border border-amber-300/60 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-700/40 dark:bg-amber-950/40 dark:text-amber-200">
        ⚠ Recuerda: las asociaciones cannábicas en España son entidades privadas sin ánimo de
        lucro. El acceso suele requerir ser socio y mayor de edad.
      </p>
    </section>
  );
}
