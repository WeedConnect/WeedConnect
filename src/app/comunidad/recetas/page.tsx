import type { Metadata } from "next";
import Link from "next/link";
import { Clock, FlaskConical, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Recetas cannábicas",
  description:
    "Cocina cannábica: cannabutter, tinturas, comestibles y más. Guías de dosificación incluidas.",
};

const RECETAS_CANNABICAS = [
  {
    id: "cannabutter",
    emoji: "🧈",
    titulo: "Cannabutter clásico",
    subtitulo: "La base de casi todo",
    descripcion:
      "El cannabutter bien hecho es la base de la cocina cannábica. La clave está en la descarboxilación previa (DECARB) y en mantener una temperatura baja durante la infusión para no degradar los cannabinoides.",
    tiempoPrep: "20 min",
    tiempoTotal: "3 horas",
    dificultad: "media",
    pasos: [
      "Precalienta el horno a 110°C. Tritura el material en trozos pequeños sin hacerlo polvo.",
      "Extiéndelo en bandeja con papel de horno y hornea 40-50 min (descarboxilación). El color debe virar de verde brillante a marrón oliva.",
      "En un cazo, funde mantequilla sin sal con la misma cantidad de agua a fuego muy bajo.",
      "Añade el material descarboxilado. Mantén a 70-80°C durante 2-3 horas. Remueve ocasionalmente.",
      "Cuela con gasa o filtro fino. Refrigera. La mantequilla subirá y el agua sobrante quedará debajo.",
      "Descarta el agua. La mantequilla ya está lista.",
    ],
    consejos: [
      "No superes los 90°C o degradarás el THC.",
      "Empieza con dosis conservadoras: ½ cucharadita en una galleta y espera 2 horas antes de repetir.",
      "El efecto de los comestibles dura 4-8 horas. Mucho más que fumado/vapeado.",
    ],
  },
  {
    id: "tintura-alcohol",
    emoji: "🍶",
    titulo: "Tintura alcohólica (Green Dragon)",
    subtitulo: "Versátil y de acción rápida bajo la lengua",
    descripcion:
      "La tintura se toma con gotero bajo la lengua. Absorción más rápida que comestibles (15-45 min) y más fácil de dosificar. Se puede añadir a bebidas o usarse en recetas.",
    tiempoPrep: "15 min",
    tiempoTotal: "48+ horas",
    dificultad: "facil",
    pasos: [
      "Descarboxila el material en horno a 110°C durante 40 min.",
      "Coloca en frasco de cristal con tapa hermética.",
      "Cubre completamente con alcohol de alta graduación (mínimo 40%, mejor 70%+).",
      "Cierra y agita. Deja macerar en lugar oscuro y fresco al menos 48h, agitando una vez al día.",
      "Filtra con gasa. Guarda en frasco oscuro con gotero.",
    ],
    consejos: [
      "Cuanto más tiempo de maceración, más potente (hasta 30 días para máxima extracción).",
      "Empieza con 5-10 gotas y aumenta gradualmente.",
      "Conservar en frío o lugar fresco prolonga la vida del preparado.",
    ],
  },
  {
    id: "aceite-cannabis",
    emoji: "🫙",
    titulo: "Aceite de cannabis",
    subtitulo: "Para recetas, cápsulas y uso tópico",
    descripcion:
      "Similar al cannabutter pero usando aceite de coco o aceite de oliva. El aceite de coco tiene mejor absorción de cannabinoides por su contenido en triglicéridos de cadena media.",
    tiempoPrep: "20 min",
    tiempoTotal: "4-8 horas",
    dificultad: "media",
    pasos: [
      "Descarboxila el material en horno a 110°C durante 40 min.",
      "En baño maría o olla de cocción lenta, mezcla aceite de coco con el material.",
      "Mantén a 60-70°C durante 4-8 horas. Cuanto más tiempo, mayor extracción.",
      "Filtra con gasa o filtro de malla fina. Exprime bien el material.",
      "Deja solidificar (si usas coco) o guarda líquido (si usas oliva). Refrigera.",
    ],
    consejos: [
      "El aceite de coco es preferible por su contenido en grasas saturadas.",
      "Puedes usar una olla de cocción lenta a temperatura baja para mayor control.",
      "Sirve para cápsulas: llena con jeringuilla, mucho más fácil de dosificar que comestibles.",
    ],
  },
];

export default function RecetasPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Recetas cannábicas</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Guías para preparar cannabutter, tinturas y aceites. Incluye consejos de dosificación y
          reducción de daños.
        </p>
      </header>

      <div className="mb-8 flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-4 text-sm dark:border-amber-800 dark:bg-amber-950/30">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" aria-hidden />
        <div className="text-amber-800 dark:text-amber-200">
          <strong>Reducción de daños:</strong> Los comestibles tienen un efecto retardado (1-2h) y
          prolongado (4-8h). Empieza siempre con la dosis más baja posible. No combines con alcohol.
          Esta información es para adultos que ya han tomado la decisión de consumir.
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {RECETAS_CANNABICAS.map((receta) => (
          <Card key={receta.id}>
            <CardHeader>
              <div className="flex items-start gap-3">
                <span className="text-2xl" aria-hidden>
                  {receta.emoji}
                </span>
                <div>
                  <CardTitle className="text-lg">{receta.titulo}</CardTitle>
                  <p className="text-sm text-muted-foreground">{receta.subtitulo}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" /> Preparación: {receta.tiempoPrep}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" /> Total: {receta.tiempoTotal}
                    </span>
                    <Badge
                      className={cn(
                        "border-0 text-[10px]",
                        receta.dificultad === "facil"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
                      )}
                    >
                      {receta.dificultad === "facil" ? "Fácil" : "Media"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">{receta.descripcion}</p>

              <div>
                <h3 className="mb-2 text-sm font-semibold">Paso a paso</h3>
                <ol className="flex flex-col gap-2">
                  {receta.pasos.map((paso, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                        {i + 1}
                      </span>
                      <span>{paso}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-900 dark:bg-blue-950/30">
                <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-blue-800 dark:text-blue-200">
                  <FlaskConical className="size-3.5" />
                  Consejos clave
                </h3>
                <ul className="flex flex-col gap-1">
                  {receta.consejos.map((consejo, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-blue-700 dark:text-blue-300">
                      <span className="mt-1.5 size-1 shrink-0 rounded-full bg-blue-500" aria-hidden />
                      {consejo}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between gap-4 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-4">
        <p className="text-sm text-muted-foreground">
          ¿Tienes una receta propia? Próximamente podrás compartirla en el blog de la comunidad.
        </p>
        <Link
          href="/comunidad/blog"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "shrink-0 text-xs")}
        >
          Ver blog
        </Link>
      </div>
    </section>
  );
}
