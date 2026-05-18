/**
 * Proveedor Foursquare Places API (stub).
 * TODO: implementar cuando FOURSQUARE_API_KEY esté disponible.
 *
 * Endpoints a usar:
 *   - Place Search: GET /v3/places/search
 *   - Place Details: GET /v3/places/{fsq_id}
 *
 * Requiere: FOURSQUARE_API_KEY en .env.local
 * Docs: https://developer.foursquare.com/reference/place-search
 */

import type { PlaceProvider, PlaceProviderConfig, RawPlace } from "../types";

export const FoursquareProvider: PlaceProvider = {
  name: "foursquare",

  async fetchNearby(
    _lat: number,
    _lng: number,
    _config?: PlaceProviderConfig,
  ): Promise<RawPlace[]> {
    // TODO: GET https://api.foursquare.com/v3/places/search
    //   ?ll={lat},{lng}&radius={radiusMeters}&categories=4d4b7105d754a06374d81259
    //   Authorization: {FOURSQUARE_API_KEY}
    return [];
  },

  async fetchByCity(
    _city: string,
    _country: string,
    _config?: PlaceProviderConfig,
  ): Promise<RawPlace[]> {
    // TODO: GET https://api.foursquare.com/v3/places/search
    //   ?near={city},{country}&categories=...
    return [];
  },
};
