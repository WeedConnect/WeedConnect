import { createPublicClient } from "@/lib/supabase/server";
import { MOCK_CLUBS } from "@/data/clubs";
import type { Club } from "@/types";

const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Parsea la ubicación desde Supabase (puede venir como GeoJSON o EWKB hex).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseLocation(loc: any): { lat: number; lng: number } {
  if (!loc) return { lat: 0, lng: 0 };

  // Si es GeoJSON estándar (según las instrucciones de la tarea)
  if (typeof loc === "object" && loc.coordinates && Array.isArray(loc.coordinates)) {
    return {
      lng: Number(loc.coordinates[0]),
      lat: Number(loc.coordinates[1]),
    };
  }

  // Si es una cadena EWKB (hexadecimal) devuelta por PostgREST
  if (typeof loc === "string") {
    try {
      const hex = loc.trim();
      const isLittleEndian = hex.startsWith("01");

      // En WKB/EWKB para un POINT, los últimos 16 bytes representan X e Y (8 bytes cada uno).
      // Cada byte son 2 caracteres hexadecimales (en total 32 caracteres para X e Y).
      const xHex = hex.substring(hex.length - 32, hex.length - 16);
      const yHex = hex.substring(hex.length - 16);

      const hexToDouble = (hexStr: string, le: boolean) => {
        const bytes = new Uint8Array(8);
        for (let i = 0; i < 8; i++) {
          bytes[i] = parseInt(hexStr.substring(i * 2, i * 2 + 2), 16);
        }
        const view = new DataView(bytes.buffer);
        return view.getFloat64(0, le);
      };

      const lng = hexToDouble(xHex, isLittleEndian);
      const lat = hexToDouble(yHex, isLittleEndian);

      if (!isNaN(lng) && !isNaN(lat)) {
        return { lng, lat };
      }
    } catch (e) {
      console.error("[Clubs] Error decodificando ubicación EWKB:", e);
    }
  }

  return { lat: 0, lng: 0 };
}

/**
 * Mapea los campos de snake_case (base de datos) a camelCase (frontend/tipos)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapClub(row: any): Club {
  const { lat, lng } = parseLocation(row.location);

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    // Degradación segura si la tabla remota aún no tiene la columna category
    category: row.category || (row.membership_required === false ? "otro" : "asociacion"),
    // Degradación segura si la tabla remota aún no tiene la columna tags
    tags: Array.isArray(row.tags) ? row.tags : [],
    description: row.description || undefined,
    address: row.address,
    city: row.city,
    country: row.country || "ES",
    lat,
    lng,
    membershipRequired: !!row.membership_required,
    website: row.website || undefined,
    createdAt: row.created_at || new Date().toISOString(),
  };
}

/**
 * Recupera todos los clubes de Supabase ordenados alfabéticamente por nombre.
 * Degradación limpia: Retorna MOCK_CLUBS si falla o no hay configuración.
 */
export async function getClubs(): Promise<Club[]> {
  if (!isSupabaseConfigured) {
    console.warn("[Clubs] Supabase no está configurado. Utilizando mock data.");
    return MOCK_CLUBS;
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("clubs")
      .select("*")
      .order("name");

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map(mapClub);
  } catch (err) {
    console.error("[Clubs] Error obteniendo clubes de Supabase:", err);
    return MOCK_CLUBS;
  }
}
