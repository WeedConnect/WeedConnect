import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Leaf } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStrains, getStrainBySlug } from "@/lib/strains";
import type { StrainType } from "@/types";
import { cn } from "@/lib/utils";

const TYPE_LABEL: Record<StrainType, string> = {
  indica: "Indica",
  sativa: "Sativa",
  hybrid: "Híbrido",
};
const TYPE_COLOR: Record<StrainType, string> = {
  indica: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200",
  sativa: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  hybrid: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
};

export async function generateStaticParams() {
  const strains = await getStrains();
  return strains.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const strain = await getStrainBySlug(slug);
  if (!strain) return { title: "Strain no encontrada" };
  return {
    title: strain.name,
    description: strain.description,
    openGraph: {
      title: `${strain.name} · WeedConnect`,
      description: strain.description,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(strain.name)}&description=${encodeURIComponent(strain.description)}`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function StrainPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const strain = await getStrainBySlug(slug);
  if (!strain) notFound();


  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link
        href="/strains"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Volver al catálogo
      </Link>

      <PageHeader className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight sm:text-4xl">
            <Leaf className="size-7 text-emerald-600" aria-hidden />
            {strain.name}
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">{strain.description}</p>
        </div>
        <Badge className={cn("border-0 text-sm", TYPE_COLOR[strain.type])}>
          {TYPE_LABEL[strain.type]}
        </Badge>
      </PageHeader>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Composición</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">THC</dt>
                <dd className="font-medium">{strain.thcPct ?? "—"}%</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">CBD</dt>
                <dd className="font-medium">{strain.cbdPct ?? "—"}%</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Aromas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              {strain.flavors.map((f) => (
                <span
                  key={f}
                  className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                >
                  {f}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Efectos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              {strain.effects.map((e) => (
                <span
                  key={e}
                  className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
                >
                  {e}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <p className="mt-8 rounded-md border border-amber-300/60 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-700/40 dark:bg-amber-950/40 dark:text-amber-200">
        ⚠ Información orientativa. Los efectos varían según la persona, dosis y vía de consumo.
        WeedConnect no fomenta el consumo: este contenido es educativo y de reducción de daños.
      </p>
    </section>
  );
}

const PageHeader = "header";
