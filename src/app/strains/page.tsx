import type { Metadata } from "next";
import { StrainsBrowser } from "./strains-browser";
import { getStrains } from "@/lib/strains";

// Asegura que se consulten datos frescos en cada solicitud
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catálogo de strains",
  description: "Explora variedades de cannabis: indica, sativa, híbridos. THC, CBD, efectos.",
  openGraph: {
    title: "Catálogo de strains · WeedConnect",
    description: "Explora variedades de cannabis: indica, sativa, híbridos. THC, CBD, efectos.",
    images: [{ url: `/api/og?title=${encodeURIComponent("Catálogo de strains")}&description=${encodeURIComponent("Indica, sativa, híbridos. THC, CBD, efectos y recomendaciones de la comunidad.")}`, width: 1200, height: 630 }],
  },
};

const PageHeader = "header";

export default async function StrainsPage() {
  const strains = await getStrains();

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <PageHeader className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Catálogo de strains</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Explora variedades por tipo, efectos y composición. Filtra y compara para encontrar la
          que mejor encaja con lo que buscas.
        </p>
      </PageHeader>
      <StrainsBrowser strains={strains} />
    </section>
  );
}

