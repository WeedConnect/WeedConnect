import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { TerpeneWheel } from "./terpene-wheel";

describe("TerpeneWheel", () => {
  it("renders all 7 terpene segments inside the SVG wheel", () => {
    const handleSelect = vi.fn();
    render(<TerpeneWheel selectedTerpeneId={null} onSelectTerpene={handleSelect} />);

    // Verificar que se renderizan los 7 botones/grupos del SVG
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(7);

    // Debe mostrar las instrucciones iniciales si no hay selección ni hover
    expect(screen.getByText("Explora por Terpenos")).toBeDefined();
  });

  it("calls onSelectTerpene callback when a terpene segment is clicked", () => {
    const handleSelect = vi.fn();
    render(<TerpeneWheel selectedTerpeneId={null} onSelectTerpene={handleSelect} />);

    // Simular clic en el primer segmento (Mirceno)
    const firstSegment = screen.getAllByRole("button")[0];
    fireEvent.click(firstSegment);

    // Debe llamar al callback con el ID del primer terpeno (myrcene)
    expect(handleSelect).toHaveBeenCalledWith("myrcene");
  });

  it("renders active terpene details when selected", () => {
    const handleSelect = vi.fn();
    // Renderizar con Mirceno ya seleccionado
    render(<TerpeneWheel selectedTerpeneId="myrcene" onSelectTerpene={handleSelect} />);

    // Debe mostrar detalles químicos y aromáticos de Mirceno
    expect(screen.getByText("Mirceno")).toBeDefined();
    expect(screen.getByText("(Myrcene)")).toBeDefined();
    expect(screen.getByText("Relajación corporal")).toBeDefined();
    expect(screen.getByText("Filtrando catálogo por Mirceno")).toBeDefined();
  });

  it("calls onSelectTerpene with null to clear filter when clicked on the active segment again", () => {
    const handleSelect = vi.fn();
    render(<TerpeneWheel selectedTerpeneId="myrcene" onSelectTerpene={handleSelect} />);

    const myrceneSegment = screen.getAllByRole("button")[0];
    fireEvent.click(myrceneSegment);

    // Clicar de nuevo en el seleccionado limpia el filtro
    expect(handleSelect).toHaveBeenCalledWith(null);
  });
});
