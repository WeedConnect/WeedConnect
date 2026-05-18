/**
 * Proveedor OpenStreetMap / Overpass API (stub).
 * TODO: implementar. Overpass API es gratuita — buena opción para chill spots y POIs.
 *
 * Endpoint: https://overpass-api.de/api/interpreter
 * Query language: Overpass QL
 *
 * Ejemplo de query para dispensarios en área:
 *   [out:json][timeout:25];
 *   node["shop"="cannabis"](around:{radius},{lat},{lng});
 *   out body;
 *
 * No requiere API key.
 */

import type { PlaceProvider, PlaceProviderConfig, RawPlace } from "../types";

export const OpenStreetMapProvider: PlaceProvider = {
  name: "openstreetmap",

  async fetchNearby(
    _lat: number,
    _lng: number,
    _config?: PlaceProviderConfig,
  ): Promise<RawPlace[]> {
    // TODO: POST https://overpass-api.de/api/interpreter
    //   body: [out:json];node["shop"="cannabis"](around:{radius},{lat},{lng});out body;
    return [];
  },

  async fetchByCity(
    _city: string,
    _country: string,
    _config?: PlaceProviderConfig,
  ): Promise<RawPlace[]> {
    // TODO: Overpass query with area name filter
    return [];
  },
};
