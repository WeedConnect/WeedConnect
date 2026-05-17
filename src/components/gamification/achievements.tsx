import {
  Leaf, Sprout, UserCheck, MessageSquarePlus, MessagesSquare,
  Award, Trophy, Map, Camera, Lock,
} from "lucide-react";
import { ACHIEVEMENTS, type Achievement } from "@/lib/gamification";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Leaf, Sprout, UserCheck, MessageSquarePlus, MessagesSquare,
  Award, Trophy, Map, Camera,
};

const CATEGORY_LABEL: Record<Achievement["category"], string> = {
  comunidad: "Comunidad",
  foro: "Foro",
  cultivo: "Cultivo",
  explorador: "Explorador",
};

const CATEGORY_COLOR: Record<Achievement["category"], string> = {
  comunidad: "text-emerald-600 dark:text-emerald-400",
  foro:      "text-blue-600 dark:text-blue-400",
  cultivo:   "text-teal-600 dark:text-teal-400",
  explorador:"text-amber-600 dark:text-amber-400",
};

interface AchievementsProps {
  points: number;
  threadCount?: number;
  hasAvatar?: boolean;
}

export function Achievements({ points, threadCount = 0, hasAvatar = false }: AchievementsProps) {
  const unlocked = ACHIEVEMENTS.map((a) => ({
    ...a,
    unlocked: a.condition({ points, threadCount, hasAvatar }),
  }));

  const unlockedCount = unlocked.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
          Logros
        </h3>
        <span className="text-xs text-muted-foreground font-medium">
          {unlockedCount}/{ACHIEVEMENTS.length} desbloqueados
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {unlocked.map((achievement) => {
          const Icon = ICON_MAP[achievement.icon] ?? Leaf;
          return (
            <div
              key={achievement.id}
              title={achievement.unlocked ? achievement.description : `Bloqueado: ${achievement.description}`}
              className={cn(
                "relative flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all",
                achievement.unlocked
                  ? "border-border/50 bg-card shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-default"
                  : "border-border/20 bg-muted/20 opacity-50 cursor-default",
              )}
            >
              {/* Icono */}
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-full",
                  achievement.unlocked
                    ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {achievement.unlocked ? (
                  <Icon className="size-5" />
                ) : (
                  <Lock className="size-4" />
                )}
              </div>

              {/* Nombre */}
              <div className="space-y-0.5">
                <p className="text-xs font-semibold leading-tight text-foreground">
                  {achievement.name}
                </p>
                <p className={cn("text-[10px] font-medium", CATEGORY_COLOR[achievement.category])}>
                  {CATEGORY_LABEL[achievement.category]}
                </p>
              </div>

              {/* Indicador desbloqueado */}
              {achievement.unlocked && (
                <span className="absolute top-2 right-2 size-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
