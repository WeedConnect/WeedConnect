"use client";

import { useState } from "react";
import { Clock, FlaskConical, Calculator, ShieldAlert, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { calculateDoseByServings, calculateDoseByMeasure } from "./dose-calculations";

interface Receta {
  id: string;
  emoji: string;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  tiempoPrep: string;
  tiempoTotal: string;
  dificultad: string;
  efficiency: number;
  defaultWeight: number;
  defaultGrams: number;
  unitLabel: string;
  pasos: string[];
  consejos: string[];
}

export function RecipeList({ recetas }: { recetas: Receta[] }) {
  // Estado para controlar qué receta tiene el calculador abierto
  const [activeCalculator, setActiveCalculator] = useState<string | null>(null);

  // Estado para los inputs del calculador indexados por el ID de la receta
  const [inputs, setInputs] = useState<
    Record<
      string,
      {
        grams: number;
        thcPct: number;
        efficiency: number;
        servings: number;
        totalVolume: number;
        measureSize: number;
        calcMode: "servings" | "measure";
      }
    >
  >({});

  const toggleCalculator = (recipeId: string) => {
    if (activeCalculator === recipeId) {
      setActiveCalculator(null);
    } else {
      // Inicializar inputs si no existen para esta receta
      if (!inputs[recipeId]) {
        const recipe = recetas.find((r) => r.id === recipeId);
        if (recipe) {
          setInputs((prev) => ({
            ...prev,
            [recipeId]: {
              grams: recipe.defaultGrams,
              thcPct: 18,
              efficiency: recipe.efficiency,
              servings: 12,
              totalVolume: recipe.defaultWeight,
              measureSize: recipe.id === "tintura-alcohol" ? 1 : 10,
              calcMode: "servings",
            },
          }));
        }
      }
      setActiveCalculator(recipeId);
    }
  };

  const updateInput = (
    recipeId: string,
    field: string,
    value: number | string
  ) => {
    setInputs((prev) => ({
      ...prev,
      [recipeId]: {
        ...prev[recipeId],
        [field]: value,
      },
    }));
  };

  // Determinar nivel de advertencia de la dosis
  const getDoseLevel = (mg: number) => {
    if (mg < 2.5) {
      return {
        label: "Microdosis",
        color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300 border-emerald-200",
        description:
          "Efecto extremadamente suave. Recomendado para principiantes o microdosificación diaria sin efectos psicoactivos notables.",
      };
    } else if (mg <= 5) {
      return {
        label: "Dosis Baja",
        color: "bg-teal-50 text-teal-700 dark:bg-teal-950/30 dark:text-teal-300 border-teal-200",
        description:
          "Efecto leve/moderado. Excelente punto de partida para experimentar sensaciones físicas y relajación sin abrumar.",
      };
    } else if (mg <= 15) {
      return {
        label: "Dosis Moderada",
        color: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300 border-amber-200",
        description:
          "Efecto notable y duradero. Apto para usuarios sociales o recreativos con experiencia media.",
      };
    } else if (mg <= 30) {
      return {
        label: "Dosis Alta",
        color: "bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-300 border-orange-200",
        description:
          "Efecto muy fuerte. Puede resultar abrumador. Recomendado únicamente para usuarios con alta tolerancia.",
      };
    } else {
      return {
        label: "Dosis Crítica",
        color: "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300 border-red-200",
        description:
          "¡Peligro de sobredosis/mal viaje! Potencia extremadamente alta. Riesgo elevado de paranoia, taquicardia o mareos. ¡Consumir con precaución extrema!",
      };
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {recetas.map((receta) => {
        const isOpen = activeCalculator === receta.id;
        const recipeInputs = inputs[receta.id] || {
          grams: receta.defaultGrams,
          thcPct: 18,
          efficiency: receta.efficiency,
          servings: 12,
          totalVolume: receta.defaultWeight,
          measureSize: receta.id === "tintura-alcohol" ? 1 : 10,
          calcMode: "servings" as const,
        };

        // Realizar cálculos
        const isServingsMode = recipeInputs.calcMode === "servings";
        const resultsServings = calculateDoseByServings({
          grams: recipeInputs.grams,
          thcPct: recipeInputs.thcPct,
          efficiency: recipeInputs.efficiency,
          servings: recipeInputs.servings,
        });

        const resultsMeasure = calculateDoseByMeasure({
          grams: recipeInputs.grams,
          thcPct: recipeInputs.thcPct,
          efficiency: recipeInputs.efficiency,
          totalVolume: recipeInputs.totalVolume,
          measureSize: recipeInputs.measureSize,
        });

        const currentMg = isServingsMode
          ? resultsServings.perServingMg
          : resultsMeasure.perMeasureMg;

        const currentGrams = isServingsMode
          ? resultsServings.gramsPerServing
          : resultsMeasure.gramsPerMeasure;

        const doseInfo = getDoseLevel(currentMg);

        return (
          <Card key={receta.id} className="overflow-hidden transition-shadow hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl" aria-hidden>
                    {receta.emoji}
                  </span>
                  <div>
                    <CardTitle className="text-lg">{receta.titulo}</CardTitle>
                    <p className="text-sm text-muted-foreground">{receta.subtitulo}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" /> Preparación: {receta.tiempoPrep}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" /> Total: {receta.tiempoTotal}
                      </span>
                      <Badge
                        className={cn(
                          "border-0 text-[10px]",
                          receta.dificultad === "facil"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
                        )}
                      >
                        {receta.dificultad === "facil" ? "Fácil" : "Media"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "flex items-center gap-1.5 text-xs font-semibold shrink-0 transition-colors",
                    isOpen
                      ? "bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-800 dark:text-emerald-300"
                      : "hover:bg-muted"
                  )}
                  onClick={() => toggleCalculator(receta.id)}
                >
                  <Calculator className="size-3.5" />
                  {isOpen ? "Cerrar Calculadora" : "Calcular Dosis"}
                  {isOpen ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <p className="text-sm text-muted-foreground leading-relaxed">{receta.descripcion}</p>

              {/* ── SECCIÓN DE LA CALCULADORA EXPANDIDA ── */}
              {isOpen && (
                <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/20 p-4 sm:p-5 dark:border-emerald-800/30 dark:bg-emerald-950/10 flex flex-col gap-5 animate-in fade-in-50 duration-200">
                  <div className="flex items-center justify-between border-b border-emerald-200/50 dark:border-emerald-800/30 pb-3">
                    <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-800 dark:text-emerald-300">
                      <Calculator className="size-4" />
                      Calculadora de Dosis Personalizada
                    </span>
                    
                    {/* Selectores de modo */}
                    <div className="flex rounded-lg bg-emerald-100/50 p-0.5 dark:bg-emerald-950/40">
                      <button
                        type="button"
                        className={cn(
                          "rounded-md px-2.5 py-1 text-xs font-semibold transition-all",
                          isServingsMode
                            ? "bg-white text-emerald-800 shadow-sm dark:bg-emerald-900 dark:text-emerald-200"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                        onClick={() => updateInput(receta.id, "calcMode", "servings")}
                      >
                        Por Porciones
                      </button>
                      <button
                        type="button"
                        className={cn(
                          "rounded-md px-2.5 py-1 text-xs font-semibold transition-all",
                          !isServingsMode
                            ? "bg-white text-emerald-800 shadow-sm dark:bg-emerald-900 dark:text-emerald-200"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                        onClick={() => updateInput(receta.id, "calcMode", "measure")}
                      >
                        Por Peso / ml
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
                    {/* Inputs */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                      <div className="space-y-1.5">
                        <Label htmlFor={`grams-${receta.id}`} className="text-xs font-bold">
                          Cantidad de flor / extracto (gramos)
                        </Label>
                        <Input
                          id={`grams-${receta.id}`}
                          type="number"
                          value={recipeInputs.grams}
                          min={0}
                          step={0.5}
                          className="bg-background"
                          onChange={(e) => updateInput(receta.id, "grams", parseFloat(e.target.value) || 0)}
                        />
                        <p className="text-[10px] text-muted-foreground">Cuánto material vas a infundir.</p>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor={`thc-${receta.id}`} className="text-xs font-bold">
                          Potencia de la flor (% THC)
                        </Label>
                        <Input
                          id={`thc-${receta.id}`}
                          type="number"
                          value={recipeInputs.thcPct}
                          min={0}
                          max={100}
                          step={0.5}
                          className="bg-background"
                          onChange={(e) => updateInput(receta.id, "thcPct", parseFloat(e.target.value) || 0)}
                        />
                        <p className="text-[10px] text-muted-foreground">Promedio: 15% - 22% THC para cogollos.</p>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor={`efficiency-${receta.id}`} className="text-xs font-bold">
                          Eficiencia de la extracción (%)
                        </Label>
                        <Input
                          id={`efficiency-${receta.id}`}
                          type="number"
                          value={recipeInputs.efficiency}
                          min={0}
                          max={100}
                          className="bg-background"
                          onChange={(e) => updateInput(receta.id, "efficiency", parseInt(e.target.value) || 0)}
                        />
                        <p className="text-[10px] text-muted-foreground">Porcentaje de cannabinoides extraídos (Butter: 60%, Tintura: 70%).</p>
                      </div>

                      {isServingsMode ? (
                        <div className="space-y-1.5">
                          <Label htmlFor={`servings-${receta.id}`} className="text-xs font-bold">
                            Nº de porciones finales
                          </Label>
                          <Input
                            id={`servings-${receta.id}`}
                            type="number"
                            value={recipeInputs.servings}
                            min={1}
                            className="bg-background"
                            onChange={(e) => updateInput(receta.id, "servings", parseInt(e.target.value) || 1)}
                          />
                          <p className="text-[10px] text-muted-foreground">En cuántas unidades repartirás el producto.</p>
                        </div>
                      ) : (
                        <>
                          <div className="space-y-1.5">
                            <Label htmlFor={`totalVolume-${receta.id}`} className="text-xs font-bold">
                              Peso/Volumen total de base ({receta.unitLabel.split(" ")[0]})
                            </Label>
                            <Input
                              id={`totalVolume-${receta.id}`}
                              type="number"
                              value={recipeInputs.totalVolume}
                              min={1}
                              className="bg-background"
                              onChange={(e) => updateInput(receta.id, "totalVolume", parseFloat(e.target.value) || 1)}
                            />
                            <p className="text-[10px] text-muted-foreground">Peso o volumen total de {receta.unitLabel.split(" ").slice(1).join(" ")}.</p>
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor={`measureSize-${receta.id}`} className="text-xs font-bold">
                              Tamaño de tu porción de medida
                            </Label>
                            <Input
                              id={`measureSize-${receta.id}`}
                              type="number"
                              value={recipeInputs.measureSize}
                              min={0.1}
                              step={0.5}
                              className="bg-background"
                              onChange={(e) => updateInput(receta.id, "measureSize", parseFloat(e.target.value) || 0.1)}
                            />
                            <p className="text-[10px] text-muted-foreground">
                              Ejemplo: gotero = 1ml, cucharadita = 10g/ml, cucharada sopera = 15g/ml.
                            </p>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Resultados */}
                    <div className="flex flex-col gap-4">
                      <div className="rounded-xl border border-emerald-200 bg-white p-4 dark:border-emerald-800/30 dark:bg-emerald-950/20 shadow-sm flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 tracking-wider">
                            Potencia estimada {isServingsMode ? "por Porción" : "por Medida"}
                          </span>
                          <p className="text-3xl font-extrabold text-emerald-800 dark:text-emerald-300 tracking-tight mt-1">
                            {currentMg} <span className="text-sm font-semibold">mg THC</span>
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                            Contiene aprox. {currentGrams} g de materia vegetal.
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-emerald-100 dark:border-emerald-900 flex items-center justify-between">
                          <span className="text-xs text-muted-foreground font-semibold">Clasificación:</span>
                          <Badge variant="outline" className={cn("text-[10px] font-extrabold uppercase py-0.5 px-2 border", doseInfo.color)}>
                            {doseInfo.label}
                          </Badge>
                        </div>
                      </div>

                      {/* Mensaje de reducción de daños dinámico */}
                      <div className="rounded-xl border border-amber-200/50 bg-amber-50/30 p-3.5 dark:border-amber-900/30 dark:bg-amber-950/10 flex gap-2.5 items-start">
                        <ShieldAlert className="size-4 shrink-0 text-amber-600 dark:text-amber-500 mt-0.5 animate-pulse" />
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-amber-900 dark:text-amber-400">Pautas de Consumo Seguro</p>
                          <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-normal">{doseInfo.description}</p>
                        </div>
                      </div>

                      {/* Desglose técnico */}
                      <div className="rounded-xl border border-muted bg-muted/20 p-3.5 space-y-2">
                        <p className="text-xs font-bold text-foreground">Detalle Técnico</p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
                          <span className="text-muted-foreground">THC total en flor:</span>
                          <span className="text-right font-medium">{isServingsMode ? resultsServings.totalThcMg : resultsMeasure.totalThcMg} mg</span>
                          
                          <span className="text-muted-foreground">THC extraído:</span>
                          <span className="text-right font-medium">{isServingsMode ? resultsServings.bioavailableMg : resultsMeasure.bioavailableMg} mg</span>
                          
                          {!isServingsMode && (
                            <>
                              <span className="text-muted-foreground">Concentración base:</span>
                              <span className="text-right font-medium">{resultsMeasure.concentrationMgPerUnit} mg/ml (o g)</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Paso a paso */}
              <div>
                <h3 className="mb-2 text-sm font-semibold">Paso a paso</h3>
                <ol className="flex flex-col gap-2">
                  {receta.pasos.map((paso, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{paso}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Consejos clave */}
              <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-900/30 dark:bg-blue-950/20">
                <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-blue-800 dark:text-blue-200">
                  <FlaskConical className="size-3.5" />
                  Consejos clave de dosificación
                </h3>
                <ul className="flex flex-col gap-1.5">
                  {receta.consejos.map((consejo, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-blue-700 dark:text-blue-300">
                      <span className="mt-1.5 size-1 shrink-0 rounded-full bg-blue-500" aria-hidden />
                      <span className="leading-relaxed">{consejo}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
