export type EventoCategoria =
  | "feria"
  | "taller"
  | "ponencia"
  | "social"
  | "activismo"
  | "online";

export interface Evento {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: EventoCategoria;
  fecha: string;
  horaInicio: string;
  horaFin?: string;
  lugar: string;
  ciudad: string;
  pais: string;
  precio: "gratuito" | string;
  aforo?: number;
  organizador: string;
  destacado?: boolean;
}

export const MOCK_EVENTOS: Evento[] = [
  {
    id: "1",
    titulo: "Spannabis 2025",
    descripcion:
      "El mayor salón cannábico de España y uno de los referentes mundiales. Tres días de exposición, concursos de cultivo, ponencias y showcooking. Reunión anual de toda la industria y la comunidad.",
    categoria: "feria",
    fecha: "2025-03-14",
    horaInicio: "10:00",
    horaFin: "20:00",
    lugar: "Fira de Cornellà",
    ciudad: "Barcelona",
    pais: "España",
    precio: "15€",
    organizador: "Spannabis SL",
    destacado: true,
  },
  {
    id: "2",
    titulo: "Taller de cultivo indoor para principiantes",
    descripcion:
      "Aprende a montar tu primer armario de cultivo: sustrato, iluminación LED, riegos, pH y fases de crecimiento. Material incluido. Grupos reducidos de máximo 12 personas.",
    categoria: "taller",
    fecha: "2025-05-24",
    horaInicio: "11:00",
    horaFin: "14:00",
    lugar: "Asociación La Verde",
    ciudad: "Madrid",
    pais: "España",
    precio: "25€",
    aforo: 12,
    organizador: "Asociación La Verde",
    destacado: true,
  },
  {
    id: "3",
    titulo: "Cannabis y salud mental: mitos y realidades",
    descripcion:
      "Ponencia del Dr. Martí Puig, psiquiatra del Hospital Clínic de Barcelona, sobre los últimos estudios que relacionan el cannabis con la ansiedad, la depresión y la psicosis. Turno de preguntas abierto.",
    categoria: "ponencia",
    fecha: "2025-05-30",
    horaInicio: "19:00",
    horaFin: "21:00",
    lugar: "Centro Cívico Barceloneta",
    ciudad: "Barcelona",
    pais: "España",
    precio: "gratuito",
    organizador: "WeedConnect",
    destacado: true,
  },
  {
    id: "4",
    titulo: "Meet & Greet — Comunidad WeedConnect Valencia",
    descripcion:
      "Primera quedada presencial de la comunidad de Valencia. Chatea, conoce gente y comparte experiencias en un ambiente relajado. Sin agenda fija: es una quedada informal.",
    categoria: "social",
    fecha: "2025-06-07",
    horaInicio: "18:00",
    lugar: "Bar El Cabanyal (confirmar al apuntarte)",
    ciudad: "Valencia",
    pais: "España",
    precio: "gratuito",
    organizador: "WeedConnect",
  },
  {
    id: "5",
    titulo: "Webinar: Legislación cannábica en España en 2025",
    descripcion:
      "Análisis de la situación legal actual: clubs privados, posesión, cultivo personal, jurisprudencia del Tribunal Supremo y comparativa con el marco europeo. Online con Q&A en directo.",
    categoria: "online",
    fecha: "2025-06-12",
    horaInicio: "20:00",
    horaFin: "21:30",
    lugar: "Online (Zoom)",
    ciudad: "Online",
    pais: "España",
    precio: "gratuito",
    organizador: "Colectivo Cáñamo Legal",
  },
  {
    id: "6",
    titulo: "Marcha por la regulación del cannabis — Madrid",
    descripcion:
      "Manifestación anual en favor de la regulación del cannabis en España. Sale de Atocha y termina en Retiro con mitin final. Organizada por la Coordinadora de ONGs de Reducción de Daños.",
    categoria: "activismo",
    fecha: "2025-06-20",
    horaInicio: "12:00",
    lugar: "Estación de Atocha",
    ciudad: "Madrid",
    pais: "España",
    precio: "gratuito",
    organizador: "Coordinadora ONGRD",
  },
  {
    id: "7",
    titulo: "Cannabis Cup España — Zona norte",
    descripcion:
      "Concurso de variedades para cultivadores amateur y profesionales. Categorías: indoor, outdoor y autoflowering. Los ganadores reciben trofeo y figuran en el catálogo de WeedConnect.",
    categoria: "feria",
    fecha: "2025-07-05",
    horaInicio: "10:00",
    horaFin: "18:00",
    lugar: "Palacio de Congresos",
    ciudad: "San Sebastián",
    pais: "España",
    precio: "10€",
    aforo: 300,
    organizador: "CannaCup Ibérica",
    destacado: true,
  },
  {
    id: "8",
    titulo: "Taller de extracción: hash rosin sin disolventes",
    descripcion:
      "Aprende a hacer rosin de calidad en casa con una plancha de calor. Técnicas de lavado en agua helada, temperaturas óptimas y conservación del extracto.",
    categoria: "taller",
    fecha: "2025-07-19",
    horaInicio: "10:00",
    horaFin: "13:00",
    lugar: "Club Cannábico Delta",
    ciudad: "Zaragoza",
    pais: "España",
    precio: "30€",
    aforo: 8,
    organizador: "Club Cannábico Delta",
  },
];

export const CATEGORIA_EVENTO_LABEL: Record<EventoCategoria, string> = {
  feria: "Feria / Expo",
  taller: "Taller",
  ponencia: "Ponencia",
  social: "Social",
  activismo: "Activismo",
  online: "Online",
};

export const CATEGORIA_EVENTO_COLOR: Record<EventoCategoria, string> = {
  feria: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  taller: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  ponencia: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
  social: "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-200",
  activismo: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
  online: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200",
};
