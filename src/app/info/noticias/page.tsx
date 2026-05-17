import type { Metadata } from "next";
import { CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MOCK_NOTICIAS,
  CATEGORIA_LABEL,
  CATEGORIA_COLOR,
  type NoticiaCategoria,
} from "@/data/noticias";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Noticias",
  description: "Actualidad cannábica: leyes, ciencia, cultivo y comunidad en España y Europa.",
};

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const CATEGORIAS = Object.keys(CATEGORIA_LABEL) as NoticiaCategoria[];

export default function NoticiasPage() {
  const destacadas = MOCK_NOTICIAS.filter((n) => n.destacada);
  const resto = MOCK_NOTICIAS.filter((n) => !n.destacada);

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Noticias</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Actualidad cannábica de España y Europa: cambios legales, investigación científica,
          cultivo y noticias de la comunidad.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {CATEGORIAS.map((cat) => (
            <Badge key={cat} className={cn("border-0 text-xs", CATEGORIA_COLOR[cat])}>
              {CATEGORIA_LABEL[cat]}
            </Badge>
          ))}
        </div>
      </header>

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

      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Más noticias
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

      <p className="mt-8 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3 text-center text-sm text-muted-foreground">
        Próximamente: alertas personalizadas de noticias por región y temática.
      </p>
    </section>
  );
}
