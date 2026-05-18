import { createClient } from "@/lib/supabase/server";
import { MOCK_CATEGORIES, FORUM_MOCK_THREADS, MOCK_POSTS } from "@/data/forum-mock";

// Re-exportar utilidades seguras en cliente desde forum-utils
export { relativeTime, getCategoryStyle, CATEGORY_STYLES } from "@/lib/forum-utils";

// Re-exportar mock data para uso en server components
export { FORUM_MOCK_THREADS } from "@/data/forum-mock";

export type ForumCategory = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  position: number;
};

export type ForumThread = {
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
  // Campos opcionales presentes en datos demo; ausentes en resultados de Supabase
  upvotes?: number;
  tags?: string[];
  is_demo?: boolean;
};

export type ForumPost = {
  id: string;
  body: string;
  created_at: string;
  profiles: { username: string; points?: number } | null;
};

// ─── Tiempo relativo y estilos: ver forum-utils.ts ───────────────────────────

// ─── Queries Supabase con fallback demo ───────────────────────────────────────

export async function getCategories(): Promise<ForumCategory[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("forum_categories")
    .select("id, slug, name, description, position")
    .order("position");
  const categories = (data as ForumCategory[]) ?? [];
  return categories.length > 0 ? categories : (MOCK_CATEGORIES as ForumCategory[]);
}

export async function getThreads(categorySlug?: string): Promise<ForumThread[]> {
  const supabase = await createClient();

  let categoryId: string | undefined;
  if (categorySlug) {
    const { data: cat } = await supabase
      .from("forum_categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();
    categoryId = cat?.id;
  }

  let query = supabase
    .from("forum_threads")
    .select(
      "id, slug, title, body, media_urls, created_at, pinned, locked, profiles!author_id(username, points), forum_categories!category_id(name, slug)",
    )
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false });

  if (categoryId) query = query.eq("category_id", categoryId);

  const { data: threads } = await query;
  if (!threads?.length) {
    // Fallback a datos demo filtrando por categoría si se indica
    const mock = FORUM_MOCK_THREADS as ForumThread[];
    if (categorySlug) return mock.filter((t) => t.forum_categories?.slug === categorySlug);
    return mock;
  }

  // Batch reply counts
  const ids = (threads as { id: string }[]).map((t) => t.id);
  const { data: posts } = await supabase
    .from("forum_posts")
    .select("thread_id")
    .in("thread_id", ids);

  const counts: Record<string, number> = {};
  for (const p of posts ?? []) {
    const pid = (p as { thread_id: string }).thread_id;
    counts[pid] = (counts[pid] ?? 0) + 1;
  }

  return (threads as unknown as ForumThread[]).map((t) => ({
    ...t,
    reply_count: counts[t.id] ?? 0,
  }));
}

export async function getThread(slug: string): Promise<ForumThread | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("forum_threads")
    .select(
      "id, slug, title, body, media_urls, created_at, pinned, locked, profiles!author_id(username, points), forum_categories!category_id(name, slug)",
    )
    .eq("slug", slug)
    .single();
  if (data) return data as unknown as ForumThread;
  return (FORUM_MOCK_THREADS.find((t) => t.slug === slug) as ForumThread | undefined) ?? null;
}

export async function getThreadPosts(threadId: string): Promise<ForumPost[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("forum_posts")
    .select("id, body, created_at, profiles!author_id(username, points)")
    .eq("thread_id", threadId)
    .order("created_at");

  const result = (data as unknown as ForumPost[]) ?? [];
  if (result.length > 0) return result;

  // Fallback: comentarios demo por thread id
  return MOCK_POSTS[threadId] ?? [];
}

// ─── Moderación de contenido ──────────────────────────────────────────────────

const BLOCKED_PATTERNS = [
  /\bvend[oa]\b/i,
  /\bcompr[oa]\b/i,
  /\bbusco\b/i,
  /\bcontacto\b/i,
  /\btelegram\b/i,
  /\bwhatsapp\b/i,
  /\bwasap\b/i,
  /\bprecio[s]?\b/i,
  /\bdelivery\b/i,
  /\bdealer\b/i,
  /\bcamello\b/i,
  /\bpillar\b/i,
  /\bgramo[s]?\b/i,
  /\benvío[s]?\b/i,
  /\benvio[s]?\b/i,
  /\bquien tiene\b/i,
  /\bquién tiene\b/i,
  /\bdonde comprar\b/i,
  /\bdónde comprar\b/i,
  /\bme pasa[s]?\b/i,
  /\bpásame\b/i,
  /\bpasame\b/i,
  /\btienes algo\b/i,
  /\bmen[uú]\b/i,
  /\bstock\b/i,
  /\benvíos\b/i,
  /\benvios\b/i,
];

export const MODERATION_BLOCK_MESSAGE =
  "Este contenido no está permitido. WeedConnect no permite compraventa, contactos para conseguir sustancias ni intermediación.";

export function moderateContent(text: string): { blocked: boolean; message?: string } {
  const normalized = text.toLowerCase();
  const isBlocked = BLOCKED_PATTERNS.some((pattern) => pattern.test(normalized));
  if (isBlocked) {
    return { blocked: true, message: MODERATION_BLOCK_MESSAGE };
  }
  return { blocked: false };
}

// ─── Utilidades de negocio ────────────────────────────────────────────────────

export type SortableThread = {
  pinned?: boolean;
  category_position?: number;
  votes?: number;
  created_at: string;
};

export function sortThreads<T extends SortableThread>(threads: T[]): T[] {
  return [...threads].sort((a, b) => {
    const aPinned = a.pinned ? 1 : 0;
    const bPinned = b.pinned ? 1 : 0;
    if (aPinned !== bPinned) return bPinned - aPinned;
    const aPos = a.category_position ?? 9999;
    const bPos = b.category_position ?? 9999;
    if (aPos !== bPos) return aPos - bPos;
    const aVotes = a.votes ?? 0;
    const bVotes = b.votes ?? 0;
    if (aVotes !== bVotes) return bVotes - aVotes;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

export function mapPostsToThreads<T extends { id: string }, P extends { thread_id: string }>(
  threads: T[],
  posts: P[]
): Array<T & { posts: P[] }> {
  return threads.map((t) => ({
    ...t,
    posts: posts.filter((p) => p.thread_id === t.id),
  }));
}

export function mapThreadsToCategories<C extends { id: string }, T extends { category_id: string }>(
  categories: C[],
  threads: T[]
): Array<C & { threads: T[] }> {
  return categories.map((c) => ({
    ...c,
    threads: threads.filter((t) => t.category_id === c.id),
  }));
}

export function filterThreads<T extends { category_id?: string; tags?: string[] }>(
  threads: T[],
  filters: { categoryId?: string; tag?: string }
): T[] {
  return threads.filter((t) => {
    if (filters.categoryId && t.category_id !== filters.categoryId) return false;
    if (filters.tag && (!t.tags || !t.tags.includes(filters.tag))) return false;
    return true;
  });
}
