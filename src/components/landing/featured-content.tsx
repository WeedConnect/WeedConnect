import Link from "next/link";
import { ArrowRight, Film, ListChecks, Pizza, Building2, Gamepad2, MapPin } from "lucide-react";

const FEATURED = [
  {
    href: "/info/peliculas",
    icon: Film,
    category: "Películas",
    title: "Top pelis para una noche visual",
    description: "Desde Enter the Void hasta 2001: Odisea en el espacio. Las mejores opciones para una sesión cinematográfica.",
    accent: "bg-violet-500/10 border-violet-500/20 text-violet-600 dark:text-violet-400",
    iconColor: "text-violet-500",
  },
  {
    href: "/info/juegos",
    icon: Gamepad2,
    category: "Juegos",
    title: "Juegos para 4 colegas",
    description: "Juegos de mesa, cooperativos y videojuegos caóticos perfectos para una tarde con amigos.",
    accent: "bg-sky-500/10 border-sky-500/20 text-sky-600 dark:text-sky-400",
    iconColor: "text-sky-500",
  },
  {
    href: "/info/munchies",
    icon: Pizza,
    category: "Munchies",
    title: "Mejores munchies dulces",
    description: "Ranking definitivo: desde los clásicos Oreos hasta los combos más locos del supermercado.",
    accent: "bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400",
    iconColor: "text-orange-500",
  },
  {
    href: "/comunidad/foro/asociaciones-cannabicas",
    icon: Building2,
    category: "Guía",
    title: "Qué saber antes de una asociación",
    description: "Todo sobre cómo funcionan las asociaciones cannábicas en España: requisitos, derechos y qué esperar.",
    accent: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
    iconColor: "text-emerald-500",
  },
  {
    href: "/info/educacion",
    icon: ListChecks,
    category: "Tips",
    title: "Checklist del plan chill perfecto",
    description: "Snacks, ambiente, playlist, pelis, juegos y todo lo que no puede faltar en una tarde de relax.",
    accent: "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400",
    iconColor: "text-amber-500",
  },
  {
    href: "/mapa",
    icon: MapPin,
    category: "Mapa",
    title: "Spots de tardeo en tu ciudad",
    description: "Miradores, bares con ambiente, parques chill y rincones tranquilos para el after del after.",
    accent: "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400",
    iconColor: "text-rose-500",
  },
];

export function FeaturedContent() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-black tracking-tight sm:text-4xl text-foreground">
          Contenido destacado
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm sm:text-base text-muted-foreground font-medium">
          Ideas, guías y rankings curados por la comunidad para sacarle el máximo a cada momento.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURED.map(({ href, icon: Icon, category, title, description, accent, iconColor }) => (
          <Link
            key={href + title}
            href={href}
            className="group flex flex-col gap-3 rounded-2xl border border-border/50 bg-background/60 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20"
          >
            <div className="flex items-center gap-2.5">
              <span className={`inline-flex size-9 items-center justify-center rounded-xl border ${accent} shrink-0`}>
                <Icon className={`size-4 ${iconColor}`} />
              </span>
              <span className={`text-xs font-bold uppercase tracking-wider ${accent.split(" ").find(c => c.startsWith("text-"))}`}>
                {category}
              </span>
            </div>
            <div className="flex-1 space-y-1.5">
              <h3 className="font-bold text-foreground leading-snug group-hover:text-brand-green dark:group-hover:text-brand-gold transition-colors">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-brand-green dark:text-brand-gold">
              Ver más <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
