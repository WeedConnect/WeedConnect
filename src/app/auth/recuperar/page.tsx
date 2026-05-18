"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export default function RecuperarPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabaseReady = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabaseReady) {
      setError("Supabase no está configurado todavía. Rellena .env.local para usar esta función.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/nueva-contrasena`,
      });
      if (resetError) {
        setError(resetError.message);
        return;
      }
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16 sm:px-6">
      <Link
        href="/auth/login"
        className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Volver al login
      </Link>

      <h1 className="text-2xl font-bold tracking-tight">Recuperar contraseña</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Introduce tu email y te enviaremos un enlace para restablecer tu contraseña.
      </p>

      {sent ? (
        <div className="mt-8 rounded-md border border-emerald-300/60 bg-emerald-50 px-4 py-4 text-sm text-emerald-800 dark:border-emerald-700/40 dark:bg-emerald-950/40 dark:text-emerald-200">
          ✅ Correo enviado. Revisa tu bandeja de entrada (y la carpeta de spam) para el enlace de recuperación.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
          {!supabaseReady && (
            <div className="rounded-md border border-amber-300/60 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-700/40 dark:bg-amber-950/40 dark:text-amber-200">
              ⚠ Supabase no configurado. Esta pantalla es de demo.
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? "Enviando…" : "Enviar enlace de recuperación"}
          </Button>
        </form>
      )}
    </div>
  );
}
