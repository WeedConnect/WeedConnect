import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquare, PenSquare, ShieldCheck, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { getCategories, getThreads, FORUM_MOCK_THREADS } from "@/lib/forum";
import { getCategoryStyle } from "@/lib/forum-utils";
import { createClient } from "@/lib/supabase/server";
import { ForumCategoryTabs } from "@/components/forum/category-tabs";
import { ForumFeed } from "@/components/forum/forum-feed";
import type { ForumThread } from "@/lib/forum";

export const metadata: Metadata = {
  title: "Foro — WeedConnect",
  description: "Debates, consejos y experiencias de la comunidad cannábica. Películas, munchies, juegos, legal, experiencias y más.",
  openGraph: {
    title: "Foro · WeedConnect",
    description: "Comunidad cannábica: películas, munchies, juegos, experiencias, legal y cultura.",
    images: [{ url: `/api/og?title=${encodeURIComponent("Foro WeedConnect")}&description=${encodeURIComponent("Debates y experiencias de la comunidad. Películas, munchies, juegos y más.")}`, width: 1200, height: 630 }],
  },
};

// ─── Sidebar: normas rápidas ──────────────────────────────────────────────────

function QuickRules() {
  return (
    <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/50 dark:border-emerald-900/30 dark:bg-emerald-950/10 p-4">
      <div className="flex items-center gap-2 mb-3">
        <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
        <span className="text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
          Normas rápidas
        </span>
      </div>
      <p className="text-xs text-foreground/80 leading-relaxed mb-3">
        WeedConnect es una comunidad de cultura, información y entretenimiento.{" "}
        <strong>No permitimos compraventa, contactos para conseguir sustancias ni intermediación.</strong>
      </p>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {["Sin compraventa", "Sin contactos", "Sin precios", "Respeto", "Buen rollo"].map((b) => (
          <span
            key={b}
            className="rounded-full border border-emerald-200 bg-emerald-100/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:border-emerald-800/40 dark:bg-emerald-900/20 dark:text-emerald-300"
          >
            {b}
          </span>
        ))}
      </div>
      <Link
        href="/comunidad/normas"
        className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 underline underline-offset-2 transition-colors"
      >
        Ver normas completas →
      </Link>
    </div>
  );
}

// ─── Sidebar: categorías ──────────────────────────────────────────────────────

