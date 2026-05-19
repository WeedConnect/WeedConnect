import type { Metadata } from "next";
import { Gamepad2, Cloud, Users, Brain, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Juegos para jugar Fumado WeedConnect",
  description: "Lista definitiva de recomendaciones de videojuegos chill, juegos multijugador caóticos y juegos de mesa físicos perfectos para acompañar una sesión.",
};

const JUEGOS = [
  {
    categoria: "chill_digital",
    tituloSeccion: "Juegos Digitales Chill",
    descripcionSeccion: "Para disfrutar en solitario o de tranquis, perdiéndote por paisajes espectaculares sin presiones.",
    icon: Cloud,
    color: "text-sky-600 dark:text-sky-400",
    items: [
      { nombre: "Red Dead Redemption 2", platform: "PC / Consolas", desc: "Pasear a caballo al atardecer, pescar y perderte por la naturaleza salvaje es una de las experiencias más inmersivas que existen.", emoji: "🐎" },
      { nombre: "Minecraft", platform: "Multiplataforma", desc: "Construir tu refugio a tu ritmo, excavar con la música zen de C418 de fondo. Pura desconexión creativa.", emoji: "🧱" },
      { nombre: "Stardew Valley", platform: "Multiplataforma", desc: "Lleva una granja pixel-art, cuida tus animales, siembra y escucha el sonido de la lluvia. Relax asegurado.", emoji: "🧑‍🌾" },
      { nombre: "Skate 3 / Session", platform: "Consolas / PC", desc: "Simplemente patinar por la ciudad fluyendo con la música sin importar los puntos ni el tiempo.", emoji: "🛹" },
    ]
  },
  {
    categoria: "caoticos_amigos",
    tituloSeccion: "Juegos Caóticos con Amigos",
    descripcionSeccion: "Carcajadas aseguradas. Ideales para fiestas, donde la coordinación nula desata el caos absoluto.",
    icon: Users,
    color: "text-amber-600 dark:text-amber-400",
    items: [
      { nombre: "Gang Beasts", platform: "PC / Consolas", desc: "Muñecos de gelatina peleando y empujándose al vacío en escenarios locos. La risa es obligatoria.", emoji: "🤼" },
      { nombre: "Mario Kart 8 Deluxe", platform: "Switch", desc: "Clásico imperecedero. Piques sanos, caparazones azules y la mítica Senda Arcoíris llena de color.", emoji: "🏎️" },
      { nombre: "Overcooked! 2", platform: "Multiplataforma", desc: "Coordinarse para cocinar en cocinas que flotan o se queman. Puede destruir amistades momentáneamente de la risa.", emoji: "🍳" },
      { nombre: "Fall Guys", platform: "Multiplataforma", desc: "Carreras de obstáculos absurdas vestido de perrito caliente. Sencillo de jugar, divertidísimo de ver.", emoji: "👑" },
    ]
  },
  {
    categoria: "pensar_fisicos",
    tituloSeccion: "Juegos Físicos y de Mesa",
    descripcionSeccion: "Vuelve a lo analógico. Cartas, reflejos y retos de conversación para disfrutar en la mesa.",
    icon: Brain,
    color: "text-purple-600 dark:text-purple-400",
    items: [
      { nombre: "Jenga Clásico", platform: "Mesa", desc: "La tensión de sacar el bloque de madera cuando los reflejos no acompañan. Una explosión de emoción al caer.", emoji: "🪵", link: true },
      { nombre: "UNO / Virus!", platform: "Cartas", desc: "Reglas sencillas, cartas de colores vibrantes y dinámicas ultra-rápidas. Perfecto para rondas cortas.", emoji: "🃏", link: true },
      { nombre: "Ajedrez / Damas", platform: "Estrategia", desc: "Para los que disfrutan de un colocón cerebral, analizando jugadas pausadas y debatiendo tácticas.", emoji: "♟️" },
      { nombre: "Guatafac / Cartas Conversación", platform: "Mesa", desc: "Cartas con preguntas absurdas que disparan las anécdotas más locas del grupo.", emoji: "🗣️", link: true },
    ]
  }
];

export default function JuegosPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 animate-in fade-in duration-500">
      <PageHeader className="mb-10">
        <div className="flex items-center gap-2 text-emerald-600 mb-1">
          <Gamepad2 className="size-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Gamers & Chill</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Juegos para jugar fumado</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground leading-relaxed">
          Hemos seleccionado los títulos más inmersivos, coloridos y divertidos tanto digitales como de mesa, perfectos
          para encajar con el mood de tu sesión.
        </p>
      </PageHeader>

      <div className="flex flex-col gap-12">
        {JUEGOS.map((sec) => {
          const SecIcon = sec.icon;
          return (
            <div key={sec.categoria} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <SecIcon className={cn("size-5", sec.color)} />
                  {sec.tituloSeccion}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">{sec.descripcionSeccion}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {sec.items.map((j) => (
                  <Card key={j.nombre} className="h-full flex flex-col transition-all hover:border-border/80 hover:shadow-sm bg-card/60 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-3xl" aria-hidden>{j.emoji}</div>
                        <Badge variant="secondary" className="text-[9px] font-semibold uppercase">
                          {j.platform}
                        </Badge>
                      </div>
                      <CardTitle className="text-base mt-2 leading-tight font-bold">{j.nombre}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1 justify-between gap-3">
                      <CardDescription className="text-xs text-foreground/80 leading-relaxed flex-1">
                        {j.desc}
                      </CardDescription>
                      
                      {j.link && (
                        <a 
                          href="/tienda/comparador" 
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 hover:text-emerald-700 border border-dashed border-emerald-600/30 rounded px-2 py-1 bg-emerald-50/50 dark:bg-emerald-950/30 transition-colors w-fit mt-2"
                        >
                          🛒 Comprar recomendado <ArrowUpRight className="size-2.5" />
                        </a>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-16 rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center space-y-3">
        <p className="text-lg font-bold">🎮 ¿Falta tu juego fetiche?</p>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          En breve abriremos la sección en el foro dedicada exclusivamente a **Gamers**, donde podrás compartir tu ID, organizar partidas multijugador y recomendar tus propios descubrimientos.
        </p>
      </div>
    </section>
  );
}

const PageHeader = "header";
