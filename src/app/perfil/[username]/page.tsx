import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalendarDays,
  Award,
  MessageSquare,
  Edit,
  Leaf,
  Sprout,
  Clock
} from "lucide-react";
import { UserLevel } from "@/components/gamification/user-level";
import { Achievements } from "@/components/gamification/achievements";
import { createClient } from "@/lib/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { relativeTime } from "@/lib/forum";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, username")
    .eq("username", username)
    .single();

  if (!profile) {
    return { title: "Usuario no encontrado" };
  }

  return {
    title: `${profile.display_name || profile.username} (@${profile.username}) | WeedConnect`,
    description: `Perfil del cultivador ${profile.display_name || profile.username} en WeedConnect.`,
  };
}

export default async function PerfilPage({ params }: PageProps) {
  const { username } = await params;

  const supabaseReady = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  if (!supabaseReady) {
    return <PerfilDemo username={username} />;
  }

  const supabase = await createClient();

  // 1. Obtener perfil
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (!profile) {
    notFound();
  }

  // 2. Obtener sesión del visualizador para comprobar si es el propio perfil
  const { data: { user } } = await supabase.auth.getUser();
  const isOwnProfile = user?.id === profile.id;

  // 3. Obtener actividad reciente (últimos hilos creados)
  const { data: threads } = await supabase
    .from("forum_threads")
    .select("id, title, slug, created_at, forum_categories!category_id(name)")
    .eq("author_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(5);

  // Formatear fecha de registro
  const fechaRegistro = new Date(profile.created_at).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
  });

  // Mapear roles
  const ROLES_MAP = {
    user: { label: "Cultivador", class: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/40" },
    moderator: { label: "Moderador", class: "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200/50 dark:border-blue-800/40" },
    admin: { label: "Administrador", class: "bg-brand-gold/10 dark:bg-brand-gold/10 text-brand-gold-dark dark:text-brand-gold border-brand-gold/20" }
  };

  const roleStyle = ROLES_MAP[profile.role as keyof typeof ROLES_MAP] || ROLES_MAP.user;

  return (
    <main className="min-h-screen pb-12 bg-background relative overflow-hidden">
      {/* Decoración de fondo sutil */}
      <div className="absolute inset-0 bg-grid-dots opacity-30 pointer-events-none" />
      
      {/* Hero Banner */}
      <div className="h-48 sm:h-64 w-full bg-gradient-to-br from-brand-green via-emerald-900 to-brand-green-deep relative border-b border-border/20">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-gold via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 relative -mt-20">
        {/* Tarjeta Principal de Perfil */}
        <div className="glass-panel-premium rounded-3xl bg-card p-6 sm:p-8 shadow-xl border-gradient-gold">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
            {/* Avatar con Anillo Premium */}
            <div className="relative shrink-0 border-4 border-card rounded-full bg-card shadow-lg -mt-16 sm:-mt-24 z-10 overflow-visible">
              <div className="rounded-full p-1 bg-gradient-to-br from-brand-gold-light via-brand-gold to-brand-gold-dark">
                <Avatar className="size-28 sm:size-32 select-none border-2 border-card">
                  <AvatarImage src={profile.avatar_url || undefined} alt={profile.username} />
                  <AvatarFallback className="bg-brand-green text-brand-pearl dark:bg-brand-gold dark:text-black text-3xl font-bold">
                    {profile.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              {profile.points >= 500 && (
                <div className="absolute bottom-0 right-0 bg-brand-gold text-black font-bold rounded-full p-1.5 shadow-lg ring-2 ring-card" title="Usuario Verificado / Pro">
                  <Award className="size-5" />
                </div>
              )}
            </div>

            {/* Información de Identidad */}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">
                  {profile.display_name || profile.username}
                </h1>
                <Badge variant="outline" className={`font-semibold tracking-wide text-[10px] uppercase ${roleStyle.class}`}>
                  {roleStyle.label}
                </Badge>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground font-medium">@{profile.username}</p>
              
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground pt-1 font-medium">
                <span className="flex items-center gap-1">
                  <CalendarDays className="size-3.5 text-brand-green/70 dark:text-brand-gold/70" />
                  Se unió en {fechaRegistro}
                </span>
                {profile.age_verified && (
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <Leaf className="size-3.5" />
                    Cultivador +18 Verificado
                  </span>
                )}
              </div>
            </div>

            {/* Acciones del Perfil */}
            <div className="shrink-0 self-start sm:self-end mt-2 sm:mt-0 flex items-center gap-2 w-full sm:w-auto">
              {isOwnProfile ? (
                <Link
                  href="/perfil/editar"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "w-full sm:w-auto gap-1.5 font-medium hover:bg-accent/10",
                  )}
                >
                  <Edit className="size-3.5" />
                  Editar perfil
                </Link>
              ) : (
                <Button size="sm" className="w-full sm:w-auto gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-medium" disabled>
                  <Sprout className="size-3.5" />
                  Seguir (próximamente)
                </Button>
              )}
            </div>
          </div>

          <Separator className="my-6 bg-border/50" />

          {/* Biografía y Tarjetas de Estadísticas */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Bio */}
            <div className="md:col-span-2 space-y-3">
              <h3 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">Sobre mí</h3>
              <p className="text-foreground/90 text-sm sm:text-base leading-relaxed bg-muted/20 p-4 rounded-xl border border-border/30 whitespace-pre-line">
                {profile.bio || "Este cultivador prefiere mantener un perfil misterioso... Aún no ha escrito su biografía."}
              </p>
            </div>

            {/* Nivel y progreso */}
            <div className="space-y-3 flex flex-col">
              <h3 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">Nivel</h3>
              <div className="flex-1 glass-panel rounded-2xl p-4 flex flex-col justify-center space-y-4 border-emerald-200/20 dark:border-brand-gold/10 bg-gradient-to-br from-muted/10 to-accent/5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-accent/40 rounded-full text-brand-gold-dark dark:text-brand-gold shadow-inner shrink-0">
                    <Award className="size-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-foreground tracking-tight">{profile.points}</div>
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Puntos WeedConnect</div>
                  </div>
                </div>
                <UserLevel points={profile.points} />
              </div>
            </div>
          </div>
        </div>

        {/* Secciones de Contenido del Usuario */}
        <div className="mt-8 space-y-6">

          {/* Logros / Gamificación */}
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden shadow-sm">
            <CardContent className="p-6">
              <Achievements
                points={profile.points}
                threadCount={threads?.length ?? 0}
                hasAvatar={!!profile.avatar_url}
              />
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden shadow-sm">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
                <MessageSquare className="size-5 text-brand-green dark:text-brand-gold" />
                Hilos del Foro Creados
              </CardTitle>
              <CardDescription>Sus intervenciones y debates iniciados en la comunidad.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {!threads || threads.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground space-y-2 px-4">
                  <div className="p-3 bg-muted/30 rounded-full">
                    <Clock className="size-6" />
                  </div>
                  <p className="text-sm font-medium">Todavía no ha abierto ningún hilo en el foro.</p>
                </div>
              ) : (
                <ul className="divide-y divide-border/40">
                  {threads.map((t) => (
                    <li key={t.id}>
                      <Link 
                        href={`/comunidad/foro/${t.slug}`}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 transition-all duration-200 hover:bg-muted/30 group cursor-pointer"
                      >
                        <div className="space-y-1 min-w-0 flex-1">
                          <h4 className="text-sm font-semibold text-foreground leading-snug group-hover:text-brand-green dark:group-hover:text-brand-gold transition-colors truncate">
                            {t.title}
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 font-medium capitalize">
                              {(t.forum_categories as { name?: string } | null)?.name || "General"}
                            </Badge>
                            <span>•</span>
                            <span>Publicado {relativeTime(t.created_at)}</span>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          Ver hilo
                          <Edit className="size-3 rotate-180" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

function PerfilDemo({ username }: { username: string }) {
  const initials = username.substring(0, 2).toUpperCase();
  return (
    <main className="min-h-screen pb-12 bg-background">
      <div className="h-48 sm:h-64 w-full bg-gradient-to-br from-brand-green via-emerald-900 to-brand-green-deep relative border-b border-border/20" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 relative -mt-20">
        <div className="rounded-3xl bg-card p-6 sm:p-8 shadow-xl border border-border/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
            <div className="relative shrink-0 border-4 border-card rounded-full bg-card shadow-lg -mt-16 sm:-mt-24 z-10">
              <div className="rounded-full p-1 bg-gradient-to-br from-brand-gold-light via-brand-gold to-brand-gold-dark">
                <div className="size-28 sm:size-32 rounded-full bg-brand-green flex items-center justify-center text-brand-pearl text-3xl font-bold border-2 border-card select-none">
                  {initials}
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">@{username}</h1>
                <Badge variant="outline" className="text-[10px] uppercase font-semibold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200/50">
                  Cultivador
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground font-medium">@{username}</p>
            </div>
          </div>

          <Separator className="my-6 bg-border/50" />

          <div className="rounded-md border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-700/40 dark:bg-amber-950/40 dark:text-amber-200">
            ⚠ Los perfiles de usuario requieren Supabase configurado. Conecta tu proyecto en{" "}
            <code className="text-xs font-mono">.env.local</code> para ver este perfil real.
          </div>
        </div>
      </div>
    </main>
  );
}
