import type { Metadata } from "next";
import Link from "next/link";
import { PenLine } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { MOCK_BLOG_POSTS } from "@/data/blog";
import { BlogBrowser } from "./blog-browser";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog colaborativo",
  description: "Artículos, experiencias y guías escritas por la comunidad WeedConnect.",
};

export default function BlogPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <PageHeader className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Blog</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Artículos, crónicas y guías escritas por la comunidad. Cultivo, ciencia, eventos y más.
          </p>
        </div>
        <Link
          href="/auth/login"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "shrink-0 gap-1.5")}
        >
          <PenLine className="size-3.5" />
          Escribir artículo
        </Link>
      </PageHeader>

      <BlogBrowser posts={MOCK_BLOG_POSTS} />

      <p className="mt-8 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3 text-center text-sm text-muted-foreground">
        ¿Quieres publicar? Crea una cuenta y envía tu artículo. El equipo de WeedConnect lo
        revisará antes de publicarlo.
      </p>
    </section>
  );
}

const PageHeader = "header";
