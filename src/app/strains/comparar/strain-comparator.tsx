"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { X, Plus, ArrowRight, Leaf, Search } from "lucide-react";
import type { Strain } from "@/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const MAX_STRAINS = 3;

const TYPE_LABELS: Record<string, string> = {
  indica: "Índica",
  sativa: "Sativa",
  hybrid: "Híbrida",
};

const TYPE_COLORS: Record<string, string> = {
  indica:
    "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800/40",
  sativa:
    "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/40",
  hybrid:
    "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800/40",
};

const TYPE_BAR_COLORS: Record<string, string> = {
  indica: "bg-purple-500",
  sativa: "bg-amber-500",
  hybrid: "bg-emerald-500",
};

interface Props {
  strains: Strain[];
}

export function StrainComparator({ strains }: Props) {
  const [selected, setSelected] = useState<Strain[]>([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = strains.filter(
    (s) =>
      !selected.some((sel) => sel.id === s.id) &&
      s.name.toLowerCase().includes(query.toLowerCase()),
  );

  function add(strain: Strain) {
    if (selected.length >= MAX_STRAINS) return;
    setSelected((prev) => [...prev, strain]);
    setQuery("");
    setOpen(false);
    inputRef.current?.blur();
  }

  function remove(id: string) {
    setSelected((prev) => prev.filter((s) => s.id !== id));
  }

  function clear() {
    setSelected([]);
    setQuery("");
  }

  const canAdd = selected.length < MAX_STRAINS;

  // Collect all unique effects and flavors for comparison highlighting
  const allEffects = [...new Set(selected.flatMap((s) => s.effects))];
  const allFlavors = [...new Set(selected.flatMap((s) => s.flavors))];
  const sharedEffects = allEffects.filter((e) =>
    selected.length > 1 && selected.every((s) => s.effects.includes(e)),
  );
  const sharedFlavors = allFlavors.filter((f) =>
    selected.length > 1 && selected.every((s) => s.flavors.includes(f)),
  );

  return (
    <div className="space-y-8">
      {/* Buscador / selector */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {canAdd && (
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
              onFocus={() => setOpen(true)}
              onBlur={() => setTimeout(() => setOpen(false), 150)}
              placeholder={`Añadir strain${selected.length > 0 ? ` (${selected.length}/${MAX_STRAINS})` : ""}…`}
              className="w-full rounded-xl border border-border bg-background pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-green/40 dark:focus:ring-brand-gold/40"
            />
            {open && filtered.length > 0 && (
              <ul className="absolute z-20 mt-1 w-full rounded-xl border border-border bg-popover shadow-lg overflow-hidden max-h-64 overflow-y-auto">
                {filtered.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onMouseDown={() => add(s)}
                      className="flex items-center gap-3 w-full px-3 py-2.5 text-left text-sm hover:bg-muted/60 transition-colors"
                    >
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold border",
                          TYPE_COLORS[s.type],
                        )}
                      >
                        {TYPE_LABELS[s.type]}
                      </span>
                      <span className="font-medium text-foreground">{s.name}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        THC {s.thcPct ?? "?"}%
                      </span>
                    </button>
                  </li>
                ))}
                {filtered.length === 0 && query && (
                  <li className="px-3 py-3 text-sm text-muted-foreground text-center">
                    Sin resultados para &ldquo;{query}&rdquo;
                  </li>
                )}
              </ul>
            )}
          </div>
        )}

        {selected.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clear} className="text-muted-foreground hover:text-foreground shrink-0">
            <X className="size-3.5 mr-1" /> Limpiar
          </Button>
        )}

        {selected.length === MAX_STRAINS && (
          <p className="text-xs text-muted-foreground">
            Máximo {MAX_STRAINS} strains para comparar.
          </p>
        )}
      </div>

      {/* Estado vacío */}
      {selected.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <div className="rounded-full bg-muted/50 p-5">
            <Leaf className="size-10 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Empieza añadiendo strains</p>
            <p className="text-sm text-muted-foreground mt-1">
              Busca y selecciona hasta {MAX_STRAINS} variedades para comparar lado a lado.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center max-w-sm">
            {strains.slice(0, 6).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => add(s)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-all hover:-translate-y-0.5 hover:shadow-sm",
                  TYPE_COLORS[s.type],
                )}
              >
                <Plus className="size-3" /> {s.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tabla de comparación */}
      {selected.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[480px] border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="w-36 px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Característica
                </th>
                {selected.map((s) => (
                  <th key={s.id} className="px-4 py-3 text-left">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-foreground leading-tight">{s.name}</p>
                        <span
                          className={cn(
                            "inline-block rounded-full px-2 py-0.5 text-[10px] font-bold border",
                            TYPE_COLORS[s.type],
                          )}
                        >
                          {TYPE_LABELS[s.type]}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(s.id)}
                        className="shrink-0 rounded-full p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        aria-label={`Quitar ${s.name}`}
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  </th>
                ))}
                {/* Columnas vacías placeholder */}
                {Array.from({ length: MAX_STRAINS - selected.length }).map((_, i) => (
                  <th key={`empty-${i}`} className="px-4 py-3 text-left opacity-40">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => inputRef.current?.focus()}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-brand-green/50 hover:text-foreground transition-colors"
                      >
                        <Plus className="size-3" /> Añadir strain
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {/* THC */}
              <Row label="THC">
                {selected.map((s) => {
                  const maxTHC = Math.max(...selected.map((x) => x.thcPct ?? 0));
                  const pct = s.thcPct ?? 0;
                  const isTop = pct === maxTHC && selected.length > 1;
                  return (
                    <td key={s.id} className="px-4 py-4 align-top">
                      <div className="space-y-1.5">
                        <span className={cn("text-lg font-extrabold tabular-nums", isTop && "text-amber-600 dark:text-amber-400")}>
                          {s.thcPct != null ? `${s.thcPct}%` : "N/D"}
                        </span>
                        {isTop && <span className="ml-1 text-[10px] text-amber-600 dark:text-amber-400 font-bold">↑ máx</span>}
                        <div className="h-1.5 w-full max-w-[120px] rounded-full bg-muted overflow-hidden">
                          <div
                            className={cn("h-full rounded-full", TYPE_BAR_COLORS[s.type])}
                            style={{ width: `${Math.min((pct / 30) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  );
                })}
                <EmptyCells count={MAX_STRAINS - selected.length} />
              </Row>

              {/* CBD */}
              <Row label="CBD">
                {selected.map((s) => {
                  const maxCBD = Math.max(...selected.map((x) => x.cbdPct ?? 0));
                  const pct = s.cbdPct ?? 0;
                  const isTop = pct === maxCBD && selected.length > 1;
                  return (
                    <td key={s.id} className="px-4 py-4 align-top">
                      <div className="space-y-1.5">
                        <span className={cn("text-lg font-extrabold tabular-nums", isTop && pct > 1 && "text-sky-600 dark:text-sky-400")}>
                          {s.cbdPct != null ? `${s.cbdPct}%` : "N/D"}
                        </span>
                        {isTop && pct > 1 && <span className="ml-1 text-[10px] text-sky-600 dark:text-sky-400 font-bold">↑ máx</span>}
                        <div className="h-1.5 w-full max-w-[120px] rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-sky-400"
                            style={{ width: `${Math.min((pct / 20) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  );
                })}
                <EmptyCells count={MAX_STRAINS - selected.length} />
              </Row>

              {/* Efectos */}
              <Row label="Efectos">
                {selected.map((s) => (
                  <td key={s.id} className="px-4 py-4 align-top">
                    <div className="flex flex-wrap gap-1.5">
                      {s.effects.map((e) => (
                        <Badge
                          key={e}
                          variant="secondary"
                          className={cn(
                            "text-[10px] capitalize font-medium",
                            sharedEffects.includes(e) &&
                              "ring-1 ring-brand-green/50 dark:ring-brand-gold/50 bg-brand-green/10 dark:bg-brand-gold/10 text-brand-green dark:text-brand-gold",
                          )}
                        >
                          {e}
                        </Badge>
                      ))}
                    </div>
                  </td>
                ))}
                <EmptyCells count={MAX_STRAINS - selected.length} />
              </Row>

              {/* Aromas */}
              <Row label="Aromas">
                {selected.map((s) => (
                  <td key={s.id} className="px-4 py-4 align-top">
                    <div className="flex flex-wrap gap-1.5">
                      {s.flavors.map((f) => (
                        <Badge
                          key={f}
                          variant="outline"
                          className={cn(
                            "text-[10px] capitalize",
                            sharedFlavors.includes(f) &&
                              "ring-1 ring-brand-green/50 dark:ring-brand-gold/50 bg-brand-green/10 dark:bg-brand-gold/10 text-brand-green dark:text-brand-gold",
                          )}
                        >
                          {f}
                        </Badge>
                      ))}
                    </div>
                  </td>
                ))}
                <EmptyCells count={MAX_STRAINS - selected.length} />
              </Row>

              {/* Descripción */}
              <Row label="Descripción">
                {selected.map((s) => (
                  <td key={s.id} className="px-4 py-4 align-top">
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">
                      {s.description}
                    </p>
                    <Link
                      href={`/strains/${s.slug}`}
                      className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-green dark:text-brand-gold hover:underline"
                    >
                      Ver ficha completa <ArrowRight className="size-3" />
                    </Link>
                  </td>
                ))}
                <EmptyCells count={MAX_STRAINS - selected.length} />
              </Row>
            </tbody>
          </table>
        </div>
      )}

      {/* Leyenda cuando hay 2+ strains */}
      {selected.length >= 2 && (sharedEffects.length > 0 || sharedFlavors.length > 0) && (
        <div className="rounded-xl border border-brand-green/20 dark:border-brand-gold/20 bg-brand-green/5 dark:bg-brand-gold/5 px-4 py-3">
          <p className="text-xs font-semibold text-brand-green dark:text-brand-gold mb-2">
            Características en común:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {sharedEffects.map((e) => (
              <Badge key={e} variant="secondary" className="text-[10px] capitalize">
                {e}
              </Badge>
            ))}
            {sharedFlavors.map((f) => (
              <Badge key={f} variant="outline" className="text-[10px] capitalize">
                {f}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <p className="rounded-md border border-amber-300/60 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-700/40 dark:bg-amber-950/40 dark:text-amber-200">
        ⚠ La información de THC/CBD mostrada es orientativa. Los porcentajes pueden variar según el lote,
        las condiciones de cultivo y el análisis de laboratorio. Esta herramienta es exclusivamente informativa.
      </p>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr className="hover:bg-muted/20 transition-colors">
      <td className="px-4 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider align-top whitespace-nowrap">
        {label}
      </td>
      {children}
    </tr>
  );
}

function EmptyCells({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <td key={i} className="px-4 py-4 bg-muted/10" />
      ))}
    </>
  );
}
