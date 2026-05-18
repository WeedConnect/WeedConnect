import type { Metadata } from "next";
import { getClubs } from "@/lib/clubs";
import { MapView } from "./map-view";

export const metadata: Metadata = {
  title: "Mapa Colaborativo Europa · WeedConnect",
  description:
    "Encuentra asociaciones cannábicas y clubs sociales en España y Europa. Alemania, Países Bajos, Portugal, Suiza, Bélgica, Malta y más. Más spots chill: miradores, parques y playas.",
  openGraph: {
    title: "Mapa Cannábico Europa · WeedConnect",
    description: "Clubs sociales cannábicos en España y Europa. Alemania, Países Bajos, Portugal, Suiza, Malta y más. Spots chill para relajarse.",
    images: [{ url: `/api/og?title=${encodeURIComponent("Mapa Europa")}&description=${encodeURIComponent("Clubs cannábicos y spots chill en toda Europa. Comunidad WeedConnect.")}`, width: 1200, height: 630 }],
  },
};

export default async function MapaPage() {
  const clubs = await getClubs();

  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Mapa Colaborativo</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Clubs sociales cannábicos y spots chill en España y Europa. Alemania, Países Bajos,
          Portugal, Suiza, Malta, Bélgica y más. Pulsa cualquier marcador para ver detalles, etiquetas y situación legal local.
        </p>
      </header>

      <MapView clubs={clubs} />

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
