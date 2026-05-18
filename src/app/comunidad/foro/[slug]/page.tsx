import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MessageSquare, ThumbsUp, Pin, Lock } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getThread, getThreadPosts } from "@/lib/forum";
import { relativeTime, getCategoryStyle } from "@/lib/forum-utils";
import { createClient } from "@/lib/supabase/server";
import { ReplyForm } from "@/components/forum/reply-form";
import { VoteButton } from "@/components/forum/vote-button";
import { LocalThreadView } from "@/components/forum/local-thread-view";
import { LevelBadge } from "@/components/gamification/level-badge";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const thread = await getThread(slug);
  if (!thread) return { title: "Hilo no encontrado" };
  return {
    title: `${thread.title} — Foro WeedConnect`,
    description: thread.body.slice(0, 160).replace(/\n/g, " "),
  };
}

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const [thread, { data: { user } }] = await Promise.all([
    getThread(slug),
    supabase.auth.getUser(),
  ]);

  if (!thread) return <LocalThreadView slug={slug} />;

  const posts = await getThreadPosts(thread.id);
  const catSlug  = thread.forum_categories?.slug ?? "";
  const catName  = thread.forum_categories?.name;
  const style    = getCategoryStyle(catSlug);

  return (
    <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground flex-wrap">
        <Link href="/comunidad/foro" className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
          <ArrowLeft className="size-4" /> Foro
        </Link>
        {catName && (
          <>
            <span>/</span>
            <Link
              href={`/comunidad/foro?categoria=${catSlug}`}
              className={cn("hover:underline transition-colors font-medium", style.color)}
            >
              {style.emoji} {catName}
            </Link>
          </>
        )}
      </div>

      <article>
        <div className="flex gap-4">
          {/* Columna de votos */}
          <div className="pt-1 shrink-0">
            <VoteButton
              target="thread"
              targetId={thread.id}
              isAuthenticated={!!user}
              revalidatePath={`/comunidad/foro/${thread.slug}`}
            />
          </div>

          <div className="flex-1 min-w-0">
            {/* Meta badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {catName && (
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide border",
                    style.color, style.bg, style.border,
                  )}
                >
                  {style.emoji} {catName}
                </span>
              )}
              {thread.pinned && (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-400">
                  <Pin className="size-3" /> Fijado
                </span>
              )}
              {thread.locked && (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-400">
                  <Lock className="size-3" /> Cerrado
                </span>
              )}
            </div>

            <h1 className="text-2xl font-black tracking-tight sm:text-3xl text-foreground leading-tight">
              {thread.title}
            </h1>

            {/* Author + time */}
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <Avatar className="size-6">
                <AvatarFallback className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                  {(thread.profiles?.username ?? "?").slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-foreground">@{thread.profiles?.username ?? "anónimo"}</span>
              {thread.profiles?.points !== undefined && (
                <LevelBadge points={thread.profiles.points} />
              )}
              <span>·</span>
              <span>{relativeTime(thread.created_at)}</span>
              {thread.upvotes !== undefined && (
                <>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <ThumbsUp className="size-3.5" />
                    {thread.upvotes}
                  </span>
                </>
              )}
            </div>

            {/* Body */}
            <div className="mt-5 rounded-2xl border border-border/50 bg-muted/20 px-5 py-5 text-base leading-relaxed whitespace-pre-wrap">
              {thread.body}
            </div>

            {/* Tags */}
            {thread.tags && thread.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {thread.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-muted/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Media */}
        {thread.media_urls?.length > 0 && (
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {thread.media_urls.map((url, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="overflow-hidden rounded-xl border border-border bg-muted"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Adjunto ${i + 1}`}
                  loading="lazy"
                  className="max-h-[420px] w-full object-cover transition-transform hover:scale-[1.02]"
                />
              </a>
            ))}
          </div>
        )}
      </article>

      {/* ── Respuestas ── */}
      {posts.length > 0 && (
        <div className="mt-10 space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
            <MessageSquare className="size-4" />
            {posts.length} {posts.length === 1 ? "respuesta" : "respuestas"}
          </h2>

          {posts.map((post) => (
            <div
              key={post.id}
              className="flex gap-3 rounded-2xl border border-border/50 bg-background px-4 py-4"
            >
              <div className="shrink-0 pt-1">
                <VoteButton
                  target="post"
                  targetId={post.id}
                  isAuthenticated={!!user}
                  orientation="vertical"
                  revalidatePath={`/comunidad/foro/${thread.slug}`}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                  <Avatar className="size-6">
                    <AvatarFallback className="text-[10px] bg-muted text-muted-foreground">
                      {(post.profiles?.username ?? "?").slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-foreground">
                    @{post.profiles?.username ?? "anónimo"}
                  </span>
                  {post.profiles?.points !== undefined && (
                    <LevelBadge points={post.profiles.points} />
                  )}
                  <span>·</span>
                  <span>{relativeTime(post.created_at)}</span>
                </div>
                <p className="mt-3 leading-relaxed text-sm whitespace-pre-wrap">{post.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Responder ── */}
      <div className="mt-10 border-t border-border pt-8">
        {thread.locked ? (
          <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
            <Lock className="size-4 shrink-0" />
            Este hilo está cerrado. No se pueden añadir más respuestas.
          </div>
        ) : user ? (
          <ReplyForm threadId={thread.id} />
        ) : (
          <div className="rounded-xl border border-border bg-muted/20 px-4 py-5 text-center text-sm text-muted-foreground">
            <Link href="/auth/login" className="text-emerald-600 hover:underline font-medium">
              Inicia sesión
            </Link>{" "}
            para responder en este hilo.
          </div>
        )}
      </div>
    </section>
  );
}
