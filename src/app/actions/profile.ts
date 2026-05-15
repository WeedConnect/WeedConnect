"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Actualiza el perfil del usuario actual: nombre visible, biografía y avatar.
 * El avatar ya debe estar subido al bucket `avatars` (se recibe la URL pública).
 */
export async function updateProfile(input: {
  displayName: string;
  bio: string;
  avatarUrl: string | null;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Debes iniciar sesión para editar tu perfil." };
  }

  const displayName = input.displayName.trim();
  const bio = input.bio.trim();

  if (displayName.length > 60) {
    return { success: false, error: "El nombre no puede superar los 60 caracteres." };
  }
  if (bio.length > 500) {
    return { success: false, error: "La biografía no puede superar los 500 caracteres." };
  }
  if (input.avatarUrl !== null && !/^https?:\/\//.test(input.avatarUrl)) {
    return { success: false, error: "La URL del avatar no es válida." };
  }

  const { data: profile, error: fetchError } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  if (fetchError || !profile) {
    return { success: false, error: "No se encontró tu perfil." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: displayName || null,
      bio: bio || null,
      avatar_url: input.avatarUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    console.error("[Profile Action] Error updating profile:", error);
    return { success: false, error: "No se pudieron guardar los cambios." };
  }

  revalidatePath(`/perfil/${profile.username}`);
  return { success: true, username: profile.username };
}
