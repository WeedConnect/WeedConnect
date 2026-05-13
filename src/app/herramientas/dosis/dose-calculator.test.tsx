import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { DoseCalculator } from "./dose-calculator";

describe("DoseCalculator", () => {
  it("renders correct initial calculations based on default props", () => {
    render(<DoseCalculator />);

    // Inicialmente: 7g, 18% THC, 60% Eficiencia, 12 porciones
    // THC Total: 7 * 1000 * 0.18 = 1260 mg
    // Biodisponible: 1260 * 0.60 = 756 mg
    // Por porción: 756 / 12 = 63 mg THC
    // Gramos por porción: 7 / 12 = 0.58 g

    // Verificar que los resultados en la tabla de detalle se muestran correctamente
    expect(screen.getByText("0.58 g")).toBeDefined();
    expect(screen.getByText("63 mg")).toBeDefined();
  });

  it("updates calculations correctly when user changes the input values", () => {
    render(<DoseCalculator />);

    // Buscamos los inputs por sus etiquetas
    const gramsInput = screen.getByLabelText(/Cantidad de flor \/ extracto/i);
    const servingsInput = screen.getByLabelText(/Nº de porciones/i);

    // Cambiamos los gramos a 10g
    fireEvent.change(gramsInput, { target: { value: "10" } });
    // Cambiamos las porciones a 10
    fireEvent.change(servingsInput, { target: { value: "10" } });

    // Nuevos valores recalculados:
    // 10g, 18% THC, 60% Eficiencia, 10 porciones
    // THC Total: 10 * 1000 * 0.18 = 1800 mg
    // Biodisponible: 1800 * 0.60 = 1080 mg
    // Por porción: 1080 / 10 = 108 mg THC
    // Gramos por porción: 10 / 10 = 1 g

    // Verificamos los nuevos resultados recalculados en la tabla de detalle
    expect(screen.getByText("1 g")).toBeDefined();
    expect(screen.getByText("108 mg")).toBeDefined();
  });
});
