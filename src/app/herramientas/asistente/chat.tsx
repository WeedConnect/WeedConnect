"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ReactMarkdown from "react-markdown";
import { Send, User, Loader2, AlertTriangle, Check } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const SUGERENCIAS = [
  "¿Cuál es la diferencia entre indica y sativa?",
  "¿Cómo empiezo un cultivo indoor por primera vez?",
  "¿Qué dice la ley española sobre el cultivo para autoconsumo?",
  "Explícame el sistema endocannabinoide",
  "¿Cómo calculo la dosis para un comestible?",
  "¿Cuáles son las señales de deficiencia de magnesio?",
];

export function AsistenteChat({ available }: { available: boolean }) {
  const [inputValue, setInputValue] = useState("");
  const { messages, status, error, sendMessage } = useChat({
    transport: new DefaultChatTransport({ api: "/api/asistente" }),
  });

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isBusy = status === "submitted" || status === "streaming";
  const hasError = status === "error" && !!error;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isBusy || !available) return;
    const textToSend = inputValue;
    setInputValue("");
    await sendMessage({ text: textToSend });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = async (suggestion: string) => {
    if (!available || isBusy) return;
    await sendMessage({ text: suggestion });
  };

  const showWelcome = messages.length === 0 && !isBusy;

  return (
    <div className="flex h-[calc(100vh-10rem)] flex-col rounded-xl border border-border bg-background shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <div className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-emerald-200 bg-emerald-100 dark:border-emerald-800/50 dark:bg-emerald-900/40">
          <Image
            src="/images/bud/bud-base.png"
            alt="Bud"
            fill
            sizes="36px"
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-sm font-semibold">Bud — Tu Asistente IA</p>
          <p className="text-xs text-muted-foreground">
            {available ? "Listo para charlar, colega" : "No disponible"}
          </p>
        </div>
        <div
          className={cn(
            "ml-auto size-2 rounded-full",
            available ? "bg-emerald-500" : "bg-muted-foreground/40",
          )}
          aria-hidden
        />
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {!available && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm dark:border-amber-800 dark:bg-amber-950/30">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" />
            <span className="text-amber-800 dark:text-amber-200">
              El asistente requiere configurar{" "}
              <code className="rounded bg-amber-100 px-1 text-[11px] dark:bg-amber-900/60">
                ANTHROPIC_API_KEY
              </code>{" "}
              en el servidor. Consulta{" "}
              <code className="rounded bg-amber-100 px-1 text-[11px] dark:bg-amber-900/60">
                TODO_USUARIO.md
              </code>{" "}
              para los pasos.
            </span>
          </div>
        )}

        {showWelcome && (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="relative mb-4 flex size-20 items-center justify-center overflow-hidden rounded-full border-2 border-emerald-100 bg-emerald-100 shadow-sm dark:border-emerald-900 dark:bg-emerald-900/40">
              <Image
                src="/images/bud/bud-saludo.png"
                alt="Bud saludando"
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <h2 className="text-lg font-semibold">¡Hola, colega! Soy Bud</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Tu aliado experto en cultivo, variedades, ciencia cannábica y derechos del consumidor. Pregúntame lo que necesites, ¡estoy para ayudarte!
            </p>
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {SUGERENCIAS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSuggestionClick(s)}
                  disabled={!available || isBusy}
                  className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => {
          const textParts = msg.parts.filter((p) => p.type === "text") as { text: string }[];
          const textContent = textParts.map((p) => p.text).join("");
          const toolParts = msg.parts.filter((p) => p.type.startsWith("tool-")) as { type: string; [key: string]: unknown }[];

          return (
            <div
              key={msg.id}
              className={cn("mb-4 flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
            >
              <div
                className={cn(
                  "relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full",
                  msg.role === "user"
                    ? "bg-emerald-600 text-white"
                    : "bg-muted dark:bg-muted/50 border border-border/50",
                )}
              >
                {msg.role === "user" ? (
                  <User className="size-4" />
                ) : (
                  <Image
                    src="/images/bud/bud-base.png"
                    alt="Bud"
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                )}
              </div>
              <div
                className={cn(
                  "max-w-[80%] px-4 py-2.5 text-sm leading-relaxed",
                  msg.role === "user"
                    ? "bg-emerald-600 text-white rounded-2xl rounded-tr-sm"
                    : "bg-muted dark:bg-muted/50 text-foreground rounded-2xl rounded-tl-sm",
                )}
              >
                {msg.role === "user" ? (
                  <div className="whitespace-pre-wrap">{textContent}</div>
                ) : (
                  <>
                    {textContent && (
                      <div className="prose prose-sm dark:prose-invert prose-emerald break-words">
                        <ReactMarkdown>{textContent}</ReactMarkdown>
                      </div>
                    )}
                    {toolParts.length > 0 && (
                      <div className="mt-2 space-y-1 border-t border-border/40 pt-2">
                        {toolParts.map((toolPart) => {
                          const { toolCallId, type, state } = toolPart;
                          const isVariedades = type === "tool-buscarVariedades";
                          const isClubes = type === "tool-buscarClubes";
                          const toolLabel = isVariedades
                            ? "variedades"
                            : isClubes
                              ? "clubes"
                              : "información";

                          if (state === "output-available") {
                            return (
                              <div
                                key={toolCallId as string}
                                className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                              >
                                <Check className="size-3" />
                                <span>✓ Búsqueda de {toolLabel} completada.</span>
                              </div>
                            );
                          }

                          return (
                            <div
                              key={toolCallId as string}
                              className="flex items-center gap-1 text-xs text-muted-foreground animate-pulse"
                            >
                              <Loader2 className="size-3 animate-spin" />
                              <span>Buscando {toolLabel}...</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}

        {hasError && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm dark:border-red-800 dark:bg-red-950/30">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-red-600" />
            <span className="text-red-800 dark:text-red-200">
              Error de conexión con el asistente. Comprueba tu conexión e inténtalo de nuevo.
            </span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="border-t border-border p-4">
        <p className="mb-2 text-[10px] text-muted-foreground">
          🚨 +18 / Información orientativa y de reducción de daños — no sustituye asesoramiento médico ni jurídico.
        </p>
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={available ? "Escribe tu pregunta… (Enter para enviar)" : "Asistente no disponible"}
            disabled={!available}
            rows={2}
            className="resize-none"
          />
          <Button
            type="submit"
            disabled={!available || !inputValue.trim() || isBusy}
            size="sm"
            className="self-end"
            aria-label="Enviar mensaje"
          >
            {isBusy ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

