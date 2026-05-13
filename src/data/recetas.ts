export type RecetaCategoria = "snack" | "plato" | "postre" | "bebida";
export type RecetaDificultad = "facil" | "media" | "avanzada";

export interface Receta {
  id: string;
  nombre: string;
  categoria: RecetaCategoria;
  dificultad: RecetaDificultad;
  tiempoMin: number;
  descripcion: string;
  ingredientesPrincipales: string[];
  emoji: string;
  veganista?: boolean;
  sinGluten?: boolean;
}

export const MOCK_RECETAS: Receta[] = [
  {
    id: "1",
    nombre: "Nachos con guacamole exprés",
    categoria: "snack",
    dificultad: "facil",
    tiempoMin: 10,
    descripcion:
      "El snack definitivo para una sesión: tortilla chips con guacamole casero, pico de gallo y jalapeños. Listo en 10 minutos.",
    ingredientesPrincipales: ["tortilla chips", "aguacate", "tomate", "cilantro", "lima"],
    emoji: "🥑",
    veganista: true,
    sinGluten: true,
  },
  {
    id: "2",
    nombre: "Brownie de chocolate fudge",
    categoria: "postre",
    dificultad: "media",
    tiempoMin: 45,
    descripcion:
      "Brownie ultra denso y húmedo con cobertura de chocolate negro. Sin cannabutter — simplemente el postre perfecto para el antojo dulce.",
    ingredientesPrincipales: ["chocolate negro", "mantequilla", "azúcar moreno", "huevos", "harina"],
    emoji: "🍫",
  },
  {
    id: "3",
    nombre: "Ramen instantáneo 'de nivel'",
    categoria: "plato",
    dificultad: "facil",
    tiempoMin: 15,
    descripcion:
      "Transforma un ramen de sobre en algo épico: huevo poché, cebolleta, salsa de soja, sésamo y un chorro de aceite de chili. El upgrade definitivo.",
    ingredientesPrincipales: ["fideos ramen", "huevo", "cebolleta", "salsa de soja", "aceite de chili"],
    emoji: "🍜",
  },
  {
    id: "4",
    nombre: "Batido de frutos rojos y plátano",
    categoria: "bebida",
    dificultad: "facil",
    tiempoMin: 5,
    descripcion:
      "Smoothie refrescante y energizante para recuperar el apetito. Frutos rojos congelados, plátano, leche de avena y un toque de miel.",
    ingredientesPrincipales: ["frutos rojos", "plátano", "leche de avena", "miel"],
    emoji: "🍓",
    veganista: true,
    sinGluten: true,
  },
  {
    id: "5",
    nombre: "Pizza casera en sartén",
    categoria: "plato",
    dificultad: "media",
    tiempoMin: 30,
    descripcion:
      "Sin horno: masa rápida en sartén con tomate, mozzarella y los ingredientes que tengas en casa. Crujiente por fuera, suave por dentro.",
    ingredientesPrincipales: ["harina", "tomate triturado", "mozzarella", "orégano", "aceite de oliva"],
    emoji: "🍕",
  },
  {
    id: "6",
    nombre: "Palomitas de caramelo salado",
    categoria: "snack",
    dificultad: "media",
    tiempoMin: 20,
    descripcion:
      "Palomitas caseras bañadas en caramelo con sal Maldon. El equilibrio perfecto de dulce, salado y crujiente para una sesión de película.",
    ingredientesPrincipales: ["maíz para palomitas", "mantequilla", "azúcar", "sal Maldon", "aceite"],
    emoji: "🍿",
    sinGluten: true,
  },
  {
    id: "7",
    nombre: "Wrap de pollo teriyaki",
    categoria: "plato",
    dificultad: "facil",
    tiempoMin: 20,
    descripcion:
      "Pollo a la plancha con salsa teriyaki casera, lechuga, pepino y mayonesa en tortilla de trigo. Saciante y fácil de comer en el sofá.",
    ingredientesPrincipales: ["pechuga de pollo", "tortilla de trigo", "salsa teriyaki", "lechuga", "pepino"],
    emoji: "🌯",
  },
  {
    id: "8",
    nombre: "Cookies de mantequilla de cacahuete",
    categoria: "postre",
    dificultad: "facil",
    tiempoMin: 25,
    descripcion:
      "Solo 3 ingredientes: mantequilla de cacahuete, azúcar y un huevo. Sin harina, sin complicaciones. El postre más fácil del mundo.",
    ingredientesPrincipales: ["mantequilla de cacahuete", "azúcar", "huevo"],
    emoji: "🍪",
    sinGluten: true,
  },
  {
    id: "9",
    nombre: "Horchata de chufa casera",
    categoria: "bebida",
    dificultad: "media",
    tiempoMin: 240,
    descripcion:
      "La bebida más valenciana del mundo: chufas en remojo, licuadas con agua fría y azúcar. Refrescante y reconfortante a la vez. Prepara el día anterior.",
    ingredientesPrincipales: ["chufa", "agua fría", "azúcar", "canela"],
    emoji: "🥛",
    veganista: true,
    sinGluten: true,
  },
  {
    id: "10",
    nombre: "Quesadillas de queso y jalapeño",
    categoria: "snack",
    dificultad: "facil",
    tiempoMin: 10,
    descripcion:
      "Tortilla de harina con mezcla de quesos y jalapeños en sartén. Crujientes, melosas y listas en menos de 10 minutos.",
    ingredientesPrincipales: ["tortillas de harina", "queso mezcla", "jalapeños", "crema agria"],
    emoji: "🫓",
  },
  {
    id: "11",
    nombre: "Pasta al huevo con mantequilla y parmesano",
    categoria: "plato",
    dificultad: "facil",
    tiempoMin: 15,
    descripcion:
      "La receta romana por excelencia en versión exprés: pasta al dente, mantequilla, yema de huevo y mucho parmesano. Simple, eficaz, brutal.",
    ingredientesPrincipales: ["pasta", "mantequilla", "parmesano", "yema de huevo", "pimienta negra"],
    emoji: "🍝",
  },
  {
    id: "12",
    nombre: "Limonada de menta y jengibre",
    categoria: "bebida",
    dificultad: "facil",
    tiempoMin: 10,
    descripcion:
      "Limonada refrescante con menta fresca y jengibre rallado. Perfecta para combatir la sequedad de boca y refrescar el paladar.",
    ingredientesPrincipales: ["limón", "menta fresca", "jengibre", "agua con gas", "azúcar"],
    emoji: "🍋",
    veganista: true,
    sinGluten: true,
  },
];

export const CATEGORIA_LABEL: Record<RecetaCategoria, string> = {
  snack: "Snack",
  plato: "Plato",
  postre: "Postre",
  bebida: "Bebida",
};

export const DIFICULTAD_LABEL: Record<RecetaDificultad, string> = {
  facil: "Fácil",
  media: "Media",
  avanzada: "Avanzada",
};

export const DIFICULTAD_COLOR: Record<RecetaDificultad, string> = {
  facil: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  media: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  avanzada: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
};
