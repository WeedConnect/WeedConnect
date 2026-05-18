/**
 * Script de importación de lugares desde proveedores externos.
 * TODO: implementar cuando las API keys estén disponibles.
 *
 * Uso (futuro):
 *   ENABLE_REAL_PLACE_IMPORT=true pnpm tsx scripts/import-places.ts
 *
 * Variables de entorno necesarias (ver .env.example):
 *   GOOGLE_PLACES_API_KEY
 *   FOURSQUARE_API_KEY
 *   ENABLE_REAL_PLACE_IMPORT
 */

// import { GooglePlacesProvider } from "@/lib/places/providers/google-places";
// import { FoursquareProvider } from "@/lib/places/providers/foursquare";
// import { OpenStreetMapProvider } from "@/lib/places/providers/openstreetmap";
// import { normalizePlace } from "@/lib/places/normalize-place";

async function main() {
  if (process.env.ENABLE_REAL_PLACE_IMPORT !== "true") {
    console.log("ENABLE_REAL_PLACE_IMPORT no está activado. Saliendo.");
    console.log("Para activar: ENABLE_REAL_PLACE_IMPORT=true pnpm tsx scripts/import-places.ts");
    return;
  }

  console.log("Importación de lugares — TODO: implementar");
  // TODO:
  //   1. Iterar ciudades de CITY_GROUPS
  //   2. Llamar a cada provider.fetchByCity()
  //   3. Normalizar con normalizePlace()
  //   4. Deduplicar por sourceId
  //   5. Guardar en Supabase tabla map_locations
  //   6. Actualizar updatedAt
}

main().catch(console.error);
