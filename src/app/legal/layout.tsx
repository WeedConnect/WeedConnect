import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="border-b border-amber-300/60 bg-amber-50 px-4 py-3 dark:border-amber-700/40 dark:bg-amber-950/30">
        <div className="mx-auto flex max-w-4xl items-start gap-2 text-xs text-amber-800 dark:text-amber-200">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
          <span>
            <strong>Borrador legal:</strong> Este documento ha sido redactado con asistencia de IA como punto de partida.
            Se recomienda revisión por un abogado especializado en derecho digital, RGPD y LSSI-CE antes del lanzamiento público.
            Los datos entre [CORCHETES] deben completarse con información real.
          </span>
        </div>
      </div>
      {children}
    </>
  );
}
