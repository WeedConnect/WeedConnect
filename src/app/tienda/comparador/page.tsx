import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export const metadata: Metadata = { title: "Comparador de precios" };

export default function ComparadorPage() {
  return (
    <PagePlaceholder
      title="Comparador de precios"
      description="Compara semillas, vaporizadores y accesorios entre tiendas verificadas. Filtros por marca, tipo y rango de precio."
    />
  );
}
