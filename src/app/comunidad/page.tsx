import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquare, Calendar, BookOpen, Mic, ChefHat, Users, Radio } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Comunidad",
  description: "Foro, eventos, blog, podcast, recetas y grupos temáticos.",
  openGraph: {
    title: "Comunidad · WeedConnect",
    description: "Foro de cannabis, eventos, blog colaborativo, podcast, recetas y grupos temáticos.",
    images: [{ url: `/api/og?title=${encodeURIComponent("Comunidad WeedConnect")}&description=${encodeURIComponent("Foro, eventos, blog colaborativo, podcast y grupos temáticos.")}`, width: 1200, height: 630 }],
  },
};

const SECTIONS = [
  {
    href: "/comunidad/chat",
    title: "Chat en vivo",
    description: "Sala de chat grupal en tiempo real. Conecta con la comunidad ahora mismo.",
    icon: Radio,
  },
  {
    href: "/comunidad/foro",
    title: "Foro",
    description: "Discusiones por categorías: cultivo, legal, medicinal, variedades.",
    icon: MessageSquare,
  },
  {
    href: "/comunidad/eventos",
    title: "Eventos y ferias",
    description: "Calendario de eventos cannábicos en tu zona.",
    icon: Calendar,
  },
  {
    href: "/comunidad/blog",
    title: "Blog colaborativo",
    description: "Historias y experiencias enviadas por la comunidad.",
    icon: BookOpen,
  },
  {
    href: "/comunidad/podcast",
    title: "Podcast",
    description: "Entrevistas a expertos, productores y consumidores.",
    icon: Mic,
  },
  {
    href: "/comunidad/recetas",
    title: "Recetas",
    description: "Cocina cannábica con valoraciones de la comunidad.",
    icon: ChefHat,
  },
  {
    href: "/comunidad/grupos",
    title: "Grupos temáticos",
    description: "Espacios privados: cultivo interior, medicinal, recreativo.",
    icon: Users,
  },
];

const PageHeader = "header";

export default function ComunidadPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <PageHeader className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Comunidad</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Todo el espacio social de WeedConnect en un sitio.
        </p>
      </PageHeader>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          return (
            <li key={s.href}>
              <Link href={s.href} className="block h-full">
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardHeader>
                    <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                      <Icon className="size-5" />
                    </div>
                    <CardTitle className="text-lg">{s.title}</CardTitle>
                    <CardDescription>{s.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
