export type MediaType = "pelicula" | "serie" | "documental";

export interface Pelicula {
  id: string;
  titulo: string;
  tituloOriginal?: string;
  anyo: number;
  tipo: MediaType;
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
    titulo: "The Culture High",
    anyo: 2014,
    tipo: "documental",
    duracion: "1h 43m",
    descripcion:
      "Documental profundo que explora el cannabis desde la ciencia, la política, la cultura y la experiencia personal. Con testimonios de investigadores, artistas y activistas.",
    generos: ["Documental"],
    puntuacionComunidad: 4.5,
    votos: 84,
    destacada: true,
  },
  {
    id: "5",
    titulo: "Weeds",
    anyo: 2005,
    tipo: "serie",
    duracion: "8 temporadas",
    descripcion:
      "Una viuda suburbana empieza a vender marihuana para mantener a su familia. Serie que mezcla drama, comedia negra y crítica social con brillantez.",
    generos: ["Drama", "Comedia"],
    puntuacionComunidad: 4.6,
    votos: 203,
    destacada: true,
  },
  {
    id: "6",
    titulo: "Humboldt County",
    anyo: 2008,
    tipo: "pelicula",
    duracion: "1h 38m",
    descripcion:
      "Un estudiante de medicina acaba conviviendo con una familia de cultivadores en los bosques de California. Road movie reflexivo sobre alternativas de vida.",
    generos: ["Drama", "Comedia"],
    puntuacionComunidad: 3.7,
    votos: 41,
  },
  {
    id: "7",
    titulo: "Murder Mountain",
    anyo: 2018,
    tipo: "documental",
    duracion: "6 episodios",
    descripcion:
      "Documental de Netflix sobre el Triángulo Esmeralda de California y la legalización del cannabis: cultivo artesanal, comunidad y la llegada de las corporaciones.",
    generos: ["Documental", "True Crime"],
    puntuacionComunidad: 4.2,
    votos: 59,
  },
  {
    id: "8",
    titulo: "Grass is Greener",
    anyo: 2019,
    tipo: "documental",
    duracion: "1h 37m",
    descripcion:
      "Documental de Netflix que analiza la historia de la prohibición del cannabis en EE.UU. y su impacto desproporcionado en las comunidades afroamericanas e hispanas.",
    generos: ["Documental"],
    puntuacionComunidad: 4.4,
    votos: 76,
  },
  {
    id: "9",
    titulo: "Jay and Silent Bob Strike Back",
    anyo: 2001,
    tipo: "pelicula",
    duracion: "1h 44m",
    descripcion:
      "Los personajes más fumetas del universo de Kevin Smith viajan a Hollywood para sabotear una película basada en ellos. Meta-comedia llena de cameos.",
    generos: ["Comedia"],
    puntuacionComunidad: 3.9,
    votos: 52,
  },
  {
    id: "10",
    titulo: "Breaking Bad",
    anyo: 2008,
    tipo: "serie",
    duracion: "5 temporadas",
    descripcion:
      "Aunque centrada en metanfetamina, esta obra maestra del crimen organizado incluye personajes como Saul Goodman y Jesse que tratan el mundo de las drogas con profundidad sin igual.",
    generos: ["Drama", "Thriller"],
    puntuacionComunidad: 4.9,
    votos: 412,
  },
  {
    id: "11",
    titulo: "Camino a la legalización",
    tituloOriginal: "The Legend of 420",
    anyo: 2017,
    tipo: "documental",
    duracion: "1h 30m",
    descripcion:
      "Recorrido por los estados de EE.UU. y países donde el cannabis es legal, explorando cómo está cambiando la industria y la sociedad.",
    generos: ["Documental"],
    puntuacionComunidad: 3.6,
    votos: 33,
  },
  {
    id: "12",
    titulo: "Disjointed",
    anyo: 2017,
    tipo: "serie",
    duracion: "2 temporadas",
    descripcion:
      "Kathy Bates dirige un dispensario de cannabis en California. Sitcom de Netflix con mucho corazón sobre la cultura del cannabis legal y sus clientes.",
    generos: ["Comedia"],
    puntuacionComunidad: 3.5,
    votos: 48,
  },
];
