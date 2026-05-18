import { createBrowserClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseReady = Boolean(url && anonKey);

export function createClient() {
  if (!supabaseReady) {
    console.warn(
      "[WeedConnect] Supabase no configurado: define NEXT_PUBLIC_SUPABASE_URL y " +
        "NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local. Auth y base de datos estarán desactivados.",
    );
  }
  // Usamos fallbacks no vacíos para que createBrowserClient no lance el error de
  // "URL and API key are required". Las llamadas a la API fallarán de forma silenciosa
  // (Supabase devuelve { data: null, error: {...} }) en lugar de romper la app.
  return createBrowserClient(
    url ?? "https://placeholder.supabase.co",
    anonKey ?? "placeholder-anon-key",
  );
}
