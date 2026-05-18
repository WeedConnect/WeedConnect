import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/lib/forum";
import { NewThreadForm } from "@/components/forum/new-thread-form";

export const metadata: Metadata = { title: "Nuevo hilo — Foro" };

export default async function NuevoHiloPage() {
  const supabaseReady = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  let userId: string | null = null;

  if (supabaseReady) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login?next=/comunidad/foro/nuevo");
    userId = user.id;
  }

  const categories = await getCategories();

  return (
    <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Nuevo hilo</h1>
      <p className="mt-2 text-muted-foreground">
        Comparte una pregunta, experiencia o debate con la comunidad.
      </p>

      {!supabaseReady && (
        <div className="mt-4 rounded-md border border-amber-300/60 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-700/40 dark:bg-amber-950/40 dark:text-amber-200">
          Modo demo — Supabase no configurado. El hilo se guardará localmente en tu navegador y
          solo será visible en este dispositivo.
        </div>
      )}

      <div className="mt-8">
        <NewThreadForm categories={categories} userId={userId} />
      </div>
    </section>
  );
}
