"use client";

import { useState, useMemo } from "react";
import {
  Leaf, Sprout, UserCheck, MessageSquarePlus, MessagesSquare,
  Award, Trophy, Map, Camera, Lock, CheckCircle
} from "lucide-react";
import { ACHIEVEMENTS, type Achievement } from "@/lib/gamification";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Leaf, Sprout, UserCheck, MessageSquarePlus, MessagesSquare,
  Award, Trophy, Map, Camera,
};

const CATEGORY_LABEL: Record<Achievement["category"] | "all", string> = {
  all:       "Todos",
  comunidad: "Comunidad",
  foro:      "Foro",
  cultivo:   "Cultivo",
  explorador:"Exploración",
};

const CATEGORY_COLOR: Record<Achievement["category"], string> = {
  comunidad: "text-emerald-600 dark:text-emerald-400 border-emerald-200/50 bg-emerald-50/50 dark:bg-emerald-950/20",
  foro:      "text-blue-600 dark:text-blue-400 border-blue-200/50 bg-blue-50/50 dark:bg-blue-950/20",
  cultivo:   "text-teal-600 dark:text-teal-400 border-teal-200/50 bg-teal-50/50 dark:bg-teal-950/20",
  explorador:"text-amber-600 dark:text-amber-400 border-amber-200/50 bg-amber-50/50 dark:bg-amber-950/20",
};

interface AchievementsProps {
  points: number;
  threadCount?: number;
  hasAvatar?: boolean;
  className?: string;
}

export function Achievements({ points, threadCount = 0, hasAvatar = false, className }: AchievementsProps) {
  const [category, setCategory] = useState<Achievement["category"] | "all">("all");

  const achievementsWithStatus = useMemo(() => {
    return ACHIEVEMENTS.map((a) => ({
      ...a,
      unlocked: a.condition({ points, threadCount, hasAvatar }),
    }));
  }, [points, threadCount, hasAvatar]);

  const filteredAchievements = useMemo(() => {
    return achievementsWithStatus.filter(
      (a) => category === "all" || a.category === category
    );
  }, [achievementsWithStatus, category]);

  const unlockedCount = useMemo(() => {
    return achievementsWithStatus.filter((a) => a.unlocked).length;
  }, [achievementsWithStatus]);

  const categoriesList: (Achievement["category"] | "all")[] = [
    "all",
    "comunidad",
    "foro",
    "cultivo",
    "explorador",
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Cabecera de Logros */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-base font-extrabold text-foreground tracking-tight">
            Logros & Distinciones
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Desbloquea insignias participando activamente en WeedConnect.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center bg-muted/40 border border-border/40 px-3 py-1.5 rounded-full shrink-0">
          <Trophy className="size-4 text-brand-gold animate-pulse" />
          <span className="text-xs font-bold text-foreground">
            {unlockedCount} / {ACHIEVEMENTS.length} Completados
          </span>
        </div>
      </div>

      {/* Selector de Categorías Interactivos */}
      <div className="flex flex-wrap gap-1.5">
        {categoriesList.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setCategory(cat);
              }
            }}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200 cursor-pointer",
              category === cat
                ? "border-emerald-600 bg-emerald-600 text-white dark:bg-emerald-600 dark:border-emerald-500 shadow-sm"
                : "border-border/60 bg-card hover:bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {CATEGORY_LABEL[cat]}
          </button>
        ))}
      </div>

      {/* Grid de Logros */}
      {filteredAchievements.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border py-12 text-center text-xs text-muted-foreground">
          No hay logros en esta categoría todavía.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredAchievements.map((achievement) => {
            const Icon = ICON_MAP[achievement.icon] ?? Leaf;
            return (
              <div
                key={achievement.id}
                className={cn(
                  "relative flex gap-3.5 rounded-2xl border p-4 transition-all duration-300",
                  achievement.unlocked
                    ? "border-border bg-card/65 shadow-sm hover:shadow-md hover:border-emerald-600/30"
                    : "border-border/20 bg-muted/5 opacity-55 hover:opacity-75"
                )}
              >
                {/* Icono de logro */}
                <div
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-xl border transition-all duration-300",
                    achievement.unlocked
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30 scale-105"
                      : "bg-muted text-muted-foreground border-border/30"
                  )}
                >
                  {achievement.unlocked ? (
                    <Icon className="size-5.5" />
                  ) : (
                    <Lock className="size-4.5" />
                  )}
                </div>

                {/* Info */}
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-xs font-extrabold leading-none text-foreground truncate">
                      {achievement.name}
                    </p>
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-[8.5px] font-extrabold uppercase border leading-none shrink-0",
                        achievement.unlocked
                          ? CATEGORY_COLOR[achievement.category]
                          : "bg-muted text-muted-foreground border-border/20"
                      )}
                    >
                      {CATEGORY_LABEL[achievement.category]}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-normal line-clamp-2">
                    {achievement.description}
                  </p>
                </div>

                {/* Check de estado */}
                {achievement.unlocked && (
                  <CheckCircle className="absolute top-3 right-3 size-4 text-emerald-600 dark:text-emerald-400" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
