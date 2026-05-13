import type { Metadata } from "next";
import { BookOpen, Leaf, FlaskConical, Sprout, Droplets, Sun, Smile, HeartHandshake, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Educación y Bienestar cannábico",
  description:
    "Guías sobre ciencia cannábica, cultivo, reducción de daños y bienestar: bajar intensidad, consejos de convivencia y tips para principiantes.",
};

const GUIAS = [
  {
    icono: Sparkles,
    titulo: "Tips para Principiantes: Inicio Seguro",
    nivel: "Básico",
    descripcion:
      "Si estás explorando el cannabis por primera vez o tras mucho tiempo, la preparación mental y del espacio (Set & Setting) es clave. Empieza con suavidad para asegurar un viaje agradable.",
    puntosClave: [
      "La regla de oro: Empieza con dosis muy bajas y ve despacio. Siempre hay tiempo para más, pero nunca para menos.",
      "Método de consumo: Inhalado es más instantáneo y fácil de controlar (efecto en 5-10 min). Con comestibles, espera mínimo 2 horas antes de consumir más.",
      "Variedades equilibradas: Opta por strains con ratios 1:1 de THC y CBD. El CBD bloquea la sobreexcitación del receptor CB1.",
      "Prepara tu 'Set & Setting': Rodéate de personas de máxima confianza en un lugar donde te sientas 100% seguro.",
      "Ten hidratación y comida a mano antes de empezar.",
    ],
  },
  {
    icono: HeartHandshake,
    titulo: "Qué hacer en un 'Amarillo' (Bajón o Ansiedad)",
    nivel: "Básico",
    descripcion:
      "Un consumo excesivo o un mal contexto pueden provocar mareo, pánico o taquicardias. Mantén la calma: es una reacción física temporal, nunca letal y pasará pronto si sigues estos pasos.",
    puntosClave: [
      "Mantén la calma absoluta: Es físicamente imposible sufrir una sobredosis letal de fitocannabinoides. Lo que sientes pasará en un rato.",
      "Busca aire y descanso: Ve a una zona ventilada, túmbate de lado si estás mareado y respira de forma pausada y profunda.",
      "Azúcar e hidratación: Bebe agua fresca o zumo. Comer algo dulce o carbohidratos ayuda a estabilizar la tensión.",
      "Pimienta negra o limón: Masticar un par de bolas de pimienta negra o morder limón ayuda gracias al terpeno Cariofileno, que mitiga la ansiedad del THC.",
      "Pide ayuda a un colega: Si estás con alguien, coméntaselo con naturalidad para que te acompañe y te dé conversación tranquila.",
    ],
  },
  {
    icono: Smile,
    titulo: "Manual de Buena Convivencia y Etiqueta",
    nivel: "Básico",
    descripcion:
      "Disfrutar responsablemente implica también respetar el espacio de los demás. Un comportamiento cívico evita problemas vecinales y estigmas sociales.",
    puntosClave: [
      "Control del olor: El humo de cannabis viaja lejos. Utiliza filtros de carbono en cultivo interior o vaporizadores en casa para no molestar a los vecinos.",
      "Espacios compartidos: Evita consumir en parques infantiles, zonas concurridas o cerca de colegios. El civismo es fundamental.",
      "Respeto a los no consumidores: No todo el mundo disfruta del olor o la presencia del cannabis. Sé empático.",
      "Recogida de residuos: Si consumes en un spot libre del mapa (playa, mirador), no dejes restos ni colillas. Cuida la naturaleza.",
      "Leyes locales: Conoce la regulación de tu región para no exponerte a sanciones administrativas innecesarias.",
    ],
  },
  {
    icono: FlaskConical,
    titulo: "Cannabinoides: THC, CBD y más allá",
    nivel: "Básico",
    descripcion:
      "El cannabis produce más de 100 cannabinoides distintos. El THC es el principal responsable del efecto psicoactivo; el CBD modula ese efecto y tiene propiedades propias. Pero también existen CBG, CBN, THCV, CBDA y decenas más, cada uno con un perfil farmacológico diferente.",
    puntosClave: [
      "THC (tetrahidrocannabinol): responsable del efecto psicoactivo. Activa receptores CB1 en el cerebro.",
      "CBD (cannabidiol): no psicoactivo. Modula la respuesta al THC, tiene efectos ansiolíticos y antiinflamatorios.",
      "CBG (cannabigerol): precursor de THC y CBD. Potencial antibacteriano y neuroprotector.",
      "CBN (cannabinol): se forma al degradarse el THC. Efecto sedante suave.",
      "Ratio THC:CBD: una variedad con alto CBD reduce la ansiedad asociada al THC.",
    ],
  },
  {
    icono: Leaf,
    titulo: "Terpenos: aroma, sabor y efecto entourage",
    nivel: "Básico",
    descripcion:
      "Los terpenos son los compuestos aromáticos del cannabis (y de la mayoría de plantas). No son exclusivos del cannabis, pero en combinación con los cannabinoides producen el 'efecto entourage': el conjunto actúa de forma sinérgica, mayor que la suma de sus partes.",
    puntosClave: [
      "Mirceno: terroso, herbal. El terpeno más común en cannabis. Potencia el efecto sedante.",
      "Limoneno: cítrico. Efecto euforizante y ansiolítico. Frecuente en Sativas.",
      "Linalool: lavanda. Propiedades calmantes y antiinflamatorias.",
      "Cariofileno: picante, amaderado. Único terpeno que activa receptores CB2 directamente.",
      "Pineno: pino. Puede contrarrestar la pérdida de memoria a corto plazo del THC.",
    ],
  },
  {
    icono: BookOpen,
    titulo: "El sistema endocannabinoide (ECS)",
    nivel: "Intermedio",
    descripcion:
      "El ECS es un sistema de señalización del cuerpo humano descubierto en los años 90 investigando cómo actúa el THC. Está presente en casi todos los mamíferos y regula funciones clave: dolor, apetito, memoria, sueño, humor e inmunidad.",
    puntosClave: [
      "Receptores CB1: concentrados en el cerebro y sistema nervioso central. El THC se une preferentemente aquí.",
      "Receptores CB2: principalmente en tejido inmune. Implicados en inflamación.",
      "Endocannabinoides propios: el cuerpo produce anandamida ('la molécula de la felicidad') y 2-AG de forma natural.",
      "El cannabis actúa como una 'llave' que encaja en los receptores del ECS, modulando sus señales.",
      "Déficit endocannabinoide clínico: teoría que explica por qué algunas personas responden especialmente bien al cannabis medicinal.",
    ],
  },
  {
    icono: Sprout,
    titulo: "Ciclo de vida de la planta de cannabis",
    nivel: "Básico",
    descripcion:
      "Entender las fases de desarrollo de la planta es fundamental para cultivar con éxito. Cada etapa tiene necesidades distintas de luz, agua, nutrientes y temperatura.",
    puntosClave: [
      "Germinación (3-7 días): la semilla abre y emerge la raíz (radícula). Humedad alta, temperatura 22-26°C.",
      "Plántula (2-3 semanas): aparecen los primeros pares de hojas. Luz suave, 18h/día.",
      "Vegetativa (3-8 semanas): crecimiento explosivo. 18h de luz/día. Necesita N (nitrógeno) alto.",
      "Floración (7-12 semanas): con 12h luz/12h oscuridad. Demanda de P y K aumenta. Aparecen los cogollos.",
      "Cosecha: tricomas ámbar = efecto más corporal/sedante. Tricomas blancos lechosos = efecto más cerebral.",
    ],
  },
  {
    icono: Droplets,
    titulo: "pH y EC: las claves invisibles del cultivo",
    nivel: "Intermedio",
    descripcion:
      "Dos parámetros que los cultivadores novatos suelen ignorar y que explican la mayoría de problemas de deficiencias: el pH del agua de riego y la conductividad eléctrica (EC) del sustrato/solución nutritiva.",
    puntosClave: [
      "pH óptimo en tierra: 6.0–7.0. Fuera de rango, la planta bloquea la absorción de nutrientes.",
      "pH en hidro/coco: 5.5–6.5. El rango es más estrecho.",
      "EC (conductividad): mide la concentración de sales minerales. Alta EC en plántulas = quema de raíces.",
      "EC de referencia: plántula 0.4–0.8, vegetativa 1.0–1.6, floración 1.6–2.4 mS/cm.",
      "Regla de oro: mide siempre el pH y EC del agua que entra Y del drenaje que sale.",
    ],
  },
  {
    icono: Sun,
    titulo: "Reducción de daños: consumo informado",
    nivel: "Básico",
    descripcion:
      "El cannabis, como cualquier sustancia psicoactiva, conlleva riesgos que pueden reducirse significativamente con información y hábitos conscientes. Esta guía no pretende fomentar el consumo, sino ayudar a quienes ya consumen a hacerlo de forma más segura.",
    puntosClave: [
      "Conoce lo que consumes: si es posible, elige variedades con ratio THC:CBD conocido. El CBD mitiga los efectos negativos del THC.",
      "Empieza por poco: especialmente con comestibles, el efecto tarda 1-2h. Espera antes de repetir dosis.",
      "Evita la mezcla con alcohol: potencia los efectos negativos de ambas sustancias.",
      "Entorno seguro: consume en un lugar conocido y con personas de confianza, especialmente si es tu primera vez.",
      "No conduzcas: el THC afecta los reflejos y la percepción del tiempo. Espera mínimo 4-6 horas antes de conducir.",
    ],
  },
];

const NIVEL_COLOR: Record<string, string> = {
  Básico: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  Intermedio: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  Avanzado: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
};

export default function EducacionPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Educación cannábica</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Guías sobre ciencia cannábica, cultivo y consumo responsable. Información basada en
          evidencia, sin sensacionalismo.
        </p>
      </header>

      <div className="flex flex-col gap-6">
        {GUIAS.map((guia) => {
          const Icon = guia.icono;
          return (
            <Card key={guia.titulo}>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/40">
                    <Icon className="size-5 text-emerald-700 dark:text-emerald-300" aria-hidden />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="text-lg">{guia.titulo}</CardTitle>
                      <Badge className={`border-0 text-[10px] ${NIVEL_COLOR[guia.nivel]}`}>
                        {guia.nivel}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{guia.descripcion}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col gap-2">
                  {guia.puntosClave.map((punto, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-emerald-500" aria-hidden />
                      <span>{punto}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="mt-10 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-4 text-sm text-muted-foreground">
        <strong className="text-foreground">Nota:</strong> WeedConnect es una plataforma
        informativa y de reducción de daños. No promovemos el consumo de cannabis. Si tienes
        preguntas sobre consumo y salud, consulta con un profesional sanitario.
      </p>
    </section>
  );
}
