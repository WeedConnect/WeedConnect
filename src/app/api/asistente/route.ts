import { NextRequest } from "next/server";
import { streamText, tool, stepCountIs } from "ai";
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
    stopWhen: stepCountIs(5),
    tools: {
      buscarVariedades: tool({
        description: "Busca cepas/strains en WeedConnect por texto libre (nombre, sabor, efecto) y tipo (indica, sativa, hybrid).",
        inputSchema: z.object({
          query: z.string().optional().describe("Palabra clave a buscar"),
          tipo: z.enum(["indica", "sativa", "hybrid"]).optional().describe("Tipo de variedad"),
        }),
        execute: async ({ query, tipo }: { query?: string; tipo?: "indica" | "sativa" | "hybrid" }) => {
          let res = MOCK_STRAINS;
          if (tipo) res = res.filter((s) => s.type === tipo);
          if (query) {
            const q = query.toLowerCase();
            res = res.filter(
              (s) =>
                s.name.toLowerCase().includes(q) ||
                s.effects.some((e) => e.toLowerCase().includes(q)) ||
                s.flavors.some((f) => f.toLowerCase().includes(q)),
            );
          }
          return res.slice(0, 4);
        },
      }),
      buscarClubes: tool({
        description: "Encuentra asociaciones y clubes cannábicos por ciudad.",
        inputSchema: z.object({
          ciudad: z.string().describe("Ciudad para buscar (ej. Barcelona, Madrid)"),
        }),
        execute: async ({ ciudad }: { ciudad: string }) => {
          const c = ciudad.toLowerCase();
          return MOCK_CLUBS.filter((club) => club.city.toLowerCase().includes(c)).slice(0, 4);
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
