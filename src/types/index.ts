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

export interface Club {
  id: ID;
  name: string;
  slug: string;
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
