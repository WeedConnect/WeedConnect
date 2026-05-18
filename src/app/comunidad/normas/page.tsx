import type { Metadata } from "next";
import { ShieldCheck, Ban, CheckCircle2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Normas de la Comunidad — WeedConnect",
  description:
    "Reglas y valores de la comunidad WeedConnect. Prohibida la compraventa, contactos para conseguir sustancias e intermediación. Comunidad de cultura, información y entretenimiento.",
};

const PROHIBIDO = [
  "Compraventa de cannabis, sustancias o cualquier producto ilegal.",
  "Pedir o compartir contactos para conseguir sustancias (teléfonos, Telegram, WhatsApp, redes sociales con ese fin).",
  "Publicar precios, condiciones de venta, zonas de entrega o cualquier dato que facilite transacciones.",
  "Usar términos como 'vendo', 'compro', 'busco', 'dealer', 'pillar', 'gramos', 'delivery' en ese contexto.",
  "Intermediación de cualquier tipo entre compradores y vendedores.",
  "Contenido relacionado con menores de edad.",
  "Acoso, insultos, amenazas o contenido violento hacia cualquier persona.",
  "Dar consejos para evadir controles policiales, ocultar actividades ilegales o engañar a autoridades.",
  "Spam, publicidad no autorizada o contenido repetitivo con fines comerciales.",
  "Desinformación médica o consejos de salud sin respaldo científico.",
];

const PERMITIDO = [
  "Hablar de cultura cannábica: películas, música, juegos, arte y entretenimiento.",
  "Compartir experiencias personales de forma respetuosa y sin incitar al consumo.",
  "Debatir sobre el marco legal cannábico en distintos países y CCAA.",
  "Preguntas sobre strains, terpenos, cannabinoides y efectos desde un enfoque informativo.",
  "Consejos de reducción de daños y bienestar.",
  "Hablar sobre técnicas de cultivo legal para uso personal donde aplique.",
  "Recomendaciones gastronómicas (munchies), recetas y planes de ocio.",
  "Compartir noticias y artículos de fuentes verificadas.",
  "Preguntas de principiantes sobre la plataforma o sobre cultura cannábica.",
  "Feedback, sugerencias y mejoras para la comunidad.",
];

const VALORES = [
  {
    titulo: "Respeto",
    descripcion: "Trata a todos los miembros con respeto, independientemente de su experiencia, opinión o forma de consumir.",
  },
  {
    titulo: "Responsabilidad",
    descripcion: "Somos responsables de lo que publicamos. Piensa antes de escribir si tu mensaje podría perjudicar a alguien.",
  },
  {
    titulo: "Información, no incitación",
    descripcion: "WeedConnect es una plataforma informativa. No fomentamos el consumo, facilitamos el conocimiento.",
  },
  {
    titulo: "Reducción de daños",
    descripcion: "Creemos en la información como herramienta de salud pública, no en el sensacionalismo ni en el negacionismo.",
  },
];

export default function NormasPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 animate-in fade-in duration-500">
      <header className="mb-10">
        <div className="flex items-center gap-2 text-emerald-600 mb-2">
          <ShieldCheck className="size-6" />
          <span className="text-xs font-bold uppercase tracking-wider">Comunidad</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Normas de la comunidad</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground leading-relaxed">
          WeedConnect es una comunidad de cultura, información y entretenimiento cannábico.{" "}
          <strong className="text-foreground">No permitimos compraventa, contactos para conseguir sustancias ni ningún tipo de intermediación.</strong>{" "}
          Estas normas son de obligado cumplimiento para todos los usuarios.
        </p>
      </header>

      {/* Aviso principal */}
      <div className="mb-8 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/60 dark:border-amber-900/40 dark:bg-amber-950/20 px-4 py-4">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600" />
        <p className="text-sm text-foreground/90 leading-relaxed">
          <strong className="text-amber-700 dark:text-amber-400">Importante:</strong> El incumplimiento de estas normas puede resultar en la eliminación del contenido, suspensión temporal o baneo permanente de la cuenta. En casos graves, WeedConnect colaborará con las autoridades competentes.
        </p>
      </div>

      {/* Lo que está prohibido */}
      <Card className="mb-8 border-red-200 dark:border-red-950/40">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-red-700 dark:text-red-400">
            <Ban className="size-5" />
            Está prohibido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-3">
            {PROHIBIDO.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-red-500" aria-hidden />
                <span className="text-foreground/85">{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Lo que está permitido */}
      <Card className="mb-8 border-emerald-200 dark:border-emerald-950/40">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="size-5" />
            Está permitido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-3">
            {PERMITIDO.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-emerald-500" aria-hidden />
                <span className="text-foreground/85">{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Valores */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-bold">Nuestros valores</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {VALORES.map((v) => (
            <div
              key={v.titulo}
              className="rounded-xl border border-border/60 bg-muted/30 px-4 py-4"
            >
              <Badge className="mb-2 border-0 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 text-[10px] font-bold uppercase tracking-wide">
                {v.titulo}
              </Badge>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.descripcion}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Moderación */}
      <div className="rounded-xl border border-border bg-muted/20 px-5 py-5 text-sm leading-relaxed text-muted-foreground">
        <p className="font-semibold text-foreground mb-1">Sistema de moderación</p>
        <p>
          WeedConnect utiliza un sistema combinado de moderación automática y revisión humana. Los contenidos que detectemos como posible compraventa o intermediación serán bloqueados automáticamente. Si crees que tu publicación fue bloqueada por error, contacta con el equipo de moderación desde tu perfil.
        </p>
        <p className="mt-2">
          Todos los usuarios pueden reportar contenido inapropiado usando el botón de reporte disponible en cada publicación y comentario.
        </p>
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Última actualización: mayo 2026 · WeedConnect se reserva el derecho de actualizar estas normas cuando sea necesario.
      </p>
    </section>
  );
}
