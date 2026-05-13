import type { Metadata } from "next";
import { Clock, ChefHat } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MOCK_RECETAS,
  CATEGORIA_LABEL,
  DIFICULTAD_LABEL,
  DIFICULTAD_COLOR,
  type RecetaCategoria,
} from "@/data/recetas";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Munchies y recetas",
  description: "Recomendaciones gastronómicas para el antojo: snacks, recetas rápidas y bebidas.",
};

const CATEGORIAS: RecetaCategoria[] = ["snack", "plato", "postre", "bebida"];

export default function MunchiesPage() {
  const recetasPorCategoria = CATEGORIAS.map((cat) => ({
    cat,
    recetas: MOCK_RECETAS.filter((r) => r.categoria === cat),
  })).filter((g) => g.recetas.length > 0);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Munchies y recetas</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Snacks, platos rápidos y bebidas para el antojo. Sin cannabutter — solo recetas
          deliciosas que puedes tener listas en minutos.
        </p>
      </header>

      <div className="flex flex-col gap-10">
        {recetasPorCategoria.map(({ cat, recetas }) => (
          <div key={cat}>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <ChefHat className="size-5 text-emerald-600" aria-hidden />
              {CATEGORIA_LABEL[cat]}s
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recetas.map((r) => (
                <li key={r.id}>
                  <Card className="h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <span className="text-xl" aria-hidden>
                            {r.emoji}
                          </span>
                          {r.nombre}
                        </CardTitle>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          className={cn(
                            "border-0 text-[10px]",
                            DIFICULTAD_COLOR[r.dificultad],
                          )}
                        >
                          {DIFICULTAD_LABEL[r.dificultad]}
                        </Badge>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="size-3" />
                          {r.tiempoMin < 60
                            ? `${r.tiempoMin} min`
                            : `${Math.floor(r.tiempoMin / 60)}h ${r.tiempoMin % 60 > 0 ? `${r.tiempoMin % 60}min` : ""}`}
                        </span>
                        {r.veganista && (
                          <span className="text-[10px] text-emerald-600 font-medium">🌿 Vegano</span>
                        )}
                        {r.sinGluten && (
                          <span className="text-[10px] text-amber-600 font-medium">Sin gluten</span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="line-clamp-3 text-sm">
                        {r.descripcion}
                      </CardDescription>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {r.ingredientesPrincipales.slice(0, 4).map((ing) => (
                          <span
                            key={ing}
                            className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                          >
                            {ing}
                          </span>
                        ))}
                        {r.ingredientesPrincipales.length > 4 && (
                          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                            +{r.ingredientesPrincipales.length - 4} más
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-10 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3 text-center text-sm text-muted-foreground">
        Próximamente: recetas enviadas por la comunidad con fotos, valoraciones y colecciones personales.
      </p>
    </section>
  );
}
