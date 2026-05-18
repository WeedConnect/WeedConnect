import { MAP_LOCATIONS } from "@/data/map-points";
import type { MapLocation } from "@/types";

/**
 * Devuelve todos los puntos del mapa.
 * TODO: cuando Supabase esté conectado, sustituir por query a tabla `map_locations`.
 * TODO: añadir fuentes externas: Google Places, Foursquare, Yelp Fusion.
 */
export async function getMapLocations(): Promise<MapLocation[]> {
  return MAP_LOCATIONS;
}
