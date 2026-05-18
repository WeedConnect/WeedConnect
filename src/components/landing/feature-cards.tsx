import Link from "next/link";
import { MessageSquare, MapPin, ArrowRight, Film, Pizza, Gamepad2, Newspaper, ShoppingBag, BookOpen } from "lucide-react";
import { LogoWeedConnect } from "@/components/icons/logo-weedconnect";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Feature = {
  href: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

const FEATURES: Feature[] = [
  {
    href: "/comunidad/foro",
    title: "Foro y comunidad",
    description:
      "Comparte experiencias, resuelve dudas y conecta con otros aficionados en espacios temáticos.",
    icon: MessageSquare,
  },
  {
    href: "/mapa",
    title: "Mapa de spots",
    description:
      "Encuentra asociaciones, miradores chill, spots de comida y planes con amigos cerca de ti.",
    icon: MapPin,
  },
  {
    href: "/info/peliculas",
    title: "Películas & Series",
    description:
      "Selección de pelis y series clasificadas por mood: fumadón, risas, psicodélicas, terror y más.",
    icon: Film,
  },
  {
    href: "/info/munchies",
    title: "Munchies y recetas",
    description:
      "Ranking de los mejores antojos, recetas express y opciones de delivery para no moverte del sofá.",
    icon: Pizza,
  },
  {
    href: "/info/juegos",
    title: "Juegos para jugar",
    description:
      "Lista curada de videojuegos chill, juegos caóticos con amigos y propuestas de mesa.",
    icon: Gamepad2,
  },
  {
    href: "/info/noticias",
    title: "Noticias",
    description:
      "Actualidad cannábica: cambios legales, ciencia, asociaciones, cultura y tendencias.",
    icon: Newspaper,
  },
  {
    href: "/tienda/comparador",
    title: "Compras recomendadas",
    description:
      "Setup chill definitivo: grinders, vaporizadores, LEDs, altavoces y más con enlaces de afiliado.",
    icon: ShoppingBag,
  },
  {
    href: "/info/educacion",
    title: "Tips & Educación",
    description:
      "Guías para principiantes, cannabinoides, terpenos, reducción de daños y convivencia responsable.",
    icon: BookOpen,
  },
  {
    href: "/strains",
    title: "Catálogo de strains",
    description:
      "Explora variedades indica, sativa e híbridos con perfiles de aroma, efectos y THC/CBD.",
    icon: LogoWeedConnect,
  },
];

export function FeatureCards() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 bg-grid-dots relative">
      {/* Subtle ambient glows */}
      <div className="absolute top-1/3 right-0 -z-10 size-96 rounded-full bg-brand-gold/5 blur-3xl dark:bg-brand-gold/3 opacity-60" />
      <div className="absolute bottom-1/3 left-0 -z-10 size-96 rounded-full bg-brand-green/5 blur-3xl dark:bg-emerald-600/3 opacity-60" />

      <div className="mb-12 text-center relative z-10">
        <h2 className="text-3xl font-black tracking-tight sm:text-4xl text-brand-green dark:text-foreground">
          Todo lo que necesitas
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-muted-foreground font-medium">
          Funcionalidades pensadas para la comunidad, los cultivadores y los apasionados de la tecnología cannábica.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 relative z-10">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          const isCustomLogo = Icon === LogoWeedConnect;
          return (
            <Card
              key={f.title}
              className="group relative h-full overflow-hidden border-border/50 bg-background/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold/40 hover:shadow-xl hover:shadow-brand-gold/5 dark:hover:shadow-black/30"
            >
              {/* Hover border accent indicator */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand-gold to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              
              <CardHeader className="pb-3">
                <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-brand-gold/10 text-brand-gold-dark dark:bg-brand-gold/10 dark:text-brand-gold transition-colors group-hover:bg-brand-gold/20">
                  {isCustomLogo ? (
                    <Icon className="size-6 text-brand-gold-dark dark:text-brand-gold" />
                  ) : (
                    <Icon className="size-5.5 stroke-[1.5]" />
                  )}
                </div>
                <CardTitle className="text-lg font-bold tracking-tight text-foreground group-hover:text-brand-green dark:group-hover:text-brand-gold transition-colors">
                  {f.title}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground leading-relaxed min-h-[60px]">
                  {f.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href={f.href}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-green dark:text-brand-gold group/link"
                >
                  <span>Descubrir</span>
                  <ArrowRight className="size-3.5 transition-transform group-hover/link:translate-x-1" />
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
