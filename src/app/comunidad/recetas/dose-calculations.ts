export interface DosingParams {
  grams: number;
  thcPct: number;
  efficiency: number;
  servings?: number;
  totalVolume?: number;
  measureSize?: number;
}

export function calculateDoseByServings({
  grams,
  thcPct,
  efficiency,
  servings = 1,
}: DosingParams) {
  const totalThcMg = grams * 1000 * (thcPct / 100);
  const bioavailableMg = totalThcMg * (efficiency / 100);
  const perServingMg = servings > 0 ? bioavailableMg / servings : 0;
  const gramsPerServing = servings > 0 ? grams / servings : 0;

  return {
    totalThcMg: round(totalThcMg, 0),
    bioavailableMg: round(bioavailableMg, 0),
    perServingMg: round(perServingMg, 1),
    gramsPerServing: round(gramsPerServing, 2),
  };
}

export function calculateDoseByMeasure({
  grams,
  thcPct,
  efficiency,
  totalVolume = 250,
  measureSize = 10,
}: DosingParams) {
  const totalThcMg = grams * 1000 * (thcPct / 100);
  const bioavailableMg = totalThcMg * (efficiency / 100);
  
  const concentrationMgPerUnit = totalVolume > 0 ? bioavailableMg / totalVolume : 0;
  const perMeasureMg = concentrationMgPerUnit * measureSize;
  const gramsPerMeasure = totalVolume > 0 ? (grams / totalVolume) * measureSize : 0;

  return {
    totalThcMg: round(totalThcMg, 0),
    bioavailableMg: round(bioavailableMg, 0),
    concentrationMgPerUnit: round(concentrationMgPerUnit, 2),
    perMeasureMg: round(perMeasureMg, 1),
    gramsPerMeasure: round(gramsPerMeasure, 2),
  };
}

function round(n: number, digits: number) {
  const p = 10 ** digits;
  return Math.round(n * p) / p;
}
