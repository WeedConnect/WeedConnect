"use client";

import { useState } from "react";
import { Info, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TerpeneInfo {
  id: string;
  name: string;
  chemicalName: string;
  emoji: string;
  aroma: string;
  effects: string[];
  description: string;
  colorClass: string;
  hoverColorClass: string;
  activeColorClass: string;
  bgBadgeClass: string;
  textBadgeClass: string;
  flavorsMapped: string[];
  effectsMapped: string[];
}

export const TERPENES: TerpeneInfo[] = [
  {
    id: "myrcene",
    name: "Mirceno",
    chemicalName: "Myrcene",
    emoji: "🌿",
    aroma: "Térreo, almizcle, herbal",
    effects: ["Relajación corporal", "Sedación", "Calma física"],
    description: "El terpeno más común. Aporta un aroma a tierra húmeda y es el principal responsable del efecto relajante y relajación corporal.",
    colorClass: "fill-emerald-600/80 dark:fill-emerald-700/80",
    hoverColorClass: "hover:fill-emerald-500/90 dark:hover:fill-emerald-600/90",
    activeColorClass: "fill-emerald-500 dark:fill-emerald-600 stroke-emerald-300 dark:stroke-emerald-400 stroke-2",
    bgBadgeClass: "bg-emerald-100 dark:bg-emerald-950/40",
    textBadgeClass: "text-emerald-800 dark:text-emerald-300",
    flavorsMapped: ["térreo", "tierra", "herbal", "especias", "especiado"],
    effectsMapped: ["relajante", "sedante", "corporal"]
  },
  {
    id: "limonene",
    name: "Limoneno",
    chemicalName: "Limonene",
    emoji: "🍋",
    aroma: "Limón, cítrico, ácido",
    effects: ["Mejora del ánimo", "Energía", "Antiestrés"],
    description: "Con fuerte aroma cítrico, destaca por sus propiedades ansiolíticas y energizantes que mejoran el ánimo.",
    colorClass: "fill-amber-500/80 dark:fill-amber-600/80",
    hoverColorClass: "hover:fill-amber-400/90 dark:hover:fill-amber-500/90",
    activeColorClass: "fill-amber-400 dark:fill-amber-500 stroke-amber-200 dark:stroke-amber-300 stroke-2",
    bgBadgeClass: "bg-amber-100 dark:bg-amber-950/40",
    textBadgeClass: "text-amber-800 dark:text-amber-300",
    flavorsMapped: ["cítrico", "limón", "ácido"],
    effectsMapped: ["feliz", "eufórico", "social"]
  },
  {
    id: "pinene",
    name: "Pineno",
    chemicalName: "Pinene",
    emoji: "🌲",
    aroma: "Pino, madera, fresco",
    effects: ["Enfoque mental", "Claridad", "Energía leve"],
    description: "Huele a bosque de pinos. Ayuda a promover el enfoque mental y la claridad, contrarrestando la somnolencia.",
    colorClass: "fill-teal-600/80 dark:fill-teal-700/80",
    hoverColorClass: "hover:fill-teal-500/90 dark:hover:fill-teal-600/90",
    activeColorClass: "fill-teal-500 dark:fill-teal-600 stroke-teal-300 dark:stroke-teal-400 stroke-2",
    bgBadgeClass: "bg-teal-100 dark:bg-teal-950/40",
    textBadgeClass: "text-teal-800 dark:text-teal-300",
    flavorsMapped: ["pino"],
    effectsMapped: ["focal", "claro", "funcional", "claridad"]
  },
  {
    id: "caryophyllene",
    name: "Cariofileno",
    chemicalName: "Caryophyllene",
    emoji: "🌶️",
    aroma: "Pimienta, especias, madera",
    effects: ["Alivio del dolor", "Calma mental", "Bienestar"],
    description: "Aporta notas picantes y amaderadas. Actúa directamente sobre los receptores CB2 del sistema endocannabinoide.",
    colorClass: "fill-orange-600/80 dark:fill-orange-700/80",
    hoverColorClass: "hover:fill-orange-500/90 dark:hover:fill-orange-600/90",
    activeColorClass: "fill-orange-500 dark:fill-orange-600 stroke-orange-300 dark:stroke-orange-400 stroke-2",
    bgBadgeClass: "bg-orange-100 dark:bg-orange-950/40",
    textBadgeClass: "text-orange-800 dark:text-orange-300",
    flavorsMapped: ["menta", "especiado", "especias"],
    effectsMapped: ["relajado", "calmante"]
  },
  {
    id: "linalool",
    name: "Linalool",
    chemicalName: "Linalool",
    emoji: "🌸",
    aroma: "Floral, lavanda, dulce",
    effects: ["Calma mental", "Relajación", "Sueño reparador"],
    description: "Terpeno aromático con notas florales dulces. Promueve una profunda calma mental y ayuda a conciliar el sueño.",
    colorClass: "fill-rose-500/80 dark:fill-rose-600/80",
    hoverColorClass: "hover:fill-rose-400/90 dark:hover:fill-rose-500/90",
    activeColorClass: "fill-rose-400 dark:fill-rose-500 stroke-rose-200 dark:stroke-rose-300 stroke-2",
    bgBadgeClass: "bg-rose-100 dark:bg-rose-950/40",
    textBadgeClass: "text-rose-800 dark:text-rose-300",
    flavorsMapped: ["floral"],
    effectsMapped: ["calmante", "sin colocón"]
  },
  {
    id: "humulene",
    name: "Humuleno",
    chemicalName: "Humulene",
    emoji: "🍺",
    aroma: "Lúpulo, madera, lúpulo seco",
    effects: ["Antiinflamatorio", "Claridad funcional"],
    description: "Presente en el lúpulo y el cilantro. Tiene propiedades antiinflamatorias y ayuda a mantener un estado funcional y claro.",
    colorClass: "fill-lime-600/80 dark:fill-lime-700/80",
    hoverColorClass: "hover:fill-lime-500/90 dark:hover:fill-lime-600/90",
    activeColorClass: "fill-lime-500 dark:fill-lime-600 stroke-lime-300 dark:stroke-lime-400 stroke-2",
    bgBadgeClass: "bg-lime-100 dark:bg-lime-950/40",
    textBadgeClass: "text-lime-800 dark:text-lime-300",
    flavorsMapped: ["incienso", "herbal"],
    effectsMapped: ["calmante", "claro"]
  },
  {
    id: "terpinolene",
    name: "Terpinoleno",
    chemicalName: "Terpinolene",
    emoji: "🍏",
    aroma: "Manzana, pino, floral dulce",
    effects: ["Estimulación cerebral", "Creatividad", "Euforia"],
    description: "Aporta un perfil complejo y dulce. Es altamente estimulante cerebralmente y fomenta la creatividad.",
    colorClass: "fill-sky-500/80 dark:fill-sky-600/80",
    hoverColorClass: "hover:fill-sky-400/90 dark:hover:fill-sky-500/90",
    activeColorClass: "fill-sky-400 dark:fill-sky-500 stroke-sky-200 dark:stroke-sky-300 stroke-2",
    bgBadgeClass: "bg-sky-100 dark:bg-sky-950/40",
    textBadgeClass: "text-sky-800 dark:text-sky-300",
    flavorsMapped: ["frutos rojos", "arándano", "dulce", "uva", "frutos del bosque"],
    effectsMapped: ["creativo", "energético", "cerebral"]
  }
];

interface TerpeneWheelProps {
  selectedTerpeneId: string | null;
  onSelectTerpene: (id: string | null) => void;
}

export function TerpeneWheel({ selectedTerpeneId, onSelectTerpene }: TerpeneWheelProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Dimensiones del SVG
  const size = 300;
  const center = size / 2;
  const R = 135; // Radio exterior
  const r = 70;  // Radio interior (Donut)
  const numSlices = TERPENES.length;
  const anglePerSlice = 360 / numSlices;

  // Obtener el terpeno actualmente activo para mostrar la info (prioriza hover sobre seleccionado)
  const activeTerpene =
    TERPENES.find((t) => t.id === hoveredId) ||
    TERPENES.find((t) => t.id === selectedTerpeneId) ||
    null;

  // Generar la ruta SVG de la rebanada (slice)
  const getSlicePath = (index: number) => {
    const startAngleDeg = index * anglePerSlice;
    const endAngleDeg = (index + 1) * anglePerSlice;

    // Restamos 90 grados para empezar en el eje Y superior (12 en punto)
    const startRad = ((startAngleDeg - 90) * Math.PI) / 180;
    const endRad = ((endAngleDeg - 90) * Math.PI) / 180;

    const x1 = center + R * Math.cos(startRad);
    const y1 = center + R * Math.sin(startRad);
    const x2 = center + R * Math.cos(endRad);
    const y2 = center + R * Math.sin(endRad);

    const x3 = center + r * Math.cos(endRad);
    const y3 = center + r * Math.sin(endRad);
    const x4 = center + r * Math.cos(startRad);
    const y4 = center + r * Math.sin(startRad);

    return `M ${x4} ${y4} L ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${r} ${r} 0 0 0 ${x4} ${y4} Z`;
  };

  // Coordenadas para centrar el Emoji en cada rebanada
  const getEmojiCoords = (index: number) => {
    const midAngleDeg = index * anglePerSlice + anglePerSlice / 2;
    const midRad = ((midAngleDeg - 90) * Math.PI) / 180;
    const rMid = (R + r) / 2;
    return {
      x: center + rMid * Math.cos(midRad),
      y: center + rMid * Math.sin(midRad) + 4, // Pequeño offset para centrar la tipografía
    };
  };

  return (
    <div className="grid gap-6 md:grid-cols-[280px_1fr] items-center rounded-2xl border border-border bg-card/45 p-5 md:p-6 backdrop-blur-sm">
      {/* Columna Rueda SVG */}
      <div className="relative mx-auto w-full max-w-[260px] aspect-square">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full select-none overflow-visible filter drop-shadow-sm"
          aria-label="Rueda sensorial de terpenos"
        >
          {/* Rebanadas de terpenos */}
          {TERPENES.map((terpene, index) => {
            const isHovered = hoveredId === terpene.id;
            const isSelected = selectedTerpeneId === terpene.id;
            const path = getSlicePath(index);
            const emojiPos = getEmojiCoords(index);

            return (
              <g
                key={terpene.id}
                className="cursor-pointer group"
                onClick={() => onSelectTerpene(isSelected ? null : terpene.id)}
                onMouseEnter={() => setHoveredId(terpene.id)}
                onMouseLeave={() => setHoveredId(null)}
                tabIndex={0}
                role="button"
                aria-label={`Terpeno ${terpene.name}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectTerpene(isSelected ? null : terpene.id);
                  }
                }}
              >
                {/* Rebanada de la rueda */}
                <path
                  d={path}
                  className={cn(
                    "transition-all duration-300 ease-out origin-center",
                    isSelected
                      ? terpene.activeColorClass
                      : cn(terpene.colorClass, terpene.hoverColorClass),
                    (isHovered || isSelected) && "scale-[1.03]"
                  )}
                />

                {/* Separador delgado de las rebanadas */}
                <path
                  d={path}
                  fill="none"
                  className="stroke-background dark:stroke-card stroke-[1.5px] pointer-events-none"
                />

                {/* Emojis representativos */}
                <text
                  x={emojiPos.x}
                  y={emojiPos.y}
                  textAnchor="middle"
                  className={cn(
                    "text-lg transition-transform duration-300 pointer-events-none select-none",
                    (isHovered || isSelected) && "scale-125"
                  )}
                >
                  {terpene.emoji}
                </text>
              </g>
            );
          })}

          {/* Anillo de cristal central */}
          <circle
            cx={center}
            cy={center}
            r={r - 3}
            className="fill-white/95 dark:fill-zinc-900/95 stroke-border/40 stroke-1 pointer-events-none"
          />

          {/* Texto o reset en el centro exacto */}
          {selectedTerpeneId ? (
            <g
              className="cursor-pointer"
              onClick={() => onSelectTerpene(null)}
              role="button"
              aria-label="Limpiar filtro de terpenos"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectTerpene(null);
                }
              }}
            >
              <circle
                cx={center}
                cy={center}
                r={24}
                className="fill-zinc-100 hover:fill-zinc-200 dark:fill-zinc-800 dark:hover:fill-zinc-700 transition-colors"
              />
              <RotateCcw className="size-4 text-muted-foreground absolute" style={{ transform: `translate(${center - 8}px, ${center - 8}px)` }} />
            </g>
          ) : (
            <text
              x={center}
              y={center + 5}
              textAnchor="middle"
              className="text-[10px] font-extrabold uppercase fill-muted-foreground tracking-wider pointer-events-none select-none"
            >
              Sensorial
            </text>
          )}
        </svg>
      </div>

      {/* Columna Detalle e Info */}
      <div className="flex flex-col h-full justify-center min-h-[170px]">
        {activeTerpene ? (
          <div className="space-y-3 animate-in fade-in-50 slide-in-from-left-2 duration-200">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl" aria-hidden>
                {activeTerpene.emoji}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-foreground leading-none">
                    {activeTerpene.name}
                  </h3>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    ({activeTerpene.chemicalName})
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 font-semibold">
                  Aroma: <span className="text-foreground">{activeTerpene.aroma}</span>
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {activeTerpene.description}
            </p>

            <div className="space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                Efectos asociados:
              </span>
              <div className="flex flex-wrap gap-1">
                {activeTerpene.effects.map((effect) => (
                  <span
                    key={effect}
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-bold border transition-colors",
                      activeTerpene.bgBadgeClass,
                      activeTerpene.textBadgeClass
                    )}
                  >
                    {effect}
                  </span>
                ))}
              </div>
            </div>

            {selectedTerpeneId === activeTerpene.id && (
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 mt-1">
                <Info className="size-3 shrink-0" />
                Filtrando catálogo por {activeTerpene.name}
              </p>
            )}
          </div>
        ) : (
          <div className="text-center md:text-left py-6 text-muted-foreground flex flex-col items-center md:items-start justify-center gap-2">
            <span className="text-3xl" aria-hidden>
              🎡
            </span>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground">Explora por Terpenos</h3>
              <p className="text-xs max-w-sm">
                Pasa el cursor o presiona las secciones de la rueda para conocer los aromas y efectos
                de los terpenos principales, y haz clic para filtrar las variedades del catálogo.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
