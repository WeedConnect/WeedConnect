import { createClient } from "@/lib/supabase/server";

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
  profiles: { username: string } | null;
  forum_categories: { name: string; slug: string } | null;
  reply_count: number;
};

export type ForumPost = {
  id: string;
  body: string;
  created_at: string;
  profiles: { username: string } | null;
};

export function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "ahora mismo";
  if (m < 60) return `hace ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `hace ${h}h`;
  const d = Math.floor(h / 24);
  if (d < 30) return `hace ${d}d`;
  return new Date(dateStr).toLocaleDateString("es-ES");
}

export async function getCategories(): Promise<ForumCategory[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("forum_categories")
    .select("id, slug, name, description, position")
    .order("position");
  return (data as ForumCategory[]) ?? [];
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
      "id, slug, title, body, media_urls, created_at, pinned, locked, profiles!author_id(username), forum_categories!category_id(name, slug)",
    )
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false });

  if (categoryId) query = query.eq("category_id", categoryId);

  const { data: threads } = await query;
  if (!threads?.length) return [];

  // Batch reply counts en una sola query
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
      "id, slug, title, body, media_urls, created_at, pinned, locked, profiles!author_id(username), forum_categories!category_id(name, slug)",
    )
    .eq("slug", slug)
    .single();
  return (data as unknown as ForumThread) ?? null;
}

export async function getThreadPosts(threadId: string): Promise<ForumPost[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("forum_posts")
    .select("id, body, created_at, profiles!author_id(username)")
    .eq("thread_id", threadId)
    .order("created_at");
  return (data as unknown as ForumPost[]) ?? [];
}

// --- Moderación de contenido ---

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
  /\benvío\b/i,
  /\benvio\b/i,
  /\bquien tiene\b/i,
  /\bquién tiene\b/i,
  /\bdonde comprar\b/i,
  /\bdónde comprar\b/i,
  /\bme pasa\b/i,
  /\bme pasas\b/i,
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

// --- Pure Business Logic Utilities ---

export type SortableThread = {
  pinned?: boolean;
  category_position?: number;
  votes?: number;
  created_at: string;
};

/**
 * Sorts threads based on multiple criteria:
 * 1. Pinned threads first.
 * 2. Category position weight (lower number = higher priority).
 * 3. Votes count (higher votes = higher priority).
 * 4. Date recency (newer threads = higher priority).
 */
export function sortThreads<T extends SortableThread>(threads: T[]): T[] {
  return [...threads].sort((a, b) => {
    // 1. Pinned
    const aPinned = a.pinned ? 1 : 0;
    const bPinned = b.pinned ? 1 : 0;
    if (aPinned !== bPinned) return bPinned - aPinned;

    // 2. Category position (lower is higher priority)
    const aPos = a.category_position ?? 9999;
    const bPos = b.category_position ?? 9999;
    if (aPos !== bPos) return aPos - bPos;

    // 3. Votes (higher votes first)
    const aVotes = a.votes ?? 0;
    const bVotes = b.votes ?? 0;
    if (aVotes !== bVotes) return bVotes - aVotes;

    // 4. Date Recency
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

/**
 * Maps responses (posts) correctly to their respective threads.
 */
export function mapPostsToThreads<T extends { id: string }, P extends { thread_id: string }>(
  threads: T[],
  posts: P[]
): Array<T & { posts: P[] }> {
  return threads.map((t) => ({
    ...t,
    posts: posts.filter((p) => p.thread_id === t.id),
  }));
}

/**
 * Maps threads to their corresponding categories.
 */
export function mapThreadsToCategories<C extends { id: string }, T extends { category_id: string }>(
  categories: C[],
  threads: T[]
): Array<C & { threads: T[] }> {
  return categories.map((c) => ({
    ...c,
    threads: threads.filter((t) => t.category_id === c.id),
  }));
}

/**
 * Filters threads accurately based on category ID and/or tags.
 */
export function filterThreads<T extends { category_id?: string; tags?: string[] }>(
  threads: T[],
  filters: { categoryId?: string; tag?: string }
): T[] {
  return threads.filter((t) => {
    if (filters.categoryId && t.category_id !== filters.categoryId) {
      return false;
    }
    if (filters.tag && (!t.tags || !t.tags.includes(filters.tag))) {
      return false;
    }
    return true;
  });
}
