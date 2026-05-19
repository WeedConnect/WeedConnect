import { describe, it, expect } from "vitest";
import { calculateDoseByServings, calculateDoseByMeasure } from "./dose-calculations";

describe("dose-calculations", () => {
  describe("calculateDoseByServings", () => {
    it("calculates correct dose for standard cannabutter recipe", () => {
      // 7g weed, 18% THC, 60% efficiency, 12 servings
      const result = calculateDoseByServings({
        grams: 7,
        thcPct: 18,
        efficiency: 60,
        servings: 12,
      });

      expect(result.totalThcMg).toBe(1260); // 7 * 1000 * 0.18
      expect(result.bioavailableMg).toBe(756); // 1260 * 0.60
      expect(result.perServingMg).toBe(63); // 756 / 12 = 63.0
      expect(result.gramsPerServing).toBe(0.58); // 7 / 12 = 0.5833...
    });

    it("handles zero servings gracefully without crashing", () => {
      const result = calculateDoseByServings({
        grams: 7,
        thcPct: 18,
        efficiency: 60,
        servings: 0,
      });

      expect(result.perServingMg).toBe(0);
      expect(result.gramsPerServing).toBe(0);
    });
  });

  describe("calculateDoseByMeasure", () => {
    it("calculates correct base concentration and serving dose", () => {
      // 7g weed, 18% THC, 65% efficiency, 200ml oil, 10ml serving size
      const result = calculateDoseByMeasure({
        grams: 7,
        thcPct: 18,
        efficiency: 65,
        totalVolume: 200,
        measureSize: 10,
      });

      expect(result.totalThcMg).toBe(1260); // 7 * 1000 * 0.18
      expect(result.bioavailableMg).toBe(819); // 1260 * 0.65
      expect(result.concentrationMgPerUnit).toBe(4.1); // 819 / 200 = 4.095 -> 4.1
      expect(result.perMeasureMg).toBe(40.9); // 4.095 * 10 = 40.95 -> 40.9 due to floating point precision
      expect(result.gramsPerMeasure).toBe(0.35); // (7 / 200) * 10 = 0.35
    });

    it("handles zero volume volume gracefully without crashing", () => {
      const result = calculateDoseByMeasure({
        grams: 7,
        thcPct: 18,
        efficiency: 65,
        totalVolume: 0,
        measureSize: 10,
      });

      expect(result.concentrationMgPerUnit).toBe(0);
      expect(result.perMeasureMg).toBe(0);
      expect(result.gramsPerMeasure).toBe(0);
    });
  });
});
