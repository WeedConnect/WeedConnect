import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const PROHIBICIONES = [
  "Compraventa de sustancias",
  "Contactos tipo dealer o camello",
  "Publicar Telegram, WhatsApp, teléfonos",
  "Precios, delivery o intermediación",
  'Mensajes tipo "vendo", "busco", "quién tiene"',
];

const VALORES = [
  "Cultura cannábica y reducción de daños",
  "Información veraz y científica",
  "Respeto y comunidad sin drama",
  "Espacio seguro sin comercio",
];

export function CommunityRules() {
  return (
    <section className="bg-emerald-950 dark:bg-emerald-950/60 text-white">
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="flex flex-col items-center gap-8 text-center lg:flex-row lg:text-left lg:gap-16">
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-center lg:justify-start gap-2.5">
              <ShieldCheck className="size-6 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Una comunidad sin malos rollos
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl text-white leading-tight">
              Normas claras para todos
            </h2>
            <p className="text-emerald-100/70 text-sm leading-relaxed max-w-md mx-auto lg:mx-0">
              WeedConnect es una plataforma cultural e informativa. No somos un mercado, no somos un foro de compraventa y no toleramos intermediación de ningún tipo.
            </p>
            <Link
              href="/comunidad/normas"
              className={cn(
                buttonVariants({ size: "sm" }),
                "mt-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-400 border-0 font-semibold",
              )}
            >
              Ver normas completas <ArrowRight className="ml-1.5 size-3.5" />
            </Link>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md lg:max-w-none">
            <div className="space-y-2.5">
              <p className="text-xs font-bold uppercase tracking-widest text-red-400 mb-3">
                Prohibido
              </p>
              {PROHIBICIONES.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-2 text-sm text-emerald-100/80"
                >
                  <span className="mt-0.5 size-4 shrink-0 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-[10px] font-black">✕</span>
                  {item}
                </div>
              ))}
            </div>
            <div className="space-y-2.5">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-3">
                Nuestros valores
              </p>
              {VALORES.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-2 text-sm text-emerald-100/80"
                >
                  <span className="mt-0.5 size-4 shrink-0 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-black">✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
