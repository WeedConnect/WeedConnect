import type { Metadata } from "next";
import { Headphones, Clock, Mic, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_EPISODIOS } from "@/data/podcast";

export const metadata: Metadata = {
  title: "Podcast WeedConnect",
  description:
    "Entrevistas a expertos, cultivadores y activistas. Audio embebido y notas del programa.",
};

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDuracion(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h}h ${m}min` : `${m} min`;
}

export default function PodcastPage() {
  const sorted = [...MOCK_EPISODIOS].sort((a, b) => b.numero - a.numero);
  const destacados = sorted.filter((e) => e.destacado);
  const resto = sorted.filter((e) => !e.destacado);

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-emerald-100 p-2 dark:bg-emerald-900/40">
            <Headphones className="size-6 text-emerald-700 dark:text-emerald-300" aria-hidden />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Podcast</h1>
            <p className="text-sm text-muted-foreground">WeedConnect · Temporada 1</p>
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Conversaciones en profundidad con expertos en legislación cannábica, cultivadores,
          investigadores y activistas. Nuevos episodios cada dos semanas.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1">
            <ExternalLink className="size-3.5" /> Disponible en Spotify e iVoox
          </span>
        </div>
      </header>

      {destacados.length > 0 && (
        <>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Episodios destacados
          </h2>
          <ul className="mb-8 flex flex-col gap-4">
            {destacados.map((ep) => (
              <li key={ep.id}>
                <Card className="border-emerald-200 dark:border-emerald-900/40">
                  <CardHeader className="pb-2">
                    <div className="flex items-start gap-4">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/40">
                        <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                          #{ep.numero}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base leading-snug">{ep.titulo}</CardTitle>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          {ep.invitado && (
                            <span className="flex items-center gap-1">
                              <Mic className="size-3" />
                              {ep.invitado}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" />
                            {formatDuracion(ep.duracionMin)}
                          </span>
                          <span>{formatFecha(ep.fecha)}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{ep.descripcion}</p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {ep.temas.map((tema) => (
                        <span
                          key={tema}
                          className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                        >
                          {tema}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 flex gap-2">
                      {ep.plataformas.spotify && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#1DB954]/10 px-3 py-1 text-[11px] font-medium text-[#1DB954]">
                          Spotify
                        </span>
                      )}
                      {ep.plataformas.ivoox && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-[11px] font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                          iVoox
                        </span>
                      )}
                      {ep.plataformas.youtube && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-[11px] font-medium text-red-700 dark:bg-red-900/40 dark:text-red-300">
                          YouTube
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
        Todos los episodios
      </h2>
      <ul className="flex flex-col divide-y divide-border rounded-lg border border-border">
        {resto.map((ep) => (
          <li key={ep.id} className="flex items-start gap-4 px-4 py-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted font-bold text-sm">
              #{ep.numero}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold leading-snug">{ep.titulo}</h3>
              <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">{ep.descripcion}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                {ep.invitado && (
                  <span className="flex items-center gap-1">
                    <Mic className="size-3" />
                    {ep.invitado}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {formatDuracion(ep.duracionMin)}
                </span>
                <span>{formatFecha(ep.fecha)}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-8 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3 text-center text-sm text-muted-foreground">
        Suscríbete en tu plataforma de podcast favorita para no perderte ningún episodio.
        Próximamente: player integrado en la web.
      </p>
    </section>
  );
}
