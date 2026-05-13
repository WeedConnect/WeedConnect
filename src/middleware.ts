import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const AGE_GATE_COOKIE = "wc_age_ok";
const AGE_GATE_PATH = "/age-gate";

// Rutas que NO pasan por el age gate (assets, age gate, callback, api).
const PUBLIC_PATHS = [AGE_GATE_PATH, "/api", "/_next", "/favicon.ico"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Age gate +18: si no hay cookie y la ruta no es pública, redirige.
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  if (!isPublic && !request.cookies.has(AGE_GATE_COOKIE)) {
    const url = request.nextUrl.clone();
    url.pathname = AGE_GATE_PATH;
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Refresca la sesión de Supabase (si hay credenciales).
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static, _next/image, favicon, files con extensión.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
