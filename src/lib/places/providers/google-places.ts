/**
 * Proveedor Google Places API (stub).
 * TODO: implementar cuando GOOGLE_PLACES_API_KEY esté disponible.
 *
 * Endpoints a usar:
 *   - Nearby Search: GET /maps/api/place/nearbysearch/json
 *   - Text Search:   GET /maps/api/place/textsearch/json
 *   - Place Details: GET /maps/api/place/details/json
 *
 * Requiere: GOOGLE_PLACES_API_KEY en .env.local
 */

import type { PlaceProvider, PlaceProviderConfig, RawPlace } from "../types";

export const GooglePlacesProvider: PlaceProvider = {
  name: "google_places",

  async fetchNearby(
    _lat: number,
    _lng: number,
    _config?: PlaceProviderConfig,
  ): Promise<RawPlace[]> {
    // TODO: GET https://maps.googleapis.com/maps/api/place/nearbysearch/json
    //   ?location={lat},{lng}&radius={radiusMeters}&type=dispensary
    //   &key={GOOGLE_PLACES_API_KEY}
    return [];
  },

  async fetchByCity(
    _city: string,
    _country: string,
    _config?: PlaceProviderConfig,
  ): Promise<RawPlace[]> {
    // TODO: GET https://maps.googleapis.com/maps/api/place/textsearch/json
    //   ?query=dispensary+in+{city}+{country}&key={GOOGLE_PLACES_API_KEY}
    return [];
  },
};
