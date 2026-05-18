import type { Metadata } from "next";
import { MOCK_NOTICIAS } from "@/data/noticias";
import { NoticiasBrowser } from "./noticias-browser";

export const metadata: Metadata = {
  title: "Noticias",
  description: "Actualidad cannábica: leyes, ciencia, cultivo y comunidad en España y Europa.",
};

export default function NoticiasPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Noticias</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Actualidad cannábica de España y Europa: cambios legales, investigación científica,
          cultivo y noticias de la comunidad.
        </p>
      </header>

      <NoticiasBrowser noticias={MOCK_NOTICIAS} />

      <div className="mt-8 flex flex-col gap-3">
        <p className="rounded-lg border border-amber-200 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/10 px-4 py-3 text-xs text-foreground/80 leading-relaxed">
          <strong className="text-amber-700 dark:text-amber-400">Aviso:</strong> Contenido
          informativo. Verifica siempre las fuentes oficiales para temas legales o sanitarios.
          WeedConnect no es un medio de comunicación y no garantiza la veracidad de las noticias
          de terceros citadas.
        </p>
        <p className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3 text-center text-sm text-muted-foreground">
          Próximamente: alertas personalizadas de noticias por región y temática.
        </p>
      </div>
    </section>
  );
}
