import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquare, PenSquare } from "lucide-react";
import { VoteButton } from "@/components/forum/vote-button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { getCategories, getThreads, relativeTime } from "@/lib/forum";
import { createClient } from "@/lib/supabase/server";
import { ForumCategoryTabs } from "@/components/forum/category-tabs";

export const metadata: Metadata = {
  title: "Foro",
  description: "Debates, consejos y experiencias de la comunidad cannábica. Cultivo, legal, variedades, medicinal y más.",
  openGraph: {
    title: "Foro · WeedConnect",
    description: "Debates y experiencias de la comunidad cannábica. Cultivo, legalidad, variedades, medicinal.",
    images: [{ url: `/api/og?title=${encodeURIComponent("Foro WeedConnect")}&description=${encodeURIComponent("Debates y experiencias de la comunidad. Cultivo, legalidad, variedades y medicinal.")}`, width: 1200, height: 630 }],
  },
};

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

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Foro</h1>
          <p className="mt-2 text-muted-foreground">
            Discusiones de la comunidad cannábica.
          </p>
        </div>
        <Link
          href={user ? "/comunidad/foro/nuevo" : "/auth/login?next=/comunidad/foro/nuevo"}
          className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
        >
          <PenSquare className="size-4" />
          Nuevo hilo
        </Link>
      </header>

      <ForumCategoryTabs categories={categories} active={categoria} />

      {threads.length === 0 ? (
        <p className="mt-10 text-center text-muted-foreground">
          No hay hilos todavía en esta categoría.{" "}
          {user ? (
            <Link href="/comunidad/foro/nuevo" className="text-emerald-600 hover:underline">
              ¡Sé el primero en escribir!
            </Link>
          ) : (
            <>
              <Link href="/auth/login" className="text-emerald-600 hover:underline">
                Inicia sesión
              </Link>{" "}
              para crear el primero.
            </>
          )}
        </p>
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {threads.map((t) => (
            <li key={t.id} className="flex items-start gap-3 px-4 py-4 transition-colors hover:bg-muted/50">
              {/* Votos — fuera del <Link> para no interferir con la navegación */}
              <div className="shrink-0 pt-0.5" onClick={(e) => e.stopPropagation()}>
                <VoteButton
                  target="thread"
                  targetId={t.id}
                  isAuthenticated={!!user}
                  orientation="vertical"
                  revalidatePath="/comunidad/foro"
                />
              </div>

              {/* Contenido clickable → navega al hilo */}
              <Link
                href={`/comunidad/foro/${t.slug}`}
                className="flex min-w-0 flex-1 items-start gap-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="text-[10px]">
                      {t.forum_categories?.name}
                    </Badge>
                    {t.pinned && (
                      <Badge variant="outline" className="text-[10px] text-emerald-600">
                        Fijado
                      </Badge>
                    )}
                    {t.locked && (
                      <Badge variant="outline" className="text-[10px] text-amber-600">
                        Cerrado
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      por @{t.profiles?.username ?? "anónimo"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      · {relativeTime(t.created_at)}
                    </span>
                  </div>
                  <h2 className="mt-1 font-semibold leading-snug">{t.title}</h2>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {t.body}
                  </p>
                </div>
                <div className="hidden shrink-0 flex-col items-end gap-1 text-xs text-muted-foreground sm:flex">
                  <span className="inline-flex items-center gap-1">
                    <MessageSquare className="size-3.5" /> {t.reply_count}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {!user && threads.length > 0 && (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/auth/login" className="text-emerald-600 hover:underline">
            Inicia sesión
          </Link>{" "}
          para crear hilos y responder.
        </p>
      )}
    </section>
  );
}
