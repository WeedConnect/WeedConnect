"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type Noticia,
  type NoticiaCategoria,
  CATEGORIA_LABEL,
  CATEGORIA_COLOR,
} from "@/data/noticias";
import { cn } from "@/lib/utils";

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function NoticiasBrowser({ noticias }: { noticias: Noticia[] }) {
  const [activeCategory, setActiveCategory] = useState<NoticiaCategoria | "todas">("todas");

  const categorias = [
    ...new Set(noticias.map((n) => n.categoria)),
  ].sort() as NoticiaCategoria[];

  const filtered = activeCategory === "todas"
    ? noticias
    : noticias.filter((n) => n.categoria === activeCategory);

  const destacadas = filtered.filter((n) => n.destacada);
  const resto = filtered.filter((n) => !n.destacada);

  return (
    <>
      {/* Filtro de categorías */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory("todas")}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold border transition-colors",
            activeCategory === "todas"
              ? "bg-foreground text-background border-foreground"
              : "bg-transparent text-muted-foreground border-border hover:border-foreground/40",
          )}
        >
          Todas
        </button>
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(activeCategory === cat ? "todas" : cat)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold border transition-colors",
              activeCategory === cat
                ? cn(CATEGORIA_COLOR[cat], "border-transparent")
                : "bg-transparent text-muted-foreground border-border hover:border-foreground/40",
            )}
          >
            {CATEGORIA_LABEL[cat]}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-muted-foreground">
          No hay noticias en esta categoría todavía.
        </p>
      )}

      {destacadas.length > 0 && (
        <>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Noticias destacadas
          </h2>
          <ul className="mb-8 flex flex-col gap-4">
            {destacadas.map((n) => (
              <li key={n.id}>
                <Card className="border-emerald-200 dark:border-emerald-900/40">
                  <CardHeader className="pb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={cn("border-0 text-[10px]", CATEGORIA_COLOR[n.categoria])}>
                        {CATEGORIA_LABEL[n.categoria]}
                      </Badge>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CalendarDays className="size-3" />
                        {formatFecha(n.fecha)}
                      </span>
                      <span className="text-xs text-muted-foreground">· {n.fuente}</span>
                    </div>
                    <CardTitle className="mt-1 text-lg leading-snug">{n.titulo}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{n.extracto}</p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </>
      )}

      {resto.length > 0 && (
        <>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {destacadas.length > 0 ? "Más noticias" : "Noticias"}
          </h2>
          <ul className="flex flex-col divide-y divide-border rounded-lg border border-border">
            {resto.map((n) => (
              <li key={n.id} className="px-4 py-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge className={cn("border-0 text-[10px]", CATEGORIA_COLOR[n.categoria])}>
                    {CATEGORIA_LABEL[n.categoria]}
                  </Badge>
                  <span className="flex items-center gap-1">
                    <CalendarDays className="size-3" />
                    {formatFecha(n.fecha)}
                  </span>
                  <span>· {n.fuente}</span>
                </div>
                <h3 className="mt-1 font-semibold leading-snug">{n.titulo}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{n.extracto}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
