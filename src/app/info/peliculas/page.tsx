import type { Metadata } from "next";
import { Film, Star, Tv, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_PELICULAS, type MediaType } from "@/data/peliculas";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pelis recomendadas",
  description: "Selección comunitaria de películas, series y documentales para acompañar una sesión.",
};

const TIPO_LABEL: Record<MediaType, string> = {
  pelicula: "Película",
  serie: "Serie",
  documental: "Documental",
};

const TIPO_COLOR: Record<MediaType, string> = {
  pelicula: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
  serie: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200",
  documental: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
};

const TIPO_ICON: Record<MediaType, React.ElementType> = {
  pelicula: Film,
  serie: Tv,
  documental: BookOpen,
};

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "size-3.5",
            i < full
              ? "fill-amber-400 text-amber-400"
              : i === full && half
                ? "fill-amber-200 text-amber-400"
                : "text-muted-foreground/30",
          )}
        />
      ))}
      <span className="ml-1 text-xs text-muted-foreground">{rating.toFixed(1)}</span>
    </span>
  );
}

export default function PeliculasPage() {
  const destacadas = MOCK_PELICULAS.filter((p) => p.destacada);
  const resto = MOCK_PELICULAS.filter((p) => !p.destacada);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Pelis recomendadas</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Películas, series y documentales elegidos por la comunidad para acompañar una sesión.
          Desde clásicos del género hasta documentales reveladores.
        </p>
      </header>

      {destacadas.length > 0 && (
        <>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Destacadas por la comunidad
          </h2>
          <ul className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {destacadas.map((p) => {
              const Icon = TIPO_ICON[p.tipo];
              return (
                <li key={p.id}>
                  <Card className="h-full border-emerald-200 dark:border-emerald-900/40">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="flex items-center gap-2 text-base leading-snug">
                          <Icon className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden />
                          {p.titulo}
                        </CardTitle>
                        <Badge className={cn("shrink-0 border-0 text-[10px]", TIPO_COLOR[p.tipo])}>
                          {TIPO_LABEL[p.tipo]}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {p.anyo} · {p.duracion}
                        {p.generos.length > 0 && ` · ${p.generos.join(", ")}`}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="line-clamp-3 text-sm">{p.descripcion}</CardDescription>
                      <div className="mt-3">
                        <StarRating rating={p.puntuacionComunidad} />
                        <p className="mt-0.5 text-[10px] text-muted-foreground">
                          {p.votos} votos de la comunidad
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              );
            })}
          </ul>
        </>
      )}

      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Todas las recomendaciones
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {resto.map((p) => {
          const Icon = TIPO_ICON[p.tipo];
          return (
            <li key={p.id}>
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="flex items-center gap-2 text-base leading-snug">
                      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                      {p.titulo}
                    </CardTitle>
                    <Badge className={cn("shrink-0 border-0 text-[10px]", TIPO_COLOR[p.tipo])}>
                      {TIPO_LABEL[p.tipo]}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {p.anyo} · {p.duracion}
                  </p>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-3 text-sm">{p.descripcion}</CardDescription>
                  <div className="mt-3">
                    <StarRating rating={p.puntuacionComunidad} />
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      {p.votos} votos
                    </p>
                  </div>
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>

      <p className="mt-10 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3 text-center text-sm text-muted-foreground">
        ¿Echas en falta alguna? Próximamente podrás proponer y votar recomendaciones desde tu perfil.
      </p>
    </section>
  );
}
