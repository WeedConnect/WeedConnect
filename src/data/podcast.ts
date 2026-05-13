export interface PodcastEpisodio {
  id: string;
  numero: number;
  titulo: string;
  descripcion: string;
  invitado?: string;
  duracionMin: number;
  fecha: string;
  plataformas: {
    spotify?: string;
    ivoox?: string;
    youtube?: string;
  };
  temas: string[];
  destacado?: boolean;
}

export const MOCK_EPISODIOS: PodcastEpisodio[] = [
  {
    id: "1",
    numero: 12,
    titulo: "Alemania lo hizo: ¿será España la siguiente?",
    descripcion:
      "Analizamos la ley de legalización aprobada en Alemania, sus mecanismos y qué probabilidades hay de que España siga un camino similar en la legislatura actual. Con Patricia Sanz, abogada especializada en cannabis.",
    invitado: "Patricia Sanz",
    duracionMin: 58,
    fecha: "2024-03-25",
    plataformas: { spotify: "#", ivoox: "#" },
    temas: ["legislación", "Alemania", "España", "legalización"],
    destacado: true,
  },
  {
    id: "2",
    numero: 11,
    titulo: "La ciencia de los terpenos con el Dr. Ramón Prat",
    descripcion:
      "El investigador de la Universidad de Barcelona nos explica qué dice la evidencia sobre el efecto entourage, por qué el perfil terpénico importa y el futuro de la farmacología cannabinoide.",
    invitado: "Dr. Ramón Prat",
    duracionMin: 72,
    fecha: "2024-03-11",
    plataformas: { spotify: "#", youtube: "#" },
    temas: ["terpenos", "efecto entourage", "ciencia", "farmacología"],
    destacado: true,
  },
  {
    id: "3",
    numero: 10,
    titulo: "Crónica de Spannabis 2024 desde dentro",
    descripcion:
      "Grabamos en directo desde Spannabis: entrevistas a cultivadores, tendencias del sector, nuevas variedades y el estado del activismo cannábico en España.",
    duracionMin: 45,
    fecha: "2024-03-04",
    plataformas: { spotify: "#", ivoox: "#", youtube: "#" },
    temas: ["Spannabis", "ferias", "comunidad", "cultivadores"],
    destacado: true,
  },
  {
    id: "4",
    numero: 9,
    titulo: "Reducción de daños: de la teoría a la práctica",
    descripcion:
      "Maria Fernández de Energy Control nos explica cómo funciona el sistema de análisis de sustancias en España, los mitos más peligrosos que circulan sobre el cannabis y cómo se puede consumir de forma más informada.",
    invitado: "Maria Fernández",
    duracionMin: 63,
    fecha: "2024-02-19",
    plataformas: { spotify: "#" },
    temas: ["reducción de daños", "Energy Control", "análisis", "educación"],
  },
  {
    id: "5",
    numero: 8,
    titulo: "El negocio del CBD: realidad vs. hype",
    descripcion:
      "¿Es el mercado del CBD una burbuja? Analizamos los productos de CBD legales en España, qué evidencia tienen y cómo distinguir productos de calidad de los que solo aprovechan el tirón del marketing.",
    duracionMin: 51,
    fecha: "2024-02-05",
    plataformas: { spotify: "#", ivoox: "#" },
    temas: ["CBD", "mercado", "regulación", "consumidores"],
  },
  {
    id: "6",
    numero: 7,
    titulo: "Cultivar en ciudad: urban growing con Sergio M.",
    descripcion:
      "Sergio lleva 8 años cultivando en un piso de Barcelona sin jardín ni terraza. Nos cuenta su setup, variedades preferidas y cómo gestiona la discreción en una comunidad de vecinos.",
    invitado: "Sergio M.",
    duracionMin: 66,
    fecha: "2024-01-22",
    plataformas: { spotify: "#", youtube: "#" },
    temas: ["cultivo indoor", "urban growing", "discreción", "apartamento"],
  },
];
