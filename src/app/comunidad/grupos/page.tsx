import type { Metadata } from "next";
import Link from "next/link";
import { Lock, Users, Leaf, Sprout, HeartPulse, ChefHat } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Grupos temáticos",
  description: "Comunidades privadas por temática: cultivo, medicinal, recreativo y cocina.",
};

const GRUPOS = [
  {
    id: "cultivo-interior",
    icono: Sprout,
    titulo: "Cultivo interior",
    descripcion:
      "Armarios, LEDs, hidro, coco, tierra… El espacio para cultivadores indoor de todos los niveles. Comparte grows, resuelve dudas y aprende de los más experimentados.",
    miembros: 342,
    privado: false,
    temas: ["indoor", "LED", "hidro", "coco", "pH", "plagas"],
    color: "emerald",
  },
  {
    id: "cultivo-exterior",
    icono: Leaf,
    titulo: "Cultivo exterior",
    descripcion:
      "Terrazas, jardines, guerrilla… Todo sobre el cultivo bajo el sol. Temporadas, variedades para exterior y tips para maximizar el rendimiento natural.",
    miembros: 218,
    privado: false,
    temas: ["outdoor", "guerrilla", "terraza", "temporadas", "plagas"],
    color: "green",
  },
  {
    id: "cannabis-medicinal",
    icono: HeartPulse,
    titulo: "Cannabis medicinal",
    descripcion:
      "Espacio para usuarios que consumen cannabis por motivos terapéuticos. Experiencias con dolor crónico, insomnio, ansiedad y epilepsia. Grupo moderado con enfoque en reducción de daños.",
    miembros: 187,
    privado: true,
    temas: ["dolor crónico", "CBD", "THC", "insomnio", "ansiedad", "médico"],
    color: "blue",
  },
  {
    id: "cocina-cannabica",
    icono: ChefHat,
    titulo: "Cocina cannábica",
    descripcion:
      "Recetas con cannabutter, tinturas e infusiones. Cálculo de dosis para comestibles, técnicas de descarboxilación y experiencias gastronómicas. ¡Comparte tus creaciones!",
    miembros: 156,
    privado: false,
    temas: ["cannabutter", "comestibles", "dosis", "recetas", "descarboxilación"],
    color: "amber",
  },
  {
    id: "reduccion-danos",
    icono: HeartPulse,
    titulo: "Reducción de daños",
    descripcion:
      "Información y apoyo para consumo consciente y seguro. Interacción con fármacos, análisis de sustancias, consumo en personas con condiciones previas. Basado en evidencia.",
    miembros: 124,
    privado: true,
    temas: ["harm reduction", "análisis", "fármacos", "salud", "test kits"],
    color: "violet",
  },
  {
    id: "primerizos",
    icono: Users,
    titulo: "Primerizos",
    descripcion:
      "¿Es tu primera vez? Este es tu espacio. Sin juicios, sin vergüenza. Preguntas básicas sobre efectos, dosis, métodos y seguridad. La comunidad te acompaña.",
    miembros: 289,
    privado: false,
    temas: ["primera vez", "dudas", "efectos", "dosis", "consejos"],
    color: "pink",
  },
];

const COLOR_MAP: Record<string, string> = {
  emerald: "bg-emerald-100 dark:bg-emerald-900/40",
  green: "bg-green-100 dark:bg-green-900/40",
  blue: "bg-blue-100 dark:bg-blue-900/40",
  amber: "bg-amber-100 dark:bg-amber-900/40",
  violet: "bg-violet-100 dark:bg-violet-900/40",
  pink: "bg-pink-100 dark:bg-pink-900/40",
};

const ICON_COLOR_MAP: Record<string, string> = {
  emerald: "text-emerald-700 dark:text-emerald-300",
  green: "text-green-700 dark:text-green-300",
  blue: "text-blue-700 dark:text-blue-300",
  amber: "text-amber-700 dark:text-amber-300",
  violet: "text-violet-700 dark:text-violet-300",
  pink: "text-pink-700 dark:text-pink-300",
};

export default function GruposPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Grupos temáticos</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Espacios privados de la comunidad organizados por intereses. Únete a los que encajen
          contigo y conecta con personas afines.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2">
        {GRUPOS.map((grupo) => {
          const Icon = grupo.icono;
          return (
            <li key={grupo.id}>
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className={cn("shrink-0 rounded-lg p-2", COLOR_MAP[grupo.color])}>
                      <Icon
                        className={cn("size-5", ICON_COLOR_MAP[grupo.color])}
                        aria-hidden
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base">{grupo.titulo}</CardTitle>
                        {grupo.privado && (
                          <span className="flex shrink-0 items-center gap-1 text-[10px] text-muted-foreground">
                            <Lock className="size-3" />
                            Privado
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="size-3" />
                        {grupo.miembros} miembros
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{grupo.descripcion}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {grupo.temas.map((tema) => (
                      <span
                        key={tema}
                        className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                      >
                        {tema}
                      </span>
                    ))}
                  </div>
                  <Link
                    href="/auth/login"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "mt-4 w-full text-xs",
                    )}
                  >
                    Unirme al grupo
                  </Link>
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>

      <p className="mt-8 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3 text-center text-sm text-muted-foreground">
        Los grupos privados requieren cuenta verificada. Próximamente: grupos con moderadores de la comunidad y solicitud de ingreso.
      </p>
    </section>
  );
}
