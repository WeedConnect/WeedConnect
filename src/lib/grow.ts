import type { SupabaseClient } from "@supabase/supabase-js";
import type { GrowLog, GrowLogEntry, GrowStage } from "@/types";

// ============================================================================
// MAPPING UTILITIES
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapGrowEntryFromDb(row: any): GrowLogEntry {
  return {
    id: row.id,
    date: row.entry_date,
    stage: row.stage as GrowStage,
    notes: row.notes || undefined,
    watering: row.watering_ml != null
      ? {
          amountMl: Number(row.watering_ml),
          ph: row.watering_ph != null ? Number(row.watering_ph) : undefined,
        }
      : undefined,
    nutrients: Array.isArray(row.nutrients)
      ? row.nutrients.map((n: { name: string; dosageMl?: number; dosage?: number }) => ({
          name: n.name,
          dosageMl: Number(n.dosageMl ?? n.dosage ?? 0),
        }))
      : undefined,
    photos: Array.isArray(row.photos) ? row.photos : [],
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapGrowLogFromDb(row: any): GrowLog {
  const rawEntries = Array.isArray(row.grow_log_entries) ? row.grow_log_entries : [];
  // Sort entries by date desc
  const mappedEntries = rawEntries
    .map(mapGrowEntryFromDb)
    .sort((a: GrowLogEntry, b: GrowLogEntry) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return {
    id: row.id,
    userId: row.user_id,
    strainId: row.strain_id || undefined,
    name: row.name,
    startedAt: row.started_at,
    finishedAt: row.finished_at || undefined,
    entries: mappedEntries,
  };
}

// Helper to ensure we get YYYY-MM-DD for date columns in Postgres
function toDateString(isoOrDate: string) {
  if (!isoOrDate) return new Date().toISOString().slice(0, 10);
  return isoOrDate.slice(0, 10);
}

// ============================================================================
// API ACTIONS
// ============================================================================

/**
 * Recupera todos los cultivos del usuario actual junto con sus entradas.
 */
export async function fetchGrowLogs(supabase: SupabaseClient): Promise<GrowLog[]> {
  const { data, error } = await supabase
    .from("grow_logs")
    .select(`
      *,
      grow_log_entries (*)
    `)
    .order("started_at", { ascending: false });

  if (error) {
    console.error("[Grow API] Error fetching grow logs:", error);
    throw error;
  }

  if (!data) return [];
  return data.map(mapGrowLogFromDb);
}

/**
 * Crea un nuevo registro de cultivo.
 */
export async function createGrowLog(
  supabase: SupabaseClient,
  log: Omit<GrowLog, "entries" | "userId"> & { userId?: string }
): Promise<GrowLog> {
  const userResponse = await supabase.auth.getUser();
  const userId = userResponse.data.user?.id;

  if (!userId) {
    throw new Error("Debes iniciar sesión para crear un cultivo.");
  }

  const dbPayload = {
    id: log.id, // Permite UUID pre-generado en cliente si existe
    user_id: userId,
    strain_id: log.strainId || null,
    name: log.name,
    started_at: toDateString(log.startedAt),
    finished_at: log.finishedAt ? toDateString(log.finishedAt) : null,
  };

  const { data, error } = await supabase
    .from("grow_logs")
    .insert(dbPayload)
    .select()
    .single();

  if (error) {
    console.error("[Grow API] Error creating grow log:", error);
    throw error;
  }

  return mapGrowLogFromDb({ ...data, grow_log_entries: [] });
}

/**
 * Elimina un cultivo por completo (las entradas se borran en cascada por RDBMS).
 */
export async function deleteGrowLog(supabase: SupabaseClient, id: string): Promise<void> {
  const { error } = await supabase
    .from("grow_logs")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[Grow API] Error deleting grow log:", error);
    throw error;
  }
}

/**
 * Añade una nueva entrada al diario de un cultivo.
 */
export async function addGrowEntry(
  supabase: SupabaseClient,
  logId: string,
  entry: GrowLogEntry
): Promise<GrowLogEntry> {
  const dbPayload = {
    id: entry.id, // Permite UUID pre-generado
    grow_log_id: logId,
    entry_date: toDateString(entry.date),
    stage: entry.stage,
    notes: entry.notes || null,
    watering_ml: entry.watering?.amountMl || null,
    watering_ph: entry.watering?.ph || null,
    nutrients: entry.nutrients || null,
    photos: entry.photos || [],
  };

  const { data, error } = await supabase
    .from("grow_log_entries")
    .insert(dbPayload)
    .select()
    .single();

  if (error) {
    console.error("[Grow API] Error adding grow entry:", error);
    throw error;
  }

  return mapGrowEntryFromDb(data);
}

/**
 * Actualiza campos editables de un cultivo (p. ej. finishedAt).
 */
export async function updateGrowLog(
  supabase: SupabaseClient,
  id: string,
  updates: { finishedAt?: string | null },
): Promise<void> {
  const { error } = await supabase
    .from("grow_logs")
    .update({ finished_at: updates.finishedAt ? toDateString(updates.finishedAt) : null })
    .eq("id", id);

  if (error) {
    console.error("[Grow API] Error updating grow log:", error);
    throw error;
  }
}

/**
 * Elimina una entrada específica del diario.
 */
export async function deleteGrowEntry(supabase: SupabaseClient, entryId: string): Promise<void> {
  const { error } = await supabase
    .from("grow_log_entries")
    .delete()
    .eq("id", entryId);

  if (error) {
    console.error("[Grow API] Error deleting grow entry:", error);
    throw error;
  }
}
