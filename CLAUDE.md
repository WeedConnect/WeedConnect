# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proyecto

WeedConnect — hub web/app para la comunidad cannábica. Stack: **Next.js 16 (App Router)** + React 19 + TypeScript + **Tailwind CSS 4** + **Shadcn UI (style `base-nova`)** + Supabase (planeado, ver más abajo). Idioma UI: español. Estado actual: **Fases 1+2 completadas** — todo el frontend está montado con mock data; falta conectar Supabase.

Lee también:
- **`BACKLOG.md`** — funcionalidades pendientes con estado (✓ / ~ / ☐). Incluye las 15 ideas originales del usuario.
- **`TODO_USUARIO.md`** — pasos manuales que tiene que hacer el usuario (Supabase, deploy, OAuth, legal). **No intentes hacerlos tú** (ver "División de trabajo" abajo).
- **Plan inicial**: `C:\Users\ester\.claude\plans\act-a-como-un-arquitecto-synthetic-shannon.md` (plan original aprobado de Fase 1).

### Workspace compartido — importante

La carpeta padre `C:\Users\ester\Desktop\HECTOR\` contiene **otros proyectos independientes** (p. ej. `ASESOR FINANCIERO 2.0/`, `ASESOR FINANCIERO/`, `HecTechAI/`). **No mezclar contexto ni código** entre proyectos. Si ves `git status` con archivos modificados fuera de `Cannabis4All/`, ignóralos — son de otros proyectos hermanos. Trabaja solo dentro de `Cannabis4All/` (el nombre de la carpeta no cambia aunque el proyecto ahora se llame WeedConnect).

### División de trabajo (regla del usuario)

> "Las cosas que debo hacer yo las dejamos a parte, primero haz todo lo que puedas hacer tú."

- **Hazlo tú**: cualquier cosa que se resuelva con código, archivos locales, `pnpm`, edición de SQL/TS/MD.
- **Déjalo al usuario**: crear cuentas externas (Supabase, Vercel, Stripe, Anthropic, OAuth providers), comprar dominios, rellenar `.env.local` con secretos reales, decisiones de branding/producto, aspectos legales. Documenta en `TODO_USUARIO.md` lo que descubras nuevo.

### Justificación de stack (no reabrir sin razón)

- **Supabase, no Firebase**: el dominio es relacional (foro con votos polimórficos, comparador, strains con relaciones, PostGIS para mapa). RLS encaja con los "espacios privados". Decisión cerrada con el usuario.
- **Pnpm, no npm/bun**: pnpm fue elegido por el usuario; bun tiene rough edges en Windows con plugins de Next/Shadcn.
- **es-ES sin i18n en Fase 1-2**: catalán llegará en Fase 4 con `next-intl`. No instalar i18n ahora.

## Comandos

```bash
pnpm dev                # dev server (http://localhost:3000)
pnpm build              # production build
pnpm lint               # eslint
pnpm start              # serve production build

# Añadir componentes shadcn (importante: NO mezcla con Radix, ver gotcha abajo)
CI=true pnpm dlx shadcn@latest add <component>

