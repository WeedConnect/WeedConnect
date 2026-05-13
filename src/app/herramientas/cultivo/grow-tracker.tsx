"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Sprout, Droplets, FlaskConical, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { GrowLog, GrowLogEntry, GrowStage } from "@/types";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "wc_grow_logs";

const STAGE_LABEL: Record<GrowStage, string> = {
  germination: "Germinación",
  seedling: "Plántula",
  vegetative: "Vegetativa",
  flowering: "Floración",
  harvest: "Cosecha",
  curing: "Curado",
};

const STAGE_COLOR: Record<GrowStage, string> = {
  germination: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200",
  seedling: "bg-lime-100 text-lime-800 dark:bg-lime-900/40 dark:text-lime-200",
  vegetative: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  flowering: "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-200",
  harvest: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  curing: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200",
};

const STAGES: GrowStage[] = ["germination", "seedling", "vegetative", "flowering", "harvest", "curing"];

function uid() {
  return crypto.randomUUID();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function GrowTracker() {
  const [logs, setLogs] = useState<GrowLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<string | null>(null);
  const [showNewLog, setShowNewLog] = useState(false);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());

  const [newLogName, setNewLogName] = useState("");
  const [newLogStrain, setNewLogStrain] = useState("");

  const [newEntryDate, setNewEntryDate] = useState(new Date().toISOString().slice(0, 10));
  const [newEntryStage, setNewEntryStage] = useState<GrowStage>("vegetative");
  const [newEntryNotes, setNewEntryNotes] = useState("");
  const [newEntryWaterMl, setNewEntryWaterMl] = useState("");
  const [newEntryPh, setNewEntryPh] = useState("");
  const [newEntryNutrients, setNewEntryNutrients] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setLogs(JSON.parse(stored));
    } catch {}
  }, []);


  function saveLogs(updated: GrowLog[]) {
    setLogs(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  function createLog() {
    if (!newLogName.trim()) return;
    const log: GrowLog = {
      id: uid(),
      userId: "local",
      name: newLogName.trim(),
      strainId: newLogStrain.trim() || undefined,
      startedAt: new Date().toISOString(),
      entries: [],
    };
    const updated = [log, ...logs];
    saveLogs(updated);
    setSelectedLog(log.id);
    setShowNewLog(false);
    setNewLogName("");
    setNewLogStrain("");
  }

  function deleteLog(id: string) {
    saveLogs(logs.filter((l) => l.id !== id));
    if (selectedLog === id) setSelectedLog(null);
  }

  function addEntry() {
    if (!selectedLog) return;
    const nutrients = newEntryNutrients
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => {
        const [name, dosage] = s.split(":").map((x) => x.trim());
        return { name: name ?? s, dosageMl: parseFloat(dosage ?? "0") || 0 };
      });

    const entry: GrowLogEntry = {
      id: uid(),
      date: newEntryDate,
      stage: newEntryStage,
      notes: newEntryNotes.trim() || undefined,
      watering:
        newEntryWaterMl
          ? { amountMl: parseFloat(newEntryWaterMl), ph: newEntryPh ? parseFloat(newEntryPh) : undefined }
          : undefined,
      nutrients: nutrients.length > 0 ? nutrients : undefined,
    };

    const updated = logs.map((l) =>
      l.id === selectedLog
        ? { ...l, entries: [entry, ...l.entries] }
        : l,
    );
    saveLogs(updated);
    setShowNewEntry(false);
    setNewEntryNotes("");
    setNewEntryWaterMl("");
    setNewEntryPh("");
    setNewEntryNutrients("");
  }

  function deleteEntry(logId: string, entryId: string) {
    const updated = logs.map((l) =>
      l.id === logId ? { ...l, entries: l.entries.filter((e) => e.id !== entryId) } : l,
    );
    saveLogs(updated);
  }

  function toggleEntry(id: string) {
    setExpandedEntries((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const activeLog = logs.find((l) => l.id === selectedLog);

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <header className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Seguimiento de cultivo</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Registra tus cultivos: riegos, nutrientes, fases y notas. Todo se guarda en tu
            navegador — sin cuenta necesaria.
          </p>
        </div>
        <Button
          onClick={() => setShowNewLog((v) => !v)}
          size="sm"
          className="shrink-0 gap-1.5"
        >
          <Plus className="size-4" />
          Nuevo cultivo
        </Button>
      </header>

      {showNewLog && (
        <Card className="mb-6 border-emerald-300 dark:border-emerald-800">
          <CardHeader>
            <CardTitle className="text-base">Nuevo cultivo</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="log-name">Nombre del cultivo *</Label>
              <Input
                id="log-name"
                placeholder="p. ej. White Widow armario 80x80"
                value={newLogName}
                onChange={(e) => setNewLogName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="log-strain">Variedad (opcional)</Label>
              <Input
                id="log-strain"
                placeholder="p. ej. White Widow"
                value={newLogStrain}
                onChange={(e) => setNewLogStrain(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={createLog} size="sm">Crear cultivo</Button>
              <Button variant="ghost" size="sm" onClick={() => setShowNewLog(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {logs.length === 0 && !showNewLog ? (
        <div className="rounded-lg border border-dashed border-border py-16 text-center">
          <Sprout className="mx-auto mb-3 size-10 text-muted-foreground/40" aria-hidden />
          <p className="text-muted-foreground">No tienes ningún cultivo registrado todavía.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Pulsa{" "}
            <button
              onClick={() => setShowNewLog(true)}
              className="text-emerald-600 hover:underline"
            >
              Nuevo cultivo
            </button>{" "}
            para empezar.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          {/* Sidebar: lista de logs */}
          <div className="flex flex-col gap-2">
            {logs.map((log) => (
              <button
                key={log.id}
                type="button"
                onClick={() => setSelectedLog(log.id)}
                className={cn(
                  "flex items-start justify-between gap-2 rounded-lg border px-3 py-3 text-left text-sm transition-colors",
                  selectedLog === log.id
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                    : "border-border hover:bg-muted/50",
                )}
              >
                <div>
                  <p className="font-medium leading-snug">{log.name}</p>
                  {log.strainId && (
                    <p className="text-xs text-muted-foreground">{log.strainId}</p>
                  )}
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Inicio: {formatDate(log.startedAt)} · {log.entries.length} entradas
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteLog(log.id);
                  }}
                  className="shrink-0 text-muted-foreground/40 hover:text-destructive"
                  aria-label="Eliminar cultivo"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </button>
            ))}
          </div>

          {/* Detalle del log seleccionado */}
          {activeLog ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">{activeLog.name}</h2>
                  {activeLog.strainId && (
                    <p className="text-sm text-muted-foreground">{activeLog.strainId}</p>
                  )}
                </div>
                <Button
                  size="sm"
                  onClick={() => setShowNewEntry((v) => !v)}
                  className="shrink-0 gap-1.5"
                >
                  <Plus className="size-4" />
                  Añadir entrada
                </Button>
              </div>

              {showNewEntry && (
                <Card className="border-emerald-300 dark:border-emerald-800">
                  <CardHeader>
                    <CardTitle className="text-sm">Nueva entrada</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="grid gap-1.5">
                        <Label htmlFor="entry-date">Fecha</Label>
                        <Input
                          id="entry-date"
                          type="date"
                          value={newEntryDate}
                          onChange={(e) => setNewEntryDate(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="entry-stage">Fase</Label>
                        <select
                          id="entry-stage"
                          value={newEntryStage}
                          onChange={(e) => setNewEntryStage(e.target.value as GrowStage)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {STAGES.map((s) => (
                            <option key={s} value={s}>
                              {STAGE_LABEL[s]}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="grid gap-1.5">
                        <Label htmlFor="entry-water">Riego (ml)</Label>
                        <Input
                          id="entry-water"
                          type="number"
                          placeholder="p. ej. 500"
                          value={newEntryWaterMl}
                          onChange={(e) => setNewEntryWaterMl(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="entry-ph">pH del agua</Label>
                        <Input
                          id="entry-ph"
                          type="number"
                          step="0.1"
                          placeholder="p. ej. 6.2"
                          value={newEntryPh}
                          onChange={(e) => setNewEntryPh(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="entry-nutrients">
                        Nutrientes (nombre:ml, separados por coma)
                      </Label>
                      <Input
                        id="entry-nutrients"
                        placeholder="p. ej. Grow:2, Bloom:1, CalMag:0.5"
                        value={newEntryNutrients}
                        onChange={(e) => setNewEntryNutrients(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="entry-notes">Notas</Label>
                      <Textarea
                        id="entry-notes"
                        placeholder="Observaciones: color de hojas, síntomas, cambios…"
                        value={newEntryNotes}
                        onChange={(e) => setNewEntryNotes(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={addEntry} size="sm">
                        Guardar entrada
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setShowNewEntry(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeLog.entries.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
                  No hay entradas todavía. Añade la primera para empezar el diario de cultivo.
                </div>
              ) : (
                <ul className="flex flex-col gap-3">
                  {activeLog.entries.map((entry) => {
                    const expanded = expandedEntries.has(entry.id);
                    return (
                      <li key={entry.id}>
                        <Card>
                          <div
                            className="flex cursor-pointer items-center gap-3 px-4 py-3"
                            onClick={() => toggleEntry(entry.id)}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-medium">
                                  {formatDate(entry.date)}
                                </span>
                                <Badge
                                  className={cn("border-0 text-[10px]", STAGE_COLOR[entry.stage])}
                                >
                                  {STAGE_LABEL[entry.stage]}
                                </Badge>
                                {entry.watering && (
                                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Droplets className="size-3 text-blue-500" />
                                    {entry.watering.amountMl}ml
                                    {entry.watering.ph && ` · pH ${entry.watering.ph}`}
                                  </span>
                                )}
                                {entry.nutrients && entry.nutrients.length > 0 && (
                                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <FlaskConical className="size-3 text-emerald-500" />
                                    {entry.nutrients.length} nutriente
                                    {entry.nutrients.length > 1 ? "s" : ""}
                                  </span>
                                )}
                                {entry.notes && (
                                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <FileText className="size-3" />
                                    nota
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteEntry(activeLog.id, entry.id);
                                }}
                                className="text-muted-foreground/40 hover:text-destructive"
                                aria-label="Eliminar entrada"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                              {expanded ? (
                                <ChevronUp className="size-4 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="size-4 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                          {expanded && (
                            <CardContent className="pt-0">
                              <div className="border-t border-border pt-3">
                                {entry.watering && (
                                  <div className="mb-2 text-sm">
                                    <span className="font-medium">Riego:</span>{" "}
                                    {entry.watering.amountMl} ml
                                    {entry.watering.ph && ` · pH ${entry.watering.ph}`}
                                  </div>
                                )}
                                {entry.nutrients && entry.nutrients.length > 0 && (
                                  <div className="mb-2 text-sm">
                                    <span className="font-medium">Nutrientes:</span>{" "}
                                    {entry.nutrients
                                      .map((n) => `${n.name} ${n.dosageMl}ml`)
                                      .join(", ")}
                                  </div>
                                )}
                                {entry.notes && (
                                  <div className="text-sm">
                                    <span className="font-medium">Notas:</span>{" "}
                                    <span className="text-muted-foreground">{entry.notes}</span>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          )}
                        </Card>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-lg border border-dashed border-border py-16 text-sm text-muted-foreground">
              Selecciona un cultivo de la lista para ver sus entradas.
            </div>
          )}
        </div>
      )}

      <p className="mt-8 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3 text-center text-sm text-muted-foreground">
        Los datos se guardan en tu navegador (localStorage). Próximamente: sincronización en la nube
        con tu cuenta de WeedConnect.
      </p>
    </section>
  );
}
