"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Suspense } from "react";
import { LogoWeedConnect } from "@/components/icons/logo-weedconnect";
import { NetworkBackground } from "@/components/ui/network-background";

const COOKIE = "wc_age_ok";
const ONE_YEAR = 60 * 60 * 24 * 365;

function AgeGateInner() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/";

  function accept() {
    document.cookie = `${COOKIE}=1; Path=/; Max-Age=${ONE_YEAR}; SameSite=Lax`;
    router.replace(next);
    router.refresh();
  }

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-12 bg-grid-dots">
      {/* Ambient Constellation Background */}
      <NetworkBackground speed={0.4} density={60} />
      
      {/* Decorative gradient blurs */}
      <div className="absolute top-1/4 left-1/4 -z-20 size-72 rounded-full bg-brand-gold/10 blur-3xl dark:bg-brand-gold/5 animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 -z-20 size-96 rounded-full bg-brand-green/10 blur-3xl dark:bg-emerald-600/5 animate-pulse-slow" style={{ animationDelay: "1.5s" }} />

      <div className="w-full max-w-md text-center glass-panel-premium border-gradient-gold rounded-3xl p-8 sm:p-10 flex flex-col items-center z-10">
        {/* Brand Logo & Icon */}
        <div className="mb-8 transform transition-all duration-500 hover:scale-[1.02] w-full max-w-[280px] mx-auto">
          <div className="relative overflow-hidden rounded-2xl border border-border/40 shadow-sm shadow-black/5 hover:shadow-md transition-all">
            <Image
              src="/images/logo_weedconnect.jpg"
              alt="WeedConnect Logo"
              width={300}
              height={150}
              priority
              className="object-cover aspect-[2/1] w-full h-auto"
            />
          </div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-6" />

        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 text-foreground">
          ¿Tienes 18 años o más?
        </h1>
        
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-8 px-2">
          WeedConnect es una plataforma tecnológica e informativa exclusiva para personas adultas. 
          Confirma tu edad para continuar al hub de la comunidad.
        </p>

        <div className="flex flex-col gap-3 w-full sm:px-4 mb-6">
          <Button 
            size="lg" 
            onClick={accept}
            className="w-full h-11 rounded-xl bg-brand-green text-white hover:bg-brand-green/90 dark:bg-gradient-to-r dark:from-brand-gold dark:to-brand-gold-dark dark:text-brand-green-deep font-semibold tracking-wide shadow-md shadow-brand-green/10 dark:shadow-brand-gold/20 transition-all duration-300"
          >
            Sí, soy mayor de edad
          </Button>
          <Link
            href="https://www.google.com"
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "w-full h-11 rounded-xl border-border/60 hover:bg-accent/10 transition-colors text-foreground/80"
            )}
          >
            No, salir
          </Link>
        </div>

        <div className="text-[11px] sm:text-xs text-muted-foreground leading-tight">
          <p className="mb-1">Al acceder aceptas el aviso legal y la política de privacidad.</p>
          <p className="opacity-60 font-medium text-brand-green dark:text-brand-gold-light">Consumo responsable · Reducción de daños</p>
        </div>
      </div>
    </div>
  );
}

export default function AgeGatePage() {
  return (
    <div className="flex flex-1 flex-col">
      <Suspense fallback={
        <div className="flex flex-1 items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-gold border-t-transparent"></div>
        </div>
      }>
        <AgeGateInner />
      </Suspense>
    </div>
  );
}
