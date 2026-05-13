# 🤖 Tarea de Implementación: Evolucionar Asistente IA a Agente Avanzado con Vercel AI SDK y Tools

## 📋 Contexto y Objetivo
Estás trabajando en el proyecto **WeedConnect** (Next.js 16 + React 19 + Tailwind 4 + Shadcn UI base-nova).
Actualmente existe una interfaz de chat básica en `src/app/herramientas/asistente/chat.tsx` y un endpoint en `src/app/api/asistente/route.ts` que utiliza `@anthropic-ai/sdk` sin soporte para herramientas ni markdown interactivo.

**Objetivo**: Transformar el chat básico en un **Agente Inteligente Multi-Herramienta** que utilice **Vercel AI SDK v6**, con capacidad para buscar cepas (strains) y clubes locales usando la base de datos mock y renderizar las respuestas con Markdown enriquecido.

---

## 🛠️ Instrucciones Paso a Paso

### Paso 1: Instalación de Dependencias
Ejecuta el siguiente comando para instalar el SDK de Vercel y las dependencias necesarias para React 19. Asegúrate de incluir `CI=true` como lo estipula `CLAUDE.md`.

```bash
CI=true pnpm add ai @ai-sdk/anthropic zod react-markdown
```

---

### Paso 2: Refactorizar el Backend (`src/app/api/asistente/route.ts`)
Reemplaza todo el contenido del route handler para que use `streamText` del SDK de Vercel AI e implemente las herramientas (`tools`) usando Zod.

#### Requisitos del Backend:
- Utiliza `MOCK_STRAINS` de `@/data/strains` y `MOCK_CLUBS` de `@/data/clubs`.
- Configura el prompt del sistema para que sea profesional, informativo y aplique disclaimers de salud/legal.
- Crea dos tools clave:
  1. `buscarVariedades`: Filtra por nombre, tipo (indica/sativa/hybrid), sabores o efectos.
  2. `buscarClubes`: Busca por ciudad (Barcelona, Madrid, Girona, etc.).
- Habilita `maxSteps: 5` en `streamText` para permitir llamadas encadenadas de herramientas.

#### Estructura del Código Sugerida:
```typescript
import { NextRequest } from "next/server";
import { streamText, tool } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { MOCK_STRAINS } from "@/data/strains";
import { MOCK_CLUBS } from "@/data/clubs";

export const runtime = "nodejs";
export const maxDuration = 30;

const SYSTEM_PROMPT = `Eres el Asistente WeedConnect, un agente experto en cannabis.
Tus funciones principales son:
1. Recomendar variedades de marihuana usando la herramienta 'buscarVariedades'.
2. Buscar clubes sociales de cannabis locales usando la herramienta 'buscarClubes'.
3. Asesorar sobre técnicas de cultivo autónomo y reducción de daños.

🚨 REGLAS DE ORO:
- La plataforma es ESTRICTAMENTE INFORMATIVA. No fomenta el consumo ni el tráfico.
- Añade siempre el aviso: "La información sobre cultivo y dosis es meramente orientativa."
- Para temas de salud, recomienda visitar a un profesional médico.
- Toda la información legal se refiere al marco legal vigente en España/Europa y no es asesoramiento jurídico formal.
- Responde en Markdown formateado con listas o tablas cuando sea útil.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Falta ANTHROPIC_API_KEY." }), { status: 503 });
  }

  const { messages } = await req.json();

  const result = streamText({
    model: anthropic("claude-3-5-sonnet-20241022"),
    messages,
    system: SYSTEM_PROMPT,
    maxSteps: 5,
    tools: {
      buscarVariedades: tool({
        description: "Busca cepas/strains en WeedConnect por texto libre (nombre, sabor, efecto) y tipo (indica, sativa, hybrid).",
        parameters: z.object({
          query: z.string().optional().describe("Palabra clave a buscar"),
          tipo: z.enum(["indica", "sativa", "hybrid"]).optional().describe("Tipo de variedad"),
        }),
        execute: async ({ query, tipo }) => {
          let res = MOCK_STRAINS;
          if (tipo) res = res.filter(s => s.type === tipo);
          if (query) {
            const q = query.toLowerCase();
            res = res.filter(s => 
              s.name.toLowerCase().includes(q) || 
              s.effects.some(e => e.toLowerCase().includes(q)) ||
              s.flavors.some(f => f.toLowerCase().includes(q))
            );
          }
          return res.slice(0, 4);
        },
      }),
      buscarClubes: tool({
        description: "Encuentra asociaciones y clubes cannábicos por ciudad.",
        parameters: z.object({
          ciudad: z.string().describe("Ciudad para buscar (ej. Barcelona, Madrid)"),
        }),
        execute: async ({ ciudad }) => {
          const c = ciudad.toLowerCase();
          return MOCK_CLUBS.filter(club => club.city.toLowerCase().includes(c)).slice(0, 4);
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
```

---

### Paso 3: Refactorizar el Frontend (`src/app/herramientas/asistente/chat.tsx`)
Rediseña el componente cliente para integrarse con `useChat` de `ai/react`.

#### Requisitos del Frontend:
1. **Importación del Hook**: Sustituye la lógica manual de `fetch` y `ReadableStream` por `const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({ api: '/api/asistente' });`.
2. **Render de Markdown**: En los globos de mensaje del asistente, usa `<ReactMarkdown className="prose prose-sm dark:prose-invert prose-emerald break-words">` para mostrar la respuesta.
3. **Estados de las Herramientas**: Renderiza `toolInvocations` dentro de la burbuja del asistente para que el usuario sepa qué está haciendo el bot:
   - Si el estado es `'call'`, muestra un spinner con texto: *"Buscando variedades..."*
   - Si el estado es `'result'`, muestra un check sutil: *"✓ Búsqueda completada."*
4. **Estilo del Chat**: Mantén la consistencia con el diseño Tailwind v4 del proyecto:
   - Globos del usuario: `bg-emerald-600 text-white rounded-2xl rounded-tr-sm`.
   - Globos del asistente: `bg-muted dark:bg-muted/50 text-foreground rounded-2xl rounded-tl-sm`.
   - Fuente: `Geist Sans` integrada por defecto.

---

### Paso 4: Control de Calidad y Verificación
- Valida que todo el texto visible esté en **Español**.
- Asegúrate de que el disclaimer "+18 / Información orientativa" siga presente en la barra inferior de la caja de texto.
- Comprueba la compilación con `pnpm run build` para garantizar que no existan hydration mismatches.
