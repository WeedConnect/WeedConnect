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
