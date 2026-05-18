"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type BlogPost,
  type BlogCategoria,
  BLOG_CATEGORIA_LABEL,
  BLOG_CATEGORIA_COLOR,
} from "@/data/blog";
import { cn } from "@/lib/utils";

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BlogBrowser({ posts }: { posts: BlogPost[] }) {
  const [activeCategory, setActiveCategory] = useState<BlogCategoria | "todos">("todos");

  const categorias = [...new Set(posts.map((p) => p.categoria))].sort() as BlogCategoria[];

  const filtered = activeCategory === "todos"
    ? posts
    : posts.filter((p) => p.categoria === activeCategory);

  const destacados = filtered.filter((p) => p.destacado);
  const resto = filtered.filter((p) => !p.destacado);

  return (
    <>
      {/* Filtro de categorías */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory("todos")}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold border transition-colors",
            activeCategory === "todos"
              ? "bg-foreground text-background border-foreground"
              : "bg-transparent text-muted-foreground border-border hover:border-foreground/40",
          )}
        >
          Todos
        </button>
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(activeCategory === cat ? "todos" : cat)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold border transition-colors",
              activeCategory === cat
                ? cn(BLOG_CATEGORIA_COLOR[cat], "border-transparent")
                : "bg-transparent text-muted-foreground border-border hover:border-foreground/40",
            )}
          >
            {BLOG_CATEGORIA_LABEL[cat]}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-muted-foreground">
          No hay artículos en esta categoría todavía.
        </p>
      )}

      {destacados.length > 0 && (
        <>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Destacados
          </h2>
          <ul className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {destacados.map((post) => (
              <li key={post.id}>
                <Link href={`/comunidad/blog/${post.slug}`} className="group block h-full">
                  <Card className="h-full border-emerald-200 dark:border-emerald-900/40 transition-shadow group-hover:shadow-md group-hover:-translate-y-0.5 transition-transform">
                    <CardHeader className="pb-2">
                      <Badge
                        className={cn(
                          "self-start border-0 text-[10px]",
                          BLOG_CATEGORIA_COLOR[post.categoria],
                        )}
                      >
                        {BLOG_CATEGORIA_LABEL[post.categoria]}
                      </Badge>
                      <CardTitle className="mt-1 text-base leading-snug group-hover:text-brand-green dark:group-hover:text-brand-gold transition-colors">
                        {post.titulo}
                      </CardTitle>
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
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      {resto.length > 0 && (
        <>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {destacados.length > 0 ? "Más artículos" : "Artículos"}
          </h2>
          <ul className="flex flex-col divide-y divide-border rounded-lg border border-border">
            {resto.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/comunidad/blog/${post.slug}`}
                  className="group flex gap-4 px-4 py-4 hover:bg-muted/30 transition-colors"
                >
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
                    <h3 className="mt-1 font-semibold leading-snug group-hover:text-brand-green dark:group-hover:text-brand-gold transition-colors">
                      {post.titulo}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{post.extracto}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
