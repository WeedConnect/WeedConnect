"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaRegister() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Registrar service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    // Capturar el evento de instalación del navegador
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      // Mostrar el banner solo si el usuario no lo ha descartado antes
      const dismissed = sessionStorage.getItem("pwa-banner-dismissed");
      if (!dismissed) setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false);
      setInstallPrompt(null);
    }
  }

  function handleDismiss() {
    setShowBanner(false);
    sessionStorage.setItem("pwa-banner-dismissed", "1");
  }

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-2xl border border-border bg-background/95 px-4 py-3 shadow-xl backdrop-blur-sm max-w-sm w-[calc(100%-2rem)] sm:w-auto">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-green/10 dark:bg-brand-gold/10">
        <Download className="size-4 text-brand-green dark:text-brand-gold" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-foreground leading-tight">Instalar WeedConnect</p>
        <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">
          Accede más rápido desde tu pantalla de inicio
        </p>
      </div>
      <button
        onClick={handleInstall}
        className="shrink-0 rounded-lg bg-brand-green dark:bg-brand-gold px-3 py-1.5 text-xs font-semibold text-white dark:text-black transition-opacity hover:opacity-90"
      >
        Instalar
      </button>
      <button
        onClick={handleDismiss}
        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Cerrar"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
