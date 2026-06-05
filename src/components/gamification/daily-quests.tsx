"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Flame, Award, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Quest {
  id: string;
  title: string;
  description: string;
  points: number;
  href: string;
  actionText: string;
  completed: boolean;
}

const INITIAL_QUESTS: Quest[] = [
  {
    id: "explore-terpenes",
    title: "Explorador de Terpenos",
    description: "Visita el catálogo de strains y usa la nueva rueda sensorial para filtrar.",
    points: 5,
    href: "/strains",
    actionText: "Ir a strains",
    completed: false,
  },
  {
    id: "use-dose-calc",
    title: "Chef de la Comunidad",
    description: "Abre una receta e infunde tus comestibles calculando la dosis de THC.",
    points: 5,
    href: "/comunidad/recetas",
    actionText: "Ir a recetas",
    completed: false,
  },
  {
    id: "forum-reply",
    title: "Mente Abierta",
    description: "Aporta tu opinión en un hilo o crea un debate en el foro.",
    points: 10,
    href: "/comunidad/foro",
    actionText: "Ir al foro",
    completed: false,
  },
  {
    id: "explore-map",
    title: "Ruta Verde",
    description: "Navega por el mapa interactivo colaborativo de WeedConnect.",
    points: 5,
    href: "/mapa",
    actionText: "Ver mapa",
    completed: false,
  },
];

interface DailyQuestsProps {
  onPointsEarned: (points: number) => void;
  className?: string;
}

interface ToastNotification {
  id: number;
  message: string;
  points: number;
}

export function DailyQuests({ onPointsEarned, className }: DailyQuestsProps) {
  const [quests, setQuests] = useState<Quest[]>(() => {
    // Inicialización lazy: se ejecuta solo una vez, no dentro de un efecto
    if (typeof window === "undefined") return INITIAL_QUESTS;
    const saved = localStorage.getItem("weedconnect_daily_quests");
    if (saved) {
      try {
        return JSON.parse(saved) as Quest[];
      } catch {
        return INITIAL_QUESTS;
      }
    }
    return INITIAL_QUESTS;
  });
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [toastIdCounter, setToastIdCounter] = useState(0);

  const saveQuests = (updatedQuests: Quest[]) => {
    setQuests(updatedQuests);
    localStorage.setItem("weedconnect_daily_quests", JSON.stringify(updatedQuests));
  };

  const completeQuest = (id: string, points: number) => {
    const updated = quests.map((q) => {
      if (q.id === id) {
        return { ...q, completed: true };
      }
      return q;
    });

    saveQuests(updated);
    onPointsEarned(points);

    // Lanzar notificación flotante
    const questTitle = quests.find((q) => q.id === id)?.title || "Misión";
    const newToast: ToastNotification = {
      id: toastIdCounter,
      message: `¡Misión "${questTitle}" completada!`,
      points,
    };
    setToasts((prev) => [...prev, newToast]);
    setToastIdCounter((prev) => prev + 1);

    // Auto-eliminar toast después de 4 segundos
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4000);
  };

  const resetQuests = () => {
    saveQuests(INITIAL_QUESTS);
  };

  const completedCount = quests.filter((q) => q.completed).length;

  return (
    <div className={cn("space-y-5", className)}>
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-base font-extrabold text-foreground tracking-tight flex items-center gap-1.5">
            <Flame className="size-5 text-amber-500 fill-amber-500/10 animate-bounce" />
            Desafíos Diarios (TXP)
          </h3>
          <p className="text-xs text-muted-foreground">
            Completa misiones rápidas para ganar Terpene XP.
          </p>
        </div>
        {completedCount > 0 && (
          <button
            type="button"
            onClick={resetQuests}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                resetQuests();
              }
            }}
            className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
          >
            Reiniciar misiones
          </button>
        )}
      </div>

      {/* Lista de Quests */}
      <div className="space-y-3">
        {quests.map((quest) => (
          <div
            key={quest.id}
            className={cn(
              "flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border p-4 transition-all duration-300",
              quest.completed
                ? "border-emerald-600/25 bg-emerald-500/5 dark:bg-emerald-500/2"
                : "border-border bg-card/65"
            )}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className={cn("text-xs font-bold leading-tight", quest.completed && "line-through text-muted-foreground")}>
                  {quest.title}
                </h4>
                <span className="rounded bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 text-[9px] font-extrabold tracking-wider leading-none">
                  +{quest.points} TXP
                </span>
              </div>
              <p className={cn("text-[11px] text-muted-foreground leading-normal max-w-md", quest.completed && "text-muted-foreground/60")}>
                {quest.description}
              </p>
            </div>

            {/* Acciones */}
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              {!quest.completed ? (
                <>
                  <Link
                    href={quest.href}
                    className="rounded-full border border-border/80 bg-card hover:bg-muted text-muted-foreground hover:text-foreground px-3 py-1 text-[10px] font-bold transition-all flex items-center gap-1"
                  >
                    {quest.actionText}
                    <ArrowUpRight className="size-3" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => completeQuest(quest.id, quest.points)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        completeQuest(quest.id, quest.points);
                      }
                    }}
                    className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 px-3.5 py-1 text-[10px] font-extrabold transition-all cursor-pointer shadow-sm"
                  >
                    Simular
                  </button>
                </>
              ) : (
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/30">
                  <Check className="size-3.5 stroke-[3px]" />
                  Completado
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Notificaciones Flotantes de XP (Toast) */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="flex items-center gap-3 bg-zinc-950/95 dark:bg-zinc-900/95 border border-zinc-800 text-white rounded-2xl p-4 shadow-xl pointer-events-auto animate-in slide-in-from-bottom-5 fade-in duration-300"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-gold/15 border border-brand-gold/25">
              <Award className="size-5 text-brand-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-zinc-400 leading-tight">¡Logro Diario!</p>
              <p className="text-xs font-bold leading-normal text-white mt-0.5 truncate">{toast.message}</p>
            </div>
            <span className="shrink-0 text-xs font-black text-amber-400 bg-amber-400/10 px-2 py-1 rounded border border-amber-400/20 tabular-nums">
              +{toast.points} XP
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
