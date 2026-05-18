import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, User, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MOCK_BLOG_POSTS,
  BLOG_CATEGORIA_LABEL,
  BLOG_CATEGORIA_COLOR,
} from "@/data/blog";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return MOCK_BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = MOCK_BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return { title: "Artículo no encontrado" };
  return {
    title: post.titulo,
    description: post.extracto,
  };
}

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function renderContent(text: string) {
  return text.split("\n\n").map((block, i) => {
    if (block.startsWith("**") && block.endsWith("**")) {
      return (
        <h2 key={i} className="mt-8 mb-3 text-xl font-bold tracking-tight">
          {block.slice(2, -2)}
        </h2>
      );
    }
    // Inline bold within paragraph
    const parts = block.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={i} className="leading-relaxed text-foreground/90">
        {parts.map((part, j) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={j}>{part.slice(2, -2)}</strong>
          ) : (
            part
          ),
        )}
      </p>
    );
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = MOCK_BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const related = MOCK_BLOG_POSTS.filter(
    (p) => p.slug !== slug && p.categoria === post.categoria,
  ).slice(0, 3);

  return (
    <article className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      {/* Navegación atrás */}
      <Link
        href="/comunidad/blog"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="size-4" />
        Volver al blog
      </Link>

      {/* Cabecera del artículo */}
      <header className="mb-8">
        <Badge className={cn("border-0 text-[10px] mb-3", BLOG_CATEGORIA_COLOR[post.categoria])}>
          {BLOG_CATEGORIA_LABEL[post.categoria]}
        </Badge>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl leading-tight">
          {post.titulo}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground leading-relaxed">{post.extracto}</p>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <User className="size-3.5" />
            <span className="font-medium text-foreground">@{post.autor}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-3.5" />
            {formatFecha(post.fecha)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5" />
            {post.minutosLectura} min de lectura
          </span>
        </div>
      </header>

      <Separator className="mb-8" />

      {/* Contenido del artículo */}
      {post.contenido ? (
        <div className="prose-custom space-y-4">
          {renderContent(post.contenido)}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border bg-muted/20 px-6 py-10 text-center text-muted-foreground">
          <p className="text-sm">El contenido completo de este artículo estará disponible pronto.</p>
          <p className="mt-2 text-sm font-medium">{post.extracto}</p>
        </div>
      )}

      <Separator className="my-10" />

      {/* Banner de comunidad */}
      <div className="rounded-xl border border-emerald-200/50 dark:border-emerald-800/30 bg-emerald-50/50 dark:bg-emerald-950/20 px-5 py-5 text-center">
        <p className="text-sm font-semibold text-foreground">¿Tienes algo que contar?</p>
        <p className="mt-1 text-sm text-muted-foreground">
          El blog de WeedConnect es colaborativo. Inicia sesión y envía tu artículo para revisión.
        </p>
        <Link
          href="/auth/login"
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
        >
          Escribir artículo
        </Link>
      </div>

      {/* Artículos relacionados */}
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Artículos relacionados
          </h2>
          <ul className="space-y-3">
            {related.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/comunidad/blog/${r.slug}`}
                  className="group flex items-start gap-3 rounded-lg border border-border px-4 py-3 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-snug group-hover:text-brand-green dark:group-hover:text-brand-gold transition-colors">
                      {r.titulo}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{formatFecha(r.fecha)} · {r.minutosLectura} min</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
