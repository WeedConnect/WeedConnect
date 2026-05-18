/**
 * Normaliza un RawPlace de cualquier proveedor a MapLocation.
 * TODO: implementar transformación real cuando se integren APIs.
 */

import type { RawPlace } from "./types";
import type { MapLocation, MapCategory, LocationStatus } from "@/types";

function inferCategory(_place: RawPlace): MapCategory {
  // TODO: mapear categorías/tipos del proveedor a MapCategory
  // Por ahora devuelve "dispensary" como placeholder
  return "dispensary";
}

function inferStatus(_place: RawPlace): LocationStatus {
  return "verificar_normativa";
}

export function normalizePlace(place: RawPlace, idx: number): MapLocation {
  return {
    id:           `${place.sourceProvider}-${place.externalId}`,
    name:         place.name,
    slug:         `${place.sourceProvider}-${place.externalId}-${idx}`,
    category:     inferCategory(place),
    city:         place.city ?? "Unknown",
    country:      place.country ?? "Unknown",
    lat:          place.lat,
    lng:          place.lng,
    rating:       place.rating ?? 4.0,
    reviewCount:  place.reviewCount ?? 0,
    tags:         place.tags ?? [],
    description:  "Información orientativa. Verifica normativa local antes de visitar.",
    status:       inferStatus(place),
    verified:     false,
    isDemo:       false,
    source:       place.sourceProvider,
    sourceId:     place.externalId,
    websiteUrl:   place.websiteUrl,
    address:      place.address,
    openingHours: place.openingHours,
    confidenceScore: 0.5,
    updatedAt:    new Date().toISOString(),
  };
}
