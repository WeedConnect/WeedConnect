import type { Metadata } from "next";
import Link from "next/link";
import { Trophy, Medal, Award } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LevelBadge } from "@/components/gamification/level-badge";

export const metadata: Metadata = {
  title: "Ranking de Cultivadores",
  description: "Los cultivadores más activos de WeedConnect por puntos de experiencia.",
};

type RankedUser = {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  points: number;
};

const MOCK_RANKING: RankedUser[] = [
  { id: "1", username: "growmaster_esp",  display_name: "GrowMaster",      avatar_url: null, points: 2350 },
  { id: "2", username: "cannabispharm",   display_name: "Cannabis Pharm",   avatar_url: null, points: 1820 },
  { id: "3", username: "verde_profundo",  display_name: "Verde Profundo",   avatar_url: null, points: 1240 },
  { id: "4", username: "semillera_bcn",   display_name: "Semillera BCN",    avatar_url: null, points:  980 },
  { id: "5", username: "haze_hunter",     display_name: "Haze Hunter",      avatar_url: null, points:  710 },
  { id: "6", username: "cogollero_mad",   display_name: "Cogollero MAD",    avatar_url: null, points:  530 },
  { id: "7", username: "terpenator",      display_name: "Terpenator",       avatar_url: null, points:  380 },
  { id: "8", username: "indoor_zen",      display_name: "Indoor Zen",       avatar_url: null, points:  210 },
  { id: "9", username: "canabinoide42",   display_name: "Canabinoide42",    avatar_url: null, points:  120 },
  { id: "10", username: "primer_cultivo", display_name: "Primer Cultivo",   avatar_url: null, points:   55 },
];

async function getRanking(): Promise<RankedUser[]> {
  const supabaseReady = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
  if (!supabaseReady) return MOCK_RANKING;

  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, points")
    .order("points", { ascending: false })
    .limit(50);

  return (data as RankedUser[] | null) ?? MOCK_RANKING;
}

const PODIUM_ICONS = [
  <Trophy key={1} className="size-5 text-brand-gold" />,
  <Medal key={2} className="size-5 text-slate-400" />,
  <Award key={3} className="size-5 text-amber-600" />,
];

export default async function RankingPage() {
  const ranking = await getRanking();
  const [gold, silver, bronze, ...rest] = ranking;
  const podium = [gold, silver, bronze].filter(Boolean);

  return (
    <main className="min-h-screen bg-background pb-16">
      {/* Cabecera */}
      <div className="bg-gradient-to-br from-brand-green via-emerald-900 to-brand-green-deep border-b border-border/20 py-14 px-4 text-center">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-3">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-brand-gold/20 ring-1 ring-brand-gold/30">
            <Trophy className="size-7 text-brand-gold" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Ranking de Cultivadores
          </h1>
          <p className="text-sm text-emerald-200/80 max-w-sm">
            Los miembros más activos de WeedConnect. Gana puntos participando en el foro,
            completando logros y contribuyendo a la comunidad.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        {/* Podio top 3 */}
        {podium.length > 0 && (
          <div className={`mt-10 grid gap-3 sm:gap-4 justify-center ${podium.length === 1 ? "grid-cols-1 max-w-[180px] mx-auto" : podium.length === 2 ? "grid-cols-2 max-w-xs mx-auto" : "grid-cols-3"}`}>
            {podium.map((user, i) => (
              <Link
                key={user.id}
                href={`/perfil/${user.username}`}
                className="group flex flex-col items-center gap-2 rounded-2xl border border-border/50 bg-card p-4 text-center transition-all hover:border-brand-gold/30 hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className="relative">
                  <Avatar className="size-16 ring-2 ring-border group-hover:ring-brand-gold/40 transition-all">
                    <AvatarImage src={user.avatar_url ?? undefined} alt={user.username} />
                    <AvatarFallback className="bg-brand-green text-brand-pearl dark:bg-emerald-800 font-bold text-lg">
                      {user.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-2 -right-2 flex size-7 items-center justify-center rounded-full bg-card ring-2 ring-border">
                    {PODIUM_ICONS[i]}
                  </div>
                </div>
                <div className="space-y-1 min-w-0 w-full">
                  <p className="text-xs font-semibold truncate text-foreground">
                    {user.display_name || user.username}
                  </p>
                  <LevelBadge points={user.points} />
                  <p className="text-xs font-bold text-muted-foreground tabular-nums">
                    {user.points.toLocaleString("es-ES")} pts
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Lista posiciones 4+ */}
        {rest.length > 0 && (
          <div className="mt-6 rounded-2xl border border-border/40 bg-card/50 overflow-hidden shadow-sm">
            <ul className="divide-y divide-border/40">
              {rest.map((user, i) => (
                <li key={user.id}>
                  <Link
                    href={`/perfil/${user.username}`}
                    className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-muted/30 group"
                  >
                    <span className="w-6 shrink-0 text-center text-sm font-bold text-muted-foreground tabular-nums">
                      {i + 4}
                    </span>
                    <Avatar className="size-9 shrink-0">
                      <AvatarImage src={user.avatar_url ?? undefined} alt={user.username} />
                      <AvatarFallback className="bg-emerald-900/60 text-emerald-300 text-xs font-bold">
                        {user.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate text-foreground group-hover:text-brand-green dark:group-hover:text-brand-gold transition-colors">
                        {user.display_name || user.username}
                        <span className="text-muted-foreground font-normal ml-1">
                          @{user.username}
                        </span>
                      </p>
                    </div>
                    <LevelBadge points={user.points} className="shrink-0" />
                    <span className="shrink-0 text-sm font-bold tabular-nums text-muted-foreground">
                      {user.points.toLocaleString("es-ES")} pts
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Cómo ganar puntos */}
        <div className="mt-8 rounded-2xl border border-emerald-200/30 dark:border-emerald-800/30 bg-emerald-50/50 dark:bg-emerald-950/20 p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-4">
            ¿Cómo ganar puntos?
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {[
              ["Crear un hilo en el foro", "+10 pts"],
              ["Responder a un hilo", "+3 pts"],
              ["Recibir un voto positivo", "+5 pts"],
              ["Completar tu perfil (avatar)", "+15 pts"],
              ["Añadir una entrada al grow log", "+5 pts"],
              ["Logros desbloqueados", "varía"],
            ].map(([accion, pts]) => (
              <li key={accion} className="flex items-center justify-between">
                <span>{accion}</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{pts}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
