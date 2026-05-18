export type BlogCategoria =
  | "cultivo"
  | "experiencias"
  | "ciencia"
  | "comunidad"
  | "gastronomia";

export interface BlogPost {
  id: string;
  slug: string;
  titulo: string;
  extracto: string;
  contenido?: string;
  categoria: BlogCategoria;
  autor: string;
  fecha: string;
  minutosLectura: number;
  destacado?: boolean;
}

export const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    slug: "primer-cultivo-indoor-armario-80x80",
    titulo: "Mi primer cultivo en armario 80×80: todo lo que aprendí (y lo que salió mal)",
    extracto:
      "Decidí cultivar por primera vez con un armario de 80×80 cm, una LEC 315W y dos plantas de White Widow. Aquí cuento el proceso completo, los errores que cometí y qué cambiaría si volviera a empezar.",
    contenido: `Llevaba dos años leyendo sobre cultivo antes de dar el paso. Tenía el espacio, el tiempo y las ganas. Lo que no tenía era experiencia real. Este artículo es para todos los que están donde yo estaba: con muchas dudas y pocas respuestas concretas.

**El setup inicial**

Armario Secret Jardin 80×80×160 cm. Lámpara LEC 315W de Sunmaster. Extractor de 400 m³/h con carbón activo. Sustrato BioBizz Light Mix. Fertilizantes orgánicos de la misma marca. Dos semillas feminizadas de White Widow de Sensi Seeds. Presupuesto total: unos 600 euros entre todo.

Parecía suficiente. Y técnicamente lo era. El problema estuvo en la ejecución.

**Semana 1-3: germinación y primeras hojas**

Germiné en vaso de agua durante 36 horas y luego directamente al sustrato húmedo bajo un vaso de plástico para mantener la humedad. Las dos germinaron en 48 horas. Hasta aquí todo bien.

El error de esta fase: regué demasiado. La tierra tardaba 5-6 días en secarse bien, pero yo la regaba cada 2-3 porque veía que la superficie estaba seca. Resultado: raíces con poco oxígeno y crecimiento más lento de lo esperado.

**Semana 4-6: crecimiento vegetativo**

Empecé con la nutrición demasiado pronto y con dosis demasiado altas. El fabricante dice "empieza con el 25% de la dosis recomendada". Yo empecé con el 50%. Las hojas empezaron a mostrar las puntas quemadas. Tardé una semana en identificarlo como exceso de nutrición y otra en que las plantas se recuperaran.

Lo que cambiaría: haber esperado dos semanas más antes de fertilizar y empezar con dosis mínimas.

**Semana 7-12: prefloración y floración**

Cambié el fotoperiodo a 12/12 horas. Las plantas mostraron sexo femenino a los 10 días. Aquí el cultivo empezó a ponerse interesante. Los colas empezaron a crecer rápido y el olor se intensificó —fue cuando me alegré de haber invertido en un buen carbón activo.

Problema en esta fase: la temperatura nocturna bajó demasiado (18°C). Las plantas aguantaron pero el crecimiento fue más lento. Solución: un pequeño calefactor cerámico en modo eco.

**Semana 13-16: maduración y cosecha**

Usé lupa de 60x para revisar los tricomas cada 3 días desde la semana 12. En la semana 14 la mitad eran lechosos y el 10% ámbar. Corté.

Producción total: 68 gramos secos de dos plantas. Sabiendo lo que sé ahora podría haber sacado 100g fácilmente.

**Resumen de errores y aprendizajes**

El exceso de riego es el error número uno de los novatos —yo incluido. Las plantas quieren ciclos de mojado/secado, no tierra permanentemente húmeda. Segundo: la paciencia con los nutrientes. Menos es más, siempre. Tercero: controlar la temperatura nocturna, que es tan importante como la diurna.

¿Repetiría la experiencia? Sin ninguna duda. El segundo cultivo salió mucho mejor.`,
    categoria: "cultivo",
    autor: "verde_novato",
    fecha: "2024-03-20",
    minutosLectura: 8,
    destacado: true,
  },
  {
    id: "2",
    slug: "sistema-endocannabinoide-que-es",
    titulo: "El sistema endocannabinoide explicado para no científicos",
    extracto:
      "¿Por qué el cannabis interactúa con nuestro cuerpo? Descubrimos el ECS en los años 90 y todavía nos sorprende: receptores CB1, CB2, anandamida y 2-AG. Una guía accesible de lo que la ciencia sabe hoy.",
    contenido: `En 1992, el químico israelí Raphael Mechoulam —el mismo que aisló el THC en los 60— descubrió algo que cambiaría para siempre nuestra comprensión del cannabis: el sistema endocannabinoide (ECS). El nombre viene de "endo" (dentro) + cannabinoide. Literalmente, el sistema de cannabinoides que ya teníamos dentro.

**¿Qué es el sistema endocannabinoide?**

Es una red de receptores, moléculas señalizadoras y enzimas que regula funciones fundamentales del organismo: el estado de ánimo, el apetito, el dolor, la memoria, el sueño y la respuesta inflamatoria, entre otros. No lo tenemos para procesar el cannabis —lo tenemos para mantener la homeostasis, el equilibrio interno del cuerpo.

El cannabis simplemente "encaja" en este sistema porque sus cannabinoides —THC, CBD, CBG y más de 100 compuestos— son estructuralmente similares a los endocannabinoides que producimos de forma natural.

**Los receptores: CB1 y CB2**

CB1 se encuentra principalmente en el sistema nervioso central: cerebro, médula espinal, nervios periféricos. Es el receptor que explica los efectos psicoactivos del THC —alteración de la percepción, euforia, distorsión temporal.

CB2 se localiza sobre todo en el sistema inmune y los tejidos periféricos. Es el receptor que más interesa a la investigación médica: regula la inflamación sin generar efectos psicoactivos relevantes.

**Los endocannabinoides propios del cuerpo**

Nuestro cuerpo produce sus propios cannabinoides. Los más estudiados son la anandamida —cuyo nombre viene del sánscrito "ananda", felicidad— y el 2-araquidonoilglicerol (2-AG). La anandamida se une principalmente al CB1 y modula el dolor, la motivación y el apetito. El 2-AG actúa sobre ambos receptores y tiene un papel clave en la respuesta inmune.

**THC vs CBD: dos mecanismos muy distintos**

El THC se une directamente a los receptores CB1 activándolos. De ahí el "subidón": ese estado alterado viene de la activación directa de los receptores que normalmente responden a la anandamida, pero con mayor intensidad y duración.

El CBD no se une directamente a CB1 ni CB2. Actúa de forma indirecta: inhibe la enzima que degrada la anandamida, lo que aumenta sus niveles naturales. También interactúa con receptores de serotonina, vainilloide y otros. Eso explica por qué el CBD no coloca pero sí puede tener efectos ansiolíticos, antiinflamatorios y analgésicos.

**¿Por qué importa esto?**

Entender el ECS ayuda a comprender por qué el cannabis tiene efectos tan variados y, sobre todo, tan personales. Dos personas con la misma cepa y la misma dosis pueden tener experiencias completamente distintas según la densidad de sus receptores CB1, sus niveles basales de endocannabinoides y su genética.

También abre la puerta a tratamientos más precisos: fármacos que actúen sobre receptores específicos, combinaciones de cannabinoides que potencien o moderen efectos, y guías de consumo personalizadas según el perfil del usuario. La investigación está en pañales, pero la dirección es prometedora.`,
    categoria: "ciencia",
    autor: "dr_verde",
    fecha: "2024-03-12",
    minutosLectura: 6,
    destacado: true,
  },
  {
    id: "3",
    slug: "spannabis-2024-cronica",
    titulo: "Crónica de Spannabis 2024: lo mejor del salón cannábico más grande de Europa",
    extracto:
      "Tres días en Fira de Cornellà. Aquí mi crónica completa: variedades que me sorprendieron, charlas que me hicieron pensar, y por qué el sector huele a cambio de ciclo.",
    contenido: `Spannabis 2024. Fira de Cornellà. Tres días, tres halls, más de 400 expositores y —según la organización— 35.000 visitantes. Es el mayor evento cannábico de Europa y llevo cuatro años viniendo. Este año algo era diferente.

**El ambiente general**

Menos humo, más profesionalismo. Hace cuatro años Spannabis tenía mucho de fiesta informal. Este año los stands son más cuidados, la señalética es mejor, hay más speakers internacionales y se nota que hay dinero detrás de las marcas. El cannabis como industria en serio empieza a tener cara.

También había más asistentes con perfil médico o científico. Dos stands de universidades catalanas, una mesa redonda con médicos y farmacéuticos, y una zona dedicada exclusivamente al cannabis medicinal que en ediciones anteriores brillaba por su ausencia.

**Las variedades que me sorprendieron**

Tres stands me detuvieron más de lo esperado. El primero: Exotic Seeds con una Watermelon Zkittlez de aroma frutal tan pronunciado que parecía artificial —pero era terpenos de verdad. El segundo: Philosopher Seeds presentando una nueva línea de semillas estabilizadas con perfiles terpénicos determinados, no solo efectos. Eso me parece el futuro del sector.

El tercero fue una cooperativa vasca pequeña, casi escondida en el pasillo lateral, con una Amnesia cruzada con Zkittlez que llevaba el nombre de "Euskittlez". Aroma a limón y fresas con un fondo terroso. Si la encuentro en semilla, es mi próximo cultivo.

**Las charlas que me hicieron pensar**

La mejor ponencia del sábado fue la de un jurista especializado en drogas que analizó la situación post-legalización alemana y sus implicaciones para España. Su tesis: España tiene una oportunidad histórica de liderar la regulación en el sur de Europa, pero el debate político sigue secuestrado por el miedo electoral.

El domingo por la mañana, una científica de la UAB presentó datos sobre el uso medicinal en pacientes con esclerosis múltiple. Los números de reducción de espasticidad eran llamativos. En el Q&A alguien del público preguntó cuándo esos datos llegarían a la consulta del médico de cabecera. Silencio incómodo. Esa brecha entre la ciencia y la práctica clínica sigue siendo el mayor problema del cannabis medicinal en España.

**Lo que me llevo**

El sector huele a cambio de ciclo, pero los cambios reales siguen siendo lentos. La industria se está profesionalizando, la ciencia avanza, pero la regulación en España sigue paralizada. Mientras tanto, las asociaciones cannábicas hacen malabarismos legales para existir.

Lo mejor de Spannabis es que en tres días puedes hablar con cultivadores veteranos, científicos, abogados, pacientes y emprendedores. Esa mezcla no existe en ningún otro foro. Y ahí está el valor real del evento.

El año que viene vuelvo.`,
    categoria: "comunidad",
    autor: "cannacronica",
    fecha: "2024-03-08",
    minutosLectura: 5,
    destacado: true,
  },
  {
    id: "4",
    slug: "terpenos-guia-completa",
    titulo: "Guía de terpenos: más allá del THC y el CBD",
    extracto:
      "Mirceno, limoneno, linalool, cariofileno… Los terpenos determinan el aroma pero también modulan el efecto. Aprende a leer el perfil terpénico de una variedad y a elegir en función de lo que buscas.",
    categoria: "ciencia",
    autor: "dr_verde",
    fecha: "2024-02-28",
    minutosLectura: 7,
  },
  {
    id: "5",
    slug: "reduccion-danos-consumo-responsable",
    titulo: "10 consejos de reducción de daños para consumidores responsables",
    extracto:
      "Desde conocer lo que consumes hasta combinar con precaución alcohol y THC, pasando por entornos seguros y dosis conservadoras. Una guía práctica pensada para quienes ya consumen y quieren hacerlo de forma más informada.",
    categoria: "comunidad",
    autor: "saludcannabica",
    fecha: "2024-02-15",
    minutosLectura: 5,
  },
  {
    id: "6",
    slug: "mantequilla-cannabis-tecnica-perfecta",
    titulo: "Cómo hacer cannabutter perfecto: temperatura, tiempo y dosis",
    extracto:
      "La clave del cannabutter no está en la receta sino en la descarboxilación previa. Aquí el proceso paso a paso, las temperaturas exactas y cómo calcular la dosis para no pasarte.",
    categoria: "gastronomia",
    autor: "verde_chef",
    fecha: "2024-02-05",
    minutosLectura: 9,
  },
  {
    id: "7",
    slug: "exterior-balcon-autoflowering",
    titulo: "Cultivo en balcón urbano: lo que nadie te dice sobre las autoflowering",
    extracto:
      "Vivir en ciudad no impide cultivar. Balcón orientado al sur, macetas de 20L, autoflowering de ciclo corto. Mi experiencia de dos temporadas y por qué la discreción es el factor más importante.",
    categoria: "cultivo",
    autor: "terrazaCannabica",
    fecha: "2024-01-25",
    minutosLectura: 6,
  },
  {
    id: "8",
    slug: "cannabis-medicinal-espana-acceso",
    titulo: "Cannabis medicinal en España: cómo está el acceso y qué esperamos de 2024",
    extracto:
      "Nabiximols (Sativex) lleva años aprobado, pero el acceso real sigue siendo complicado. Analizamos la situación actual, los ensayos clínicos en curso y las perspectivas de regulación a corto plazo.",
    categoria: "ciencia",
    autor: "dr_verde",
    fecha: "2024-01-14",
    minutosLectura: 7,
  },
];

export const BLOG_CATEGORIA_LABEL: Record<BlogCategoria, string> = {
  cultivo: "Cultivo",
  experiencias: "Experiencias",
  ciencia: "Ciencia",
  comunidad: "Comunidad",
  gastronomia: "Gastronomía",
};

export const BLOG_CATEGORIA_COLOR: Record<BlogCategoria, string> = {
  cultivo: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  experiencias: "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-200",
  ciencia: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200",
  comunidad: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
  gastronomia: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
};
