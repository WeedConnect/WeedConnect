import type { Metadata } from "next";
import Link from "next/link";
import { Scale, GraduationCap, Newspaper, Film, Pizza } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Información",
  description: "Educación, legalidad, noticias y recomendaciones culturales.",
  openGraph: {
    title: "Información · WeedConnect",
    description: "Guías educativas, marco legal por CCAA, noticias del sector y recomendaciones culturales.",
    images: [{ url: `/api/og?title=${encodeURIComponent("Información Cannabis")}&description=${encodeURIComponent("Educación, marco legal, noticias del sector y cultura cannábica.")}`, width: 1200, height: 630 }],
  },
};

const SECTIONS = [
  {
    href: "/info/educacion",
    title: "Educación",
    description: "Guías de cultivo, anatomía de la planta, cannabinoides, terpenos…",
    icon: GraduationCap,
  },
  {
    href: "/info/legal",
    title: "Marco legal",
    description: "Normativa en España y Europa, derechos y deberes, jurisprudencia.",
    icon: Scale,
  },
  {
    href: "/info/noticias",
    title: "Noticias",
    description: "Actualidad cannábica con alertas legales personalizables.",
    icon: Newspaper,
  },
  {
    href: "/info/peliculas",
    title: "Pelis recomendadas",
    description: "Películas y series para acompañar una buena sesión.",
    icon: Film,
  },
  {
    href: "/info/munchies",
    title: "Munchies / Gules",
    description: "Snacks recomendados para los antojos posteriores.",
    icon: Pizza,
  },
];

const PageHeader = "header";

export default function InfoPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <PageHeader className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Información</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Conocimiento, contexto legal y recomendaciones culturales.
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
