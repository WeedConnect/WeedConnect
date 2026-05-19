import { getLevel, getLevelProgress, LEVELS } from "@/lib/gamification";
import { cn } from "@/lib/utils";

interface UserLevelProps {
  points: number;
  className?: string;
}

export function UserLevel({ points, className }: UserLevelProps) {
  const level = getLevel(points);
  const { pct, pointsToNext } = getLevelProgress(points);
  const nextLevel = LEVELS[LEVELS.findIndex((l) => l.id === level.id) + 1];

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={cn("text-sm font-bold tracking-wide uppercase", level.color)}>
            {level.name}
          </span>
          <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border", level.bgColor, level.color)}>
            Nv. {LEVELS.findIndex((l) => l.id === level.id) + 1}
          </span>
        </div>
        <span className="text-xs font-semibold text-muted-foreground tabular-nums">
          {points.toLocaleString("es-ES")} pts
        </span>
      </div>

      {/* Barra de progreso */}
      <div className="h-2 rounded-full bg-muted/60 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700",
            level.id === "semilla"    && "bg-emerald-500",
            level.id === "plantula"   && "bg-lime-500",
            level.id === "cultivador" && "bg-teal-500",
            level.id === "maestro"    && "bg-amber-500",
            level.id === "leyenda"    && "bg-rose-500",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        {pointsToNext !== null && nextLevel ? (
          <>
            <span>{pct}% hacia {nextLevel.name}</span>
            <span>{pointsToNext.toLocaleString("es-ES")} pts restantes</span>
          </>
        ) : (
          <span className="text-rose-500 dark:text-rose-400 font-semibold w-full text-center">
            Nivel máximo alcanzado
          </span>
        )}
      </div>
    </div>
  );
}
