import { cn } from "@/lib/utils";
import { getLevel } from "@/lib/gamification";

interface LevelBadgeProps {
  points: number;
  className?: string;
}

export function LevelBadge({ points, className }: LevelBadgeProps) {
  const level = getLevel(points);
  return (
    <span
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border leading-none",
        level.bgColor,
        level.color,
        className,
      )}
    >
      {level.name}
    </span>
  );
}
