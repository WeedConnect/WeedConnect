export type ID = string;

export type UserRole = "user" | "moderator" | "admin";

export interface User {
  id: ID;
  username: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  bio?: string;
  points: number;
  createdAt: string;
}

export type StrainType = "indica" | "sativa" | "hybrid";

export interface Strain {
  id: ID;
  name: string;
  slug: string;
  type: StrainType;
  thcPct?: number;
  cbdPct?: number;
  flavors: string[];
  effects: string[];
  description: string;
  imageUrl?: string;
}

export type SpotCategory = "asociacion" | "mirador" | "parque" | "banco" | "playa" | "spot_relax" | "comida" | "noche" | "otro";

export interface Club {
  id: ID;
  name: string;
  slug: string;
  category: SpotCategory;
  tags: string[];
  description?: string;
  address: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  membershipRequired: boolean;
  website?: string;
  createdAt: string;
}

export type GrowStage =
  | "germination"
  | "seedling"
  | "vegetative"
  | "flowering"
  | "harvest"
  | "curing";

export interface GrowLogEntry {
  id: ID;
  date: string;
  stage: GrowStage;
  notes?: string;
  watering?: { amountMl: number; ph?: number };
  nutrients?: { name: string; dosageMl: number }[];
  photos?: string[];
  temperatureC?: number;
  humidityPct?: number;
}

export interface GrowLog {
  id: ID;
  userId: ID;
  strainId?: ID;
  name: string;
  startedAt: string;
  finishedAt?: string;
  entries: GrowLogEntry[];
}

export interface SocialComment {
  id: ID;
  postId: ID;
  authorId: ID;
  content: string;
  createdAt: string;
  author?: {
    id: ID;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
}

// ─── Map types ────────────────────────────────────────────────────────────────

export type MapCategory =
  | "dispensary"      // Dispensarios legales (principalmente USA)
  | "association"     // Asociaciones cannábicas (Europa)
  | "cannabis_club"   // Clubes cannábicos privados (España/EU)
  | "cbd_shop"        // Tiendas CBD / wellness
  | "chill_spot"      // Miradores, parques, zonas chill
  | "food"            // Munchies y comida
  | "nightlife"       // Bares, ocio nocturno
  | "point_of_interest"; // POI genérico

export type LocationStatus =
  | "negocio_publico"     // Negocio público/licenciado
  | "info_orientativa"    // Información orientativa
  | "verificar_normativa"; // Verificar normativa local

export type LocationContinent =
  | "europe"
  | "north_america"
  | "south_america"
  | "asia"
  | "oceania"
  | "africa";

export interface MapLocation {
  id: string;
  name: string;
  slug: string;
  category: MapCategory;
  city: string;
  country: string;
  region?: string;
  continent?: LocationContinent;
  lat: number;
  lng: number;
  rating: number;           // 1-5
  reviewCount: number;
  tags: string[];
  description: string;
  status: LocationStatus;
  verified: boolean;
  isDemo?: boolean;         // true = dato generado para demo, no real
  source?: string;          // "demo" | "community" | "google_places" | "foursquare" | "official"
  sourceId?: string;        // ID en el proveedor externo (futuro)
  websiteUrl?: string;
  image?: string;
  address?: string;
  openingHours?: string;
  subcategory?: string;
  legalNotice?: string;
  licenseNote?: string;
  confidenceScore?: number; // 0-1, confianza en la validez del dato
  updatedAt?: string;
}

// ─── Social ───────────────────────────────────────────────────────────────────

export interface SocialPost {
  id: ID;
  authorId: ID;
  content: string;
  mediaUrls: string[];
  createdAt: string;
  author?: {
    id: ID;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
  likesCount: number;
  isLikedByUser?: boolean;
  commentsCount?: number;
  comments?: SocialComment[];
  bookmarksCount?: number;
  isBookmarkedByUser?: boolean;
}

