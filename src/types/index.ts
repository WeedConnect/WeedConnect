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
  | "dispensary"   // Dispensarios legales (principalmente USA)
  | "association"  // Clubes/asociaciones cannábicas (España/Europa)
  | "cbd_shop"     // Tiendas CBD / wellness
  | "chill_spot"   // Miradores, parques, zonas chill
  | "food"         // Munchies y comida
  | "nightlife";   // Bares, ocio nocturno

export type LocationStatus =
  | "negocio_publico"     // Negocio público/licenciado
  | "info_orientativa"    // Información orientativa
  | "verificar_normativa"; // Verificar normativa local

export interface MapLocation {
  id: string;
  name: string;
  slug: string;
  category: MapCategory;
  city: string;
  country: string;
  region?: string;
  lat: number;
  lng: number;
  rating: number;       // 1-5
  reviewCount: number;
  tags: string[];
  description: string;
  status: LocationStatus;
  verified: boolean;
  source?: string;      // TODO: "google_places" | "foursquare" | "yelp" | "community" | "official"
  websiteUrl?: string;
  image?: string;
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

