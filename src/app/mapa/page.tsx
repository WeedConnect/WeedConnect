import type { Metadata } from "next";
import { MOCK_CLUBS } from "@/data/clubs";
import { MapView } from "./map-view";

export const metadata: Metadata = {
  title: "Mapa Colaborativo WeedConnect",
  description:
    "Encuentra asociaciones legales y los mejores sitios (spots) chill para relajarte: miradores, parques y zonas con vistas. Datos de la comunidad.",
};

export default function MapaPage() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Mapa Colaborativo</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Descubre asociaciones legales, miradores con buenas vistas, bancos tranquilos y rincones
          mágicos para relajarte con amigos. Pulsa cualquier marcador para ver los detalles y etiquetas comunitarias.
        </p>
      </header>

      <MapView clubs={MOCK_CLUBS} />

      <div className="grid gap-4 sm:grid-cols-2">
        <p className="rounded-md border border-amber-300/60 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-700/40 dark:bg-amber-950/40 dark:text-amber-200">
          🔒 **Asociaciones (Verde)**: Son entidades privadas sin ánimo de lucro. El acceso
          está restringido legalmente a socios registrados y mayores de edad.
        </p>
        <p className="rounded-md border border-sky-200/60 bg-sky-50 px-3 py-2 text-xs text-sky-900 dark:border-sky-700/40 dark:bg-sky-950/40 dark:text-sky-200">
          🌳 **Spots Libres (Azul/Naranja/Verde)**: Miradores, parques y playas de libre acceso. Respeta
          el entorno urbano, a los vecinos y no dejes basura.
        </p>
      </div>
    </section>
  );
}
