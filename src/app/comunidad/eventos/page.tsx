import type { Metadata } from "next";
import { CalendarDays, MapPin, Users, Euro } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MOCK_EVENTOS,
  CATEGORIA_EVENTO_LABEL,
  CATEGORIA_EVENTO_COLOR,
} from "@/data/eventos";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Eventos y ferias",
  description: "Calendario de ferias, talleres, ponencias y quedadas de la comunidad cannábica.",
};

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatMes(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", { month: "long", year: "numeric" });
}

function getMes(iso: string) {
  return iso.slice(0, 7);
}

export default function EventosPage() {
  const sorted = [...MOCK_EVENTOS].sort(
    (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime(),
  );

  const meses = [...new Set(sorted.map((e) => getMes(e.fecha)))];

  const destacados = MOCK_EVENTOS.filter((e) => e.destacado);

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Eventos y ferias</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Ferias del cáñamo, talleres de cultivo, ponencias y quedadas de la comunidad en España.
        </p>
      </header>

      {destacados.length > 0 && (
        <>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            No te pierdas
          </h2>
          <ul className="mb-10 grid gap-4 sm:grid-cols-2">
            {destacados.map((ev) => (
              <li key={ev.id}>
                <Card className="h-full border-emerald-200 dark:border-emerald-900/40">
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
                    <CardTitle className="text-base leading-snug">{ev.titulo}</CardTitle>
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
                            {ev.horaFin ? `–${ev.horaFin}` : ""}
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
                          Aforo: {ev.aforo} personas
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </>
      )}

      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Todos los eventos
      </h2>
      <div className="flex flex-col gap-8">
        {meses.map((mes) => {
          const eventos = sorted.filter((e) => getMes(e.fecha) === mes);
          return (
            <div key={mes}>
              <h3 className="mb-3 text-xs font-semibold capitalize text-muted-foreground">
                {formatMes(mes + "-01")}
              </h3>
              <ul className="flex flex-col divide-y divide-border rounded-lg border border-border">
                {eventos.map((ev) => (
                  <li key={ev.id} className="flex gap-4 px-4 py-4">
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
                          <span className="text-[10px] font-medium text-emerald-600">Gratuito</span>
                        ) : (
                          <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                            <Euro className="size-3" />
                            {ev.precio}
                          </span>
                        )}
                      </div>
                      <h4 className="mt-0.5 font-semibold leading-snug">{ev.titulo}</h4>
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
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <p className="mt-10 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3 text-center text-sm text-muted-foreground">
        ¿Organizas un evento? Próximamente podrás publicarlo directamente desde tu perfil.
      </p>
    </section>
  );
}
