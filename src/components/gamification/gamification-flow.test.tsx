import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { getLevel, getLevelProgress } from "@/lib/gamification";
import { Achievements } from "./achievements";
import { DailyQuests } from "./daily-quests";

describe("Gamification Rules (Terpene XP)", () => {
  it("correctly identifies the maximum Level 'Leyenda' at 2000+ points with rose style tokens", () => {
    const level = getLevel(2500);
    expect(level.id).toBe("leyenda");
    expect(level.name).toBe("Leyenda");
    expect(level.color).toContain("rose");
    expect(level.bgColor).toContain("rose");
  });

  it("calculates progress toward the next level correctly", () => {
    // Nivel Plántula tiene minPoints 50, maxPoints 199. Rango = 150 pts.
    // Con 125 pts, tiene 75/150 = 50% de progreso.
    const { pct, pointsToNext } = getLevelProgress(125);
    expect(pct).toBe(50);
    expect(pointsToNext).toBe(75);
  });

  it("identifies progress for max level correctly without crashing", () => {
    const { pct, pointsToNext } = getLevelProgress(2500);
    expect(pct).toBe(100);
    expect(pointsToNext).toBeNull();
  });
});

describe("Achievements Component", () => {
  it("renders achievements and filters them by category tab", () => {
    render(<Achievements points={250} threadCount={2} hasAvatar={true} />);

    // Verificar que se renderiza el contador total de logros
    expect(screen.getByText(/Completados/)).toBeDefined();

    // Buscar los botones de categoría
    const allTab = screen.getByRole("button", { name: "Todos" });
    const forumTab = screen.getByRole("button", { name: "Foro" });
    const cultivoTab = screen.getByRole("button", { name: "Cultivo" });

    // Inicialmente muestra el logro de Foro "Voz Activa" y el logro "Cultivador Novato"
    expect(screen.getByText("Voz Activa")).toBeDefined();
    expect(screen.getByText("Cultivador Novato")).toBeDefined();

    // Cambiar filtro a "Foro"
    fireEvent.click(forumTab);
    expect(screen.getByText("Voz Activa")).toBeDefined();
    // Cultivador Novato debería desaparecer ya que es de la categoría Cultivo
    expect(screen.queryByText("Cultivador Novato")).toBeNull();

    // Cambiar filtro a "Cultivo"
    fireEvent.click(cultivoTab);
    expect(screen.getByText("Cultivador Novato")).toBeDefined();
    expect(screen.queryByText("Voz Activa")).toBeNull();
  });
});

describe("DailyQuests Component", () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada prueba
    localStorage.clear();
  });

  it("renders daily quests list and allows simulating a quest completion", () => {
    const handlePointsEarned = vi.fn();
    render(<DailyQuests onPointsEarned={handlePointsEarned} />);

    // Verificar que se muestra la lista inicial de misiones
    expect(screen.getByText("Explorador de Terpenos")).toBeDefined();
    expect(screen.getByText("Chef de la Comunidad")).toBeDefined();

    // Buscar botones "Simular"
    const simulateButtons = screen.getAllByText("Simular");
    expect(simulateButtons.length).toBe(4);

    // Simular la primera misión ("Explorador de Terpenos", +5 TXP)
    fireEvent.click(simulateButtons[0]);

    // Debe llamar al callback con 5 puntos
    expect(handlePointsEarned).toHaveBeenCalledWith(5);

    // El estado del botón debe cambiar a "Completado"
    expect(screen.getByText("Completado")).toBeDefined();
  });
});
