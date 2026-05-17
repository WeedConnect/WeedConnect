import type { Metadata } from "next";
import Link from "next/link";
import { Calculator, Sprout, Leaf, Bot } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Herramientas",
  description:
    "Calculadora de dosis, seguimiento de cultivo, asistente IA y catálogo de strains.",
  openGraph: {
    title: "Herramientas · WeedConnect",
    description: "Calculadora de dosis para comestibles, diario de cultivo y asistente IA especializado.",
    images: [{ url: `/api/og?title=${encodeURIComponent("Herramientas WeedConnect")}&description=${encodeURIComponent("Calculadora de dosis, grow tracker y asistente IA cannábico.")}`, width: 1200, height: 630 }],
  },
};

const TOOLS = [
  {
    href: "/herramientas/dosis",
    title: "Calculadora de dosis",
    description: "Estima los mg de THC por porción al cocinar comestibles o preparar extracciones.",
    icon: Calculator,
    status: "ready" as const,
  },
  {
    href: "/herramientas/cultivo",
    title: "Seguimiento de cultivo",
    description: "Diario de cultivos con riegos, nutrientes, fases y notas. Guarda en tu navegador.",
    icon: Sprout,
    status: "ready" as const,
  },
  {
    href: "/herramientas/asistente",
    title: "Asistente IA",
    description: "Pregunta sobre cultivo, strains, legislación y reducción de daños. Respuestas basadas en evidencia.",
    icon: Bot,
    status: "api" as const,
  },
  {
    href: "/strains",
    title: "Catálogo de strains",
    description: "Explora variedades por tipo, efectos, THC/CBD y aromas.",
    icon: Leaf,
    status: "ready" as const,
  },
];

const STATUS_BADGE: Record<string, React.ReactNode> = {
  ready: null,
  api: (
    <Badge className="border-0 bg-violet-100 text-[10px] text-violet-800 dark:bg-violet-900/40 dark:text-violet-200">
      Requiere API key
    </Badge>
  ),
  soon: (
    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
      próximamente
    </span>
  ),
};

export default function HerramientasPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Herramientas</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Utilidades prácticas para cultivadores y usuarios conscientes.
        </p>
      </header>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((t) => {
          const Icon = t.icon;
          return (
            <li key={t.href}>
              <Link href={t.href} className="block h-full">
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardHeader>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                        <Icon className="size-5" />
                      </div>
                      {STATUS_BADGE[t.status]}
                    </div>
                    <CardTitle className="text-lg">{t.title}</CardTitle>
                    <CardDescription>{t.description}</CardDescription>
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
