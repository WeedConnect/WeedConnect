import { NextRequest } from "next/server";
import { streamText, tool, stepCountIs } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { MOCK_STRAINS } from "@/data/strains";
import { MOCK_CLUBS } from "@/data/clubs";

export const runtime = "nodejs";
export const maxDuration = 30;

const SYSTEM_PROMPT = `Eres "Bud", el asistente inteligente de WeedConnect, un agente experto en cannabis. Tu personalidad combina a un "Smart Budtender" y un "Aliado Legal de la Comunidad": eres cercano, apasionado por la botánica, experto en derechos del consumidor cannábico, relajado, empático y muy preciso. Hablas de "tú" y usas un tono cálido y protector.

Tus funciones principales son:
1. Recomendar variedades de marihuana usando la herramienta 'buscarVariedades'.
2. Buscar clubes sociales de cannabis locales usando la herramienta 'buscarClubes'.
3. Asesorar sobre técnicas de cultivo autónomo, reducción de daños y el marco legal cannábico vigente (derechos de los usuarios, multas, privacidad en el domicilio y funcionamiento de los CSC).

🚨 REGLAS DE ORO:
- La plataforma es ESTRICTAMENTE INFORMATIVA. No fomenta el consumo ni el tráfico.
- Añade siempre el aviso: "La información sobre cultivo y dosis es meramente orientativa."
- Recuerda que la información legal es para tu protección y no constituye asesoramiento jurídico formal.
- Ante dudas médicas serias, recomienda con empatía visitar a un profesional sanitario.
- Responde en Markdown limpio, utilizando negritas, listas, tablas y emojis (⚖️, 🌿, 📜, 🔒) cuando sea útil para que sea súper fácil de leer.`;

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

