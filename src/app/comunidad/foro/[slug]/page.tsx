import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getThread, getThreadPosts, relativeTime } from "@/lib/forum";
import { createClient } from "@/lib/supabase/server";
import { ReplyForm } from "@/components/forum/reply-form";
import { VoteButton } from "@/components/forum/vote-button";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const thread = await getThread(slug);
  return thread ? { title: thread.title } : { title: "Hilo no encontrado" };
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

  if (!thread) notFound();

  const posts = await getThreadPosts(thread.id);

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link
        href="/comunidad/foro"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Volver al foro
      </Link>

      <article className="mt-6">
        <div className="flex gap-4">
          {/* Votos del hilo */}
          <div className="pt-1 shrink-0">
            <VoteButton
              target="thread"
              targetId={thread.id}
              isAuthenticated={!!user}
              revalidatePath={`/comunidad/foro/${thread.slug}`}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="secondary">{thread.forum_categories?.name}</Badge>
              {thread.pinned && (
                <Badge variant="outline" className="text-[10px] text-emerald-600">
                  Fijado
                </Badge>
              )}
              {thread.locked && (
                <Badge variant="outline" className="text-[10px] text-amber-600">
                  Cerrado
                </Badge>
              )}
              <span>por @{thread.profiles?.username ?? "anónimo"}</span>
              <span>· {relativeTime(thread.created_at)}</span>
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              {thread.title}
            </h1>
            <div className="mt-4 rounded-lg bg-muted/30 px-5 py-5 text-base leading-relaxed whitespace-pre-wrap">
              {thread.body}
            </div>
          </div>
        </div>

        {thread.media_urls?.length > 0 && (
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {thread.media_urls.map((url, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="overflow-hidden rounded-lg border border-border bg-muted"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Adjunto ${i + 1} del hilo`}
                  loading="lazy"
                  className="max-h-[420px] w-full object-cover transition-transform hover:scale-[1.02]"
                />
              </a>
            ))}
          </div>
        )}
      </article>

      {/* Respuestas */}
      {posts.length > 0 && (
        <div className="mt-10 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {posts.length} {posts.length === 1 ? "respuesta" : "respuestas"}
          </h2>
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex gap-3 rounded-lg border border-border bg-card px-4 py-4"
            >
              {/* Votos de la respuesta */}
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
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Avatar className="size-6">
                    <AvatarFallback className="text-[10px]">
                      {(post.profiles?.username ?? "?").slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-foreground">
                    @{post.profiles?.username ?? "anónimo"}
                  </span>
                  <span>· {relativeTime(post.created_at)}</span>
                </div>
                <p className="mt-3 leading-relaxed whitespace-pre-wrap">{post.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Formulario de respuesta */}
      <div className="mt-10 border-t border-border pt-8">
        {thread.locked ? (
          <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
            Este hilo está cerrado. No se pueden añadir más respuestas.
          </p>
        ) : user ? (
          <ReplyForm threadId={thread.id} />
        ) : (
          <p className="rounded-md border border-border bg-muted/30 px-4 py-4 text-center text-sm text-muted-foreground">
            <Link href="/auth/login" className="text-emerald-600 hover:underline">
              Inicia sesión
            </Link>{" "}
            para responder en este hilo.
          </p>
        )}
      </div>
    </section>
  );
}
