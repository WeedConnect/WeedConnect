"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { ForumCategory } from "@/lib/forum";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export function NewThreadForm({
  categories,
  userId,
}: {
  categories: ForumCategory[];
  userId: string;
}) {
  const router = useRouter();
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim() || !categoryId) return;
    setLoading(true);
    setError("");

    const slug = slugify(title);
    const supabase = createClient();

    const { error: err } = await supabase.from("forum_threads").insert({
      category_id: categoryId,
      author_id: userId,
      slug,
      title: title.trim(),
      body: body.trim(),
    });

    if (err) {
      setError(
        err.message.includes("unique")
          ? "Ya existe un hilo con un título muy similar en esa categoría. Prueba a ser más específico."
          : err.message,
      );
      setLoading(false);
      return;
    }

    router.push(`/comunidad/foro/${slug}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="category">Categoría</Label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          required
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="¿De qué trata tu hilo?"
          required
          maxLength={150}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="body">Contenido</Label>
        <Textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Explica tu pregunta, experiencia o tema con detalle…"
          rows={7}
          required
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading || !title.trim() || !body.trim()}>
          {loading ? "Publicando…" : "Publicar hilo"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
