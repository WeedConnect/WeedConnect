import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Users,
  Euro,
  Clock,
  ExternalLink,
  Mail,
  Building2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MOCK_EVENTOS,
  CATEGORIA_EVENTO_LABEL,
  CATEGORIA_EVENTO_COLOR,
} from "@/data/eventos";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return MOCK_EVENTOS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const ev = MOCK_EVENTOS.find((e) => e.slug === slug);
  if (!ev) return { title: "Evento no encontrado" };
  return {
    title: ev.titulo,
    description: ev.descripcion,
  };
}

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function renderContent(text: string) {
  return text.split("\n\n").map((block, i) => {
    if (block.startsWith("**") && block.endsWith("**")) {
      return (
        <h2 key={i} className="mt-8 mb-3 text-xl font-bold tracking-tight">
          {block.slice(2, -2)}
        </h2>
      );
    }
    const parts = block.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={i} className="leading-relaxed text-foreground/90">
        {parts.map((part, j) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={j}>{part.slice(2, -2)}</strong>
          ) : (
            part
          ),
        )}
      </p>
    );
  });
}

export default async function EventoDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const ev = MOCK_EVENTOS.find((e) => e.slug === slug);
  if (!ev) notFound();

  const related = MOCK_EVENTOS.filter(
    (e) => e.slug !== slug && e.categoria === ev.categoria,
  ).slice(0, 3);

  return (
    <article className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      {/* Volver */}
      <Link
        href="/comunidad/eventos"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="size-4" />
        Volver a eventos
      </Link>

      {/* Cabecera */}
      <PageHeader className="mb-8">
        <Badge className={cn("border-0 text-[10px] mb-3", CATEGORIA_EVENTO_COLOR[ev.categoria])}>
          {CATEGORIA_EVENTO_LABEL[ev.categoria]}
        </Badge>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl leading-tight">
          {ev.titulo}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground leading-relaxed">{ev.descripcion}</p>
      </PageHeader>

      {/* Info rápida */}
      <div className="rounded-xl border border-border bg-muted/20 px-5 py-4 mb-8 flex flex-col gap-3 text-sm">
        <div className="flex items-start gap-3">
          <CalendarDays className="size-4 shrink-0 mt-0.5 text-emerald-600" />
          <div>
            <span className="capitalize font-medium">{formatFecha(ev.fecha)}</span>
            {ev.fechaFin && ev.fechaFin !== ev.fecha && (
              <span className="text-muted-foreground">
                {" "}→ <span className="capitalize">{formatFecha(ev.fechaFin)}</span>
              </span>
            )}
            {ev.horaInicio && (
              <span className="ml-2 text-muted-foreground">
                · {ev.horaInicio}
                {ev.horaFin ? `–${ev.horaFin}` : ""}h
              </span>
            )}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="size-4 shrink-0 mt-0.5 text-emerald-600" />
          <div>
            <span className="font-medium">
              {ev.ciudad !== "Online" ? ev.lugar : "Online"}
            </span>
            {ev.direccion && (
              <p className="text-xs text-muted-foreground mt-0.5">{ev.direccion}</p>
            )}
            {ev.ciudad !== "Online" && (
              <p className="text-xs text-muted-foreground">{ev.ciudad}, {ev.pais}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Euro className="size-4 shrink-0 text-emerald-600" />
          <span>
            {ev.precio === "gratuito" ? (
              <span className="font-medium text-emerald-600">Gratuito</span>
            ) : (
              <span className="font-medium">{ev.precio}</span>
            )}
          </span>
        </div>

        {ev.aforo && (
          <div className="flex items-center gap-3">
            <Users className="size-4 shrink-0 text-emerald-600" />
            <span className="text-muted-foreground">
              Aforo máximo: <strong className="text-foreground">{ev.aforo.toLocaleString("es-ES")}</strong> personas
            </span>
          </div>
        )}

        {ev.horaInicio && ev.horaFin && (
          <div className="flex items-center gap-3">
            <Clock className="size-4 shrink-0 text-emerald-600" />
            <span className="text-muted-foreground">
              Duración aproximada:{" "}
              <strong className="text-foreground">
                {Math.round(
                  (new Date(`1970-01-01T${ev.horaFin}`).getTime() -
                    new Date(`1970-01-01T${ev.horaInicio}`).getTime()) /
                    3600000,
                )}{" "}
                horas
              </strong>
            </span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <Building2 className="size-4 shrink-0 text-emerald-600" />
          <span className="text-muted-foreground">
            Organiza: <strong className="text-foreground">{ev.organizador}</strong>
          </span>
        </div>
      </div>

      {/* CTA principal */}
      <div className="mb-8 flex flex-wrap gap-3">
        {ev.urlExterna ? (
          <a
            href={ev.urlExterna}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-green px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            <ExternalLink className="size-4" />
            Más información / Entradas
          </a>
        ) : (
          <button
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-green px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            disabled
          >
            Próximamente: reservar plaza
          </button>
        )}
        {ev.contacto && (
          <a
            href={`mailto:${ev.contacto}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted/40 transition-colors"
          >
            <Mail className="size-4" />
            Contactar
          </a>
        )}
      </div>

      <Separator className="mb-8" />

      {/* Contenido */}
      {ev.contenido ? (
        <div className="prose-custom space-y-4">{renderContent(ev.contenido)}</div>
      ) : (
        <div className="rounded-lg border border-dashed border-border bg-muted/20 px-6 py-10 text-center text-muted-foreground">
          <p className="text-sm">Los detalles completos de este evento estarán disponibles pronto.</p>
        </div>
      )}

      <Separator className="my-10" />

      {/* Eventos relacionados */}
      {related.length > 0 && (
        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Otros eventos de {CATEGORIA_EVENTO_LABEL[ev.categoria].toLowerCase()}
          </h2>
          <ul className="space-y-3">
            {related.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/comunidad/eventos/${r.slug}`}
                  className="group flex items-start gap-3 rounded-lg border border-border px-4 py-3 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex w-10 shrink-0 flex-col items-center rounded-lg bg-muted/50 py-1.5 text-center">
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(r.fecha).toLocaleDateString("es-ES", { month: "short" })}
                    </span>
                    <span className="text-base font-bold leading-none">
                      {new Date(r.fecha).getDate()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-snug group-hover:text-brand-green dark:group-hover:text-brand-gold transition-colors">
                      {r.titulo}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {r.ciudad} · {r.precio === "gratuito" ? "Gratuito" : r.precio}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

const PageHeader = "header";
