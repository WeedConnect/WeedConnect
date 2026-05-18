export type MediaType = "pelicula" | "serie" | "documental";

export type StonerMood = 
  | "fumadon" 
  | "risas" 
  | "psicodelica" 
  | "terror" 
  | "domingo_chill" 
  | "clasico_stoner";

export interface Pelicula {
  id: string;
  titulo: string;
  tituloOriginal?: string;
  anyo: number;
  tipo: MediaType;
  mood: StonerMood;
  duracion: string;
  descripcion: string;
  generos: string[];
  puntuacionComunidad: number;
  votos: number;
  destacada?: boolean;
}

export const MOCK_PELICULAS: Pelicula[] = [
  {
    id: "1",
    titulo: "Pineapple Express",
    anyo: 2008,
    tipo: "pelicula",
    mood: "clasico_stoner",
    duracion: "1h 51m",
    descripcion:
      "Un consumidor y su dealer huyen de un asesino a sueldo tras ser testigos de un asesinato. Comedia de acción desternillante que se convirtió en referente de la cultura cannábica.",
    generos: ["Comedia", "Acción"],
    puntuacionComunidad: 4.3,
    votos: 128,
    destacada: true,
  },
  {
    id: "2",
    titulo: "Super High Me",
    anyo: 2007,
    tipo: "documental",
    mood: "domingo_chill",
    duracion: "1h 36m",
    descripcion:
      "El cómico Doug Benson se abstiene 30 días y después consume cannabis durante 30 días seguidos, documentando los efectos en su cuerpo y rendimiento cognitivo.",
    generos: ["Documental", "Comedia"],
    puntuacionComunidad: 3.8,
    votos: 67,
  },
  {
    id: "3",
    titulo: "Harold y Kumar van al White Castle",
    tituloOriginal: "Harold & Kumar Go to White Castle",
    anyo: 2004,
    tipo: "pelicula",
    mood: "clasico_stoner",
    duracion: "1h 28m",
    descripcion:
      "Dos amigos porrados emprenden un road trip épico para llegar a un restaurante de hamburguesas. Clásico imprescindible del género.",
    generos: ["Comedia"],
    puntuacionComunidad: 4.1,
    votos: 95,
    destacada: true,
  },
  {
    id: "4",
    titulo: "Inception (Origen)",
    tituloOriginal: "Inception",
    anyo: 2010,
    tipo: "pelicula",
    mood: "fumadon",
    duracion: "2h 28m",
    descripcion:
      "Entrar en los sueños para implantar ideas. Una complejidad mental perfecta para debatir horas y horas sobre la realidad y la ficción.",
    generos: ["Sci-Fi", "Acción"],
    puntuacionComunidad: 4.7,
    votos: 320,
    destacada: true,
  },
  {
    id: "5",
    titulo: "Spider-Man: Into the Spider-Verse",
    anyo: 2018,
    tipo: "pelicula",
    mood: "psicodelica",
    duracion: "1h 57m",
    descripcion:
      "Una explosión visual de colores, animación revolucionaria y universos paralelos que resulta una delicia visual absoluta en una sesión chill.",
    generos: ["Animación", "Sci-Fi"],
    puntuacionComunidad: 4.8,
    votos: 250,
    destacada: true,
  },
  {
    id: "6",
    titulo: "Superbad (Supersalidos)",
    anyo: 2007,
    tipo: "pelicula",
    mood: "risas",
    duracion: "1h 53m",
    descripcion:
      "Tres estudiantes de instituto intentan comprar alcohol para una fiesta, desatando una noche de caos épico. Risas ininterrumpidas con McLovin.",
    generos: ["Comedia"],
    puntuacionComunidad: 4.5,
    votos: 180,
  },
  {
    id: "7",
    titulo: "Scary Movie",
    anyo: 2000,
    tipo: "pelicula",
    mood: "risas",
    duracion: "1h 28m",
    descripcion:
      "La parodia definitiva de las películas de terror de los 90. Absurda, irreverente y mítica (especialmente Shorty y su famoso 'Wazzuuup!').",
    generos: ["Comedia", "Parodia"],
    puntuacionComunidad: 4.2,
    votos: 190,
  },
  {
    id: "8",
    titulo: "Everything Everywhere All at Once",
    anyo: 2022,
    tipo: "pelicula",
    mood: "psicodelica",
    duracion: "2h 19m",
    descripcion:
      "Una inmigrante china se ve envuelta en una aventura alocada donde solo ella puede salvar el mundo explorando universos paralelos. Caos visual absoluto.",
    generos: ["Sci-Fi", "Aventura"],
    puntuacionComunidad: 4.6,
    votos: 150,
    destacada: true,
  },
  {
    id: "9",
    titulo: "Interstellar",
    anyo: 2014,
    tipo: "pelicula",
    mood: "fumadon",
    duracion: "2h 49m",
    descripcion:
      "Un viaje a través de agujeros de gusano buscando un nuevo hogar para la humanidad. Visualmente aplastante y con una BSO de Hans Zimmer inmersiva.",
    generos: ["Sci-Fi", "Drama"],
    puntuacionComunidad: 4.8,
    votos: 410,
  },
  {
    id: "10",
    titulo: "The Cabin in the Woods",
    anyo: 2011,
    tipo: "pelicula",
    mood: "terror",
    duracion: "1h 35m",
    descripcion:
      "Cinco amigos van a una cabaña apartada en el bosque. Lo que parece el típico cliché de terror se convierte en algo totalmente impredecible y salvaje.",
    generos: ["Terror", "Comedia negra"],
    puntuacionComunidad: 4.0,
    votos: 85,
  },
  {
    id: "11",
    titulo: "How High (Buen rollito)",
    anyo: 2001,
    tipo: "pelicula",
    mood: "clasico_stoner",
    duracion: "1h 33m",
    descripcion:
      "Dos chicos de barrio consiguen entrar en Harvard gracias a una marihuana muy especial que los vuelve genios. Un pilar del género protagonizado por Method Man y Redman.",
    generos: ["Comedia"],
    puntuacionComunidad: 4.4,
    votos: 210,
    destacada: true,
  },
  {
    id: "12",
    titulo: "Doctor Strange",
    anyo: 2016,
    tipo: "pelicula",
    mood: "psicodelica",
    duracion: "1h 55m",
    descripcion:
      "Dimensiones espejo que se pliegan sobre sí mismas, fractales mágicos y magia mística. Los efectos visuales son un viaje por derecho propio.",
    generos: ["Acción", "Fantasía"],
    puntuacionComunidad: 4.3,
    votos: 130,
  },
  {
    id: "13",
    titulo: "Friday",
    anyo: 1995,
    tipo: "pelicula",
    mood: "clasico_stoner",
    duracion: "1h 31m",
    descripcion:
      "Craig y Smokey tienen que conseguir 200 dólares antes del final del día tras fumarse la mercancía de un camello. Protagonizada por Ice Cube y Chris Tucker.",
    generos: ["Comedia", "Culto"],
    puntuacionComunidad: 4.5,
    votos: 140,
  },
  {
    id: "14",
    titulo: "Scream",
    anyo: 1996,
    tipo: "pelicula",
    mood: "terror",
    duracion: "1h 51m",
    descripcion:
      "Un asesino enmascarado acosa a un grupo de adolescentes usando las 'reglas' del cine de terror contra ellos. Un slasher icónico para ver con colegas.",
    generos: ["Terror", "Misterio"],
    puntuacionComunidad: 4.1,
    votos: 115,
  },
  {
    id: "15",
    titulo: "Weeds",
    anyo: 2005,
    tipo: "serie",
    mood: "domingo_chill",
    duracion: "8 temporadas",
    descripcion:
      "Una viuda suburbana empieza a vender marihuana para mantener a su familia. Serie que mezcla drama, comedia negra y crítica social con brillantez.",
    generos: ["Drama", "Comedia"],
    puntuacionComunidad: 4.6,
    votos: 203,
  },
  {
    id: "16",
    titulo: "The Matrix",
    tituloOriginal: "The Matrix",
    anyo: 1999,
    tipo: "pelicula",
    mood: "fumadon",
    duracion: "2h 16m",
    descripcion:
      "¿Y si la realidad que conoces es una simulación? Neo descubre la verdad y nada vuelve a ser igual. El debate filosófico post-peli es garantizado.",
    generos: ["Sci-Fi", "Acción"],
    puntuacionComunidad: 4.9,
    votos: 520,
    destacada: true,
  },
  {
    id: "17",
    titulo: "Borat",
    tituloOriginal: "Borat: Cultural Learnings of America for Make Benefit Glorious Nation of Kazakhstan",
    anyo: 2006,
    tipo: "pelicula",
    mood: "risas",
    duracion: "1h 24m",
    descripcion:
      "Un periodista kazajo viaja por los Estados Unidos documentando las costumbres locales. Humor absurdo, situaciones incómodas y carcajadas imparables.",
    generos: ["Comedia", "Mockumentary"],
    puntuacionComunidad: 4.4,
    votos: 175,
  },
  {
    id: "18",
    titulo: "Enter the Void",
    anyo: 2009,
    tipo: "pelicula",
    mood: "psicodelica",
    duracion: "2h 43m",
    descripcion:
      "Gaspar Noé filma en primera persona la experiencia post-mortem de un joven en Tokio. Visuales alucinantes, colores neón explosivos y una narrativa que rompe el cerebro.",
    generos: ["Drama", "Psicodelia"],
    puntuacionComunidad: 4.0,
    votos: 88,
    destacada: true,
  },
];
