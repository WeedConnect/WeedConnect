/**
 * Tipos compartidos para proveedores de lugares externos.
 * TODO: implementar cuando se integren APIs reales.
 */

import type { MapLocation } from "@/types";

export interface PlaceProviderConfig {
  apiKey?: string;
  maxResults?: number;
  radiusKm?: number;
}

export interface RawPlace {
  externalId: string;
  name: string;
  lat: number;
  lng: number;
  address?: string;
  city?: string;
  country?: string;
  rating?: number;
  reviewCount?: number;
  websiteUrl?: string;
  phone?: string;
  openingHours?: string;
  tags?: string[];
  sourceProvider: "google_places" | "foursquare" | "openstreetmap" | "yelp" | "community";
}

export interface PlaceProvider {
  name: string;
  fetchNearby(lat: number, lng: number, config?: PlaceProviderConfig): Promise<RawPlace[]>;
  fetchByCity(city: string, country: string, config?: PlaceProviderConfig): Promise<RawPlace[]>;
}

export type NormalizedPlace = MapLocation;
