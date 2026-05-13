import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NetworkBackground } from "@/components/ui/network-background";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-brand-pearl via-background to-background dark:from-brand-green-deep dark:via-background dark:to-background">
      {/* Floating Network Constellation */}
      <NetworkBackground speed={0.3} density={50} />
      
      {/* Glowing Ambient Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-20 w-full max-w-7xl h-[400px] opacity-40 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.15),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.08),transparent_60%)]" />
      
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 py-24 text-center sm:px-6 sm:py-32 relative z-10">
        <span className="inline-flex items-center rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3.5 py-1 text-xs font-semibold text-brand-gold-dark dark:text-brand-gold animate-pulse-slow">
          Comunidad · Cultivo · Clubes · Strains
        </span>
        
        <h1 className="text-balance text-4xl font-black tracking-tight sm:text-6xl text-foreground leading-[1.1]">
          El hub de la <span className="text-brand-green dark:text-gradient-gold bg-gradient-to-r from-brand-green to-emerald-700 bg-clip-text text-transparent dark:from-brand-gold-light dark:via-brand-gold dark:to-brand-gold-dark">comunidad cannábica</span>
        </h1>
        
        <p className="max-w-2xl text-pretty text-base sm:text-lg text-muted-foreground/90 leading-relaxed font-medium">
          Encuentra clubes cercanos, sigue tus cultivos, descubre nuevas variedades y comparte
          conocimiento con miles de cultivadores y aficionados. Todo en un solo sitio.
        </p>
        
        <div className="mt-4 flex flex-col gap-3 sm:flex-row w-full sm:w-auto justify-center px-4 sm:px-0">
          <Link 
            href="/comunidad" 
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-12 rounded-xl bg-brand-green text-white shadow-md hover:bg-brand-green/90 dark:bg-gradient-to-r dark:from-brand-gold dark:to-brand-gold-dark dark:text-brand-green-deep dark:shadow-brand-gold/15 hover:shadow-lg dark:hover:shadow-brand-gold/25 transition-all duration-300 font-semibold"
            )}
          >
            Explorar la comunidad <ArrowRight className="ml-1.5 size-4" />
          </Link>
          <Link
            href="/mapa"
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "h-12 rounded-xl border-border/60 bg-background/40 backdrop-blur-sm hover:bg-accent/20 transition-all font-semibold"
            )}
          >
            <MapPin className="mr-1.5 size-4 text-brand-gold-dark dark:text-brand-gold" /> Ver el mapa de clubes
          </Link>
        </div>
      </div>
    </section>
  );
}
