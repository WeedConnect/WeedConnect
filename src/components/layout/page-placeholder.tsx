import { Construction } from "lucide-react";

export function PagePlaceholder({
  title,
  description,
  status = "Próximamente",
}: {
  title: string;
  description: string;
  status?: string;
}) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{description}</p>
      <div className="mt-8 flex items-center gap-3 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-6 text-sm text-muted-foreground">
        <Construction className="size-5 shrink-0" aria-hidden />
        <span>
          <strong className="text-foreground">{status}.</strong> Esta sección está en el roadmap.
          Consulta el <code className="rounded bg-muted px-1 py-0.5 text-xs">BACKLOG.md</code> del
          repo para ver el orden de implementación.
        </span>
      </div>
    </section>
  );
}