# Instalar dependencias — IMPORTANTE: CI=true es obligatorio
CI=true pnpm install
CI=true pnpm add <package>
```

**`CI=true` es obligatorio para cualquier `pnpm install` / `add` / `dlx`** porque pnpm v11 aborta sin TTY interactiva. También se necesita para que pnpm no pregunte por la confirmación de purga de `node_modules`.

## Arquitectura — lo que no se ve a primera vista

### Shadcn UI usa `@base-ui/react`, NO Radix

La style `base-nova` que viene por defecto en shadcn 4.7 está construida sobre `@base-ui/react`, no sobre Radix. Esto cambia varias APIs:

- **`asChild` no existe en `<Button>`**. Para enlazar un `<Link>` con estilo de botón, hay dos patrones:
  ```tsx
  // Opción A: buttonVariants() como className (preferido para Links)
  <Link href="/x" className={cn(buttonVariants({ size: "lg" }))}>...</Link>

  // Opción B: prop `render` (preferida para triggers de Sheet/Dialog/Dropdown)
  <SheetTrigger render={<Button variant="ghost"><Menu /></Button>} />
  <DropdownMenuTrigger render={<Button>{label}</Button>} />
  <DropdownMenuItem render={<Link href="/x">label</Link>} />
  ```
- Ejemplos en el repo: `src/components/landing/hero.tsx`, `src/app/age-gate/page.tsx`, `src/components/layout/navbar.tsx`, `src/components/layout/mobile-nav.tsx`.
- Si copias snippets de la doc antigua de shadcn (Radix) con `asChild`, el typecheck fallará. Refactor antes de pegar.

### Capa de datos: mock hoy, Supabase mañana

Toda la UI consume **mock data** desde `src/data/{strains,clubs,forum-mock}.ts`. La regla: cuando se conecte Supabase, **se sustituyen estas importaciones** por queries — la forma de los objetos coincide con `src/types/index.ts` (que a su vez refleja el schema en `supabase/migrations/0001_init.sql`). No introduzcas un ORM ni capa intermedia: las funciones helper estilo `findStrain(slug)` se sustituirán por queries Supabase directamente.

### Schema SQL + RLS + PostGIS

`supabase/migrations/0001_init.sql` tiene el schema completo con RLS habilitada en todas las tablas y un trigger `on_auth_user_created` que auto-crea profile. Cualquier cambio de modelo:
1. Edita el archivo SQL.
2. Actualiza el tipo correspondiente en `src/types/index.ts`.
3. Actualiza la mock data si afecta a la forma.
4. Documenta el cambio en `TODO_USUARIO.md` (el usuario tiene que re-ejecutar el SQL).

No crees migraciones adicionales en Fase 2: la base aún no existe en ningún Supabase real. Una sola migración consolidada es válida hasta que el usuario aplique el schema y empiece a haber datos en producción.

**Requisitos del schema** (ya documentados en `TODO_USUARIO.md`): el usuario debe habilitar `postgis` y `pgcrypto` en `Database → Extensions` antes de ejecutar el SQL. La tabla `clubs` usa `geography(point, 4326)` y `events.location` también — sin PostGIS el SQL falla. Cualquier feature nueva que use geo debe seguir el mismo tipo, no `lat numeric, lng numeric` sueltos.

**Storage buckets** que el usuario debe crear manualmente: `avatars`, `strain-photos`, `forum-photos` (públicos), `grow-photos` (privado). Si añades nuevas features con fotos, añade el bucket a `TODO_USUARIO.md`.

### Middleware: age gate + Supabase session

`src/middleware.ts` hace dos cosas en orden:
1. **Age gate +18**: si no hay cookie `wc_age_ok`, redirige a `/age-gate?next=<path>`. La cookie dura 1 año, se setea en `src/app/age-gate/page.tsx`.
2. **Refresco de sesión Supabase** (`updateSession` en `src/lib/supabase/middleware.ts`).

**Crítico**: `updateSession` **degrada limpiamente** si faltan `NEXT_PUBLIC_SUPABASE_URL` o `NEXT_PUBLIC_SUPABASE_ANON_KEY` (devuelve `NextResponse.next()` sin tocar nada). Mantén esa propiedad — la app tiene que arrancar sin Supabase configurado. Los formularios de auth (`src/app/auth/{login,registro}/`) hacen el mismo check (`supabaseReady`) y muestran un banner amarillo.

### Leaflet + SSR

`src/app/mapa/clubs-map.tsx` usa Leaflet, que toca `window`. Se carga vía `dynamic(() => import(...), { ssr: false })` desde `src/app/mapa/map-view.tsx`. Los iconos por defecto de Leaflet rompen con bundlers — están parcheados manualmente apuntando a `unpkg.com`. Si añades más mapas, replica el patrón.

### `next-themes` + hydration

El toggle de tema (`src/components/layout/theme-toggle.tsx`) usa el patrón clásico `mounted` para evitar hydration mismatch. Esto **viola la regla `react-hooks/set-state-in-effect`** de React 19, que está silenciada con `eslint-disable-next-line` en esa línea. Es el patrón oficial de next-themes — no lo "arregles". El root layout también lleva `suppressHydrationWarning` en `<html>` por la misma razón.

### Navegación: fuente única

`src/lib/nav.ts` define `MAIN_NAV` (con `children` opcionales). Tanto `navbar.tsx` (dropdowns en desktop) como `mobile-nav.tsx` (tree expandido en Sheet) como `footer.tsx` consumen este array. **No dupliques rutas** — añade aquí.

## Gotchas operacionales

- **Nombre del paquete**: `weedconnect` (lowercase, en `package.json`). La carpeta es `Cannabis4All` con mayúsculas. `create-next-app` rechaza mayúsculas en el name; si re-creas, instala en subdir y aplana después.
- **Builds aprobados de pnpm**: `pnpm-workspace.yaml` whitelist `sharp` y `unrs-resolver` (sí), `msw` (no). Si una dep nueva pide aprobar build, edita ese archivo y vuelve a instalar con `CI=true`.
- **Tailwind v4**: no hay `tailwind.config.ts`. Configuración inline en `src/app/globals.css` con `@theme inline`. Si cambias tokens (p. ej. paleta verde), edítalo allí.
- **shadcn add**: cuando re-añades componentes y la versión ya existe, pasa `--overwrite` para sobreescribir. Si pide aprobar nuevos builds (p. ej. `msw`), denegar en `pnpm-workspace.yaml` (no lo usamos).

## Convenciones de código

- **Rutas y slugs en español**, **filenames en inglés**. Ejemplos: ruta `/auth/registro/`, filename `register-form.tsx`; ruta `/herramientas/dosis/`, filename `dose-calculator.tsx`. Los slugs de contenido también en español (`primer-cultivo-indoor-armario-80x80`).
- Texto UI siempre en español. Comentarios y commits, también en español por consistencia con el resto del repo del usuario.
- Páginas con `generateStaticParams` para slugs de mock data — cuando Supabase esté conectado, considera `dynamic = 'force-dynamic'` o ISR según la frecuencia de actualización.
- Imports absolutos vía alias `@/*` (configurado en `tsconfig.json`).
- **Disclaimer +18 / "contenido informativo"** en cualquier página con detalle sensible (ver `/strains/[slug]`, `/mapa`). **No es decoración** — es la postura de producto: la plataforma es **informativa y de reducción de daños**, no fomenta el consumo. Cualquier feature nueva con info de strains/dosis/cultivo debe llevar disclaimer similar.

## Patrón visual

- Color de marca: **verde esmeralda** (`emerald-600` / `emerald-100` / `emerald-900/40` para dark). No introducir otros acentos sin acordarlo con el usuario.
- Tipografía: Geist Sans + Geist Mono (cargadas con `next/font/google` en root layout).
- Icono recurrente: `Leaf` de lucide-react (logo, listings, etc.).
- Badges de tipo de strain con paleta fija: indica=`purple-*`, sativa=`amber-*`, hybrid=`emerald-*` (ver `src/app/strains/strains-browser.tsx` y `[slug]/page.tsx`). Si se añaden más vistas de strain, reutilizar esos mapas — no inventar colores nuevos.
