import type { Metadata } from "next";
import { Clock, ChefHat, Pizza, Award, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MOCK_RECETAS,
  CATEGORIA_LABEL,
  DIFICULTAD_LABEL,
  DIFICULTAD_COLOR,
  type RecetaCategoria,
} from "@/data/recetas";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Munchies, Antojos y Recetas WeedConnect",
  description: "Recomendaciones gastronómicas definitivas para el antojo: ranking de munchies comunitarios, recetas express deliciosas y ofertas en delivery cercano.",
};

const CATEGORIAS: RecetaCategoria[] = ["snack", "plato", "postre", "bebida"];

const TOP_MUNCHIES = [
  { rank: 1, nombre: "Pizza Barbacoa con Bordes Queso", votos: 342, emoji: "🍕", tag: "El Clásico" },
  { rank: 2, nombre: "Nachos Supremos Cargados", votos: 289, emoji: "🥑", tag: "Ideal para Compartir" },
  { rank: 3, nombre: "Tarrina de Helado de Chocolate Fudge", votos: 254, emoji: "🍦", tag: "Frenesí Dulce" },
  { rank: 4, nombre: "Burguer Smash Doble con Bacon", votos: 210, emoji: "🍔", tag: "Hambre Real" },
  { rank: 5, nombre: "Gominolas Ácidas Mix", votos: 188, emoji: "🍬", tag: "Para Picar" },
];

const DELIVERY_PARTNERS = [
  { nombre: "Burguer King", promo: "15% Dto con cupón WEEDCONNECT", link: "#", icon: "🍔" },
  { nombre: "Telepizza / Domino's", promo: "Ofertas 2x1 acumulables", link: "#", icon: "🍕" },
  { nombre: "UberEats / JustEat", promo: "Envío gratis en tu primer pedido", link: "#", icon: "🚴" },
];

