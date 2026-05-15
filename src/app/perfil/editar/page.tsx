import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EditProfileForm } from "@/components/profile/edit-profile-form";

export const metadata: Metadata = { title: "Editar perfil — WeedConnect" };

export default async function EditarPerfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?next=/perfil/editar");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name, bio, avatar_url")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/");

  return (
    <section className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Editar perfil</h1>
      <p className="mt-2 text-muted-foreground">
        Actualiza tu foto, tu nombre visible y tu biografía.
      </p>
      <div className="mt-8">
        <EditProfileForm userId={user.id} profile={profile} />
      </div>
    </section>
  );
}
