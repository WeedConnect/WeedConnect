import type { Metadata } from "next";
import { GrowTracker } from "./grow-tracker";

export const metadata: Metadata = {
  title: "Seguimiento de cultivo",
  description: "Registra cada cultivo con sus riegos, fases, nutrientes y notas. Guarda todo en tu navegador.",
  openGraph: {
    title: "Grow Tracker · WeedConnect",
    description: "Diario de cultivo con fases, riegos, nutrientes y fotos. Funciona sin cuenta, sincroniza con la nube.",
    images: [{ url: `/api/og?title=${encodeURIComponent("Grow Tracker")}&description=${encodeURIComponent("Diario de cultivo: fases, riegos, nutrientes y fotos privadas.")}`, width: 1200, height: 630 }],
  },
};

export default function CultivoPage() {
  return <GrowTracker />;
}
