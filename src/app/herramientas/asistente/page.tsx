import type { Metadata } from "next";
import { AsistenteChat } from "./chat";

export const metadata: Metadata = {
  title: "Asistente IA — WeedConnect",
  description:
    "Pregunta al asistente sobre cultivo, strains, legislación y reducción de daños. Información orientativa.",
};

export default function AsistentePage() {
  const available = !!process.env.ANTHROPIC_API_KEY;

  return (
    <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <PageHeader className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Asistente cannábico</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Cultivo, strains, ciencia, legislación y reducción de daños. Información orientativa,
          no asesoramiento médico ni jurídico.
        </p>
      </PageHeader>
      <AsistenteChat available={available} />
    </section>
  );
}

const PageHeader = "header";
