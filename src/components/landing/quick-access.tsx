import Link from "next/link";
import { MapPin, MessageSquare, Film, Pizza, BookOpen, Scale } from "lucide-react";
import { cn } from "@/lib/utils";

const QUICK_LINKS = [
  { href: "/mapa", label: "Ver mapa", icon: MapPin, color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/30" },
  { href: "/comunidad/foro", label: "Entrar al foro", icon: MessageSquare, color: "text-brand-gold-dark dark:text-brand-gold bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40 hover:bg-amber-100 dark:hover:bg-amber-900/20" },
  { href: "/info/peliculas", label: "Películas para hoy", icon: Film, color: "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/20 border-violet-200 dark:border-violet-800/40 hover:bg-violet-100 dark:hover:bg-violet-900/20" },
  { href: "/info/munchies", label: "Munchies", icon: Pizza, color: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800/40 hover:bg-orange-100 dark:hover:bg-orange-900/20" },
  { href: "/info/educacion", label: "Tips principiantes", icon: BookOpen, color: "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/20 border-sky-200 dark:border-sky-800/40 hover:bg-sky-100 dark:hover:bg-sky-900/20" },
  { href: "/info/legal", label: "Legal básico", icon: Scale, color: "text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800/30" },
];

export function QuickAccess() {
  return (
    <section className="border-y border-border/40 bg-muted/30">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <p className="mb-5 text-center text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
          Empieza por aquí
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {QUICK_LINKS.map(({ href, label, icon: Icon, color }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm",
                color,
              )}
            >
              <Icon className="size-3.5 shrink-0" />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
