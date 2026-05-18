import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ChatRoom, type ChatMessage } from "./chat-room";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Chat en vivo · WeedConnect",
  description: "Sala de chat grupal y en tiempo real de la comunidad WeedConnect.",
};

export default async function ChatPage() {
  const supabase = await createClient();

  const [{ data: userData }, { data: rawMessages }] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from("chat_messages")
      .select("id, content, created_at, user_id, profiles(username, avatar_url)")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  // Supabase devuelve profiles como array en joins; normalizar a objeto único
  const messages: ChatMessage[] = ((rawMessages ?? []) as unknown[]).map((m) => {
    const row = m as Record<string, unknown>;
    const profiles = Array.isArray(row.profiles)
      ? (row.profiles[0] ?? null)
      : (row.profiles ?? null);
    return { ...(row as Omit<ChatMessage, "profiles">), profiles } as ChatMessage;
  }).reverse();

  return <ChatRoom initialMessages={messages} currentUser={userData?.user ?? null} />;
}
