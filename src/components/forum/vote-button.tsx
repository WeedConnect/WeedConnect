"use client";

import { useState, useTransition } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { castVote, removeVote, type VoteTarget, type VoteValue } from "@/app/actions/vote";
import { cn } from "@/lib/utils";

interface VoteButtonProps {
  target: VoteTarget;
  targetId: string;
  initialScore?: number;
  initialUserVote?: VoteValue | null;
  isAuthenticated: boolean;
  revalidatePath?: string;
  orientation?: "horizontal" | "vertical";
}

export function VoteButton({
  target,
  targetId,
  initialScore = 0,
  initialUserVote = null,
  isAuthenticated,
  revalidatePath,
  orientation = "vertical",
}: VoteButtonProps) {
  const [score, setScore] = useState(initialScore);
  const [userVote, setUserVote] = useState<VoteValue | null>(initialUserVote);
  const [isPending, startTransition] = useTransition();

  const handleVote = (value: VoteValue) => {
    if (!isAuthenticated) return;

    const isRetract = userVote === value;
    const prevScore = score;
    const prevVote = userVote;

    // Optimistic update
    if (isRetract) {
      setUserVote(null);
      setScore((s) => s + (value === "up" ? -1 : 1));
    } else {
      const delta = value === "up" ? 1 : -1;
      const retractDelta = userVote ? (userVote === "up" ? -1 : 1) : 0;
      setUserVote(value);
      setScore((s) => s + delta + retractDelta);
    }

    startTransition(async () => {
      const result = isRetract
        ? await removeVote(target, targetId, revalidatePath)
        : await castVote(target, targetId, value, revalidatePath);

      if (result.error && result.error !== "no_auth") {
        // Revertir si hay error real
        setScore(prevScore);
        setUserVote(prevVote);
      }
    });
  };

  const btnBase =
    "flex items-center justify-center rounded-md p-1 transition-all disabled:pointer-events-none";

  if (orientation === "horizontal") {
    return (
      <div className="flex items-center gap-1">
        <button
          aria-label="Votar a favor"
          disabled={!isAuthenticated || isPending}
          onClick={() => handleVote("up")}
          className={cn(
            btnBase,
            "size-7",
            userVote === "up"
              ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60"
              : "text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40",
          )}
        >
          <ChevronUp className="size-4" />
        </button>
        <span
          className={cn(
            "text-xs font-bold tabular-nums min-w-[1.5rem] text-center",
            score > 0 && "text-emerald-600 dark:text-emerald-400",
            score < 0 && "text-red-500 dark:text-red-400",
            score === 0 && "text-muted-foreground",
          )}
        >
          {score > 0 ? `+${score}` : score}
        </span>
        <button
          aria-label="Votar en contra"
          disabled={!isAuthenticated || isPending}
          onClick={() => handleVote("down")}
          className={cn(
            btnBase,
            "size-7",
            userVote === "down"
              ? "text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/40"
              : "text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40",
          )}
        >
          <ChevronDown className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-0.5">
      <button
        aria-label="Votar a favor"
        disabled={!isAuthenticated || isPending}
        onClick={() => handleVote("up")}
        className={cn(
          btnBase,
          "size-8",
          userVote === "up"
            ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60"
            : "text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40",
        )}
      >
        <ChevronUp className="size-5" />
      </button>
      <span
        className={cn(
          "text-sm font-bold tabular-nums leading-none",
          score > 0 && "text-emerald-600 dark:text-emerald-400",
          score < 0 && "text-red-500 dark:text-red-400",
          score === 0 && "text-muted-foreground",
        )}
      >
        {score > 0 ? `+${score}` : score}
      </span>
      <button
        aria-label="Votar en contra"
        disabled={!isAuthenticated || isPending}
        onClick={() => handleVote("down")}
        className={cn(
          btnBase,
          "size-8",
          userVote === "down"
            ? "text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/40"
            : "text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40",
        )}
      >
        <ChevronDown className="size-5" />
      </button>
    </div>
  );
}
