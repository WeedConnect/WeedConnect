"use client";

import { useState } from "react";
import { Film, Star, Tv, BookOpen, Flame, Smile, Eye, Ghost, Sofa, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_PELICULAS, type MediaType, type StonerMood } from "@/data/peliculas";
import { cn } from "@/lib/utils";

const TIPO_LABEL: Record<MediaType, string> = {
  pelicula: "Película",
  serie: "Serie",
  documental: "Documental",
};

const TIPO_COLOR: Record<MediaType, string> = {
  pelicula: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200",
  serie: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200",
  documental: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200",
};

const TIPO_ICON: Record<MediaType, React.ElementType> = {
  pelicula: Film,
  serie: Tv,
  documental: BookOpen,
};

interface MoodOption {
  key: StonerMood | "todos";
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

const MOODS: MoodOption[] = [
  { key: "todos", label: "Todos los moods", icon: Sparkles, color: "text-muted-foreground", bgColor: "bg-muted" },
  { key: "fumadon", label: "Fumadón mental", icon: Flame, color: "text-purple-600 dark:text-purple-400", bgColor: "bg-purple-100 dark:bg-purple-950/40" },
  { key: "risas", label: "Risas aseguradas", icon: Smile, color: "text-amber-600 dark:text-amber-400", bgColor: "bg-amber-100 dark:bg-amber-950/40" },
  { key: "psicodelica", label: "Visuales / Psicodelia", icon: Eye, color: "text-pink-600 dark:text-pink-400", bgColor: "bg-pink-100 dark:bg-pink-950/40" },
  { key: "terror", label: "Terror con colegas", icon: Ghost, color: "text-red-600 dark:text-red-400", bgColor: "bg-red-100 dark:bg-red-950/40" },
  { key: "domingo_chill", label: "Domingo chill", icon: Sofa, color: "text-emerald-600 dark:text-emerald-400", bgColor: "bg-emerald-100 dark:bg-emerald-950/40" },
  { key: "clasico_stoner", label: "Clásico Stoner", icon: Film, color: "text-orange-600 dark:text-orange-400", bgColor: "bg-orange-100 dark:bg-orange-950/40" },
];

const MOOD_BADGE_LABEL: Record<StonerMood, string> = {
  fumadon: "🤯 Fumadón mental",
  risas: "😂 Risas aseguradas",
  psicodelica: "🌀 Visual / Psicodélica",
  terror: "👻 Terror con colegas",
  domingo_chill: "🛋️ Domingo chill",
  clasico_stoner: "🚬 Clásico Stoner",
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
      <span className="ml-1 text-xs text-muted-foreground font-medium">{rating.toFixed(1)}</span>
    </span>
  );
}

export function PeliculasBrowser() {
  const [selectedMood, setSelectedMood] = useState<StonerMood | "todos">("todos");

  const filtered = selectedMood === "todos"
    ? MOCK_PELICULAS
    : MOCK_PELICULAS.filter(p => p.mood === selectedMood);

  const destacadas = filtered.filter((p) => p.destacada);
  const resto = filtered.filter((p) => !p.destacada);

  return (
    <div className="flex flex-col gap-8">
      {/* Selector de Moods con Pills Modernas */}
      <div className="scrollbar-none flex gap-2 overflow-x-auto pb-2">
        {MOODS.map((m) => {
          const Icon = m.icon;
          const isSelected = selectedMood === m.key;
          return (
            <button
              key={m.key}
              onClick={() => setSelectedMood(m.key)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-200 shadow-sm cursor-pointer hover:-translate-y-0.5",
                isSelected 
                  ? `${m.bgColor} border-transparent shadow-md ring-2 ring-emerald-600/20`
                  : "border-border bg-background text-muted-foreground hover:bg-muted/50"
              )}
            >
              <Icon className={cn("size-4", isSelected ? m.color : "text-muted-foreground")} />
              <span className={isSelected ? "text-foreground font-bold" : ""}>{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Contenido Filtrado */}
      {destacadas.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            <Sparkles className="size-4" /> Destacadas en este mood
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {destacadas.map((p) => {
              const Icon = TIPO_ICON[p.tipo];
              return (
                <li key={p.id}>
                  <Card className="h-full border-emerald-200 transition-all hover:shadow-md dark:border-emerald-900/40 bg-gradient-to-b from-emerald-50/20 to-background dark:from-emerald-950/10">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="flex items-center gap-2 text-base leading-snug">
                          <Icon className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden />
                          {p.titulo}
                        </CardTitle>
                        <Badge className={cn("shrink-0 border-0 text-[9px] uppercase font-extrabold", TIPO_COLOR[p.tipo])}>
                          {TIPO_LABEL[p.tipo]}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground font-medium">
                        {p.anyo} · {p.duracion}
                        {p.generos.length > 0 && ` · ${p.generos.join(", ")}`}
                      </p>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                      <CardDescription className="line-clamp-3 text-sm leading-relaxed text-foreground/80">{p.descripcion}</CardDescription>
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 mt-auto border-t border-border/40">
                        <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded">
                          {MOOD_BADGE_LABEL[p.mood]}
                        </span>
                        <div className="text-right">
                          <StarRating rating={p.puntuacionComunidad} />
                          <p className="text-[9px] text-muted-foreground mt-0.5">
                            {p.votos} votos
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
          {selectedMood === "todos" ? "Todas las recomendaciones" : "Más en este mood"}
        </h2>
        
        {resto.length === 0 && destacadas.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground border border-dashed rounded-lg bg-muted/10">
            No hay títulos sugeridos para esta categoría aún.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resto.map((p) => {
              const Icon = TIPO_ICON[p.tipo];
              return (
                <li key={p.id}>
                  <Card className="h-full border-border/50 hover:border-border/80 transition-colors bg-card/50">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="flex items-center gap-2 text-base leading-snug">
                          <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                          {p.titulo}
                        </CardTitle>
                        <Badge className={cn("shrink-0 border-0 text-[9px] uppercase font-extrabold", TIPO_COLOR[p.tipo])}>
                          {TIPO_LABEL[p.tipo]}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground font-medium">
                        {p.anyo} · {p.duracion}
                      </p>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                      <CardDescription className="line-clamp-3 text-sm leading-relaxed">{p.descripcion}</CardDescription>
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 mt-auto border-t border-border/40">
                        <span className="text-[10px] font-medium text-muted-foreground bg-muted/80 px-2 py-0.5 rounded">
                          {MOOD_BADGE_LABEL[p.mood]}
                        </span>
                        <div className="text-right">
                          <StarRating rating={p.puntuacionComunidad} />
                          <p className="text-[9px] text-muted-foreground mt-0.5">
                            {p.votos} votos
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
