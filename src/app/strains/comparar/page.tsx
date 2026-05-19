import type { Metadata } from "next";
import { StrainComparator } from "./strain-comparator";
import { MOCK_STRAINS } from "@/data/strains";

export const metadata: Metadata = {
  title: "Comparador de Strains · WeedConnect",
  description: "Compara hasta 3 variedades de cannabis lado a lado: THC, CBD, efectos, aromas y más.",
};

export default function ComparadorPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <PageHeader className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-green dark:text-brand-gold mb-1">
          Herramienta
        </p>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl text-foreground">
          Comparador de Strains
        </h1>
        <p className="mt-2 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
          Selecciona hasta 3 variedades y compáralas lado a lado para encontrar la que mejor se adapta a lo que buscas.
        </p>
      </PageHeader>

      <StrainComparator strains={MOCK_STRAINS} />
    </div>
  );
}

const PageHeader = "header";
