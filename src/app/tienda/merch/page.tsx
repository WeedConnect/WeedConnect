import type { Metadata } from "next";
import { ShoppingBag, Package, Tag, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Merchandising — WeedConnect",
  description: "Ropa, accesorios y artículos oficiales de WeedConnect. Próximamente.",
};

const MOCK_PRODUCTOS = [
  { id: "1", nombre: "Camiseta WeedConnect Logo", precio: 29.99, categoria: "ropa", emoji: "👕", disponible: false },
  { id: "2", nombre: "Sudadera Hoodie Leaf", precio: 54.99, categoria: "ropa", emoji: "👕", disponible: false },
  { id: "3", nombre: "Gorra Snapback verde", precio: 24.99, categoria: "accesorios", emoji: "🧢", disponible: false },
  { id: "4", nombre: "Tote bag ecológica", precio: 14.99, categoria: "accesorios", emoji: "👜", disponible: false },
  { id: "5", nombre: "Pack semillas artesanales", precio: 19.99, categoria: "semillas", emoji: "🌱", disponible: false },
  { id: "6", nombre: "Grinder de aluminio WC", precio: 34.99, categoria: "accesorios", emoji: "⚙️", disponible: false },
];

const CATEGORIAS = ["ropa", "accesorios", "semillas"];

export default function MerchPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="mb-8 flex items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Merchandising</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Ropa, accesorios y artículos oficiales de WeedConnect. La tienda estará activa cuando
            el proyecto esté en producción.
          </p>
        </div>
      </header>

      <div className="mb-6 flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-4 text-sm dark:border-blue-900 dark:bg-blue-950/30">
        <Info className="mt-0.5 size-4 shrink-0 text-blue-600" aria-hidden />
        <span className="text-blue-800 dark:text-blue-200">
          La tienda está en desarrollo. Los artículos que ves son una previsión del catálogo.
          Pagos con Stripe — disponible cuando el proyecto salga a producción.
        </span>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_PRODUCTOS.map((p) => (
          <li key={p.id}>
            <Card className="h-full opacity-75">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-3xl" aria-hidden>{p.emoji}</span>
                  <Badge variant="secondary" className="text-[10px]">
                    {p.categoria}
                  </Badge>
                </div>
                <CardTitle className="text-base">{p.nombre}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-lg font-bold text-emerald-600">
                    <Tag className="size-4" />
                    {p.precio.toFixed(2)} €
                  </span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                    Próximamente
                  </span>
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex items-center gap-4 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-4">
        <ShoppingBag className="size-8 shrink-0 text-muted-foreground/40" aria-hidden />
        <div>
          <p className="font-medium">¿Quieres recibir una notificación cuando la tienda abra?</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Crea una cuenta y activa las alertas desde tu perfil. Serás el primero en saberlo.
          </p>
        </div>
      </div>
    </section>
  );
}
