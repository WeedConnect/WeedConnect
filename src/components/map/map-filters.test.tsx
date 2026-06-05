import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { ClubsMap } from "@/app/mapa/clubs-map";
import type { MapLocation } from "@/types";

// ─── Mocks ───────────────────────────────────────────────────────────────────

vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children, position }: { children: React.ReactNode; position: [number, number] }) => (
    <div data-testid="marker" data-position={JSON.stringify(position)}>{children}</div>
  ),
  Popup: ({ children }: { children: React.ReactNode }) => <div data-testid="popup">{children}</div>,
  useMapEvents: () => null,
  useMap: () => ({
    setView: vi.fn(),
  }),
}));

vi.mock("leaflet", () => ({
  default: {
    divIcon: vi.fn().mockReturnValue({}),
  },
  divIcon: vi.fn().mockReturnValue({}),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock("@/components/ui/sheet", () => ({
  Sheet: ({ children }: { children: React.ReactNode }) => <div data-testid="sheet-root">{children}</div>,
  SheetTrigger: ({ children }: { children: React.ReactNode }) => <div data-testid="sheet-trigger">{children}</div>,
  SheetContent: ({ children }: { children: React.ReactNode }) => <div data-testid="sheet-content">{children}</div>,
  SheetHeader: ({ children }: { children: React.ReactNode }) => <div data-testid="sheet-header">{children}</div>,
  SheetTitle: ({ children }: { children: React.ReactNode }) => <div data-testid="sheet-title">{children}</div>,
  SheetDescription: ({ children }: { children: React.ReactNode }) => <div data-testid="sheet-description">{children}</div>,
  SheetClose: ({ children }: { children: React.ReactNode }) => <div data-testid="sheet-close">{children}</div>,
}));

vi.mock("@/components/map/propose-spot-modal", () => ({
  ProposeSpotModal: () => <div data-testid="propose-spot-modal" />,
}));

// Mock Geolocation
const mockGeolocation = {
  getCurrentPosition: vi.fn().mockImplementation((success) =>
    success({
      coords: {
        latitude: 40.4168,
        longitude: -3.7038,
      },
    })
  ),
};
vi.stubGlobal("navigator", {
  geolocation: mockGeolocation,
});

// ─── Test Data ────────────────────────────────────────────────────────────────

const MOCK_LOCATIONS: MapLocation[] = [
  {
    id: "loc-1",
    name: "Club Green Leaf",
    slug: "club-green-leaf",
    category: "association",
    city: "Barcelona",
    country: "Spain",
    continent: "europe",
    lat: 41.3851,
    lng: 2.1734,
    rating: 4.8,
    reviewCount: 150,
    tags: ["club", "members only", "wifi"],
    description: "Excelente club social con buena conexión.",
    status: "verificar_normativa",
    verified: true,
  },
  {
    id: "loc-2",
    name: "Mirador del Sol",
    slug: "mirador-del-sol",
    category: "chill_spot",
    city: "Madrid",
    country: "Spain",
    continent: "europe",
    lat: 40.4168,
    lng: -3.7038,
    rating: 4.5,
    reviewCount: 80,
    tags: ["mirador", "terraza", "atardecer"],
    description: "Vistas espectaculares al aire libre.",
    status: "info_orientativa",
    verified: false,
  },
];

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("ClubsMap Filters & Real-Time Logic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders locations and stats correctly", () => {
    render(<ClubsMap locations={MOCK_LOCATIONS} />);

    // Verificar que se listan los lugares
    expect(screen.getAllByText("Club Green Leaf").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Mirador del Sol").length).toBeGreaterThan(0);

    // Stats bar debe mostrar conteos correctos
    expect(screen.getByText("total")).toBeDefined();
  });

  it("loads and merges proposed spots from localStorage", () => {
    const localSpot: MapLocation = {
      id: "local-prop-12345",
      name: "Spot Propuesto Local",
      slug: "local-spot-propuesto-local",
      category: "chill_spot",
      city: "Valencia",
      country: "Spain",
      continent: "europe",
      lat: 39.4699,
      lng: -0.3763,
      rating: 5.0,
      reviewCount: 1,
      tags: ["comunidad", "propuesto"],
      description: "Spot local propuesto.",
      status: "info_orientativa",
      verified: false,
    };

    localStorage.setItem("weedconnect_local_proposed_spots", JSON.stringify([localSpot]));

    render(<ClubsMap locations={MOCK_LOCATIONS} />);

    // Debe mostrar la locación local combinada (en la tarjeta de lista o marcador popup)
    expect(screen.getAllByText("Spot Propuesto Local").length).toBeGreaterThan(0);
  });

  it("filters locations reactively using search input", () => {
    render(<ClubsMap locations={MOCK_LOCATIONS} />);

    const searchInput = screen.getByPlaceholderText(/Buscar por nombre/i);
    
    // Filtrar por "Mirador"
    fireEvent.change(searchInput, { target: { value: "Mirador" } });

    expect(screen.queryByText("Club Green Leaf")).toBeNull();
    expect(screen.getAllByText("Mirador del Sol").length).toBeGreaterThan(0);
  });

  it("calculates distance and sorts by 'Cerca de mí' when geolocation is requested", async () => {
    render(<ClubsMap locations={MOCK_LOCATIONS} />);

    const locationButton = screen.getByRole("button", { name: /Ubicación/i });
    fireEvent.click(locationButton);

    // Debe dispararse geolocalización
    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();

    // Debe calcular distancia (por ejemplo, el spot de Madrid a 40.4168, -3.7038 debe estar a 0.0 km)
    await waitFor(() => {
      expect(screen.getAllByText("0.0 km").length).toBeGreaterThan(0);
    });
  });

  it("submits live status reports and stores them in localStorage", () => {
    render(<ClubsMap locations={MOCK_LOCATIONS} />);

    // Buscar botón de reporte rápido para 'Club Green Leaf' (🟢 = Tranquilo)
    const reportButtons = screen.getAllByTitle(/Reportar como tranquilo/i);
    expect(reportButtons.length).toBeGreaterThan(0);

    // Simular reporte
    fireEvent.click(reportButtons[0]);

    // Debe guardarse en localStorage y actualizar estado en UI
    const savedReports = JSON.parse(localStorage.getItem("weedconnect_live_reports") || "{}");
    expect(savedReports["loc-1"]).toBeDefined();
    expect(savedReports["loc-1"].status).toBe("tranquilo");
  });
});
