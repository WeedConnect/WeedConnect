import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CreatePostBox } from "@/components/social/create-post-box";
import { PostCard } from "@/components/social/post-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MessageSquareHeart, Sparkles, ShieldAlert, LogIn } from "lucide-react";
import { SocialPost } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Muro Social — WeedConnect",
  description: "Comparte estados rápidos y conecta con la comunidad en tiempo real.",
};

export default async function FeedPage() {
  const supabase = await createClient();
  
  // 1. Comprobar autenticación
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // Vista amigable para invitar a iniciar sesión
    return (
      <section className="mx-auto max-w-2xl px-4 py-20 sm:px-6 flex flex-col items-center text-center">
        <div className="glass-panel-premium rounded-3xl p-8 sm:p-12 flex flex-col items-center max-w-md border-gradient-gold/20 relative overflow-hidden">
          {/* Efecto de resplandor de fondo */}
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-64 h-64 bg-brand-green/10 dark:bg-brand-gold/5 rounded-full blur-3xl -z-10" />
          
          <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-emerald-100 text-brand-green dark:bg-brand-gold/10 dark:text-brand-gold border border-brand-green/10 dark:border-brand-gold/20 animate-pulse-slow">
            <MessageSquareHeart className="size-8" />
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3">
            Únete a la Conversación
          </h1>
          
          <p className="text-sm text-muted-foreground leading-relaxed mb-8">
            El Muro Social es un espacio exclusivo para miembros verificados de WeedConnect. Inicia sesión para compartir micro-estados, dar "Me gusta" y conectar en tiempo real.
          </p>

          <div className="flex flex-col w-full gap-3">
            <Link
              href="/auth/login"
              className={cn(
                buttonVariants({ size: "lg" }),
                "w-full bg-brand-green text-white hover:bg-brand-green-bright dark:bg-brand-gold dark:text-brand-green-deep dark:hover:bg-brand-gold-light font-bold rounded-full shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer border-0 flex items-center justify-center gap-2"
              )}
            >
              <LogIn className="size-4" />
              <span>Iniciar Sesión</span>
            </Link>
            
            <Link
              href="/auth/registro"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full border-border bg-background/50 hover:bg-muted/50 dark:border-border/40 font-medium rounded-full cursor-pointer flex items-center justify-center gap-2"
              )}
            >
              <span>Crear Cuenta Gratis</span>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // 2. Cargar Perfil del usuario activo para pasar sus datos a CreatePostBox
  const { data: activeProfile } = await supabase
    .from("profiles")
    .select("username, display_name, avatar_url")
    .eq("id", user.id)
    .single();

  const userData = {
    username: activeProfile?.username || "usuario",
    displayName: activeProfile?.display_name || undefined,
    avatarUrl: activeProfile?.avatar_url || undefined,
  };

  // 3. Cargar los últimos 30 posts con JOIN a profiles, contar likes, incluir comentarios y bookmarks
  const { data: rawPosts, error: fetchError } = await supabase
    .from("social_posts")
    .select(`
      id,
      author_id,
      content,
      created_at,
      media_urls,
      author:profiles(id, username, display_name, avatar_url),
      social_likes(user_id),
      social_comments(
        id,
        content,
        created_at,
        author:profiles(id, username, display_name, avatar_url)
      ),
      social_bookmarks(user_id)
    `)
    .order("created_at", { ascending: false })
    .limit(30);

  // Mapeo dinámico compatible con el tipo SocialPost extendido
  const posts: SocialPost[] = (rawPosts || []).map((p: any) => ({
    id: p.id,
    authorId: p.author_id,
    content: p.content,
    createdAt: p.created_at,
    mediaUrls: p.media_urls || [],
    author: p.author ? {
      id: p.author.id,
      username: p.author.username,
      displayName: p.author.display_name,
      avatarUrl: p.author.avatar_url,
    } : undefined,
    likesCount: p.social_likes?.length || 0,
    isLikedByUser: p.social_likes?.some((l: any) => l.user_id === user.id) || false,
    commentsCount: p.social_comments?.length || 0,
    comments: (p.social_comments || [])
      .map((c: any) => ({
        id: c.id,
        postId: p.id,
        authorId: c.author?.id || "",
        content: c.content,
        createdAt: c.created_at,
        author: c.author ? {
          id: c.author.id,
          username: c.author.username,
          displayName: c.author.display_name,
          avatarUrl: c.author.avatar_url,
        } : undefined,
      }))
      .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
    bookmarksCount: p.social_bookmarks?.length || 0,
    isBookmarkedByUser: p.social_bookmarks?.some((b: any) => b.user_id === user.id) || false,
  }));

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 flex flex-col gap-8">
      {/* Título de la sección */}
      <header className="flex items-center justify-between border-b border-border/20 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 text-foreground">
            <Sparkles className="size-6 text-brand-gold animate-pulse" />
            Muro Social
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-medium">
            Timeline en tiempo real de WeedConnect
          </p>
        </div>
      </header>

      {/* Caja superior de creación */}
      <CreatePostBox user={userData} />

      {/* Mensaje de error en fetch */}
      {fetchError && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-4 flex gap-3 items-start text-sm">
          <ShieldAlert className="size-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Error al conectar con Supabase</p>
            <p className="opacity-90">No pudimos refrescar las publicaciones recientes. Por favor reintenta en unos momentos.</p>
          </div>
        </div>
      )}

      {/* Timeline de posts */}
      <div className="flex flex-col gap-4 relative">
        {/* Línea central de diseño del timeline */}
        <div className="absolute left-8 top-0 bottom-0 w-[1px] bg-gradient-to-b from-border/30 via-border/10 to-transparent -z-10 pointer-events-none hidden sm:block" />

        {posts.length === 0 && !fetchError ? (
          <div className="text-center py-16 px-6 border border-dashed border-border/50 rounded-2xl glass-panel bg-card/10 flex flex-col items-center">
            <div className="size-12 flex items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
              <MessageSquareHeart className="size-6 opacity-50" />
            </div>
            <p className="text-lg font-semibold text-foreground">Aún no hay publicaciones</p>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              ¡Sé la primera persona de la comunidad en compartir algo increíble en este muro social!
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} currentUserId={user.id} />
          ))
        )}
      </div>
    </main>
  );
}
