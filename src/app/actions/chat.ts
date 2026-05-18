"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({
  content: z.string().min(1).max(500),
});

export type SendMessageResult = { ok: true } | { ok: false; error: string };

export async function sendMessage(content: string): Promise<SendMessageResult> {
  const parsed = schema.safeParse({ content: content.trim() });
  if (!parsed.success) return { ok: false, error: "Mensaje inválido." };

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { ok: false, error: "Debes iniciar sesión para enviar mensajes." };
  }

  const { error } = await supabase.from("chat_messages").insert({
    user_id: user.id,
    content: parsed.data.content,
  });

  if (error) {
    console.error("[sendMessage]", error);
    return { ok: false, error: "No se pudo enviar el mensaje. Inténtalo de nuevo." };
  }

  return { ok: true };
}
