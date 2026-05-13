# WeedConnect

Hub central de la comunidad cannábica: foro, mapa de clubes, seguimiento de cultivo, catálogo de strains, herramientas y comercio. Plataforma web/app construida con Next.js, TypeScript y Supabase.

## Documentos clave

- **[BACKLOG.md](./BACKLOG.md)** — lista maestra de funcionalidades con estado.
- **[TODO_USUARIO.md](./TODO_USUARIO.md)** — pasos manuales que tienes que hacer tú (crear Supabase, deploy, etc.).
- **[supabase/migrations/](./supabase/)** — schema SQL listo para ejecutar en el SQL Editor de Supabase.

## Stack

- **Frontend**: Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Shadcn UI (style `base-nova` sobre `@base-ui/react`) · lucide-react · next-themes
- **Mapa**: react-leaflet + OpenStreetMap (sin API key)
- **Backend**: Supabase (Postgres + Auth + Realtime + Storage; PostGIS para mapa) — código preparado, falta crear el proyecto en supabase.com.
- **Package manager**: pnpm (necesita `CI=true` en install para evitar prompt TTY)

## Desarrollo local

```bash
pnpm install
cp .env.local.example .env.local   # rellenar cuando crees el proyecto Supabase
pnpm dev
```

App en `http://localhost:3000`. En el primer acceso te pedirá confirmar +18 (age gate).

## Estructura

```
src/
├── app/
│   ├── layout.tsx                  Layout raíz (Navbar + Footer + ThemeProvider)
│   ├── page.tsx                    Landing
│   ├── age-gate/                   Confirmación +18
│   ├── auth/{login,registro,callback}/   Auth UI + OAuth callback
│   ├── comunidad/
│   │   ├── page.tsx                Hub
│   │   ├── foro/                   Listado + [slug] (mock)
│   │   └── {eventos,blog,podcast,recetas,grupos}/
│   ├── mapa/                       Leaflet + OSM + 8 clubes mock
│   ├── strains/                    Catálogo funcional con filtro + [slug]
│   ├── herramientas/
│   │   ├── page.tsx                Hub
│   │   ├── dosis/                  Calculadora de dosis — FUNCIONAL
│   │   └── cultivo/                (placeholder)
│   ├── info/
│   │   ├── page.tsx                Hub
│   │   └── {educacion,legal,noticias,peliculas,munchies}/
│   └── tienda/{merch,comparador}/
├── components/
│   ├── ui/                         Shadcn (button, card, sheet, nav-menu, dropdown, input, etc.)
│   ├── layout/                     Navbar, MobileNav, Footer, ThemeToggle, PagePlaceholder
│   ├── landing/                    Hero, FeatureCards
│   └── theme-provider.tsx          next-themes wrapper
├── data/                           Mock data (se sustituye por queries a Supabase en Fase 3)
│   ├── strains.ts
│   ├── clubs.ts
│   └── forum-mock.ts
├── lib/
│   ├── nav.ts                      Estructura de navegación (fuente única)
│   ├── utils.ts                    cn() de shadcn
│   └── supabase/{client,server,middleware}.ts   Clientes SSR
├── middleware.ts                   Age gate + refresco de sesión Supabase
└── types/index.ts                  User, Strain, Club, GrowLog…

supabase/
├── migrations/0001_init.sql        Schema completo con RLS y PostGIS
└── seed.sql                        Datos de muestra (categorías foro, strains, clubs)
```

## Estado por fase

- **Fase 1** ✓ Setup base, navegación, landing, tipado.
- **Fase 2** ✓ Schema SQL, auth wiring, age gate, dark mode, catálogo strains funcional, calculadora de dosis, mapa Leaflet, scaffolding completo del sitio.
- **Fase 3** (siguiente) — Conectar Supabase real: importar schema, sustituir mock data por queries, foro funcional, grow tracker.
- **Fase 4** — Chat realtime, IA asistente, tienda con Stripe, comparador de precios.

## Features ya funcionales (sin backend)

- 🌿 **Catálogo de strains** (`/strains`) — 10 variedades, filtro por tipo, búsqueda por aroma/efecto, detalle.
- 🧮 **Calculadora de dosis** (`/herramientas/dosis`) — totalmente operativa, cálculo client-side.
- 🗺 **Mapa de clubes** (`/mapa`) — Leaflet + OpenStreetMap con 8 clubes en España.
- 🌗 **Tema claro/oscuro** — toggle en navbar, respeta preferencia del sistema.
- 🔞 **Age gate +18** — cookie de 1 año, middleware redirige hasta confirmar.
- 🔐 **Auth UI** — pantallas de login/registro listas; se conectan automáticamente cuando rellenes `.env.local`.

## Notas técnicas

- Shadcn `base-nova` usa `@base-ui/react`, NO Radix. La API `asChild` no existe; usa la prop `render={<Component />}` o aplica `buttonVariants()` como className sobre `<Link>` (ver `src/app/auth/login/login-form.tsx` y `src/components/landing/hero.tsx` como ejemplos).
- Leaflet se carga con `dynamic(..., { ssr: false })` para evitar `window is not defined`.
- El middleware no rompe si faltan las env vars de Supabase — degrada limpiamente.
- next-themes requiere `suppressHydrationWarning` en el `<html>` (ya está en `layout.tsx`).

## Scripts

| Script | Descripción |
| --- | --- |
| `pnpm dev` | Servidor de desarrollo |
| `pnpm build` | Build de producción |
| `pnpm start` | Servir build de producción |
| `pnpm lint` | ESLint |
