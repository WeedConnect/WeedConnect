"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageSquare, Clock, Edit, Award, Sparkles } from "lucide-react";
import { UserLevel } from "@/components/gamification/user-level";
import { Achievements } from "@/components/gamification/achievements";
import { DailyQuests } from "@/components/gamification/daily-quests";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { relativeTime } from "@/lib/forum-utils";
import { cn } from "@/lib/utils";

interface ForumThread {
  id: string;
  title: string;
  slug: string;
  created_at: string;
  forum_categories: { name?: string } | null;
}

interface ProfileTabsProps {
  initialPoints: number;
  hasAvatar: boolean;
  threads: ForumThread[];
}

export function ProfileTabs({ initialPoints, hasAvatar, threads }: ProfileTabsProps) {
  const [points, setPoints] = useState(initialPoints);
  const [activeTab, setActiveTab] = useState<"actividad" | "gamificacion">("gamificacion");

  const handlePointsEarned = (earned: number) => {
    setPoints((prev) => prev + earned);
  };

  return (
    <div className="space-y-6">
      {/* Nivel y progreso destacado siempre arriba */}
      <div className="glass-panel rounded-2xl p-5 border-emerald-200/20 dark:border-brand-gold/10 bg-gradient-to-br from-muted/20 to-accent/5 shadow-inner">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 bg-accent/40 rounded-full text-brand-gold-dark dark:text-brand-gold shadow-inner shrink-0">
            <Award className="size-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-foreground tracking-tight tabular-nums">
              {points.toLocaleString("es-ES")} TXP
            </div>
            <div className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">
              Terpene Experience Points
            </div>
          </div>
        </div>
        <UserLevel points={points} />
      </div>

      {/* Selector de Pestañas */}
      <div className="flex border-b border-border/50">
        <button
          type="button"
          onClick={() => setActiveTab("gamificacion")}
          className={cn(
            "pb-3 text-xs font-bold uppercase tracking-wider border-b-2 px-4 transition-all cursor-pointer flex items-center gap-1.5",
            activeTab === "gamificacion"
              ? "border-emerald-600 text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Sparkles className="size-4" />
          Terpene XP y Logros
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("actividad")}
          className={cn(
            "pb-3 text-xs font-bold uppercase tracking-wider border-b-2 px-4 transition-all cursor-pointer flex items-center gap-1.5",
            activeTab === "actividad"
              ? "border-emerald-600 text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <MessageSquare className="size-4" />
          Actividad Foro
        </button>
      </div>

      {/* Contenido de Pestañas */}
      {activeTab === "gamificacion" ? (
        <div className="space-y-6">
          {/* Desafíos Diarios */}
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden shadow-sm">
            <CardContent className="p-6">
              <DailyQuests onPointsEarned={handlePointsEarned} />
            </CardContent>
          </Card>

          {/* Logros */}
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden shadow-sm">
            <CardContent className="p-6">
              <Achievements
                points={points}
                threadCount={threads?.length ?? 0}
                hasAvatar={hasAvatar}
              />
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Hilos Creados */
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden shadow-sm">
          <CardHeader className="pb-3 border-b border-border/40">
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
              <MessageSquare className="size-5 text-brand-green dark:text-brand-gold" />
              Hilos del Foro Creados
            </CardTitle>
            <CardDescription>Sus intervenciones y debates iniciados en la comunidad.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {!threads || threads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground space-y-2 px-4">
                <div className="p-3 bg-muted/30 rounded-full">
                  <Clock className="size-6" />
                </div>
                <p className="text-sm font-medium">Todavía no ha abierto ningún hilo en el foro.</p>
              </div>
            ) : (
              <ul className="divide-y divide-border/40">
                {threads.map((t) => (
                  <li key={t.id}>
                    <Link
                      href={`/comunidad/foro/${t.slug}`}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 transition-all duration-200 hover:bg-muted/30 group cursor-pointer"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <h4 className="text-sm font-semibold text-foreground leading-snug group-hover:text-brand-green dark:group-hover:text-brand-gold transition-colors truncate">
                          {t.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 font-medium capitalize">
                            {(t.forum_categories as { name?: string } | null)?.name || "General"}
                          </Badge>
                          <span>•</span>
                          <span>Publicado {relativeTime(t.created_at)}</span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        Ver hilo
                        <Edit className="size-3 rotate-180" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
