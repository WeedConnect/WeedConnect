"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Leaf, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Strain, StrainType } from "@/types";
import { cn } from "@/lib/utils";
import { TerpeneWheel, TERPENES } from "./terpene-wheel";

function getDominantTerpenes(strain: Strain) {
  return TERPENES.filter((t) => {
    const hasFlavor = strain.flavors.some((f) => t.flavorsMapped.includes(f.toLowerCase()));
    const hasEffect = strain.effects.some((e) => t.effectsMapped.includes(e.toLowerCase()));
    return hasFlavor || hasEffect;
  });
}

const TYPE_LABEL: Record<StrainType, string> = {
  indica: "Indica",
  sativa: "Sativa",
  hybrid: "Híbrido",
};

const TYPE_COLOR: Record<StrainType, string> = {
  indica: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200",
  sativa: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  hybrid: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
};

const TYPES: (StrainType | "all")[] = ["all", "indica", "sativa", "hybrid"];

export function StrainsBrowser({ strains }: { strains: Strain[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<StrainType | "all">("all");
  const [selectedTerpeneId, setSelectedTerpeneId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return strains.filter((s) => {
      if (type !== "all" && s.type !== type) return false;

      // Filtro por Terpeno seleccionado en la rueda
      if (selectedTerpeneId) {
        const terpene = TERPENES.find((t) => t.id === selectedTerpeneId);
        if (terpene) {
          const matchesFlavor = s.flavors.some((f) => terpene.flavorsMapped.includes(f.toLowerCase()));
          const matchesEffect = s.effects.some((e) => terpene.effectsMapped.includes(e.toLowerCase()));
          if (!matchesFlavor && !matchesEffect) return false;
        }
      }

      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.flavors.some((f) => f.includes(q)) ||
        s.effects.some((e) => e.includes(q))
      );
    });
  }, [strains, query, type, selectedTerpeneId]);

  return (
    <div className="flex flex-col gap-6">
      {/* Rueda de Terpenos e Interactividad */}
      <TerpeneWheel selectedTerpeneId={selectedTerpeneId} onSelectTerpene={setSelectedTerpeneId} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, aroma o efecto…"
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                t === type
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-border bg-background text-muted-foreground hover:bg-muted",
              )}
            >
              {t === "all" ? "Todas" : TYPE_LABEL[t]}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
          No hay strains que coincidan con tu búsqueda.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <li key={s.id}>
              <Link href={`/strains/${s.slug}`} className="block h-full">
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Leaf className="size-4 text-emerald-600" aria-hidden />
                        {s.name}
                      </CardTitle>
                      <Badge className={cn("border-0", TYPE_COLOR[s.type])}>
                        {TYPE_LABEL[s.type]}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">{s.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>
                        <span className="font-semibold text-foreground">THC</span>{" "}
                        {s.thcPct ?? "—"}%
                      </span>
                      <span>
                        <span className="font-semibold text-foreground">CBD</span>{" "}
                        {s.cbdPct ?? "—"}%
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {s.effects.slice(0, 3).map((e) => (
                        <span
                          key={e}
                          className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                        >
                          {e}
                        </span>
                      ))}
                    </div>
                    {/* Terpenos dominantes calculados */}
                    {(() => {
                      const dominant = getDominantTerpenes(s);
                      if (dominant.length === 0) return null;
                      return (
                        <div className="mt-3.5 pt-2.5 border-t border-border/50 flex flex-wrap gap-1 items-center">
                          <span className="text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground mr-1">
                            Terpenos:
                          </span>
                          {dominant.map((dt) => (
                            <span
                              key={dt.id}
                              className={cn(
                                "rounded px-1.5 py-0.5 text-[9px] font-extrabold flex items-center gap-0.5",
                                dt.bgBadgeClass,
                                dt.textBadgeClass
                              )}
                              title={`${dt.name}: ${dt.aroma}`}
                            >
                              <span>{dt.emoji}</span>
                              <span>{dt.name}</span>
                            </span>
                          ))}
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
