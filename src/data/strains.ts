import type { Strain } from "@/types";

export const MOCK_STRAINS: Strain[] = [
  {
    id: "1",
    slug: "white-widow",
    name: "White Widow",
    type: "hybrid",
    thcPct: 19,
    cbdPct: 0.5,
    flavors: ["térreo", "floral", "pino"],
    effects: ["energético", "cerebral", "creativo"],
    description:
      "Híbrido legendario de los 90, con un equilibrio sativa/indica casi perfecto y una resina abundante que la hizo famosa en los coffee shops de Ámsterdam.",
  },
  {
    id: "2",
    slug: "northern-lights",
    name: "Northern Lights",
    type: "indica",
    thcPct: 18,
    cbdPct: 0.2,
    flavors: ["dulce", "especiado", "cítrico"],
    effects: ["relajante", "sedante", "corporal"],
    description:
      "Indica clásica con efecto profundamente relajante. Ideal para el final del día o uso medicinal contra el insomnio.",
  },
  {
    id: "3",
    slug: "amnesia-haze",
    name: "Amnesia Haze",
    type: "sativa",
    thcPct: 22,
    cbdPct: 0.3,
    flavors: ["cítrico", "incienso", "limón"],
    effects: ["eufórico", "social", "creativo"],
    description: "Sativa potente con efecto cerebral marcado. Ganadora de varias Cannabis Cup.",
  },
  {
    id: "4",
    slug: "og-kush",
    name: "OG Kush",
    type: "hybrid",
    thcPct: 23,
    cbdPct: 0.3,
    flavors: ["pino", "tierra", "limón"],
    effects: ["relajante", "feliz", "hambriento"],
    description:
      "Híbrido californiano con notas terpenicas intensas y un efecto equilibrado muy demandado en la west coast.",
  },
  {
    id: "5",
    slug: "blue-dream",
    name: "Blue Dream",
    type: "hybrid",
    thcPct: 18,
    cbdPct: 0.1,
    flavors: ["frutos rojos", "arándano", "dulce"],
    effects: ["creativo", "relajado", "feliz"],
    description: "Cruce Blueberry × Haze. Sativa-dominante muy suave, ideal para usuarios novatos.",
  },
  {
    id: "6",
    slug: "charlottes-web",
    name: "Charlotte's Web",
    type: "hybrid",
    thcPct: 0.5,
    cbdPct: 17,
    flavors: ["térreo", "herbal", "cítrico"],
    effects: ["calmante", "claridad", "sin colocón"],
    description:
      "Variedad medicinal alta en CBD y mínima en THC. Diseñada para uso terapéutico, especialmente en pediatría.",
  },
  {
    id: "7",
    slug: "granddaddy-purple",
    name: "Granddaddy Purple",
    type: "indica",
    thcPct: 20,
    cbdPct: 0.4,
    flavors: ["uva", "frutos del bosque", "dulce"],
    effects: ["sedante", "feliz", "corporal"],
    description:
      "Indica púrpura conocida por su color visualmente impactante y un efecto relajante intenso.",
  },
  {
    id: "8",
    slug: "sour-diesel",
    name: "Sour Diesel",
    type: "sativa",
    thcPct: 22,
    cbdPct: 0.2,
    flavors: ["diesel", "cítrico", "ácido"],
    effects: ["energético", "focal", "social"],
    description: "Sativa estimulante con perfil terpenico inconfundible. Ideal para uso diurno.",
  },
  {
    id: "9",
    slug: "girl-scout-cookies",
    name: "Girl Scout Cookies",
    type: "hybrid",
    thcPct: 25,
    cbdPct: 0.3,
    flavors: ["dulce", "menta", "tierra"],
    effects: ["eufórico", "corporal", "creativo"],
    description: "Híbrido potente ganador de varios premios. Originario de California.",
  },
  {
    id: "10",
    slug: "jack-herer",
    name: "Jack Herer",
    type: "sativa",
    thcPct: 20,
    cbdPct: 0.5,
    flavors: ["pino", "especias", "cítrico"],
    effects: ["claro", "creativo", "funcional"],
    description:
      "Sativa funcional, ideal para uso diurno. Homenaje al activista cannábico Jack Herer.",
  },
];

export function findStrain(slug: string): Strain | undefined {
  return MOCK_STRAINS.find((s) => s.slug === slug);
}
