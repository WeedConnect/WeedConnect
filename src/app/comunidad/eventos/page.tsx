import type { Metadata } from "next";
import { MOCK_EVENTOS } from "@/data/eventos";
import { EventosBrowser } from "./eventos-browser";

export const metadata: Metadata = {
  title: "Eventos y ferias",
  description: "Calendario de ferias, talleres, ponencias y quedadas de la comunidad cannábica.",
};

export default function EventosPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Eventos y ferias</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Ferias del cáñamo, talleres de cultivo, ponencias y quedadas de la comunidad en España.
        </p>
      </header>

      <EventosBrowser eventos={MOCK_EVENTOS} />

      <p className="mt-10 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3 text-center text-sm text-muted-foreground">
        ¿Organizas un evento? Próximamente podrás publicarlo directamente desde tu perfil.
      </p>
    </section>
  );
}
