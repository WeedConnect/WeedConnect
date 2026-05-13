import type { Metadata } from "next";
import { StrainsBrowser } from "./strains-browser";
import { getStrains } from "@/lib/strains";

// Asegura que se consulten datos frescos en cada solicitud
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catálogo de strains",
  description: "Explora variedades de cannabis: indica, sativa, híbridos. THC, CBD, efectos.",
};

export default async function StrainsPage() {
  const strains = await getStrains();

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Catálogo de strains</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Explora variedades por tipo, efectos y composición. Filtra y compara para encontrar la
          que mejor encaja con lo que buscas.
        </p>
      </header>
      <StrainsBrowser strains={strains} />
    </section>
  );
}

