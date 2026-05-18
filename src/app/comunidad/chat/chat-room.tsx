"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { sendMessage } from "@/app/actions/chat";
import type { User } from "@supabase/supabase-js";

type Profile = { username: string | null; avatar_url: string | null };

export type ChatMessage = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: Profile | null;
};

interface Props {
  initialMessages: ChatMessage[];
  currentUser: User | null;
}

export function ChatRoom({ initialMessages, currentUser }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [text, setText] = useState("");
  const [pending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // createBrowserClient is singleton-safe; useRef avoids dep-array issues
  const supabase = useRef(createClient()).current;

  // Auto-scroll al llegar nuevos mensajes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Suscripción Realtime — INSERT en chat_messages
  useEffect(() => {
    const channel = supabase
      .channel("public:chat_messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        async (payload) => {
          const incoming = payload.new as Omit<ChatMessage, "profiles">;

          // Evitar duplicados (el propio usuario ya lo ve vía optimistic)
          setMessages((prev) => {
            if (prev.some((m) => m.id === incoming.id)) return prev;

            // Enriquecer con perfil en background
            supabase
              .from("profiles")
              .select("username, avatar_url")
              .eq("id", incoming.user_id)
              .single()
              .then(({ data: profile }) => {
                setMessages((cur) =>
                  cur.map((m) =>
                    m.id === incoming.id ? { ...m, profiles: profile ?? null } : m
                  )
                );
              });

            return [...prev, { ...incoming, profiles: null }];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed || pending) return;
    setText("");
    textareaRef.current?.focus();

    startTransition(async () => {
      const result = await sendMessage(trimmed);
      if (!result.ok) {
        // Devolver el texto si falla para no perderlo
        setText(trimmed);
      }
    });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col">
      {/* Cabecera */}
      <div className="flex items-center gap-3 border-b border-border bg-background px-4 py-3 sm:px-6">
        <Link
          href="/comunidad"
          className="text-muted-foreground hover:text-foreground"
          aria-label="Volver a Comunidad"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <h1 className="font-semibold">Chat en vivo</h1>
        </div>
        <span className="ml-auto text-xs text-muted-foreground">
          {messages.length === 0 ? "Sin mensajes aún" : `${messages.length} mensajes`}
        </span>
      </div>

      {/* Historial de mensajes */}
      <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
        {messages.length === 0 && (
          <p className="mt-16 text-center text-sm text-muted-foreground">
            Sé el primero en escribir algo 🌿
          </p>
        )}
        <div className="space-y-3">
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              msg={msg}
              currentUserId={currentUser?.id}
            />
          ))}
        </div>
        <div ref={bottomRef} className="h-1" />
      </div>

      {/* Input */}
      <div className="border-t border-border bg-background px-4 py-3 sm:px-6">
        {currentUser ? (
          <div className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              className="flex-1 resize-none rounded-xl border border-border bg-muted/30 px-3 py-2 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
              placeholder="Escribe un mensaje… (Enter para enviar, Shift+Enter nueva línea)"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={500}
              rows={1}
              disabled={pending}
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!text.trim() || pending}
              className="size-10 shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white"
              aria-label="Enviar mensaje"
            >
              <Send className="size-4" />
            </Button>
          </div>
        ) : (
          <p className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-center text-sm text-muted-foreground">
            <Link href="/auth/login" className="font-medium text-emerald-600 hover:underline">
              Inicia sesión
            </Link>{" "}
            para participar en el chat.
          </p>
        )}
        {text.length > 400 && (
          <p className="mt-1 text-right text-xs text-muted-foreground">
            {text.length}/500
          </p>
        )}
      </div>
    </div>
  );
}

function MessageBubble({
  msg,
  currentUserId,
}: {
  msg: ChatMessage;
  currentUserId?: string;
}) {
  const isOwn = msg.user_id === currentUserId;
  const username = msg.profiles?.username ?? "…";
  const initials = username.slice(0, 2).toUpperCase();
  const time = new Date(msg.created_at).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`flex items-end gap-2 ${isOwn ? "flex-row-reverse" : ""}`}>
      <Avatar className="size-7 shrink-0 self-end">
        {msg.profiles?.avatar_url && (
          <AvatarImage src={msg.profiles.avatar_url} alt={username} />
        )}
        <AvatarFallback className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div
        className={`flex max-w-[72%] flex-col gap-0.5 ${isOwn ? "items-end" : "items-start"}`}
      >
        {!isOwn && (
          <span className="px-1 text-xs text-muted-foreground">@{username}</span>
        )}
        <div
          className={`rounded-2xl px-3 py-2 text-sm leading-relaxed break-words ${
            isOwn
              ? "rounded-br-sm bg-emerald-600 text-white"
              : "rounded-bl-sm bg-muted text-foreground"
          }`}
        >
          {msg.content}
        </div>
        <span className="px-1 text-[10px] text-muted-foreground">{time}</span>
      </div>
    </div>
  );
}