function CategoryList({
  categories,
  threads,
  active,
}: {
  categories: Awaited<ReturnType<typeof getCategories>>;
  threads: ForumThread[];
  active?: string;
}) {
  const countBySlug: Record<string, number> = {};
  for (const t of threads) {
    const slug = t.forum_categories?.slug;
    if (slug) countBySlug[slug] = (countBySlug[slug] ?? 0) + 1;
  }

  return (
    <div className="rounded-2xl border border-border/50 bg-background p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-3">
        Categorías
      </p>
      <ul className="flex flex-col gap-1">
        <li>
          <Link
            href="/comunidad/foro"
            className={cn(
              "flex items-center justify-between rounded-lg px-2.5 py-1.5 text-sm transition-colors",
              !active
                ? "bg-emerald-50 text-emerald-700 font-semibold dark:bg-emerald-950/20 dark:text-emerald-400"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <span>Todos los hilos</span>
            <span className="text-xs tabular-nums text-muted-foreground">{threads.length}</span>
          </Link>
        </li>
        {categories.map((cat) => {
          const style = getCategoryStyle(cat.slug);
          const isActive = active === cat.slug;
          return (
            <li key={cat.id}>
              <Link
                href={`/comunidad/foro?categoria=${cat.slug}`}
                className={cn(
                  "flex items-center justify-between rounded-lg px-2.5 py-1.5 text-sm transition-colors",
                  isActive
                    ? cn("font-semibold", style.color, style.bg)
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <span className="flex items-center gap-1.5">
                  <span>{style.emoji}</span>
                  {cat.name}
                </span>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {countBySlug[cat.slug] ?? 0}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ─── Sidebar: top tags ────────────────────────────────────────────────────────

function TopTags({ threads }: { threads: ForumThread[] }) {
  const tagCount: Record<string, number> = {};
  for (const t of threads) {
    for (const tag of t.tags ?? []) {
      tagCount[tag] = (tagCount[tag] ?? 0) + 1;
    }
  }
  const top = Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);

  if (top.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border/50 bg-background p-4">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="size-3.5 text-muted-foreground" />
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Tags populares
        </p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {top.map(([tag, count]) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
          >
            #{tag}
            <span className="text-muted-foreground/50">{count}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Sidebar: destacados ──────────────────────────────────────────────────────

function FeaturedThreads({ threads }: { threads: ForumThread[] }) {
  const featured = threads
    .filter((t) => t.pinned)
    .slice(0, 3);

  if (featured.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border/50 bg-background p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-3">
        Hilos destacados
      </p>
      <ul className="flex flex-col gap-2.5">
        {featured.map((t) => {
          const style = getCategoryStyle(t.forum_categories?.slug);
          return (
            <li key={t.id}>
              <Link
                href={`/comunidad/foro/${t.slug}`}
                className="flex flex-col gap-0.5 group"
              >
                <span className={cn("text-[10px] font-bold uppercase tracking-wide", style.color)}>
                  {style.emoji} {t.forum_categories?.name}
                </span>
                <span className="text-xs font-semibold text-foreground leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                  {t.title}
                </span>
                <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-0.5">
                  <MessageSquare className="size-3" />
                  {t.reply_count} respuestas
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ─── Sidebar: stats ───────────────────────────────────────────────────────────

function ForumStats({ threads, categories }: { threads: ForumThread[]; categories: Awaited<ReturnType<typeof getCategories>> }) {
  const totalReplies = threads.reduce((acc, t) => acc + t.reply_count, 0);
  return (
    <div className="rounded-2xl border border-border/50 bg-muted/30 px-4 py-3">
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-base font-black text-foreground">{threads.length}</p>
          <p className="text-[10px] text-muted-foreground leading-tight">hilos</p>
        </div>
        <div>
          <p className="text-base font-black text-foreground">{totalReplies}</p>
          <p className="text-[10px] text-muted-foreground leading-tight">respuestas</p>
        </div>
        <div>
          <p className="text-base font-black text-foreground">{categories.length}</p>
          <p className="text-[10px] text-muted-foreground leading-tight">categorías</p>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ForoPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;
  const supabase = await createClient();

  const [categories, threads, { data: { user } }] = await Promise.all([
    getCategories(),
    getThreads(categoria),
    supabase.auth.getUser(),
  ]);

  // Para el sidebar usamos siempre todos los hilos (para stats y tags)
  const allThreads = categoria ? (FORUM_MOCK_THREADS as ForumThread[]) : threads;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {/* ── Header ── */}
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">
            <MessageSquare className="size-3.5" />
            Comunidad
          </div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl text-foreground">
            Foro WeedConnect
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground max-w-xl">
            Películas, munchies, juegos, experiencias, legal y cultura cannábica. Sin postureo.
          </p>
        </div>
        <Link
          href={user ? "/comunidad/foro/nuevo" : "/auth/login?next=/comunidad/foro/nuevo"}
          className={cn(buttonVariants({ size: "sm" }), "gap-1.5 shrink-0")}
        >
          <PenSquare className="size-4" />
          Nuevo hilo
        </Link>
      </header>

      {/* ── Layout principal (feed + sidebar) ── */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* ── Feed principal ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          {/* Category tabs */}
          <ForumCategoryTabs categories={categories} active={categoria} />

          {/* Feed con búsqueda y orden */}
          <ForumFeed threads={threads} activeCategory={categoria} />

          {/* Login CTA */}
          {!user && threads.length > 0 && (
            <p className="text-center text-sm text-muted-foreground pt-2">
              <Link href="/auth/login" className="text-emerald-600 hover:underline font-medium">
                Inicia sesión
              </Link>{" "}
              para crear hilos y responder.
            </p>
          )}
        </div>

        {/* ── Sidebar ── */}
        <aside className="flex flex-col gap-4 lg:w-72 shrink-0">
          <ForumStats threads={allThreads} categories={categories} />
          <QuickRules />
          <FeaturedThreads threads={allThreads} />
          <CategoryList categories={categories} threads={allThreads} active={categoria} />
          <TopTags threads={allThreads} />
        </aside>
      </div>
    </section>
  );
}
