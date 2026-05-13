# WeedConnect — Backlog de Funcionalidades

Lista maestra de funcionalidades a implementar. Marcadas con `[x]` cuando estén hechas, `[~]` cuando estén scaffolded (UI sin backend real) y `[ ]` cuando estén pendientes.

## Ideas core (de la lista inicial del usuario)

- [~] **Foro de cannabis** — comunidad / threads / posts / votos. Categorías extendidas (Experiencias, Munchies, Memes, Principiantes).
- [~] **Recomendaciones de pelis** — listado curado y filtrado por "stoner mood" (Fumadón, Risas, Psicodélica, Clásico).
- [~] **Recomendaciones de "gules" / munchies** — recetas + snacks + locales delivery cerca.
- [ ] **Subida de fotos** — usar Supabase Storage.
- [ ] **IA integrada en la app** — chat asistente sobre cultivo, strains, dudas legales (Claude/OpenAI vía route handler streaming).
- [~] **Mapa de spots chill y clubes** — asociaciones legales + miradores + parques + spots para relajarse (PostGIS + tags).
- [ ] **Noticias** — feed de actualidad cannábica, mercado internacional y cultura.
- [x] **Catálogo de strains** — indica/sativa/híbrido, THC/CBD, efectos.
- [x] **Temas legales** — sección informativa en lenguaje sencillo, alertas por país/CCAA (sin asesoramiento).
- [x] **Información sobre el cannabis** — guías, educación y tips de bienestar (bajar intensidad, convivencia).
- [ ] **Merchandising** — tienda con Stripe.
- [~] **Compras Recomendadas (Afiliación)** — catálogo de vaporizadores, grinders, setup chill y luces LED (Amazon Afiliados).
- [ ] **Juegos para jugar fumado** — lista curada de juegos chill, caóticos y de mesa.

## Ideas extendidas (numeradas)

1. [~] **Mapa interactivo de asociaciones y spots** — Leaflet + OSM montado con mock data y categorías.
2. [ ] **Calendario de eventos y ferias** — vista calendar + listado.
3. [~] **Sección educativa** (artículos, vídeos, guías cultivador, reducción de daños) — MDX o Sanity.
4. [ ] **Podcast / audio** — entrevistas embebidas (Spotify/iVoox).
5. [~] **Recetas cuina cannábica** — fotos + valoraciones comunidad + warnings dosificación.
6. [~] **Herramienta de seguimiento de cultivo** — riegos/fertilizantes/fases. Tipos `GrowLog` ya definidos.
7. [ ] **Alertas personalizadas de noticias legales** — suscripción por región.
8. [~] **Comparador de productos y precios / Afiliados** — semillas, vaporizadores, gears de setup.
9. [ ] **Gamificación** — logros, puntos por participar. Campo `profiles.points` ya en schema.
10. [ ] **Espacios privados / grupos temáticos** — cultivo interior, medicinal, recreativo. RLS en Supabase.
11. [ ] **Blog colaborativo** — los usuarios envían historias/experiencias.
12. [x] **Calculadora de dosis** — comestibles/extracciones según potencia. **Funcional sin backend** en `/herramientas/dosis`.
13. [ ] **Chat en tiempo real** — Supabase Realtime channels.
14. [ ] **Sistema de votaciones** — strains, productos, posts destacados. Tablas `votes` en schema.
15. [ ] **Integración con redes sociales** — share + Open Graph + meta cards.

## Transversales (no listadas pero necesarias)

- [x] Tema claro/oscuro
- [x] Age gate +18
- [~] Auth (UI + middleware, falta conectar a Supabase real)
- [ ] i18n catalán/español (decisión: empezar solo en es, añadir ca con next-intl en Fase 4)
- [ ] PWA / offline
- [ ] Notificaciones push (FCM)
- [ ] Moderación (queue + roles)
- [ ] Analytics (Plausible o PostHog)
- [ ] Tests (Vitest + Playwright)
- [ ] CI/CD (GitHub Actions)

## Prioridad sugerida tras Fase 2

1. Conectar Supabase real (auth + foro + strains desde BBDD).
2. Subida de fotos (avatar + posts foro + fotos grow log).
3. Mapa con datos reales de clubes y crowd-sourced spots.
4. Grow tracker conectado.
5. IA asistente (route handler streaming + Anthropic).
6. Gamificación (triggers en BBDD para sumar puntos).
7. Tienda (Stripe Checkout + pedidos).

