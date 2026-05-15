import type { SupabaseClient } from "@supabase/supabase-js";

// Límites de subida de imágenes — deben coincidir con la config de los buckets
// en Supabase (ver TODO_USUARIO.md).
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/**
 * Valida tipo MIME y tamaño de un archivo de imagen.
 * Devuelve un mensaje de error en español, o `null` si es válido.
 */
export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Formato no admitido. Usa imágenes JPG, PNG, WEBP o GIF.";
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return "Cada imagen debe pesar como máximo 5 MB.";
  }
  return null;
}

/**
 * Sube un archivo a `bucket`, dentro de la carpeta del usuario
 * (`<userId>/<archivo>` — necesario para que casen las políticas RLS).
 * Devuelve el path del objeto en storage.
 */
export async function uploadImage(
  supabase: SupabaseClient,
  bucket: string,
  userId: string,
  file: File,
): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) throw new Error("No se pudo subir una de las imágenes.");
  return path;
}

/** Devuelve la URL pública de un path en un bucket público. */
export function publicImageUrl(
  supabase: SupabaseClient,
  bucket: string,
  path: string,
): string {
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

/**
 * Genera URLs firmadas temporales para paths de un bucket privado
 * (p. ej. `grow-photos`). Devuelve un mapa `path -> signedUrl`.
 */
export async function signImages(
  supabase: SupabaseClient,
  bucket: string,
  paths: string[],
  expiresIn = 3600,
): Promise<Record<string, string>> {
  if (paths.length === 0) return {};

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrls(paths, expiresIn);

  if (error || !data) return {};

  const map: Record<string, string> = {};
  for (const item of data) {
    if (item.signedUrl && item.path) map[item.path] = item.signedUrl;
  }
  return map;
}
