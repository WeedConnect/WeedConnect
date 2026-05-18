// Tipos espejo de lib/forum.ts — sin import para evitar dep circular
type ForumCategory = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  position: number;
};

type ForumThread = {
  id: string;
  slug: string;
  title: string;
  body: string;
  media_urls: string[];
  created_at: string;
  pinned: boolean;
  locked: boolean;
  profiles: { username: string } | null;
  forum_categories: { name: string; slug: string } | null;
  reply_count: number;
};

// Formato legado — se mantiene para compatibilidad con forum.test.ts
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

export const MOCK_CATEGORIES: ForumCategory[] = [
  { id: "cat-cultivo",     slug: "cultivo",     name: "Cultivo",     description: "Técnicas y experiencias de cultivo indoor y outdoor", position: 1 },
  { id: "cat-variedades",  slug: "variedades",  name: "Variedades",  description: "Cepas, genéticas, efectos y perfiles terpénicos",    position: 2 },
  { id: "cat-legal",       slug: "legal",       name: "Legal",       description: "Normativa, asociaciones y actualidad jurídica",       position: 3 },
  { id: "cat-medicinal",   slug: "medicinal",   name: "Medicinal",   description: "Uso terapéutico, CBD y reducción de daños",          position: 4 },
  { id: "cat-experiencias",slug: "experiencias",name: "Experiencias",description: "Relatos y vivencias personales",                     position: 5 },
  { id: "cat-munchies",    slug: "munchies",    name: "Munchies",    description: "Recetas, snacks y caprichos cannábicos",             position: 6 },
  { id: "cat-comunidad",   slug: "comunidad",   name: "Comunidad",   description: "Presentaciones, memes y off-topic",                  position: 7 },
];

export const FORUM_MOCK_THREADS: ForumThread[] = [
  {
    id: "t1",
    slug: "primer-cultivo-indoor-armario-80x80",
    title: "Primer cultivo indoor en armario 80x80, ¿qué luz me recomendáis?",
    body: "Estoy montando mi primer indoor en un armario de 80x80. Dudo entre un quantum board de 100W o un panel LED de 240W de los chinos. He leído que el QB es mejor para principiantes por el consumo y el calor, pero no sé si la diferencia de precio merece la pena.\n\n¿Qué habéis usado vosotros al principio? Presupuesto máximo 150€ para la luz.",
    media_urls: [],
    created_at: new Date(Date.now() - 2 * 3_600_000).toISOString(),
    pinned: false,
    locked: false,
    profiles: { username: "verdetina" },
    forum_categories: { name: "Cultivo", slug: "cultivo" },
    reply_count: 14,
  },
  {
    id: "t2",
    slug: "experiencia-charlottes-web-medicinal",
    title: "Mi experiencia con Charlotte's Web para dolor crónico",
    body: "Llevo seis meses tomando aceite de CW como complemento a mi tratamiento y quería compartir cómo me ha cambiado el día a día. Al principio tenía muchas dudas sobre dosificación y horarios, pero con paciencia encontré lo que funciona para mí.\n\nAMA sobre el proceso o los resultados.",
    media_urls: [],
    created_at: new Date(Date.now() - 5 * 3_600_000).toISOString(),
    pinned: false,
    locked: false,
    profiles: { username: "mariajose" },
    forum_categories: { name: "Medicinal", slug: "medicinal" },
    reply_count: 7,
  },
  {
    id: "t3",
    slug: "nueva-normativa-cataluna-2026",
    title: "Nueva normativa en Cataluña 2026 — resumen rápido",
    body: "Resumo los puntos clave del nuevo decreto que afecta a las asociaciones cannábicas y qué cambia respecto a 2024.\n\nTL;DR: más restricciones en la zona de consumo, nuevos requisitos de socio, y un plazo de 6 meses para adaptarse.\n\nFuente: DOGC de la semana pasada. Si queréis el link, pedidlo.",
    media_urls: [],
    created_at: new Date(Date.now() - 24 * 3_600_000).toISOString(),
    pinned: true,
    locked: false,
    profiles: { username: "advocada" },
    forum_categories: { name: "Legal", slug: "legal" },
    reply_count: 31,
  },
  {
    id: "t4",
    slug: "white-widow-vs-northern-lights-relax",
    title: "White Widow vs Northern Lights, ¿cuál para relax?",
    body: "Busco algo para desconectar después del trabajo. He probado WW y me gusta pero quizá NL sea mejor para dormir.\n\n¿Alguien ha comparado ambas directamente? Mi situación: estrés laboral, insomnio ocasional, prefiero índica o híbrida equilibrada.",
    media_urls: [],
    created_at: new Date(Date.now() - 28 * 3_600_000).toISOString(),
    pinned: false,
    locked: false,
    profiles: { username: "k1ng" },
    forum_categories: { name: "Variedades", slug: "variedades" },
    reply_count: 22,
  },
  {
    id: "t5",
    slug: "preset-presentaciones-comunidad",
    title: "¡Hola a todos! Me presento",
    body: "Soy nuevo en la plataforma, llevo años cultivando outdoor en el sur y me apetecía conocer gente con la misma pasión.\n\nSi tenéis preguntas de cultivo mediterráneo o variedades adaptadas al calor, preguntad sin miedo.",
    media_urls: [],
    created_at: new Date(Date.now() - 2 * 24 * 3_600_000).toISOString(),
    pinned: false,
    locked: false,
    profiles: { username: "nuevo-user-2026" },
    forum_categories: { name: "Comunidad", slug: "comunidad" },
    reply_count: 4,
  },
];

// Formato legado — solo para forum.test.ts
export const MOCK_THREADS: MockThread[] = [
  {
    id: "t1",
    slug: "primer-cultivo-indoor-armario-80x80",
    category: "Cultivo",
    title: "Primer cultivo indoor en armario 80x80, ¿qué luz me recomendáis?",
    author: "verdetina",
    replies: 14,
    votes: 22,
    excerpt: "Estoy montando mi primer indoor en un armario de 80x80. Dudo entre un quantum board de 100W o un panel LED de 240W…",
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
    excerpt: "Llevo seis meses tomando aceite de CW como complemento y quería compartir cómo me ha cambiado el día a día…",
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
    excerpt: "Resumo los puntos clave del nuevo decreto que afecta a las asociaciones cannábicas y qué cambia respecto a 2024…",
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
    excerpt: "Busco algo para desconectar después del trabajo. He probado WW y me gusta pero quizá NL sea mejor para dormir…",
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
    excerpt: "Soy nuevo en la plataforma, llevo años cultivando outdoor en el sur y me apetecía conocer gente con la misma pasión…",
    createdAt: "Hace 2 días",
  },
];

export function findThread(slug: string) {
  return MOCK_THREADS.find((t) => t.slug === slug);
}
