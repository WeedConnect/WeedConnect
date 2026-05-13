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
      "id, slug, title, body, created_at, pinned, locked, profiles!author_id(username), forum_categories!category_id(name, slug)",
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
      "id, slug, title, body, created_at, pinned, locked, profiles!author_id(username), forum_categories!category_id(name, slug)",
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
