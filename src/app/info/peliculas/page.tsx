import type { Metadata } from "next";
import { Film } from "lucide-react";
import { PeliculasBrowser } from "./peliculas-browser";

export const metadata: Metadata = {
  title: "Películas y Series Recomendadas WeedConnect",
  description: "Listas de películas, series y documentales organizados por estado de ánimo para acompañar una sesión: psicodelia, risas, terror con colegas y clásicos stoner.",
};

export default function PeliculasPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 animate-in fade-in duration-500">
      <header className="mb-8 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-emerald-600">
          <Film className="size-6" />
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Cine & Chill</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Películas para ver fumado</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground leading-relaxed">
          Selecciones elegidas meticulosamente por la comunidad y clasificadas según tu viaje actual.
          Desde risas absurdas hasta documentales reveladores y viajes interdimensionales.
        </p>
      </header>

      {/* Componente Cliente de Filtrado Dinámico */}
      <PeliculasBrowser />

      <p className="mt-12 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-6 text-center text-sm text-muted-foreground leading-relaxed">
        🍿 ¿Tienes una sugerencia icónica? Próximamente podrás proponer tus películas favoritas y votar la lista directamente desde tu perfil.
      </p>
    </section>
  );
}
