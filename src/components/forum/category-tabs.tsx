"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { ForumCategory } from "@/lib/forum";

const ALL_TAB = { id: "", slug: "", name: "Todos" } as const;

export function ForumCategoryTabs({
  categories,
  active,
}: {
  categories: ForumCategory[];
  active?: string;
}) {
  const router = useRouter();
  const tabs = [ALL_TAB, ...categories];
  const current = active ?? "";

  return (
    <div className="mb-4 flex flex-wrap gap-1.5">
      {tabs.map((cat) => (
        <button
          key={cat.slug}
          onClick={() =>
            router.push(
              cat.slug ? `/comunidad/foro?categoria=${cat.slug}` : "/comunidad/foro",
            )
          }
          className={cn(
            "rounded-full border px-3 py-1 text-sm transition-colors",
            current === cat.slug
              ? "border-emerald-600 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400"
              : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground",
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
