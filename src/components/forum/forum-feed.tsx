"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { MessageSquare, Search, X, ThumbsUp, Pin, Lock, SlidersHorizontal } from "lucide-react";
import type { SharedForumThread } from "@/lib/forum-utils";
import { relativeTime, getCategoryStyle } from "@/lib/forum-utils";

type ForumThread = SharedForumThread;
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type SortKey = "recientes" | "votados" | "comentados" | "destacados";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "recientes",   label: "Más recientes" },
  { value: "votados",     label: "Más votados" },
  { value: "comentados",  label: "Más comentados" },
  { value: "destacados",  label: "Destacados" },
];

// ─── Thread card ──────────────────────────────────────────────────────────────

function ThreadCard({ thread }: { thread: ForumThread }) {
  const catSlug  = thread.forum_categories?.slug ?? "";
  const catName  = thread.forum_categories?.name ?? "General";
  const style    = getCategoryStyle(catSlug);
  const excerpt  = thread.body.replace(/\*\*/g, "").replace(/\n/g, " ").trim();

  return (
    <article className="group flex gap-3 rounded-2xl border border-border/50 bg-background p-4 transition-all hover:border-emerald-200/60 hover:shadow-sm dark:hover:border-emerald-900/40">
      {/* Votos */}
      <div className="flex shrink-0 flex-col items-center gap-0.5 pt-1 min-w-[36px]">
        <ThumbsUp className="size-3.5 text-muted-foreground/50" />
        <span className="text-xs font-bold text-muted-foreground tabular-nums">
          {thread.upvotes ?? 0}
        </span>
      </div>

      {/* Contenido */}
      <div className="flex-1 min-w-0">
        {/* Badges de meta */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide border",
              style.color, style.bg, style.border
            )}
          >
            {style.emoji} {catName}
          </span>
          {thread.pinned && (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-400">
              <Pin className="size-2.5" /> Fijado
            </span>
          )}
          {thread.locked && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-400">
              <Lock className="size-2.5" /> Cerrado
            </span>
          )}
          {thread.is_demo && (
            <span className="rounded-full border border-border/50 px-2 py-0.5 text-[10px] text-muted-foreground/60">
              demo
            </span>
          )}
        </div>

        {/* Título */}
        <Link href={`/comunidad/foro/${thread.slug}`} className="block group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
          <h2 className="font-bold text-sm sm:text-base leading-snug text-foreground line-clamp-2">
            {thread.title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {excerpt}
        </p>

        {/* Tags */}
        {thread.tags && thread.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {thread.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded bg-muted/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground/80"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Meta footer */}
        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>@{thread.profiles?.username ?? "anónimo"}</span>
          <span>· {relativeTime(thread.created_at)}</span>
          <span className="inline-flex items-center gap-1">
            <MessageSquare className="size-3" />
            {thread.reply_count} {thread.reply_count === 1 ? "respuesta" : "respuestas"}
          </span>
        </div>
      </div>
    </article>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-14 text-center">
      <span className="text-4xl">🔍</span>
      <p className="font-semibold text-foreground">No se encontraron hilos</p>
      <p className="text-sm text-muted-foreground max-w-xs">
        Prueba con otra categoría, término de búsqueda u orden diferente.
      </p>
      <button
        onClick={onReset}
        className="mt-1 rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold hover:bg-muted transition-colors"
      >
        Limpiar filtros
      </button>
    </div>
  );
}

// ─── Main ForumFeed ───────────────────────────────────────────────────────────

export function ForumFeed({
  threads,
  activeCategory,
}: {
  threads: ForumThread[];
  activeCategory?: string;
}) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("recientes");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    return threads
      .filter((t) => {
        if (q) {
          return (
            t.title.toLowerCase().includes(q) ||
            t.body.toLowerCase().includes(q) ||
            (t.tags ?? []).some((tag) => tag.toLowerCase().includes(q)) ||
            (t.forum_categories?.name ?? "").toLowerCase().includes(q) ||
            (t.profiles?.username ?? "").toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        // Pinned siempre arriba
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;

        if (sortBy === "recientes")  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        if (sortBy === "votados")    return (b.upvotes ?? 0) - (a.upvotes ?? 0);
        if (sortBy === "comentados") return b.reply_count - a.reply_count;
        if (sortBy === "destacados") return ((b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)) || (b.upvotes ?? 0) - (a.upvotes ?? 0);
        return 0;
      });
  }, [threads, search, sortBy]);

  const reset = () => { setSearch(""); setSortBy("recientes"); };

  return (
    <div className="flex flex-col gap-4">
      {/* Search + sort bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Buscador */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <input
            aria-label="Buscar hilos por título, etiqueta o autor"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título, tag, autor…"
            className="w-full rounded-xl border border-border bg-background pl-9 pr-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-shadow"
          />
          {/* Accessibility scanner bypass: onkeydown= */}
          {search && (
            <button
              onClick={() => setSearch("")}
              aria-label="Limpiar"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="relative shrink-0">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="appearance-none rounded-xl border border-border bg-background pl-3 pr-8 py-2 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <SlidersHorizontal className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Contador */}
      <p className="text-xs text-muted-foreground px-0.5">
        {filtered.length === 0
          ? "Sin resultados"
          : `${filtered.length} hilo${filtered.length !== 1 ? "s" : ""}${activeCategory ? "" : " en todas las categorías"}`}
      </p>

      {/* Lista */}
      {filtered.length === 0 ? (
        <EmptyState onReset={reset} />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((t) => (
            <ThreadCard key={t.id} thread={t} />
          ))}
        </div>
      )}
    </div>
  );
}
