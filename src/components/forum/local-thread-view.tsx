"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { LocalThread } from "./new-thread-form";

const LOCAL_KEY = "wc_local_threads";

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "ahora mismo";
  if (m < 60) return `hace ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `hace ${h}h`;
  return `hace ${Math.floor(h / 24)}d`;
}

export function LocalThreadView({ slug }: { slug: string }) {
  const [thread, setThread] = useState<LocalThread | null | "loading">("loading");

  useEffect(() => {
    const stored: LocalThread[] = JSON.parse(localStorage.getItem(LOCAL_KEY) ?? "[]");
    setThread(stored.find((t) => t.slug === slug) ?? null);
  }, [slug]);

  if (thread === "loading") return null;

  if (!thread) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Link
          href="/comunidad/foro"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Volver al foro
        </Link>
        <p className="mt-12 text-center text-muted-foreground">Hilo no encontrado.</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link
        href="/comunidad/foro"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Volver al foro
      </Link>

      <article className="mt-6">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          {thread.category_name && (
            <Badge variant="secondary">{thread.category_name}</Badge>
          )}
          <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-300/50">
            Guardado localmente
          </Badge>
          <span>· {relativeTime(thread.created_at)}</span>
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          {thread.title}
        </h1>
        <div className="mt-4 rounded-lg bg-muted/30 px-5 py-5 text-base leading-relaxed whitespace-pre-wrap">
          {thread.body}
        </div>
      </article>

      <div className="mt-10 border-t border-border pt-8">
        <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
          Este hilo está guardado solo en tu navegador (modo demo).{" "}
          <Link href="/auth/login" className="underline font-medium">
            Inicia sesión
          </Link>{" "}
          con Supabase configurado para publicarlo en la comunidad.
        </p>
      </div>
    </section>
  );
}
