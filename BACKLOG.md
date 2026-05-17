# WeedConnect — Backlog de Funcionalidades

Lista maestra de funcionalidades a implementar. Marcadas con `[x]` cuando estén hechas, `[~]` cuando estén scaffolded (UI sin backend real) y `[ ]` cuando estén pendientes.

## Ideas core (de la lista inicial del usuario)

- [~] **Foro de cannabis** — comunidad / threads / posts / votos. Categorías extendidas (Experiencias, Munchies, Memes, Principiantes).
- [~] **Recomendaciones de pelis** — listado curado y filtrado por "stoner mood" (Fumadón, Risas, Psicodélica, Clásico).
- [~] **Recomendaciones de "gules" / munchies** — recetas + snacks + locales delivery cerca.
- [x] **Subida de fotos** — Supabase Storage. Muro Social (`social-photos`), avatares (`avatars`), hilos del foro (`forum-photos`) y diario de cultivo (`grow-photos`, privado + signed URLs). Todos con bucket + RLS + validación.
- [~] **IA integrada en la app** — route handler streaming con `@ai-sdk/anthropic` + herramientas `buscarVariedades` y `buscarClubes` implementadas. Chat UI funcional en `/herramientas/asistente`. Falta `ANTHROPIC_API_KEY` del usuario.
- [~] **Mapa de spots chill y clubes** — asociaciones legales + miradores + parques + spots para relajarse (PostGIS + tags).
- [~] **Noticias** — `info/noticias/page.tsx` con `MOCK_NOTICIAS` y categorías. Falta feed real / RSS.
- [x] **Catálogo de strains** — indica/sativa/híbrido, THC/CBD, efectos.
- [x] **Temas legales** — sección informativa en lenguaje sencillo, alertas por país/CCAA (sin asesoramiento).
- [x] **Información sobre el cannabis** — guías, educación y tips de bienestar (bajar intensidad, convivencia).
- [~] **Merchandising** — `tienda/merch/page.tsx` con catálogo mock "próximamente". Falta Stripe Checkout.
- [~] **Compras Recomendadas (Afiliación)** — catálogo de vaporizadores, grinders, setup chill y luces LED (Amazon Afiliados).
- [x] **Juegos para jugar fumado** — lista curada completa en `/info/juegos` (digitales chill, multijugador caótico, mesa). Contenido estático, sin backend necesario.

## Ideas extendidas (numeradas)

1. [~] **Mapa interactivo de asociaciones y spots** — Leaflet + OSM montado con mock data y categorías.
2. [~] **Calendario de eventos y ferias** — `comunidad/eventos/page.tsx` con `MOCK_EVENTOS`. Falta backend real y vista calendar.
3. [~] **Sección educativa** (artículos, vídeos, guías cultivador, reducción de daños) — MDX o Sanity.
4. [~] **Podcast / audio** — `comunidad/podcast/page.tsx` con `MOCK_EPISODIOS` y placeholders de embeds Spotify/iVoox. Falta audio real.
5. [~] **Recetas cuina cannábica** — fotos + valoraciones comunidad + warnings dosificación.
6. [x] **Herramienta de seguimiento de cultivo** — localStorage + Supabase + migración automática. Resumen con stats (días, fase, riego), línea de tiempo visual de fases (Germinación→Curado), botón Finalizar/Reabrir cultivo, exportar JSON, fotos privadas (usuarios con sesión). OG metadata añadida.
7. [ ] **Alertas personalizadas de noticias legales** — suscripción por región.
8. [~] **Comparador de productos y precios / Afiliados** — semillas, vaporizadores, gears de setup.
9. [~] **Gamificación** — sistema de niveles (Semilla→Leyenda) con barra de progreso + grid de 10 logros en el perfil (`src/lib/gamification.ts`, `src/components/gamification/`). Listo para conectar Supabase.
10. [~] **Espacios privados / grupos temáticos** — `comunidad/grupos/page.tsx` con grupos mock. Falta backend RLS real y funcionalidad de unirse/publicar.
11. [~] **Blog colaborativo** — `comunidad/blog/page.tsx` con `MOCK_BLOG_POSTS`. Falta formulario de envío y moderación.
12. [x] **Calculadora de dosis** — comestibles/extracciones según potencia. **Funcional sin backend** en `/herramientas/dosis`.
13. [ ] **Chat en tiempo real** — Supabase Realtime channels.
14. [~] **Sistema de votaciones** — VoteButton (up/down) en listado del foro, detalle de hilo y respuestas. Server Action `castVote`/`removeVote` con updates optimistas. Listo para conectar Supabase.
15. [x] **Integración con redes sociales** — Open Graph completo con imagen dinámica (`/api/og`), imagen estática de portada (`/opengraph-image`), Twitter card y `metadataBase`. Metadata específica en strains, foro, mapa, comunidad, herramientas e info.

## Transversales (no listadas pero necesarias)

- [x] Tema claro/oscuro
- [x] Age gate +18
- [~] Auth (UI + middleware, falta conectar a Supabase real)
- [ ] i18n catalán/español (decisión: empezar solo en es, añadir ca con next-intl en Fase 4)
- [x] PWA — `manifest.ts` con shortcuts, iconos generados con ImageResponse (512×512 + 180×180 Apple), `themeColor` adaptativo light/dark, `viewport` correcto.
- [ ] Notificaciones push (FCM)
- [ ] Moderación (queue + roles)
- [x] Analytics — Plausible integrado con `next/script` (`afterInteractive`). Solo carga en producción si `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` está definido. PostHog como alternativa gratuita.
- [~] Tests (Vitest: `forum.test.ts` y `utils.test.ts` + `dose-calculator.test.tsx` presentes. Falta cobertura E2E con Playwright)
- [x] CI/CD (GitHub Actions) — `.github/workflows/ci.yml` con lint + build automático en push/PR a main.

## Prioridad sugerida tras Fase 2

1. Conectar Supabase real (auth + foro + strains desde BBDD).
2. ✓ Subida de fotos (Muro Social, avatar, posts foro y fotos grow log — completado).
3. Mapa con datos reales de clubes y crowd-sourced spots.
4. Grow tracker conectado.
5. IA asistente — ya implementada, solo falta que el usuario añada `ANTHROPIC_API_KEY` al `.env.local`.
6. Gamificación (triggers en BBDD para sumar puntos).
7. Tienda (Stripe Checkout + pedidos).
