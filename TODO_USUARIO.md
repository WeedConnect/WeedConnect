# TODO Usuario — Pasos manuales que Claude no puede hacer por ti

Estos son los pasos que requieren tu intervención (cuentas externas, dinero, decisiones de producto). Están ordenados por prioridad.

## 1. Supabase (BLOQUEANTE para casi todo el backend)

1. Crea cuenta gratis en https://supabase.com (puedes usar tu cuenta de GitHub).
2. **Crear proyecto nuevo**:
   - Name: `weedconnect`
   - Region: `Europe (Frankfurt)` (más cercana)
   - Database password: genera una fuerte y guárdala (no se puede recuperar fácilmente).
3. **Habilitar extensiones**: ve a `Database → Extensions` y activa:
   - `postgis` (geolocalización del mapa)
   - `pgcrypto` (UUIDs — normalmente ya está)
4. **Ejecutar la migración**: copia el contenido de `supabase/migrations/0001_init.sql` y pégalo en `SQL Editor → New query → Run`. Luego haz lo mismo con `supabase/seed.sql` para los datos de ejemplo. *(Nota: El archivo incluye un parche crítico de seguridad del `SecurityAgent` para evitar escalada de roles y el esquema del **Muro Social / Feed**).* Si ya aplicaste la migración inicial previamente, solo debes ejecutar la sección final de `0001_init.sql` dedicada al **SOCIAL FEED**.
5. **Crear storage buckets**: en `Storage → New bucket`, crea:
   - `avatars` (público)
   - `strain-photos` (público)
   - `grow-photos` (privado — solo dueño)
   - `forum-photos` (público)
   - `social-photos` (público — configurar políticas para permitir SELECT público e INSERT para usuarios autenticados)
6. **Copiar credenciales**: ve a `Project Settings → API` y copia:
   - Project URL
   - `anon` public key
7. **Rellenar `.env.local`** en la raíz del proyecto:
   ```
   cp .env.local.example .env.local
   ```
   Y pega los valores:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
8. **Reinicia el dev server** (`Ctrl+C` → `pnpm dev`).

## 2. Autenticación — Proveedores OAuth (opcional pero recomendado)

En `Supabase → Authentication → Providers`, activa los que quieras:
- **Email** (ya activo por defecto — basta para arrancar).
- **Google**: necesitas crear OAuth credentials en https://console.cloud.google.com.
- **GitHub**: en https://github.com/settings/developers → OAuth Apps.

Para cada proveedor, Supabase te da el `Redirect URL` que tienes que pegar en la consola del proveedor.

## 3. Despliegue en Vercel (cuando quieras enseñarlo)

1. Crea cuenta gratis en https://vercel.com (puedes usar GitHub).
2. **Subir el repo a GitHub**:
   - Crea un repo nuevo (privado o público) llamado `weedconnect`.
   - En la raíz del proyecto:
     ```
     git init
     git add .
     git commit -m "feat: Fase 1 + 2 — setup, schema y scaffolding"
     git branch -M main
     git remote add origin https://github.com/<tu-user>/weedconnect.git
     git push -u origin main
     ```
3. En Vercel: `New Project → Import` tu repo de GitHub.
4. Vercel detecta Next.js automáticamente. Pulsa Deploy.
5. **Añadir variables de entorno**: tras el primer deploy, ve a `Settings → Environment Variables` y añade:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Redeploy desde la pestaña Deployments.

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

## 9. Analytics (cuando tengas tráfico)

Recomendado: **Plausible** (https://plausible.io, ~9€/mes, sin cookies, RGPD-friendly) o **PostHog** (gratis hasta 1M eventos/mes).

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
