import Link from "next/link";
import { WifiOff, Leaf } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RetryButton } from "./retry-button";

export default function OfflinePage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="relative">
        <div className="rounded-full bg-muted/50 p-6">
          <WifiOff className="size-12 text-muted-foreground" />
        </div>
        <div className="absolute -bottom-1 -right-1 rounded-full bg-brand-green/10 p-2">
          <Leaf className="size-5 text-brand-green dark:text-brand-gold" />
        </div>
      </div>

      <div className="space-y-2 max-w-sm">
        <h1 className="text-2xl font-bold tracking-tight">Sin conexión</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Parece que no tienes acceso a Internet en este momento. Comprueba tu conexión
          y vuelve a intentarlo.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <RetryButton />
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "gap-2")}>
          <Leaf className="size-4" />
          Inicio
        </Link>
      </div>

      <p className="text-xs text-muted-foreground max-w-xs">
        Algunas páginas visitadas anteriormente pueden estar disponibles en modo sin conexión
        gracias a la caché del navegador.
      </p>
    </div>
  );
}
