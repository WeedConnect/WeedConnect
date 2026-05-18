"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarDays, MapPin, Users, Euro } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type Evento,
  type EventoCategoria,
  CATEGORIA_EVENTO_LABEL,
  CATEGORIA_EVENTO_COLOR,
} from "@/data/eventos";
import { cn } from "@/lib/utils";

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatMes(iso: string) {
  return new Date(iso + "-01").toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });
}

function getMes(iso: string) {
  return iso.slice(0, 7);
}

interface EventosBrowserProps {
  eventos: Evento[];
}

export function EventosBrowser({ eventos }: EventosBrowserProps) {
  const [activeCategory, setActiveCategory] = useState<EventoCategoria | "todos">("todos");

  const categorias = [...new Set(eventos.map((e) => e.categoria))].sort() as EventoCategoria[];

  const filtered =
    activeCategory === "todos"
      ? eventos
      : eventos.filter((e) => e.categoria === activeCategory);

  const sorted = [...filtered].sort(
    (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime(),
  );

  const destacados = filtered.filter((e) => e.destacado);
  const meses = [...new Set(sorted.map((e) => getMes(e.fecha)))];

  return (
    <>
      {/* Filtro de categorías */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory("todos")}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold border transition-colors",
            activeCategory === "todos"
              ? "bg-foreground text-background border-foreground"
              : "bg-transparent text-muted-foreground border-border hover:border-foreground/40",
          )}
        >
          Todos
        </button>
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(activeCategory === cat ? "todos" : cat)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold border transition-colors",
              activeCategory === cat
                ? cn(CATEGORIA_EVENTO_COLOR[cat], "border-transparent")
                : "bg-transparent text-muted-foreground border-border hover:border-foreground/40",
            )}
          >
            {CATEGORIA_EVENTO_LABEL[cat]}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-muted-foreground">
          No hay eventos en esta categoría todavía.
        </p>
      )}

      {/* Destacados */}
      {destacados.length > 0 && (
        <>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            No te pierdas
          </h2>
          <ul className="mb-10 grid gap-4 sm:grid-cols-2">
            {destacados.map((ev) => (
              <li key={ev.id}>
                <Link href={`/comunidad/eventos/${ev.slug}`} className="group block h-full">
                  <Card className="h-full border-emerald-200 dark:border-emerald-900/40 transition-shadow group-hover:shadow-md">
                    <CardHeader className="pb-2">
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          className={cn("border-0 text-[10px]", CATEGORIA_EVENTO_COLOR[ev.categoria])}
                        >
                          {CATEGORIA_EVENTO_LABEL[ev.categoria]}
                        </Badge>
                        {ev.precio === "gratuito" ? (
                          <Badge className="border-0 bg-emerald-100 text-[10px] text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
                            Gratuito
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px]">
                            {ev.precio}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-base leading-snug group-hover:text-brand-green dark:group-hover:text-brand-gold transition-colors">
                        {ev.titulo}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-2 text-sm text-muted-foreground">{ev.descripcion}</p>
                      <div className="mt-3 flex flex-col gap-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <CalendarDays className="size-3.5 shrink-0 text-emerald-600" />
                          <span className="capitalize">{formatFecha(ev.fecha)}</span>
                          {ev.horaInicio && (
                            <span>
                              · {ev.horaInicio}
                              {ev.horaFin ? `–${ev.horaFin}` : ""}h
                            </span>
                          )}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="size-3.5 shrink-0 text-emerald-600" />
                          {ev.ciudad !== "Online" ? `${ev.lugar} · ${ev.ciudad}` : "Online"}
                        </span>
                        {ev.aforo && (
                          <span className="flex items-center gap-1.5">
                            <Users className="size-3.5 shrink-0" />
                            Aforo: {ev.aforo.toLocaleString("es-ES")} personas
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Listado por mes */}
      {sorted.length > 0 && (
        <>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {destacados.length > 0 ? "Todos los eventos" : "Eventos"}
          </h2>
          <div className="flex flex-col gap-8">
            {meses.map((mes) => {
              const eventosDelMes = sorted.filter((e) => getMes(e.fecha) === mes);
              return (
                <div key={mes}>
                  <h3 className="mb-3 text-xs font-semibold capitalize text-muted-foreground">
                    {formatMes(mes)}
                  </h3>
                  <ul className="flex flex-col divide-y divide-border rounded-lg border border-border">
                    {eventosDelMes.map((ev) => (
                      <li key={ev.id}>
                        <Link
                          href={`/comunidad/eventos/${ev.slug}`}
                          className="group flex gap-4 px-4 py-4 hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex w-12 shrink-0 flex-col items-center rounded-lg bg-muted/50 py-2 text-center">
                            <span className="text-xs text-muted-foreground">
                              {new Date(ev.fecha).toLocaleDateString("es-ES", { month: "short" })}
                            </span>
                            <span className="text-xl font-bold leading-none">
                              {new Date(ev.fecha).getDate()}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge
                                className={cn(
                                  "border-0 text-[10px]",
                                  CATEGORIA_EVENTO_COLOR[ev.categoria],
                                )}
                              >
                                {CATEGORIA_EVENTO_LABEL[ev.categoria]}
                              </Badge>
                              {ev.precio === "gratuito" ? (
                                <span className="text-[10px] font-medium text-emerald-600">
                                  Gratuito
                                </span>
                              ) : (
                                <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                                  <Euro className="size-3" />
                                  {ev.precio}
                                </span>
                              )}
                            </div>
                            <h4 className="mt-0.5 font-semibold leading-snug group-hover:text-brand-green dark:group-hover:text-brand-gold transition-colors">
                              {ev.titulo}
                            </h4>
                            <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
                              {ev.descripcion}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="size-3" />
                                {ev.ciudad !== "Online" ? ev.ciudad : "Online"}
                              </span>
                              {ev.horaInicio && (
                                <span className="flex items-center gap-1">
                                  <CalendarDays className="size-3" />
                                  {ev.horaInicio}
                                  {ev.horaFin ? `–${ev.horaFin}` : ""}h
                                </span>
                              )}
                              <span>Por {ev.organizador}</span>
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
