# TODO Usuario — Pasos manuales que Claude no puede hacer por ti

Estos son los pasos que requieren tu intervención (cuentas externas, dinero, decisiones de producto). Están ordenados por prioridad.

## 1. Supabase (BLOQUEANTE para casi todo el backend)

1. [x] **Crea cuenta gratis** en https://supabase.com (puedes usar tu cuenta de GitHub).
2. [x] **Crear proyecto nuevo**:
   - Name: `weedconnect`
   - Region: `Europe (Frankfurt)` (más cercana)
   - Database password: genera una fuerte y guárdala.
3. [x] **Habilitar extensiones**: ve a `Database → Extensions` y activa:
   - `postgis` (geolocalización del mapa)
   - `pgcrypto` (UUIDs — normalmente ya está)
4. [x] **Ejecutar la migración**: copia el contenido de `supabase/migrations/0001_init.sql` y pégalo en `SQL Editor → New query → Run`. Luego haz lo mismo con `supabase/seed.sql` para los datos de ejemplo. *(Nota: El archivo incluye un parche crítico de seguridad del `SecurityAgent` para evitar escalada de roles y el esquema del **Muro Social / Feed**).* Si ya aplicaste la migración inicial previamente, solo debes ejecutar la sección final de `0001_init.sql` dedicada al **SOCIAL FEED**.
   - [ ] **Migración de gamificación**: ejecuta también `supabase/migrations/0002_gamification_triggers.sql` en el SQL Editor. Este archivo instala los triggers que actualizan `profiles.points` automáticamente cada vez que un usuario crea/borra hilos, respuestas, posts sociales, comentarios, cultivos, entradas de cultivo y votos.
5. [x] **Crear storage buckets**: en `Storage → New bucket`, crea (en todos, límite de tamaño `5 MB` y MIME types `image/jpeg, image/png, image/webp, image/gif`):
   - `avatars` (público — fotos de perfil)
   - `strain-photos` (público)
   - `grow-photos` (**privado** — fotos del diario de cultivo; se sirven con signed URLs, solo las ve el dueño)
   - `forum-photos` (público — fotos de los hilos del foro)
   - `social-photos` (público — fotos del Muro Social).
   *(Nota: ¡Ya los hemos creado e insertado en minúsculas y con la configuración correcta de seguridad en tu base de datos! Si aún tienes los buckets antiguos en mayúsculas en tu panel de Supabase, puedes borrarlos directamente en la pestaña Storage).*
6. [x] **Copiar credenciales**: ve a `Project Settings → API` y copia:
   - Project URL
   - `anon` public key
7. [x] **Rellenar `.env.local`** en la raíz del proyecto:
   ```
   cp .env.local.example .env.local
   ```
   Y pega los valores:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
8. [x] **Reinicia el dev server** (`Ctrl+C` → `pnpm dev`).

## 2. Autenticación — Proveedores OAuth (opcional pero recomendado)

En `Supabase → Authentication → Providers`, activa los que quieras:
- **Email** (ya activo por defecto — basta para arrancar).
- **Google**: necesitas crear OAuth credentials en https://console.cloud.google.com.
- **GitHub**: en https://github.com/settings/developers → OAuth Apps.

Para cada proveedor, Supabase te da el `Redirect URL` que tienes que pegar en la consola del proveedor.

## 3. Despliegue en Vercel (cuando quieras enseñarlo)

> ⚠ **GitHub Pages no es compatible** con este proyecto. GitHub Pages solo sirve archivos
> estáticos y WeedConnect usa Server Components, API routes, Server Actions y middleware
> que requieren runtime Node.js. La plataforma correcta es **Vercel** (gratuita para proyectos
> personales, diseñada para Next.js, un clic de deploy).

El repositorio ya está en GitHub (`WeedConnect/WeedConnect`, rama `main`). Solo falta:

