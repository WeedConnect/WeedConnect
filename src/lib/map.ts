import { MAP_LOCATIONS } from "@/data/map-points";
import { getClubs } from "@/lib/clubs";
import type { MapLocation, MapCategory } from "@/types";

/**
 * Devuelve todos los puntos del mapa, combinando los demo spots globales
 * con los clubes y asociaciones reales de la base de datos (Supabase o Mock fallback).
 */
export async function getMapLocations(): Promise<MapLocation[]> {
  try {
    const clubs = await getClubs();
    const mappedClubs: MapLocation[] = clubs.map((club) => {
      // Mapear de forma segura SpotCategory a MapCategory
      let category: MapCategory = "association";
      if (club.category === "asociacion") {
        category = "association";
      } else if (
        club.category === "mirador" ||
        club.category === "parque" ||
        club.category === "banco" ||
        club.category === "playa" ||
        club.category === "spot_relax"
      ) {
        category = "chill_spot";
      } else if (club.category === "comida") {
        category = "food";
      } else if (club.category === "noche") {
        category = "nightlife";
      } else if (club.category === "otro") {
        category = "point_of_interest";
      }


      return {
        id: club.id,
        name: club.name,
        slug: club.slug,
        category,
        city: club.city,
        country: club.country,
        continent: "europe", // Por defecto Europa para España
        lat: club.lat,
        lng: club.lng,
        rating: 4.8, // Valoraciones premium para nuestros clubes reales
        reviewCount: 42,
        tags: club.tags,
        description: club.description || "",
        status: "verificar_normativa", // Asociaciones privadas europeas
        verified: true,
        isDemo: false, // Es un club real de la base de datos/mock local
        source: "official",
        websiteUrl: club.website,
        address: club.address,
        updatedAt: club.createdAt,
      };
    });

    // Unimos los clubes reales al principio para que tengan prioridad visual
    return [...mappedClubs, ...MAP_LOCATIONS];
  } catch (error) {
    console.error("[Map] Error cargando clubes reales para el mapa:", error);
    return MAP_LOCATIONS;
  }
}

