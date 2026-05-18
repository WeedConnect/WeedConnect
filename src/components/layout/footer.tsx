import Link from "next/link";
import { MAIN_NAV } from "@/lib/nav";
import { LogoWeedConnect } from "@/components/icons/logo-weedconnect";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-muted/30">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3 sm:px-6">
        <div>
          <LogoWeedConnect showText className="size-7" textClassName="text-base font-bold" />
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            El hub central de la comunidad cannábica: foro, clubes, cultivo, strains y más.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Navegación</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {MAIN_NAV.filter((i) => i.href !== "/").map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Legal y Comunidad</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/comunidad/normas" className="text-muted-foreground transition-colors hover:text-foreground">
                Normas de la comunidad
              </Link>
            </li>
            <li>
              <Link href="/info/legal" className="text-muted-foreground transition-colors hover:text-foreground">
                Marco legal
              </Link>
            </li>
            <li>
              <Link href="/legal/aviso-legal" className="text-muted-foreground transition-colors hover:text-foreground">
                Aviso legal
              </Link>
            </li>
            <li>
              <Link href="/legal/privacidad" className="text-muted-foreground transition-colors hover:text-foreground">
                Política de privacidad
              </Link>
            </li>
            <li>
              <Link href="/legal/terminos-uso" className="text-muted-foreground transition-colors hover:text-foreground">
                Términos de uso
              </Link>
            </li>
            <li>
              <Link href="/legal/cookies" className="text-muted-foreground transition-colors hover:text-foreground">
                Política de cookies
              </Link>
            </li>
            <li className="text-muted-foreground">+18 · Contenido informativo</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} WeedConnect. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
