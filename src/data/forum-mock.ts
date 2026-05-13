export type MockThread = {
  id: string;
  slug: string;
  category: string;
  title: string;
  author: string;
  replies: number;
  votes: number;
  excerpt: string;
  createdAt: string;
};

export const MOCK_THREADS: MockThread[] = [
  {
    id: "t1",
    slug: "primer-cultivo-indoor-armario-80x80",
    category: "Cultivo",
    title: "Primer cultivo indoor en armario 80x80, ¿qué luz me recomendáis?",
    author: "verdetina",
    replies: 14,
    votes: 22,
    excerpt:
      "Estoy montando mi primer indoor en un armario de 80x80. Dudo entre un quantum board de 100W o un panel LED de 240W…",
    createdAt: "Hace 2 horas",
  },
  {
    id: "t2",
    slug: "experiencia-charlottes-web-medicinal",
    category: "Medicinal",
    title: "Mi experiencia con Charlotte's Web para dolor crónico",
    author: "mariajose",
    replies: 7,
    votes: 41,
    excerpt:
      "Llevo seis meses tomando aceite de CW como complemento y quería compartir cómo me ha cambiado el día a día…",
    createdAt: "Hace 5 horas",
  },
  {
    id: "t3",
    slug: "nueva-normativa-cataluna-2026",
    category: "Legal",
    title: "Nueva normativa en Cataluña 2026 — resumen rápido",
    author: "advocada",
    replies: 31,
    votes: 89,
    excerpt:
      "Resumo los puntos clave del nuevo decreto que afecta a las asociaciones cannábicas y qué cambia respecto a 2024…",
    createdAt: "Ayer",
  },
  {
    id: "t4",
    slug: "white-widow-vs-northern-lights-relax",
    category: "Variedades",
    title: "White Widow vs Northern Lights, ¿cuál para relax?",
    author: "k1ng",
    replies: 22,
    votes: 18,
    excerpt:
      "Busco algo para desconectar después del trabajo. He probado WW y me gusta pero quizá NL sea mejor para dormir…",
    createdAt: "Ayer",
  },
  {
    id: "t5",
    slug: "preset-presentaciones-comunidad",
    category: "Comunidad",
    title: "¡Hola a todos! Me presento",
    author: "nuevo-user-2026",
    replies: 4,
    votes: 5,
    excerpt:
      "Soy nuevo en la plataforma, llevo años cultivando outdoor en el sur y me apetecía conocer gente con la misma pasión…",
    createdAt: "Hace 2 días",
  },
];

export function findThread(slug: string) {
  return MOCK_THREADS.find((t) => t.slug === slug);
}
