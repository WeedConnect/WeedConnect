import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, MapPin, Plus } from "lucide-react";
import { getMapLocations } from "@/lib/map";
import { MapView } from "./map-view";

export const metadata: Metadata = {
  title: "Mapa WeedConnect — Dispensarios, Asociaciones, Spots Chill",
  description:
    "Descubre dispensarios legales, asociaciones cannábicas, tiendas CBD, chill spots y sitios recomendados en Europa y Estados Unidos. Información orientativa de la comunidad.",
  openGraph: {
    title: "Mapa WeedConnect · Descubre lugares",
    description:
      "Dispensarios, asociaciones, CBD shops, chill spots y munchies. Información orientativa de la comunidad WeedConnect.",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Mapa WeedConnect")}&description=${encodeURIComponent("Dispensarios, asociaciones, spots chill y comida. Comunidad cannábica.")}`,
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default async function MapaPage() {
  const locations = await getMapLocations();

const PageHeader = "header";

  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      {/* ── Header ── */}
      <PageHeader className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-green dark:text-emerald-400">
          <MapPin className="size-3.5" />
          Mapa WeedConnect
        </div>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl text-foreground leading-tight">
          Descubre lugares cerca de ti
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground leading-relaxed">
          Dispensarios legales, asociaciones cannábicas, tiendas CBD, chill spots, comida y sitios
          recomendados por la comunidad en Europa y Estados Unidos.
        </p>
        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
          Sin compraventa · Sin contactos · Solo información orientativa y recomendaciones.
        </p>
      </PageHeader>

      {/* ── Legal banner ── */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3.5 dark:border-amber-800/40 dark:bg-amber-950/20">
        <ShieldCheck className="size-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
        <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
          <span className="font-bold">Aviso legal:</span> WeedConnect muestra información orientativa
          sobre lugares públicos, negocios legales, asociaciones, spots y recomendaciones de la
          comunidad. No permite compraventa, contactos, precios, delivery ni intermediación.{" "}
          <span className="font-semibold">
            Verifica siempre la normativa local antes de visitar cualquier lugar.
          </span>
        </p>
      </div>

      {/* ── Map ── */}
      <MapView locations={locations} />

      {/* ── Info boxes ── */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-indigo-200/60 bg-indigo-50/60 px-4 py-3 text-xs dark:border-indigo-800/40 dark:bg-indigo-950/20">
          <p className="font-bold text-indigo-900 dark:text-indigo-300 mb-1">
            🛡️ Asociaciones / Clubs
          </p>
          <p className="text-indigo-800 dark:text-indigo-300/80 leading-relaxed">
            Son entidades privadas. El acceso requiere ser socio registrado y mayor de edad.
            Información orientativa — no garantiza acceso.
          </p>
        </div>
        <div className="rounded-xl border border-emerald-200/60 bg-emerald-50/60 px-4 py-3 text-xs dark:border-emerald-800/40 dark:bg-emerald-950/20">
          <p className="font-bold text-emerald-900 dark:text-emerald-300 mb-1">
            🏪 Dispensarios
          </p>
          <p className="text-emerald-800 dark:text-emerald-300/80 leading-relaxed">
            Negocios licenciados principalmente en USA. La regulación varía por estado.
            Verifica siempre la legalidad y requisitos en tu zona.
          </p>
        </div>
        <div className="rounded-xl border border-green-200/60 bg-green-50/60 px-4 py-3 text-xs dark:border-green-800/40 dark:bg-green-950/20">
          <p className="font-bold text-green-900 dark:text-green-300 mb-1">
            🌳 Spots chill y comida
          </p>
          <p className="text-green-800 dark:text-green-300/80 leading-relaxed">
            Parques, miradores y restaurantes de libre acceso. Respeta el entorno, a los vecinos y la normativa del espacio.
          </p>
        </div>
      </div>

      {/* ── CTA Proponer lugar ── */}
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-10 text-center">
        <p className="font-bold text-foreground">¿Conoces un lugar que debería aparecer?</p>
        <p className="text-sm text-muted-foreground max-w-sm">
          La comunidad construye el mapa. Si conoces un spot chill, dispensario legal o CBD shop
          que no está aquí, proponlo.
        </p>
        <div className="flex items-center gap-2">
          <Link
            href="/comunidad/foro"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold hover:bg-muted transition-colors"
          >
            <Plus className="size-3.5" />
            Proponer en el foro
          </Link>
          <span className="text-xs text-muted-foreground">(formulario directo — próximamente)</span>
        </div>
      </div>
    </section>
  );
}