export default function MunchiesPage() {
  const recetasPorCategoria = CATEGORIAS.map((cat) => ({
    cat,
    recetas: MOCK_RECETAS.filter((r) => r.categoria === cat),
  })).filter((g) => g.recetas.length > 0);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 animate-in fade-in duration-500">
      <PageHeader className="mb-10">
        <div className="flex items-center gap-2 text-emerald-600 mb-1">
          <Pizza className="size-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Gastro & Placer</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Munchies y recetas express</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground leading-relaxed">
          El antojo ataca, nosotros respondemos. Aquí encontrarás el ranking oficial de gules comunitarios y recetas 
          súper sencillas que puedes hacer tú mismo en 10 minutos. Sin complicaciones.
        </p>
      </PageHeader>

      {/* --- SECCIÓN 1: RANKING DE MUNCHIES --- */}
      <div className="mb-12">
        <div className="mb-4 flex items-center gap-2">
          <Award className="size-5 text-amber-500" />
          <h2 className="text-xl font-bold">Top 5 Munchies Legendarios</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {TOP_MUNCHIES.map((item) => (
            <Card key={item.rank} className="relative overflow-hidden border-amber-100 transition-all hover:shadow-md dark:border-amber-950/40 bg-gradient-to-b from-amber-50/10 to-background dark:from-amber-950/5">
              <span className="absolute top-2 right-2 text-3xl font-extrabold text-muted-foreground/10 select-none">
                #{item.rank}
              </span>
              <CardHeader className="pb-2 pt-4 px-4">
                <div className="text-3xl mb-1" aria-hidden>{item.emoji}</div>
                <CardTitle className="text-sm font-bold leading-tight pr-6">{item.nombre}</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <Badge className="border-0 text-[9px] bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 mb-2">
                  {item.tag}
                </Badge>
                <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                  ⭐ {item.votos} votos de la comunidad
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <hr className="border-border my-10" />

      {/* --- SECCIÓN 2: RECETAS --- */}
      <div className="mb-12">
        <div className="mb-6">
          <h2 className="text-xl font-bold">Recetas exprés de cocina</h2>
          <p className="text-xs text-muted-foreground mt-1">Prepara algo alucinante tú mismo en pocos minutos con lo que tienes por casa.</p>
        </div>
        
        <div className="flex flex-col gap-10">
          {recetasPorCategoria.map(({ cat, recetas }) => (
            <div key={cat} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="mb-4 flex items-center gap-2 text-md font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                <ChefHat className="size-4" aria-hidden />
                {CATEGORIA_LABEL[cat]}s
              </h3>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recetas.map((r) => (
                  <li key={r.id}>
                    <Card className="h-full transition-all hover:border-border/80 hover:shadow-sm">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground/90">
                            <span className="text-xl" aria-hidden>
                              {r.emoji}
                            </span>
                            {r.nombre}
                          </CardTitle>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <Badge
                            className={cn(
                              "border-0 text-[9px] font-bold tracking-wide uppercase",
                              DIFICULTAD_COLOR[r.dificultad],
                            )}
                          >
                            {DIFICULTAD_LABEL[r.dificultad]}
                          </Badge>
                          <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                            <Clock className="size-3" />
                            {r.tiempoMin < 60
                              ? `${r.tiempoMin} min`
                              : `${Math.floor(r.tiempoMin / 60)}h ${r.tiempoMin % 60 > 0 ? `${r.tiempoMin % 60}m` : ""}`}
                          </span>
                          {r.veganista && (
                            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 rounded py-0.5">🌿 Vegan</span>
                          )}
                          {r.sinGluten && (
                            <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-1.5 rounded py-0.5">Sin Gluten</span>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="flex flex-col gap-3 mt-1">
                        <CardDescription className="line-clamp-3 text-sm text-foreground/80 leading-relaxed">
                          {r.descripcion}
                        </CardDescription>
                        <div className="mt-auto pt-2 border-t border-border/40 flex flex-wrap gap-1">
                          {r.ingredientesPrincipales.slice(0, 4).map((ing) => (
                            <span
                              key={ing}
                              className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground border border-border/30"
                            >
                              {ing}
                            </span>
                          ))}
                          {r.ingredientesPrincipales.length > 4 && (
                            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                              +{r.ingredientesPrincipales.length - 4}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* --- SECCIÓN 3: MONETIZACIÓN / DELIVERY AFFILIATES --- */}
      <div className="mt-16 rounded-2xl overflow-hidden border border-emerald-200 dark:border-emerald-900/50 bg-emerald-500/5 dark:bg-emerald-950/10 p-6 sm:p-8 flex flex-col lg:flex-row items-center gap-8 relative shadow-inner">
        <div className="flex-1 space-y-3">
          <div className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 px-3 py-1 text-xs font-bold uppercase tracking-wide">
            🚀 Munchie express
          </div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">¿Hambre feroz y pocas ganas de cocinar?</h2>
          <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
            Hemos negociado descuentos directos en tus cadenas de comida y apps de envío a domicilio favoritas para que disfrutes de tu sesión sin moverte del sofá.
          </p>
        </div>

        <div className="w-full lg:w-[400px] flex flex-col gap-3 shrink-0">
          {DELIVERY_PARTNERS.map((p) => (
            <a 
              key={p.nombre} 
              href={p.link}
              className="flex items-center justify-between p-4 rounded-xl bg-card hover:bg-muted/40 border border-border shadow-sm hover:shadow transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{p.icon}</span>
                <div>
                  <p className="font-bold text-sm leading-tight">{p.nombre}</p>
                  <p className="text-xs text-emerald-600 font-semibold">{p.promo}</p>
                </div>
              </div>
              <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>
          ))}
        </div>
      </div>

      <p className="mt-12 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-4 text-center text-xs text-muted-foreground">
        🍔 <strong>Aviso Gastro:</strong> Las ofertas y links mostrados pertenecen a nuestro programa de afiliados locales. WeedConnect recibe una pequeña contribución para mantener la plataforma en línea por cada pedido completado, sin coste extra para ti.
      </p>
    </section>
  );
}

const PageHeader = "header";
