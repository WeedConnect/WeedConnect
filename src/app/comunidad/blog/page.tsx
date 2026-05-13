import type { Metadata } from "next";
import Link from "next/link";
import { Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import {
  MOCK_BLOG_POSTS,
  BLOG_CATEGORIA_LABEL,
  BLOG_CATEGORIA_COLOR,
} from "@/data/blog";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog colaborativo",
  description: "Artículos, experiencias y guías escritas por la comunidad WeedConnect.",
};

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogPage() {
  const destacados = MOCK_BLOG_POSTS.filter((p) => p.destacado);
  const resto = MOCK_BLOG_POSTS.filter((p) => !p.destacado);

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <header className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Blog</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Artículos, crónicas y guías escritas por la comunidad. Cultivo, ciencia, eventos y más.
          </p>
        </div>
        <Link
          href="/auth/login"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "shrink-0")}
        >
          Escribir artículo
        </Link>
      </header>

      {destacados.length > 0 && (
        <>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Destacados
          </h2>
          <ul className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {destacados.map((post) => (
              <li key={post.id}>
                <Card className="h-full border-emerald-200 dark:border-emerald-900/40">
                  <CardHeader className="pb-2">
                    <Badge
                      className={cn(
                        "self-start border-0 text-[10px]",
                        BLOG_CATEGORIA_COLOR[post.categoria],
                      )}
                    >
                      {BLOG_CATEGORIA_LABEL[post.categoria]}
                    </Badge>
                    <CardTitle className="mt-1 text-base leading-snug">{post.titulo}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-3 text-sm text-muted-foreground">{post.extracto}</p>
                    <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="size-3" />@{post.autor}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {post.minutosLectura} min
                      </span>
                    </div>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {formatFecha(post.fecha)}
                    </p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </>
      )}

      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Todos los artículos
      </h2>
      <ul className="flex flex-col divide-y divide-border rounded-lg border border-border">
        {resto.map((post) => (
          <li key={post.id} className="flex gap-4 px-4 py-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  className={cn("border-0 text-[10px]", BLOG_CATEGORIA_COLOR[post.categoria])}
                >
                  {BLOG_CATEGORIA_LABEL[post.categoria]}
                </Badge>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <User className="size-3" />@{post.autor}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="size-3" />
                  {post.minutosLectura} min
                </span>
                <span className="text-xs text-muted-foreground">{formatFecha(post.fecha)}</span>
              </div>
              <h3 className="mt-1 font-semibold leading-snug">{post.titulo}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{post.extracto}</p>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-8 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3 text-center text-sm text-muted-foreground">
        ¿Quieres publicar? Crea una cuenta y envía tu artículo. El equipo de WeedConnect lo
        revisará antes de publicarlo.
      </p>
    </section>
  );
}
