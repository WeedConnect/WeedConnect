"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(3, "Mínimo 3 caracteres").max(100),
  type: z.enum(["asociacion", "spot_libre"]),
  city: z.string().min(2, "Mínimo 2 caracteres").max(80),
  address: z.string().min(5, "Mínimo 5 caracteres").max(200),
  description: z.string().max(500).optional(),
  lat: z.number(),
  lng: z.number(),
});

export type ProposeSpotData = z.infer<typeof schema>;
export type ProposeSpotResult = { ok: true } | { ok: false; error: string };

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function proposeSpot(data: ProposeSpotData): Promise<ProposeSpotResult> {
  const parsed = schema.safeParse(data);
  if (!parsed.success) return { ok: false, error: "Datos del formulario inválidos." };

  const { name, type, city, address, description, lat, lng } = parsed.data;

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { ok: false, error: "Debes iniciar sesión para proponer un spot." };
  }

  const slug = `${slugify(name)}-${Date.now().toString(36)}`;

  const { error } = await supabase.from("clubs").insert({
    name,
    slug,
    category: type === "asociacion" ? "asociacion" : "otro",
    city,
    address,
    description: description ?? null,
    country: "ES",
    // PostGIS WKT: longitud primero, latitud después
    location: `POINT(${lng} ${lat})`,
    membership_required: type === "asociacion",
    verified: false,
    created_by: user.id,
  });

  if (error) {
    console.error("[proposeSpot]", error);
    return { ok: false, error: "No se pudo guardar la propuesta. Inténtalo de nuevo." };
  }

  return { ok: true };
}
