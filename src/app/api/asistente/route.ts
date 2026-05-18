import { NextRequest } from "next/server";
import { streamText, tool, stepCountIs, createUIMessageStreamResponse, type UIMessageChunk } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { MOCK_STRAINS } from "@/data/strains";
import { getClubs } from "@/lib/clubs";
import { createClient } from "@/lib/supabase/server";
import type { Strain } from "@/types";

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

const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function findStrains(
  query?: string,
  tipo?: "indica" | "sativa" | "hybrid",
): Promise<Strain[]> {
  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      let req = supabase
        .from("strains")
        .select("id, name, slug, type, thc_pct, cbd_pct, flavors, effects, description, image_url");

      if (tipo) req = req.eq("type", tipo);
      if (query) req = req.ilike("name", `%${query}%`);

      const { data, error } = await req.limit(4);

      if (!error && data && data.length > 0) {
        return data.map(
          (s): Strain => ({
            id: s.id,
            name: s.name,
            slug: s.slug,
            type: s.type as Strain["type"],
            thcPct: s.thc_pct ?? undefined,
            cbdPct: s.cbd_pct ?? undefined,
            flavors: Array.isArray(s.flavors) ? s.flavors : [],
            effects: Array.isArray(s.effects) ? s.effects : [],
            description: s.description ?? "",
            imageUrl: s.image_url ?? undefined,
          }),
        );
      }
    } catch (e) {
      console.error("[asistente] Error buscando strains en Supabase:", e);
    }
  }

  // Fallback a mock data con filtros aplicados en memoria
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
}

function makeFallbackStream(text: string): ReadableStream<UIMessageChunk> {
  return new ReadableStream<UIMessageChunk>({
    start(controller) {
      const id = "fallback-1";
      controller.enqueue({ type: "start", messageId: "fallback-msg" });
      controller.enqueue({ type: "start-step" });
      controller.enqueue({ type: "text-start", id });
      controller.enqueue({ type: "text-delta", id, delta: text });
      controller.enqueue({ type: "text-end", id });
      controller.enqueue({ type: "finish-step" });
      controller.enqueue({ type: "finish", finishReason: "stop" });
      controller.close();
    },
  });
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return createUIMessageStreamResponse({
      stream: makeFallbackStream(
        "El asistente está echándose una siesta 💤\n\nFalta configurar la `ANTHROPIC_API_KEY` en el entorno del servidor. Añádela a tu archivo `.env.local` para empezar a charlar con **Bud**.",
      ),
    });
  }

  const { messages } = await req.json();

  const result = streamText({
    model: anthropic("claude-sonnet-4-6"),
    messages,
    system: SYSTEM_PROMPT,
    stopWhen: stepCountIs(5),
    tools: {
      buscarVariedades: tool({
        description:
          "Busca cepas/strains en WeedConnect por texto libre (nombre, sabor, efecto) y tipo (indica, sativa, hybrid).",
        inputSchema: z.object({
          query: z.string().optional().describe("Palabra clave a buscar"),
          tipo: z
            .enum(["indica", "sativa", "hybrid"])
            .optional()
            .describe("Tipo de variedad"),
        }),
        execute: async ({ query, tipo }) => findStrains(query, tipo),
      }),
      buscarClubes: tool({
        description: "Encuentra asociaciones y clubes cannábicos por ciudad.",
        inputSchema: z.object({
          ciudad: z.string().describe("Ciudad para buscar (ej. Barcelona, Madrid)"),
        }),
        execute: async ({ ciudad }) => {
          const clubs = await getClubs();
          return clubs.filter((c) => c.city.toLowerCase().includes(ciudad.toLowerCase())).slice(0, 4);
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
