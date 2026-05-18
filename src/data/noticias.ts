export type NoticiaCategoria =
  | "legal"
  | "ciencia"
  | "cultivo"
  | "politica"
  | "internacional"
  | "comunidad"
  | "asociaciones"
  | "mercado"
  | "cultura"
  | "eventos"
  | "estudios"
  | "tendencias";

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
    categoria: "eventos",
    fuente: "WeedConnect",
    fecha: "2024-01-03",
  },
  {
    id: "11",
    slug: "thai-legaliza-cannabis-recreativo-asia",
    titulo: "Tailandia da marcha atrás: debate sobre la re-penalización del cannabis",
    extracto:
      "Tras ser el primer país asiático en legalizar el cannabis medicinal, el nuevo gobierno tailandés debate revertir parcialmente la normativa entre tensiones políticas y presión internacional.",
    categoria: "internacional",
    fuente: "Reuters / Redacción",
    fecha: "2024-03-28",
    destacada: true,
  },
  {
    id: "12",
    slug: "asociaciones-espana-cifras-2024",
    titulo: "Más de 1.200 asociaciones cannábicas activas en España según nuevo informe",
    extracto:
      "Un estudio publicado por el Instituto de Política de Drogas contabiliza las asociaciones activas por CCAA. Cataluña lidera con 380, seguida de País Vasco y Madrid. El informe destaca el vacío legal autonómico.",
    categoria: "asociaciones",
    fuente: "Instituto de Política de Drogas",
    fecha: "2024-02-10",
  },
  {
    id: "13",
    slug: "mercado-legal-cannabis-europa-2025",
    titulo: "El mercado legal de cannabis en Europa podría superar los 3.200 millones de euros en 2025",
    extracto:
      "Un análisis de mercado prevé un crecimiento exponencial del sector cannábico legal europeo, impulsado por la legalización alemana y los avances en cannabis medicinal en Francia y Reino Unido.",
    categoria: "mercado",
    fuente: "Prohibition Partners / Redacción",
    fecha: "2024-01-20",
  },
  {
    id: "14",
    slug: "cultura-cannabica-musica-hip-hop",
    titulo: "El hip-hop y la cultura cannábica: 50 años de una relación indivisible",
    extracto:
      "Desde Cypress Hill hasta Kendrick Lamar, la cultura hip-hop y el cannabis han caminado de la mano. Un repaso cultural a cómo la música urbana normalizó la conversación sobre el cannabis mucho antes de la política.",
    categoria: "cultura",
    fuente: "WeedConnect",
    fecha: "2024-03-10",
    destacada: true,
  },
  {
    id: "15",
    slug: "estudio-cannabis-ansiedad-jóvenes",
    titulo: "Nuevo estudio alerta sobre el consumo temprano y el riesgo de ansiedad en jóvenes",
    extracto:
      "Investigadores de la Universidad Complutense analizan datos de 2.000 jóvenes de 16 a 24 años y concluyen que el inicio del consumo antes de los 18 años se asocia con un mayor riesgo de episodios de ansiedad. La edad y la dosis importan.",
    categoria: "estudios",
    fuente: "UCM / Redacción",
    fecha: "2024-04-05",
  },
  {
    id: "16",
    slug: "tendencias-vaporizadores-2024",
    titulo: "El vaporizador supera al porro en preferencia entre nuevos consumidores adultos en España",
    extracto:
      "Una encuesta realizada por WeedConnect entre 3.500 usuarios adultos revela que el 54% de quienes empezaron a consumir en los últimos 3 años prefieren el vaporizador frente al papel. La reducción de daños y la discreción son los motivos principales.",
    categoria: "tendencias",
    fuente: "WeedConnect",
    fecha: "2024-04-12",
  },
];

export const CATEGORIA_LABEL: Record<NoticiaCategoria, string> = {
  legal: "Legal",
  ciencia: "Ciencia",
  cultivo: "Cultivo",
  politica: "Política",
  internacional: "Internacional",
  comunidad: "Comunidad",
  asociaciones: "Asociaciones",
  mercado: "Mercado",
  cultura: "Cultura",
  eventos: "Eventos",
  estudios: "Estudios",
  tendencias: "Tendencias",
};

export const CATEGORIA_COLOR: Record<NoticiaCategoria, string> = {
  legal: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
  ciencia: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200",
  cultivo: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  politica: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
  internacional: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  comunidad: "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-200",
  asociaciones: "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-200",
  mercado: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-200",
  cultura: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200",
  eventos: "bg-lime-100 text-lime-800 dark:bg-lime-900/40 dark:text-lime-200",
  estudios: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200",
  tendencias: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200",
};
