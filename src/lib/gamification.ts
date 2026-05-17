export type LevelId = "semilla" | "plantula" | "cultivador" | "maestro" | "leyenda";

export interface Level {
  id: LevelId;
  name: string;
  minPoints: number;
  maxPoints: number | null;
  color: string;
  bgColor: string;
}

export const LEVELS: Level[] = [
  { id: "semilla",    name: "Semilla",    minPoints: 0,    maxPoints: 49,   color: "text-emerald-600 dark:text-emerald-400",   bgColor: "bg-emerald-50 dark:bg-emerald-950/60"   },
  { id: "plantula",   name: "Plántula",   minPoints: 50,   maxPoints: 199,  color: "text-lime-600 dark:text-lime-400",          bgColor: "bg-lime-50 dark:bg-lime-950/60"          },
  { id: "cultivador", name: "Cultivador", minPoints: 200,  maxPoints: 499,  color: "text-teal-600 dark:text-teal-400",          bgColor: "bg-teal-50 dark:bg-teal-950/60"          },
  { id: "maestro",    name: "Maestro",    minPoints: 500,  maxPoints: 1999, color: "text-amber-600 dark:text-amber-400",        bgColor: "bg-amber-50 dark:bg-amber-950/60"        },
  { id: "leyenda",    name: "Leyenda",    minPoints: 2000, maxPoints: null, color: "text-purple-600 dark:text-purple-400",      bgColor: "bg-purple-50 dark:bg-purple-950/60"      },
];

export function getLevel(points: number): Level {
  return [...LEVELS].reverse().find((l) => points >= l.minPoints) ?? LEVELS[0];
}

export function getLevelProgress(points: number): { pct: number; pointsToNext: number | null } {
  const level = getLevel(points);
  if (level.maxPoints === null) return { pct: 100, pointsToNext: null };
  const range = level.maxPoints - level.minPoints + 1;
  const progress = points - level.minPoints;
  const pct = Math.min(100, Math.round((progress / range) * 100));
  return { pct, pointsToNext: level.maxPoints + 1 - points };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "comunidad" | "cultivo" | "foro" | "explorador";
  condition: (data: { points: number; threadCount?: number; hasAvatar?: boolean }) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "bienvenido",
    name: "Bienvenido",
    description: "Te has unido a WeedConnect.",
    icon: "Leaf",
    category: "comunidad",
    condition: () => true,
  },
  {
    id: "primer-paso",
    name: "Primer Paso",
    description: "Has ganado tus primeros 10 puntos.",
    icon: "Sprout",
    category: "comunidad",
    condition: ({ points }) => points >= 10,
  },
  {
    id: "perfil-completo",
    name: "Perfil Completo",
    description: "Has añadido un avatar a tu perfil.",
    icon: "UserCheck",
    category: "comunidad",
    condition: ({ hasAvatar }) => !!hasAvatar,
  },
  {
    id: "voz-activa",
    name: "Voz Activa",
    description: "Has abierto tu primer hilo en el foro.",
    icon: "MessageSquarePlus",
    category: "foro",
    condition: ({ threadCount }) => (threadCount ?? 0) >= 1,
  },
  {
    id: "debatidor",
    name: "Debatidor",
    description: "Has abierto 5 hilos en el foro.",
    icon: "MessagesSquare",
    category: "foro",
    condition: ({ threadCount }) => (threadCount ?? 0) >= 5,
  },
  {
    id: "cultivador-novato",
    name: "Cultivador Novato",
    description: "Has alcanzado 200 puntos WeedConnect.",
    icon: "Sprout",
    category: "cultivo",
    condition: ({ points }) => points >= 200,
  },
  {
    id: "maestro",
    name: "Maestro",
    description: "Has alcanzado 500 puntos WeedConnect.",
    icon: "Award",
    category: "comunidad",
    condition: ({ points }) => points >= 500,
  },
  {
    id: "leyenda",
    name: "Leyenda",
    description: "Has alcanzado 2.000 puntos WeedConnect.",
    icon: "Trophy",
    category: "comunidad",
    condition: ({ points }) => points >= 2000,
  },
  {
    id: "explorador",
    name: "Explorador",
    description: "Has visitado el mapa colaborativo.",
    icon: "Map",
    category: "explorador",
    condition: () => false, // se activará con Supabase (tracking de visitas)
  },
  {
    id: "fotografo",
    name: "Fotógrafo",
    description: "Has subido tu primera foto al grow log.",
    icon: "Camera",
    category: "cultivo",
    condition: () => false, // se activará cuando el grow log esté conectado
  },
];
