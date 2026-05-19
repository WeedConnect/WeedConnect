import type { Metadata } from "next";
import Link from "next/link";
import { ShoppingBag, BarChart3 } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Tienda",
  description: "Merchandising y comparador de precios.",
};

const SECTIONS = [
  {
    href: "/tienda/merch",
    title: "Merchandising",
    description: "Ropa, accesorios y artículos de la comunidad WeedConnect.",
    icon: ShoppingBag,
  },
  {
    href: "/tienda/comparador",
    title: "Comparador de precios",
    description: "Compara precios de semillas, vaporizadores y accesorios entre tiendas verificadas.",
    icon: BarChart3,
  },
];

export default function TiendaPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <PageHeader className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Tienda</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Merchandising oficial y comparador de productos.
        </p>
      </PageHeader>
      <ul className="grid gap-4 sm:grid-cols-2">
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          return (
            <li key={s.href}>
              <Link href={s.href} className="block h-full">
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardHeader>
                    <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                      <Icon className="size-5" />
                    </div>
                    <CardTitle className="text-lg">{s.title}</CardTitle>
                    <CardDescription>{s.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

const PageHeader = "header";
