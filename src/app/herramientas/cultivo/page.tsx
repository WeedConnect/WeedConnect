import type { Metadata } from "next";
import { GrowTracker } from "./grow-tracker";

export const metadata: Metadata = {
  title: "Seguimiento de cultivo",
  description: "Registra cada cultivo con sus riegos, fases, nutrientes y notas. Guarda todo en tu navegador.",
};

export default function CultivoPage() {
  return <GrowTracker />;
}
