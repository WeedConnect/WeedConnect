export type NoticiaCategoria =
  | "legal"
  | "ciencia"
  | "cultivo"
  | "politica"
  | "internacional"
  | "comunidad";

export interface Noticia {
  id: string;
  slug: string;
  titulo: string;
  extracto: string;
  categoria: NoticiaCategoria;
  fuente: string;
  fecha: string;
  destacada?: boolean;
}

export const MOCK_NOTICIAS: Noticia[] = [
  {
    id: "1",
    slug: "alemania-legaliza-cannabis-adultos",
    titulo: "Alemania aprueba la legalización del cannabis para adultos",
    extracto:
      "El Bundestag ha aprobado la ley que permite a los adultos poseer hasta 25 gramos de cannabis en espacios públicos y 50 gramos en casa. La norma también autoriza los clubes de cultivo privado con hasta 500 miembros.",
    categoria: "internacional",
    fuente: "El País",
    fecha: "2024-04-01",
    destacada: true,
  },
  {
    id: "2",
    slug: "estudio-thc-memoria-corto-plazo",
    titulo: "Nuevo estudio matiza el efecto del THC en la memoria a corto plazo",
    extracto:
      "Investigadores de la Universitat Autònoma de Barcelona publican un estudio que diferencia los efectos según dosis, frecuencia de uso y genética del usuario, abriendo la puerta a guías de consumo más personalizadas.",
    categoria: "ciencia",
    fuente: "UAB Divulga",
    fecha: "2024-03-18",
    destacada: true,
  },
  {
    id: "3",
    slug: "clubs-cannabis-cataluna-regulacion",
    titulo: "El Parlament de Catalunya debate una regulación específica para los clubs cannábicos",
    extracto:
      "El proyecto de ley pretende establecer un marco claro para las más de 300 asociaciones cannábicas que operan en Cataluña, fijando requisitos de higiene, acceso solo para socios y zonas de exclusión.",
    categoria: "legal",
    fuente: "Ara",
    fecha: "2024-03-05",
    destacada: true,
  },
  {
    id: "4",
    slug: "cbd-dolor-cronico-meta-analisis",
    titulo: "Un meta-análisis confirma la eficacia del CBD en el dolor crónico leve-moderado",
    extracto:
      "La revisión de 48 ensayos clínicos publicada en The Lancet concluye que el cannabidiol reduce significativamente el dolor neuropático sin los efectos secundarios de los opioides.",
    categoria: "ciencia",
    fuente: "The Lancet / Redacción",
    fecha: "2024-02-22",
  },
  {
    id: "5",
    slug: "operacion-policia-clubs-barcelona",
    titulo: "La Guardia Urbana de Barcelona cierra 12 clubs cannábicos por irregularidades",
    extracto:
      "La operación se centró en establecimientos que vendían cannabis a no socios y que incumplían las ordenanzas municipales de distancia respecto a colegios y centros de salud.",
    categoria: "legal",
    fuente: "La Vanguardia",
    fecha: "2024-02-14",
  },
  {
    id: "6",
    slug: "portugal-despenalizacion-veinte-aniversario",
    titulo: "Portugal celebra 20 años de despenalización: un modelo para Europa",
    extracto:
      "Dos décadas después de despenalizar todas las drogas para uso personal, Portugal presenta datos que muestran una reducción del 50% en muertes por sobredosis y un aumento de los pacientes en tratamiento.",
    categoria: "internacional",
    fuente: "Público",
    fecha: "2024-02-01",
  },
  {
    id: "7",
    slug: "autoflowering-cultivo-interior-guia",
    titulo: "Temporada de cultivo: las autoflowering más recomendadas para armarios pequeños",
    extracto:
      "Un análisis de las variedades más populares en la comunidad para cultivos de menos de 80 cm: tiempos de floración, rendimiento y tolerancia a fallos del cultivador principiante.",
    categoria: "cultivo",
    fuente: "WeedConnect",
    fecha: "2024-01-28",
  },
  {
    id: "8",
    slug: "opioides-cannabis-sustitucion",
    titulo: "El 30% de los pacientes con dolor crónico que consumen cannabis reducen los opioides",
    extracto:
      "Un estudio del Hospital Vall d'Hebron seguido durante 18 meses revela que el cannabis medicinal actúa como sustituto parcial de analgésicos opiáceos en pacientes con dolor crónico no oncológico.",
    categoria: "ciencia",
    fuente: "Vall d'Hebron",
    fecha: "2024-01-15",
  },
  {
    id: "9",
    slug: "europa-politica-cannabis-mapa",
    titulo: "Mapa de la política cannábica en Europa en 2024: quién avanza y quién frena",
    extracto:
      "Repaso actualizado a la situación legal del cannabis en los 27 países de la UE: desde la legalización total de Alemania hasta la penalización estricta de Hungría y los países del Este.",
    categoria: "politica",
    fuente: "WeedConnect",
    fecha: "2024-01-08",
    destacada: true,
  },
  {
    id: "10",
    slug: "primera-feria-cannaval-barcelona-2024",
    titulo: "La Cannaval de Barcelona espera 20.000 asistentes en su edición de primavera",
    extracto:
      "El evento de la cultura cannábica más grande de España vuelve a la ciudad condal con exposición de variedades, ponencias de expertos, talleres de cultivo y zona de showcooking cannábica.",
    categoria: "comunidad",
    fuente: "WeedConnect",
    fecha: "2024-01-03",
  },
];

export const CATEGORIA_LABEL: Record<NoticiaCategoria, string> = {
  legal: "Legal",
  ciencia: "Ciencia",
  cultivo: "Cultivo",
  politica: "Política",
  internacional: "Internacional",
  comunidad: "Comunidad",
};

export const CATEGORIA_COLOR: Record<NoticiaCategoria, string> = {
  legal:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
  ciencia:
    "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200",
  cultivo:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  politica:
    "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
  internacional:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  comunidad:
    "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-200",
};
