import { CalendarDays, Droplets, Hash, Leaf, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { GrowLog, GrowLogEntry, GrowStage } from "@/types";

const STAGE_ORDER: GrowStage[] = [
  "germination", "seedling", "vegetative", "flowering", "harvest", "curing",
];

const STAGE_LABEL: Record<GrowStage, string> = {
  germination: "Germinación",
  seedling: "Plántula",
  vegetative: "Vegetativa",
  flowering: "Floración",
  harvest: "Cosecha",
  curing: "Curado",
};

function daysBetween(a: string, b?: string) {
  const end = b ? new Date(b) : new Date();
  return Math.floor((end.getTime() - new Date(a).getTime()) / 86_400_000);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86_400_000);
  if (d === 0) return "hoy";
  if (d === 1) return "ayer";
  if (d < 30) return `hace ${d} días`;
  return formatDate(iso);
}

interface GrowSummaryProps {
  log: GrowLog;
}

export function GrowSummary({ log }: GrowSummaryProps) {
  const entries = log.entries ?? [];
  const lastEntry = entries[0] as GrowLogEntry | undefined;
  const currentStage = lastEntry?.stage;

  const stagesUsed = new Set(entries.map((e) => e.stage));
  const currentStageIndex = currentStage ? STAGE_ORDER.indexOf(currentStage) : -1;

  const daysElapsed = daysBetween(log.startedAt, log.finishedAt);

  const lastWatering = entries.find((e) => e.watering);

  const isFinished = !!log.finishedAt;

  return (
    <div className="space-y-4">
      {/* Stats rápidas */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          icon={<CalendarDays className="size-4 text-emerald-500" />}
          label={isFinished ? "Duración total" : "Días de cultivo"}
          value={`${daysElapsed} días`}
          sub={isFinished ? `Finalizado ${formatDate(log.finishedAt!)}` : `Desde ${formatDate(log.startedAt)}`}
        />
        <StatCard
          icon={<Leaf className="size-4 text-lime-500" />}
          label="Fase actual"
          value={currentStage ? STAGE_LABEL[currentStage] : "Sin entradas"}
          sub={lastEntry ? `Última entrada ${relativeTime(lastEntry.date)}` : "Añade tu primera entrada"}
        />
        <StatCard
          icon={<Hash className="size-4 text-blue-500" />}
          label="Entradas"
          value={String(entries.length)}
          sub={entries.length === 1 ? "1 registro" : `${entries.length} registros`}
        />
        <StatCard
          icon={<Droplets className="size-4 text-sky-500" />}
          label="Último riego"
          value={lastWatering ? `${lastWatering.watering!.amountMl} ml` : "—"}
          sub={
            lastWatering
              ? `${relativeTime(lastWatering.date)}${lastWatering.watering!.ph ? ` · pH ${lastWatering.watering!.ph}` : ""}`
              : "Sin registros de riego"
          }
        />
      </div>

      {/* Línea de tiempo de fases */}
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Progreso de fases
        </p>
        <div className="flex items-center gap-0">
          {STAGE_ORDER.map((stage, i) => {
            const isPast = stagesUsed.has(stage) && currentStageIndex > i;
            const isCurrent = stage === currentStage;
            const isFuture = !isPast && !isCurrent;

            return (
              <div key={stage} className="flex flex-1 flex-col items-center gap-1 relative">
                {/* Línea conectora */}
                {i < STAGE_ORDER.length - 1 && (
                  <div
                    className={cn(
                      "absolute left-1/2 top-3 h-0.5 w-full z-0",
                      isPast || isCurrent ? "bg-emerald-500" : "bg-border",
                    )}
                  />
                )}

                {/* Círculo indicador */}
                <div
                  className={cn(
                    "relative z-10 flex size-6 items-center justify-center rounded-full border-2 text-[10px] font-bold transition-all",
                    isCurrent && "border-emerald-500 bg-emerald-500 text-white scale-110 shadow-md shadow-emerald-500/30",
                    isPast && "border-emerald-500 bg-emerald-500 text-white",
                    isFuture && "border-border bg-background text-muted-foreground",
                  )}
                  title={STAGE_LABEL[stage]}
                >
                  {isPast ? <CheckCircle2 className="size-3.5" /> : i + 1}
                </div>

                {/* Etiqueta */}
                <span
                  className={cn(
                    "text-center text-[9px] font-medium leading-tight",
                    isCurrent && "text-emerald-600 dark:text-emerald-400",
                    isPast && "text-emerald-500",
                    isFuture && "text-muted-foreground/60",
                  )}
                >
                  {STAGE_LABEL[stage]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badge de finalizado */}
      {isFinished && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 dark:border-amber-800/40 dark:bg-amber-950/20">
          <CheckCircle2 className="size-4 text-amber-500 shrink-0" />
          <span className="text-sm text-amber-700 dark:text-amber-300 font-medium">
            Cultivo finalizado — {daysElapsed} días de ciclo completo
          </span>
          <Badge variant="outline" className="ml-auto border-amber-300/50 text-amber-600 dark:text-amber-400 text-[10px]">
            Archivado
          </Badge>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-3 space-y-1.5">
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="text-lg font-bold leading-none tracking-tight text-foreground">{value}</p>
      <p className="text-[10px] text-muted-foreground leading-snug">{sub}</p>
    </div>
  );
}
