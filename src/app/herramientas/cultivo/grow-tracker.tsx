"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Trash2,
  Sprout,
  Droplets,
  FlaskConical,
  FileText,
  ChevronDown,
  ChevronUp,
  Cloud,
  CloudLightning,
  Loader2,
  Database,
  Info,
  ArrowRight,
  Image as ImageIcon,
  X,
  Flag,
  RotateCcw,
  Download,
  Thermometer,
  Wind,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { GrowLog, GrowLogEntry, GrowStage } from "@/types";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import {
  fetchGrowLogs,
  createGrowLog,
  deleteGrowLog,
  updateGrowLog,
  addGrowEntry,
  deleteGrowEntry,
} from "@/lib/grow";
import { uploadImage, signImages, validateImageFile } from "@/lib/storage";
import { GrowSummary } from "@/components/grow/grow-summary";

const STORAGE_KEY = "wc_grow_logs";
const GROW_BUCKET = "grow-photos";
const MAX_ENTRY_PHOTOS = 4;

interface SelectedFile {
  file: File;
  preview: string;
}

/** Recopila todos los paths de fotos de todas las entradas de los cultivos. */
function collectPhotoPaths(logs: GrowLog[]): string[] {
  return logs.flatMap((l) => l.entries.flatMap((e) => e.photos ?? []));
}

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
  const [supabase] = useState(() => createClient());
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any | null>(null);

  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasLocalData, setHasLocalData] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);

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
  const [newEntryTempC, setNewEntryTempC] = useState("");
  const [newEntryHumidity, setNewEntryHumidity] = useState("");
  const [newEntryPhotos, setNewEntryPhotos] = useState<SelectedFile[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [pendingDeleteLogId, setPendingDeleteLogId] = useState<string | null>(null);
  const [pendingDeleteEntryId, setPendingDeleteEntryId] = useState<string | null>(null);
  const [migrationSuccess, setMigrationSuccess] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        // Comprobar si hay datos previos locales
        const stored = localStorage.getItem(STORAGE_KEY);
        let hasLocal = false;
        let localLogs: GrowLog[] = [];
        try {
          if (stored) {
            localLogs = JSON.parse(stored);
            hasLocal = Array.isArray(localLogs) && localLogs.length > 0;
          }
        } catch {}
        setHasLocalData(hasLocal);

        // Comprobar sesión del usuario
        const { data } = await supabase.auth.getUser();
        const currentUser = data?.user;
        setUser(currentUser);

        if (currentUser) {
          // Cargar desde la nube
          setIsLoadingData(true);
          const cloudLogs = await fetchGrowLogs(supabase);
          setLogs(cloudLogs);
          if (cloudLogs.length > 0) {
            setSelectedLog(cloudLogs[0].id);
          }
          // Firmar las URLs de las fotos (bucket privado)
          const paths = collectPhotoPaths(cloudLogs);
          if (paths.length > 0) {
            setSignedUrls(await signImages(supabase, GROW_BUCKET, paths));
          }
        } else {
          // Cargar desde localStorage si es invitado
          setLogs(localLogs);
          if (localLogs.length > 0) {
            setSelectedLog(localLogs[0].id);
          }
        }
      } catch (err) {
        console.error("[GrowTracker] Error initializing:", err);
      } finally {
        setIsLoadingSession(false);
        setIsLoadingData(false);
      }
    }

    init();
  }, [supabase]);

  async function handleMigrateLocalData() {
    if (!user) return;
    setIsMigrating(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;
      
      const localLogs: GrowLog[] = JSON.parse(stored);
      
      // Migrar cada cultivo y sus entradas
      for (const log of localLogs) {
        const createdLog = await createGrowLog(supabase, {
          id: crypto.randomUUID(), // Asegurar UUID
          name: log.name,
          startedAt: log.startedAt,
          finishedAt: log.finishedAt,
          strainId: log.strainId,
        });
        
        // Subir entradas para este cultivo (en orden cronológico ascendente)
        const sortedEntries = [...log.entries].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        for (const entry of sortedEntries) {
          await addGrowEntry(supabase, createdLog.id, {
             ...entry,
             id: crypto.randomUUID(),
          });
        }
      }

      // Refrescar datos actualizados de la nube
      const cloudLogs = await fetchGrowLogs(supabase);
      setLogs(cloudLogs);
      
      // Limpiar almacenamiento local tras el éxito
      localStorage.removeItem(STORAGE_KEY);
      setHasLocalData(false);
      
      if (cloudLogs.length > 0) {
        setSelectedLog(cloudLogs[0].id);
      }
      
      setMigrationSuccess(true);
    } catch (err) {
      console.error("[GrowTracker] Error en migración:", err);
      console.error("[GrowTracker] Error en migración — los datos locales siguen intactos.");
    } finally {
      setIsMigrating(false);
    }
  }

  async function createLog() {
    if (!newLogName.trim()) return;
    setIsSaving(true);
    
    const logId = uid();
    const newLogData = {
      id: logId,
      name: newLogName.trim(),
      strainId: newLogStrain.trim() || undefined,
      startedAt: new Date().toISOString(),
    };

    try {
      if (user) {
        const createdLog = await createGrowLog(supabase, newLogData);
        setLogs([createdLog, ...logs]);
        setSelectedLog(createdLog.id);
      } else {
        const log: GrowLog = {
          ...newLogData,
          userId: "local",
          entries: [],
        };
        const updated = [log, ...logs];
        setLogs(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setSelectedLog(log.id);
      }

      setShowNewLog(false);
      setNewLogName("");
      setNewLogStrain("");
    } catch (err) {
      console.error("[GrowTracker] Error al crear cultivo:", err);
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteLog(id: string) {
    setIsSaving(true);
    try {
      if (user) {
        await deleteGrowLog(supabase, id);
      }
      const updated = logs.filter((l) => l.id !== id);
      setLogs(updated);
      if (!user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      if (selectedLog === id) setSelectedLog(null);
    } catch (err) {
      console.error("[GrowTracker] Error al eliminar cultivo:", err);
    } finally {
      setIsSaving(false);
      setPendingDeleteLogId(null);
    }
  }

  async function toggleFinishLog(log: GrowLog) {
    const isFinished = !!log.finishedAt;
    const finishedAt = isFinished ? null : new Date().toISOString().slice(0, 10);

    if (user) {
      try {
        await updateGrowLog(supabase, log.id, { finishedAt });
      } catch (err) {
        console.error("[GrowTracker] Error actualizando cultivo:", err);
        return;
      }
    }

    const updated = logs.map((l) =>
      l.id === log.id ? { ...l, finishedAt: finishedAt ?? undefined } : l,
    );
    setLogs(updated);
    if (!user) localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  function exportLog(log: GrowLog) {
    const json = JSON.stringify(log, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cultivo-${log.name.replace(/\s+/g, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function addEntry() {
    if (!selectedLog) return;
    setIsSaving(true);

    try {
      const nutrients = newEntryNutrients
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => {
          const [name, dosage] = s.split(":").map((x) => x.trim());
          return { name: name ?? s, dosageMl: parseFloat(dosage ?? "0") || 0 };
        });

      // Subir fotos al bucket privado (solo usuarios con sesión)
      const photoPaths: string[] = [];
      if (user && newEntryPhotos.length > 0) {
        for (const { file } of newEntryPhotos) {
          photoPaths.push(await uploadImage(supabase, GROW_BUCKET, user.id, file));
        }
      }

      const entryData: GrowLogEntry = {
        id: uid(),
        date: newEntryDate,
        stage: newEntryStage,
        notes: newEntryNotes.trim() || undefined,
        watering:
          newEntryWaterMl
            ? { amountMl: parseFloat(newEntryWaterMl), ph: newEntryPh ? parseFloat(newEntryPh) : undefined }
            : undefined,
        nutrients: nutrients.length > 0 ? nutrients : undefined,
        photos: photoPaths,
        temperatureC: newEntryTempC ? parseFloat(newEntryTempC) : undefined,
        humidityPct: newEntryHumidity ? parseFloat(newEntryHumidity) : undefined,
      };

      if (user) {
        const createdEntry = await addGrowEntry(supabase, selectedLog, entryData);
        const updated = logs.map((l) =>
          l.id === selectedLog
            ? { ...l, entries: [createdEntry, ...l.entries] }
            : l,
        );
        setLogs(updated);
        // Firmar las URLs de las fotos recién subidas
        if (photoPaths.length > 0) {
          const newSigned = await signImages(supabase, GROW_BUCKET, photoPaths);
          setSignedUrls((prev) => ({ ...prev, ...newSigned }));
        }
      } else {
        const updated = logs.map((l) =>
          l.id === selectedLog
            ? { ...l, entries: [entryData, ...l.entries] }
            : l,
        );
        setLogs(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }

      setShowNewEntry(false);
      setNewEntryNotes("");
      setNewEntryWaterMl("");
      setNewEntryPh("");
      setNewEntryNutrients("");
      setNewEntryTempC("");
      setNewEntryHumidity("");
      newEntryPhotos.forEach((p) => URL.revokeObjectURL(p.preview));
      setNewEntryPhotos([]);
      setPhotoError(null);
    } catch (err) {
      console.error("[GrowTracker] Error al añadir entrada:", err);
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteEntry(logId: string, entryId: string) {
    setIsSaving(true);
    try {
      if (user) {
        await deleteGrowEntry(supabase, entryId);
      }
      const updated = logs.map((l) =>
        l.id === logId ? { ...l, entries: l.entries.filter((e) => e.id !== entryId) } : l,
      );
      setLogs(updated);
      if (!user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
    } catch (err) {
      console.error("[GrowTracker] Error al eliminar entrada:", err);
    } finally {
      setIsSaving(false);
      setPendingDeleteEntryId(null);
    }
  }

  function handleEntryPhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (photoInputRef.current) photoInputRef.current.value = "";
    if (files.length === 0) return;

    const remaining = MAX_ENTRY_PHOTOS - newEntryPhotos.length;
    if (files.length > remaining) {
      setPhotoError(`Solo puedes adjuntar hasta ${MAX_ENTRY_PHOTOS} fotos por entrada.`);
    }

    const accepted: SelectedFile[] = [];
    for (const file of files.slice(0, remaining)) {
      const validationError = validateImageFile(file);
      if (validationError) {
        setPhotoError(validationError);
        continue;
      }
      accepted.push({ file, preview: URL.createObjectURL(file) });
    }
    setNewEntryPhotos((prev) => [...prev, ...accepted]);
  }

  function removeEntryPhoto(index: number) {
    setNewEntryPhotos((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
    setPhotoError(null);
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
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl flex flex-wrap items-center gap-2">
            Seguimiento de cultivo
            {!isLoadingSession && (
              user ? (
                <Badge className="h-6 gap-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-200 font-medium border border-emerald-300/30">
                  <Cloud className="size-3" /> Nube
                </Badge>
              ) : (
                <Badge variant="outline" className="h-6 gap-1 border-amber-200 bg-amber-50/50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300 font-medium">
                  <Database className="size-3" /> Local
                </Badge>
              )
            )}
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Registra tus cultivos: riegos, nutrientes, fases y notas.
          </p>
          {!isLoadingSession && !user && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-semibold animate-pulse">
              <Info className="size-3.5 shrink-0" />
              💾 Guardando en local. Inicia sesión para sincronizar en la nube con tu cuenta.
            </div>
          )}
        </div>
        <Button
          onClick={() => setShowNewLog((v) => !v)}
          size="sm"
          disabled={isLoadingSession || isLoadingData || isSaving}
          className="shrink-0 gap-1.5"
        >
          <Plus className="size-4" />
          Nuevo cultivo
        </Button>
      </header>

      {/* Banner de migración / éxito de migración */}
      {user && migrationSuccess && (
        <div className="mb-6 rounded-lg border border-emerald-300/50 bg-emerald-50/60 p-4 dark:border-emerald-800/50 dark:bg-emerald-950/20 flex items-center gap-3">
          <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
          <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
            ¡Cultivos sincronizados con éxito! Ya están guardados en tu cuenta.
          </p>
        </div>
      )}
      {user && hasLocalData && !migrationSuccess && (
        <div className="mb-6 rounded-lg border border-emerald-300/50 bg-emerald-50/60 p-4 dark:border-emerald-800/50 dark:bg-emerald-950/20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-emerald-100 p-1.5 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                <CloudLightning className="size-4 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                  ¿Sincronizar tus datos locales a la nube?
                </h3>
                <p className="text-xs text-emerald-800/80 dark:text-emerald-300/70">
                  Hemos detectado cultivos guardados previamente en este navegador. Puedes subirlos y guardarlos permanentemente en tu cuenta de WeedConnect.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={handleMigrateLocalData}
              disabled={isMigrating}
              className="shrink-0 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
            >
              {isMigrating ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Sincronizando...
                </>
              ) : (
                <>
                  Migrar a la Nube
                  <ArrowRight className="size-3.5" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}

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
                disabled={isSaving}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="log-strain">Variedad (opcional)</Label>
              <Input
                id="log-strain"
                placeholder="p. ej. White Widow"
                value={newLogStrain}
                onChange={(e) => setNewLogStrain(e.target.value)}
                disabled={isSaving}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={createLog} size="sm" disabled={isSaving || !newLogName.trim()}>
                {isSaving ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-1.5" />
                    Creando...
                  </>
                ) : (
                  "Crear cultivo"
                )}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowNewLog(false)} disabled={isSaving}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoadingSession || isLoadingData ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-20 text-center gap-3">
          <Loader2 className="size-10 animate-spin text-emerald-600" />
          <p className="text-muted-foreground text-sm">Accediendo al diario de cultivos...</p>
        </div>
      ) : logs.length === 0 && !showNewLog ? (
        <div className="rounded-lg border border-dashed border-border py-16 text-center">
          <Sprout className="mx-auto mb-3 size-10 text-muted-foreground/40" aria-hidden />
          <p className="text-muted-foreground">No tienes ningún cultivo registrado todavía.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Pulsa{" "}
            <button
              onClick={() => setShowNewLog(true)}
              className="text-emerald-600 hover:underline font-medium"
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
              <div
                key={log.id}
                className={cn(
                  "rounded-lg border text-sm transition-colors",
                  selectedLog === log.id
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                    : "border-border",
                )}
              >
                <button
                  type="button"
                  onClick={() => { setSelectedLog(log.id); setPendingDeleteLogId(null); }}
                  className="flex w-full items-start justify-between gap-2 px-3 py-3 text-left hover:bg-muted/30 rounded-lg transition-colors"
                >
                  <div className="overflow-hidden">
                    <p className="font-medium leading-snug truncate">{log.name}</p>
                    {log.strainId && (
                      <p className="text-xs text-muted-foreground truncate">{log.strainId}</p>
                    )}
                    <p className="mt-0.5 text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(log.startedAt)} · {log.entries?.length || 0} {log.entries?.length === 1 ? "entrada" : "entradas"}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPendingDeleteLogId(pendingDeleteLogId === log.id ? null : log.id);
                    }}
                    className="shrink-0 text-muted-foreground/40 hover:text-destructive transition-colors focus:outline-none p-0.5 rounded"
                    aria-label="Eliminar cultivo"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </button>
                {pendingDeleteLogId === log.id && (
                  <div className="flex items-center gap-2 border-t border-red-200 dark:border-red-900/40 bg-red-50/60 dark:bg-red-950/20 px-3 py-2 rounded-b-lg">
                    <AlertTriangle className="size-3.5 text-red-500 shrink-0" />
                    <span className="text-xs text-red-700 dark:text-red-400 flex-1">¿Eliminar permanentemente?</span>
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => deleteLog(log.id)}
                      className="text-xs font-semibold text-red-600 hover:text-red-800 dark:text-red-400 px-1"
                    >
                      {isSaving ? <Loader2 className="size-3 animate-spin" /> : "Sí"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingDeleteLogId(null)}
                      className="text-xs text-muted-foreground hover:text-foreground px-1"
                    >
                      No
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Detalle del log seleccionado */}
          {activeLog ? (
            <div className="flex flex-col gap-4">
              {/* Cabecera del cultivo activo */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="overflow-hidden">
                  <h2 className="text-xl font-semibold truncate">{activeLog.name}</h2>
                  {activeLog.strainId && (
                    <p className="text-sm text-muted-foreground truncate">{activeLog.strainId}</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => exportLog(activeLog)}
                    className="gap-1.5 text-muted-foreground"
                    title="Exportar datos del cultivo"
                  >
                    <Download className="size-3.5" />
                    Exportar
                  </Button>
                  <Button
                    size="sm"
                    variant={activeLog.finishedAt ? "outline" : "outline"}
                    onClick={() => toggleFinishLog(activeLog)}
                    disabled={isSaving}
                    className={cn(
                      "gap-1.5",
                      activeLog.finishedAt
                        ? "text-muted-foreground"
                        : "border-amber-300 text-amber-600 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-950/30",
                    )}
                  >
                    {activeLog.finishedAt ? (
                      <><RotateCcw className="size-3.5" />Reabrir</>
                    ) : (
                      <><Flag className="size-3.5" />Finalizar</>
                    )}
                  </Button>
                  {!activeLog.finishedAt && (
                    <Button
                      size="sm"
                      onClick={() => setShowNewEntry((v) => !v)}
                      disabled={isSaving}
                      className="gap-1.5"
                    >
                      <Plus className="size-4" />
                      Añadir entrada
                    </Button>
                  )}
                </div>
              </div>

              {/* Panel de resumen y progreso */}
              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <GrowSummary log={activeLog} />
              </div>

              {showNewEntry && (
                <Card className="border-emerald-300 dark:border-emerald-800 shadow-sm">
                  <CardHeader className="pb-3">
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
                          disabled={isSaving}
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="entry-stage">Fase</Label>
                        <select
                          id="entry-stage"
                          value={newEntryStage}
                          onChange={(e) => setNewEntryStage(e.target.value as GrowStage)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          disabled={isSaving}
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
                          disabled={isSaving}
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
                          disabled={isSaving}
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
                        disabled={isSaving}
                      />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="grid gap-1.5">
                        <Label htmlFor="entry-temp">
                          Temperatura (°C)
                        </Label>
                        <Input
                          id="entry-temp"
                          type="number"
                          step="0.5"
                          placeholder="p. ej. 24"
                          value={newEntryTempC}
                          onChange={(e) => setNewEntryTempC(e.target.value)}
                          disabled={isSaving}
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="entry-humidity">
                          Humedad relativa (%)
                        </Label>
                        <Input
                          id="entry-humidity"
                          type="number"
                          step="1"
                          min="0"
                          max="100"
                          placeholder="p. ej. 55"
                          value={newEntryHumidity}
                          onChange={(e) => setNewEntryHumidity(e.target.value)}
                          disabled={isSaving}
                        />
                      </div>
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="entry-notes">Notas</Label>
                      <Textarea
                        id="entry-notes"
                        placeholder="Observaciones: color de hojas, síntomas, cambios…"
                        value={newEntryNotes}
                        onChange={(e) => setNewEntryNotes(e.target.value)}
                        rows={3}
                        disabled={isSaving}
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label>Fotos (opcional)</Label>
                      {user ? (
                        <>
                          {newEntryPhotos.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                              {newEntryPhotos.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={item.preview}
                                    alt="Vista previa"
                                    className="h-full w-full object-cover"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeEntryPhoto(idx)}
                                    disabled={isSaving}
                                    className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-white"
                                    aria-label="Quitar foto"
                                  >
                                    <X className="size-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            ref={photoInputRef}
                            onChange={handleEntryPhotoChange}
                            disabled={isSaving || newEntryPhotos.length >= MAX_ENTRY_PHOTOS}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isSaving || newEntryPhotos.length >= MAX_ENTRY_PHOTOS}
                            onClick={() => photoInputRef.current?.click()}
                            className="w-fit gap-1.5"
                          >
                            <ImageIcon className="size-4" />
                            Añadir fotos
                          </Button>
                          {photoError && (
                            <p className="text-xs text-destructive">{photoError}</p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Hasta {MAX_ENTRY_PHOTOS} imágenes · máx. 5 MB cada una. Privadas: solo tú puedes verlas.
                          </p>
                        </>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          Inicia sesión para adjuntar fotos privadas a tus entradas de cultivo.
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button onClick={addEntry} size="sm" disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <Loader2 className="size-4 animate-spin mr-1.5" />
                            Guardando...
                          </>
                        ) : (
                          "Guardar entrada"
                        )}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setShowNewEntry(false)} disabled={isSaving}>
                        Cancelar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {(!activeLog.entries || activeLog.entries.length === 0) ? (
                <div className="rounded-lg border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
                  No hay entradas todavía. Añade la primera para empezar el diario de cultivo.
                </div>
              ) : (
                <ul className="flex flex-col gap-3">
                  {activeLog.entries.map((entry) => {
                    const expanded = expandedEntries.has(entry.id);
                    return (
                      <li key={entry.id}>
                        <Card className="transition-all hover:shadow-sm">
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
                                  <span className="flex items-center gap-1 text-xs text-muted-foreground bg-blue-50/50 dark:bg-blue-950/20 px-1.5 py-0.5 rounded">
                                    <Droplets className="size-3 text-blue-500" />
                                    {entry.watering.amountMl}ml
                                    {entry.watering.ph && ` · pH ${entry.watering.ph}`}
                                  </span>
                                )}
                                {entry.nutrients && entry.nutrients.length > 0 && (
                                  <span className="flex items-center gap-1 text-xs text-muted-foreground bg-emerald-50/50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded">
                                    <FlaskConical className="size-3 text-emerald-500" />
                                    {entry.nutrients.length} {entry.nutrients.length === 1 ? "nutriente" : "nutrientes"}
                                  </span>
                                )}
                                {entry.temperatureC != null && (
                                  <span className="flex items-center gap-1 text-xs text-muted-foreground bg-orange-50/50 dark:bg-orange-950/20 px-1.5 py-0.5 rounded">
                                    <Thermometer className="size-3 text-orange-500" />
                                    {entry.temperatureC}°C
                                    {entry.humidityPct != null && ` · ${entry.humidityPct}%HR`}
                                  </span>
                                )}
                                {entry.notes && (
                                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <FileText className="size-3 text-slate-400" />
                                    nota
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                disabled={isSaving}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPendingDeleteEntryId(
                                    pendingDeleteEntryId === entry.id ? null : entry.id,
                                  );
                                }}
                                className={cn(
                                  "transition-colors p-0.5 rounded",
                                  pendingDeleteEntryId === entry.id
                                    ? "text-destructive"
                                    : "text-muted-foreground/40 hover:text-destructive",
                                )}
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
                          {pendingDeleteEntryId === entry.id && (
                            <div className="flex items-center gap-2 border-t border-red-200 dark:border-red-900/40 bg-red-50/60 dark:bg-red-950/20 px-4 py-2">
                              <AlertTriangle className="size-3.5 text-red-500 shrink-0" />
                              <span className="text-xs text-red-700 dark:text-red-400 flex-1">¿Eliminar esta entrada?</span>
                              <button
                                type="button"
                                disabled={isSaving}
                                onClick={() => deleteEntry(activeLog.id, entry.id)}
                                className="text-xs font-semibold text-red-600 hover:text-red-800 dark:text-red-400 px-2"
                              >
                                {isSaving ? <Loader2 className="size-3 animate-spin" /> : "Sí, eliminar"}
                              </button>
                              <button
                                type="button"
                                onClick={() => setPendingDeleteEntryId(null)}
                                className="text-xs text-muted-foreground hover:text-foreground"
                              >
                                Cancelar
                              </button>
                            </div>
                          )}
                          {expanded && (
                            <CardContent className="pt-0">
                              <div className="border-t border-border pt-3 animate-tw-animate-fade-in">
                                {entry.watering && (
                                  <div className="mb-2 text-sm flex gap-2">
                                    <span className="font-medium text-muted-foreground">Riego:</span>{" "}
                                    <span>
                                      {entry.watering.amountMl} ml
                                      {entry.watering.ph && ` · pH ${entry.watering.ph}`}
                                    </span>
                                  </div>
                                )}
                                {entry.nutrients && entry.nutrients.length > 0 && (
                                  <div className="mb-2 text-sm flex gap-2">
                                    <span className="font-medium text-muted-foreground">Nutrientes:</span>{" "}
                                    <span>
                                      {entry.nutrients
                                        .map((n) => `${n.name} (${n.dosageMl}ml)`)
                                        .join(", ")}
                                    </span>
                                  </div>
                                )}
                                {(entry.temperatureC != null || entry.humidityPct != null) && (
                                  <div className="mb-2 text-sm flex gap-2">
                                    <span className="font-medium text-muted-foreground">Ambiente:</span>
                                    <span className="flex items-center gap-2">
                                      {entry.temperatureC != null && (
                                        <span className="flex items-center gap-1">
                                          <Thermometer className="size-3 text-orange-500" />
                                          {entry.temperatureC}°C
                                        </span>
                                      )}
                                      {entry.humidityPct != null && (
                                        <span className="flex items-center gap-1">
                                          <Wind className="size-3 text-sky-500" />
                                          {entry.humidityPct}% HR
                                        </span>
                                      )}
                                    </span>
                                  </div>
                                )}
                                {entry.notes && (
                                  <div className="text-sm flex flex-col gap-1 mt-1 bg-muted/30 p-2 rounded-md">
                                    <span className="font-medium text-xs text-muted-foreground">Notas:</span>{" "}
                                    <span className="text-foreground">{entry.notes}</span>
                                  </div>
                                )}
                                {entry.photos && entry.photos.length > 0 && (
                                  <div className="mt-3">
                                    <span className="font-medium text-xs text-muted-foreground">
                                      Fotos:
                                    </span>
                                    <div className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                                      {entry.photos.map((path, idx) => {
                                        const url = signedUrls[path];
                                        return url ? (
                                          <a
                                            key={idx}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="overflow-hidden rounded-lg border border-border bg-muted"
                                          >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                              src={url}
                                              alt={`Foto ${idx + 1} de la entrada`}
                                              loading="lazy"
                                              className="aspect-square w-full object-cover transition-transform hover:scale-[1.03]"
                                            />
                                          </a>
                                        ) : (
                                          <div
                                            key={idx}
                                            className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 text-muted-foreground"
                                          >
                                            <Loader2 className="size-4 animate-spin" />
                                          </div>
                                        );
                                      })}
                                    </div>
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

      <footer className="mt-8 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3 text-center text-sm text-muted-foreground">
        {!user ? (
          "Estás usando almacenamiento local. Los datos no se guardarán en múltiples dispositivos hasta que inicies sesión."
        ) : (
          <span className="flex items-center justify-center gap-1.5">
            <Cloud className="size-4 text-emerald-500" /> Tus cultivos están sincronizados de forma segura en tu cuenta de WeedConnect.
          </span>
        )}
      </footer>
    </section>
  );
}
