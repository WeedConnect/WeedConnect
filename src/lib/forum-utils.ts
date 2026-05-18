/**
 * Utilidades del foro que son seguras tanto en cliente como en servidor.
 * No importar aquí nada de next/headers, supabase/server, ni cookies.
 */

// ─── Tiempo relativo ──────────────────────────────────────────────────────────

export function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "ahora mismo";
  if (m < 60) return `hace ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `hace ${h}h`;
  const days = Math.floor(h / 24);
  if (days < 30) return `hace ${days}d`;
  return new Date(dateStr).toLocaleDateString("es-ES");
}

// ─── Estilos por categoría ────────────────────────────────────────────────────

export const CATEGORY_STYLES: Record<
  string,
  { color: string; bg: string; border: string; emoji: string }
> = {
  experiencias:  { color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/20",  border: "border-emerald-200 dark:border-emerald-900/40", emoji: "✨" },
  principiantes: { color: "text-blue-700 dark:text-blue-400",      bg: "bg-blue-50 dark:bg-blue-950/20",        border: "border-blue-200 dark:border-blue-900/40",      emoji: "🌱" },
  peliculas:     { color: "text-purple-700 dark:text-purple-400",   bg: "bg-purple-50 dark:bg-purple-950/20",    border: "border-purple-200 dark:border-purple-900/40",  emoji: "🎬" },
  munchies:      { color: "text-orange-700 dark:text-orange-400",   bg: "bg-orange-50 dark:bg-orange-950/20",    border: "border-orange-200 dark:border-orange-900/40",  emoji: "🍔" },
  juegos:        { color: "text-indigo-700 dark:text-indigo-400",   bg: "bg-indigo-50 dark:bg-indigo-950/20",    border: "border-indigo-200 dark:border-indigo-900/40",  emoji: "🎮" },
  legal:         { color: "text-amber-700 dark:text-amber-400",     bg: "bg-amber-50 dark:bg-amber-950/20",      border: "border-amber-200 dark:border-amber-900/40",    emoji: "⚖️" },
  memes:         { color: "text-pink-700 dark:text-pink-400",       bg: "bg-pink-50 dark:bg-pink-950/20",        border: "border-pink-200 dark:border-pink-900/40",      emoji: "😂" },
  productos:     { color: "text-cyan-700 dark:text-cyan-400",       bg: "bg-cyan-50 dark:bg-cyan-950/20",        border: "border-cyan-200 dark:border-cyan-900/40",      emoji: "🛠️" },
  "mapa-spots":  { color: "text-green-700 dark:text-green-400",     bg: "bg-green-50 dark:bg-green-950/20",      border: "border-green-200 dark:border-green-900/40",    emoji: "📍" },
  noticias:      { color: "text-red-700 dark:text-red-400",         bg: "bg-red-50 dark:bg-red-950/20",          border: "border-red-200 dark:border-red-900/40",        emoji: "📰" },
  // Legado
  cultivo:       { color: "text-lime-700 dark:text-lime-400",       bg: "bg-lime-50 dark:bg-lime-950/20",        border: "border-lime-200 dark:border-lime-900/40",      emoji: "🌿" },
  variedades:    { color: "text-violet-700 dark:text-violet-400",   bg: "bg-violet-50 dark:bg-violet-950/20",    border: "border-violet-200 dark:border-violet-900/40",  emoji: "🌸" },
  medicinal:     { color: "text-teal-700 dark:text-teal-400",       bg: "bg-teal-50 dark:bg-teal-950/20",        border: "border-teal-200 dark:border-teal-900/40",      emoji: "💊" },
  comunidad:     { color: "text-slate-700 dark:text-slate-400",     bg: "bg-slate-50 dark:bg-slate-950/20",      border: "border-slate-200 dark:border-slate-900/40",    emoji: "💬" },
};

export function getCategoryStyle(slug?: string | null) {
  return (
    CATEGORY_STYLES[slug ?? ""] ?? {
      color:  "text-muted-foreground",
      bg:     "bg-muted/40",
      border: "border-border/60",
      emoji:  "💬",
    }
  );
}

// ─── Tipo compartido (sin deps de servidor) ───────────────────────────────────

export type SharedForumThread = {
  id: string;
  slug: string;
  title: string;
  body: string;
  media_urls: string[];
  created_at: string;
  pinned: boolean;
  locked: boolean;
  profiles: { username: string; points?: number } | null;
  forum_categories: { name: string; slug: string } | null;
  reply_count: number;
  upvotes?: number;
  tags?: string[];
  is_demo?: boolean;
};