1. Crea cuenta gratis en https://vercel.com con tu cuenta de GitHub.
2. En Vercel: `Add New → Project → Import Git Repository`.
3. Selecciona el repo `WeedConnect/WeedConnect`.
4. Vercel detecta Next.js automáticamente. Pulsa **Deploy** (el primer deploy irá sin Supabase — es normal).
5. **Añadir variables de entorno**: ve a `Settings → Environment Variables` y añade:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` (cuando tengas el dominio definitivo)
6. Redeploy desde la pestaña Deployments.

Cada `git push` a `main` lanzará un deploy automático en Vercel.

## 4. Dominio propio (opcional, ~10€/año)

- Compra dominio en Namecheap, Cloudflare Registrar o similar (p.ej. `weedconnect.com` o `.eu`/`.cat`).
- En Vercel: `Settings → Domains → Add Domain` y sigue las instrucciones DNS.

## 5. Mapa de clubes — datos reales

El mapa actual usa 8 clubes mock. Para datos reales tienes dos vías:
- **Crowdsource**: dejar que usuarios registrados propongan clubes (con cola de moderación).
- **Importar listado público**: hay datasets en algunas asociaciones nacionales (CATFAC, CONFAC). Conviértelo a CSV/JSON y usa el script `supabase/scripts/import-clubs.sql` (a crear).

Decisión que tienes que tomar tú: ¿qué cobertura geográfica inicial? (solo Cataluña, toda España, Europa…)

## 6. IA asistente (Fase posterior)

Cuando llegue el momento de implementar la IA:
- Crea cuenta en https://console.anthropic.com (o OpenAI).
- Genera una API key y guárdala como `ANTHROPIC_API_KEY` (sin `NEXT_PUBLIC_` — solo server-side).
- Decide presupuesto mensual (Anthropic permite poner límites).

## 7. Tienda + pagos (Fase posterior)

- Crea cuenta Stripe en https://stripe.com (Europa).
- Activa modo test mientras desarrollas.
- Variables: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
- Requisitos legales: necesitarás CIF/autónomo o sociedad para cobrar, y políticas de devolución.

## 8. Aspectos legales (IMPORTANTE — España)

> ⚠️ Consulta con un abogado especializado antes de lanzar. Cannabis recreativo es ilegal en España; la plataforma debe enfocarse a **información, comunidad y reducción de daños**, no a la venta de cannabis. La venta de semillas y merchandising no relacionado con consumo sí es legal.

Mínimos:
- Aviso legal, política de privacidad y cookies (templates en https://termsfeed.com gratis).
- Banner de cookies (next-cookies-banner o vanilla).
- Verificación +18 (ya implementada como age gate).
- Disclaimer en cada página sensible: "Contenido informativo. El consumo de cannabis puede tener riesgos."
- RGPD: opción de borrar cuenta y descargar datos.

## 9. Analytics — Plausible (antes del lanzamiento)

La integración ya está lista en el código — solo necesitas crear la cuenta y añadir el dominio.

1. Crea cuenta en https://plausible.io (prueba gratuita 30 días, luego ~9€/mes).
   - Alternativa gratuita: **PostHog** (https://posthog.com, 1M eventos/mes gratis).
2. En Plausible: `Add Website` → pon el dominio exacto (ej: `weedconnect.app`).
3. En tu `.env.local` añade:
   ```
   NEXT_PUBLIC_PLAUSIBLE_DOMAIN=weedconnect.app
   ```
4. En Vercel (`Settings → Environment Variables`) añade la misma variable.
5. El script se carga automáticamente en producción — en local no carga si la variable está vacía.

Ventajas de Plausible: sin cookies → sin banner de cookies obligatorio, RGPD compliant de serie.

## 10. Email transaccional (cuando haya auth real)

Supabase envía emails básicos de auth gratis pero con su branding. Para algo profesional:
- **Resend** (https://resend.com) — 3000 emails/mes gratis.
- Configurar dominio remitente + DKIM/SPF.

---

## Decisiones de producto que tienes que tomar (no técnicas)

- [x] **Nombre definitivo**: WeedConnect.
- [ ] **Logo + paleta de colores** (ahora uso verde esmeralda neutro).
- [ ] **Cobertura geográfica inicial** (España vs Cataluña vs Europa).
- [ ] **Idiomas** (ahora solo es-ES — ¿añadir ca-ES en Fase 4?).
- [ ] **Modelo de negocio** (gratis con ads, freemium, suscripción, tienda…).
- [ ] **Moderación** (¿quién modera el foro al principio? ¿tú? ¿voluntarios?).
- [ ] **Términos de uso** (qué se permite y qué no — fotos de cultivo personal, intercambio, etc.).
