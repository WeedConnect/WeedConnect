import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/lib/forum";
import { NewThreadForm } from "@/components/forum/new-thread-form";

export const metadata: Metadata = { title: "Nuevo hilo — Foro" };

export default async function NuevoHiloPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?next=/comunidad/foro/nuevo");

  const categories = await getCategories();

  return (
    <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Nuevo hilo</h1>
      <p className="mt-2 text-muted-foreground">
        Comparte una pregunta, experiencia o debate con la comunidad.
      </p>
      <div className="mt-8">
        <NewThreadForm categories={categories} userId={user.id} />
      </div>
    </section>
  );
}
