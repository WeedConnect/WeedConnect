"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Crea una nueva publicación en el muro social tras validar la longitud y fotos opcionales.
 */
export async function createSocialPost(content: string, mediaUrls: string[] = []) {
  const trimmedContent = content.trim();
  if (!trimmedContent && mediaUrls.length === 0) {
    return { success: false, error: "La publicación no puede estar vacía." };
  }

  if (trimmedContent.length > 500) {
    return { success: false, error: "La publicación no puede superar los 500 caracteres." };
  }

  // Validar adjuntos: máximo 4 y solo URLs http(s) válidas.
  if (mediaUrls.length > 4) {
    return { success: false, error: "Solo puedes adjuntar hasta 4 fotos por publicación." };
  }
  const invalidUrl = mediaUrls.some(
    (url) => typeof url !== "string" || !/^https?:\/\//.test(url),
  );
  if (invalidUrl) {
    return { success: false, error: "Una de las imágenes no es válida." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Debes iniciar sesión para publicar." };
  }

  const { error } = await supabase
    .from("social_posts")
    .insert({
      author_id: user.id,
      content: trimmedContent,
      media_urls: mediaUrls,
    });

  if (error) {
    console.error("[Feed Action] Error creating post:", error);
    return { success: false, error: "No se pudo crear la publicación." };
  }

  revalidatePath("/feed");
  return { success: true };
}

/**
 * Da o quita el like de un post para el usuario actual.
 */
export async function toggleLikePost(postId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Debes iniciar sesión para dar Me Gusta." };
  }

  // Comprobar si el like ya existe
  const { data: existingLike, error: fetchError } = await supabase
    .from("social_likes")
    .select("post_id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (fetchError) {
    console.error("[Feed Action] Error checking existing like:", fetchError);
    return { success: false, error: "Ha ocurrido un error al procesar la solicitud." };
  }

  if (existingLike) {
    // Si ya existe, eliminarlo
    const { error } = await supabase
      .from("social_likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", user.id);

    if (error) {
      console.error("[Feed Action] Error removing like:", error);
      return { success: false, error: "No se pudo procesar tu Me Gusta." };
    }
  } else {
    // Si no existe, insertarlo
    const { error } = await supabase
      .from("social_likes")
      .insert({
        post_id: postId,
        user_id: user.id,
      });

    if (error) {
      console.error("[Feed Action] Error adding like:", error);
      return { success: false, error: "No se pudo procesar tu Me Gusta." };
    }
  }

  revalidatePath("/feed");
  return { success: true };
}

/**
 * Elimina una publicación del muro social (solo permitida si el usuario es el dueño).
 */
export async function deleteSocialPost(postId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autorizado." };
  }

  const { error } = await supabase
    .from("social_posts")
    .delete()
    .eq("id", postId)
    .eq("author_id", user.id);

  if (error) {
    console.error("[Feed Action] Error deleting post:", error);
    return { success: false, error: "No se pudo eliminar la publicación." };
  }

  revalidatePath("/feed");
  return { success: true };
}

/**
 * Crea un comentario asociado a una publicación del muro social.
 */
export async function createSocialComment(postId: string, content: string) {
  const trimmedContent = content.trim();
  if (!trimmedContent) {
    return { success: false, error: "El comentario no puede estar vacío." };
  }

  if (trimmedContent.length > 300) {
    return { success: false, error: "El comentario no puede superar los 300 caracteres." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Debes iniciar sesión para comentar." };
  }

  const { error } = await supabase
    .from("social_comments")
    .insert({
      post_id: postId,
      author_id: user.id,
      content: trimmedContent,
    });

  if (error) {
    console.error("[Feed Action] Error creating comment:", error);
    return { success: false, error: "No se pudo publicar tu comentario." };
  }

  revalidatePath("/feed");
  return { success: true };
}

/**
 * Alterna el estado de guardado/marcado de un post para el usuario actual (Bookmarks).
 */
export async function toggleBookmarkPost(postId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Debes iniciar sesión para guardar publicaciones." };
  }

  // Comprobar si el bookmark ya existe
  const { data: existingBookmark, error: fetchError } = await supabase
    .from("social_bookmarks")
    .select("post_id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (fetchError) {
    console.error("[Feed Action] Error checking existing bookmark:", fetchError);
    return { success: false, error: "Error al procesar tu solicitud." };
  }

  if (existingBookmark) {
    // Si ya existe, lo quitamos
    const { error } = await supabase
      .from("social_bookmarks")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", user.id);

    if (error) {
      console.error("[Feed Action] Error removing bookmark:", error);
      return { success: false, error: "No se pudo quitar de guardados." };
    }
  } else {
    // Si no existe, lo añadimos
    const { error } = await supabase
      .from("social_bookmarks")
      .insert({
        post_id: postId,
        user_id: user.id,
      });

    if (error) {
      console.error("[Feed Action] Error adding bookmark:", error);
      return { success: false, error: "No se pudo guardar la publicación." };
    }
  }

  revalidatePath("/feed");
  return { success: true };
}
