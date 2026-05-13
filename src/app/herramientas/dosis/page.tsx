import type { Metadata } from "next";
import { DoseCalculator } from "./dose-calculator";

export const metadata: Metadata = {
  title: "Calculadora de dosis",
  description:
    "Calcula los miligramos de THC por porción de comestibles o extracciones según la potencia de tu material.",
};

export default function DosisPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Calculadora de dosis</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Estima los mg de THC por porción al cocinar comestibles o preparar extracciones. Útil
          para dosificar de forma consciente y reducir riesgos.
        </p>
      </header>
      <DoseCalculator />
    </section>
  );
}
