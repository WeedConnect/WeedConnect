import { createPublicClient } from "@/lib/supabase/server";
import { MOCK_STRAINS } from "@/data/strains";
import type { Strain } from "@/types";

const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Mapea los campos de snake_case (base de datos) a camelCase (frontend/tipos)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapStrain(row: any): Strain {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    type: row.type,
    thcPct: row.thc_pct != null ? Number(row.thc_pct) : undefined,
    cbdPct: row.cbd_pct != null ? Number(row.cbd_pct) : undefined,
    flavors: Array.isArray(row.flavors) ? row.flavors : [],
    effects: Array.isArray(row.effects) ? row.effects : [],
    description: row.description,
    imageUrl: row.image_url || undefined,
  };
}

/**
 * Recupera todas las strains de Supabase ordenadas alfabéticamente por nombre.
 * Degradación limpia: Retorna MOCK_STRAINS si falla o no hay configuración.
 */
export async function getStrains(): Promise<Strain[]> {
  if (!isSupabaseConfigured) {
    console.warn("[Strains] Supabase no está configurado. Utilizando mock data.");
    return MOCK_STRAINS;
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("strains")
      .select("*")
      .order("name");

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map(mapStrain);
  } catch (err) {
    console.error("[Strains] Error obteniendo strains de Supabase:", err);
    return MOCK_STRAINS;
  }
}

/**
 * Recupera una strain específica por su slug.
 * Degradación limpia: Busca en MOCK_STRAINS si falla o no hay configuración.
 */
export async function getStrainBySlug(slug: string): Promise<Strain | null> {
  if (!isSupabaseConfigured) {
    console.warn(`[Strains] Supabase no está configurado. Buscando '${slug}' en mock data.`);
    return MOCK_STRAINS.find((s) => s.slug === slug) || null;
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("strains")
      .select("*")
      .eq("slug", slug)
      .maybeSingle(); // Evita lanzar error si no se encuentra ningún registro

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    return mapStrain(data);
  } catch (err) {
    console.error(`[Strains] Error obteniendo strain '${slug}' de Supabase:`, err);
    return MOCK_STRAINS.find((s) => s.slug === slug) || null;
  }
}
