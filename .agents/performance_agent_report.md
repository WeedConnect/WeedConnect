# ⚡ Informe de Rendimiento (PerfAgent)

**Proyecto**: WeedConnect
**Fecha**: 2026-05-13
**Estado**: 🟢 EXCELENTE (Buenas prácticas aplicadas correctamente)

---

## 📊 Diagnóstico Rápido

- **Lazy Loading / Code Splitting**: 🟢 Óptimo (Leaflet desacoplado vía dynamic con `ssr: false`).
- **Renderizado de Imágenes**: 🟢 Correcto (Sin uso indebido de `<img />` sin optimizar).
- **Uso de Client Components (`"use client"`)**: 🟡 Aceptable (Pocas páginas son 100% cliente, la mayoría son server-first).
- **Estrategia de Data Fetching**: 🟢 Previsto de manera óptima (Mock data lista para ser sustituida por Direct Supabase Queries).

---

## 🔍 Hallazgos Detallados

### 🟢 [OPTIMIZADO] Carga Perezosa del Mapa (`src/app/mapa/map-view.tsx`)
Una de las mayores penalizaciones de rendimiento en webs que usan mapas es cargar librerías como **Leaflet** de manera síncrona. 
*   **Evaluación**: Se está utilizando perfectamente `dynamic(() => import('./clubs-map'), { ssr: false })`.
*   **Beneficio**: Esto remueve cerca de ~150kb de JavaScript del bundle principal del Home y del resto del sitio, descargándose únicamente cuando el usuario visita de forma intencionada la ruta `/mapa`. 
*   **Recomendación**: El spinner/skeleton fallback definido en `loading: () => ...` es limpio y previene cambios de layout (Cumulative Layout Shift).

---

### 🟢 [BUENA PRÁCTICA] Uso de Server Components en el Detalle (`[slug]/page.tsx`)
La arquitectura híbrida de Next.js 16 se aprovecha bien.
*   **Evaluación**: Rutas como `/strains/[slug]` y `/strains/page.tsx` están definidas como componentes de servidor asíncronos.
*   **Beneficio**: El parseo de Markdown, la lectura de base de datos y la generación inicial de HTML suceden en el servidor, devolviendo el contenido al navegador en milisegundos y reduciendo a cero la carga de CPU del cliente para pintar estas páginas.

---

### 🟡 [OPORTUNIDAD] Oportunidad con `next/image` para fotos futuras
Actualmente, en la fase mock del proyecto, no se están renderizando las imágenes de las cepas en el catálogo ni en el perfil.
*   **Advertencia futura**: Cuando se conecte Supabase Storage (`strain-photos`, `grow-photos`), es crítico evitar usar tags HTML planos `<img src={supabaseUrl} />`.
*   **Recomendación**: Emplear `<Image />` de `next/image` configurando el dominio del Storage de Supabase en `next.config.ts` para beneficiarse de redimensionado dinámico y formato `.webp` automático en CDN.

---

## 💡 Próximos Pasos Prioritarios

1.  **Corto Plazo**: Cuando se activen las imágenes en la Base de Datos, configurar el patrón de optimización de dominios en `next.config.ts` para imágenes de Supabase Storage.
2.  **Medio Plazo**: Implementar prefetching de links críticos usando hover o viewport (Next.js lo hace por defecto, verificar que los links custom no rompan este comportamiento).
