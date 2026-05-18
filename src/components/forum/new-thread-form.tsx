"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { uploadImage, publicImageUrl, validateImageFile } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Image as ImageIcon, X } from "lucide-react";
import type { ForumCategory } from "@/lib/forum";

const MAX_PHOTOS = 4;
const LOCAL_KEY = "wc_local_threads";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

interface SelectedFile {
  file: File;
  preview: string;
}

export interface LocalThread {
  id: string;
  slug: string;
  title: string;
  body: string;
  created_at: string;
  category_name: string;
  category_slug: string;
}

export function NewThreadForm({
  categories,
  userId,
}: {
  categories: ForumCategory[];
  userId: string | null;
}) {
  const router = useRouter();
  const isDemo = userId === null;

  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [photos, setPhotos] = useState<SelectedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (files.length === 0) return;

    const remaining = MAX_PHOTOS - photos.length;
    if (files.length > remaining) {
      setError(`Solo puedes adjuntar hasta ${MAX_PHOTOS} fotos por hilo.`);
    }

    const accepted: SelectedFile[] = [];
    for (const file of files.slice(0, remaining)) {
      const validationError = validateImageFile(file);
      if (validationError) {
        setError(validationError);
        continue;
      }
      accepted.push({ file, preview: URL.createObjectURL(file) });
    }
    setPhotos((prev) => [...prev, ...accepted]);
  }

  function removePhoto(index: number) {
    setPhotos((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim() || !categoryId) return;
    setLoading(true);
    setError("");

    const slug = slugify(title);

    // Modo demo: guardar en localStorage
    if (isDemo) {
      const category = categories.find((c) => c.id === categoryId);
      const thread: LocalThread = {
        id: crypto.randomUUID(),
        slug,
        title: title.trim(),
        body: body.trim(),
        created_at: new Date().toISOString(),
        category_name: category?.name ?? "",
        category_slug: category?.slug ?? "",
      };
      const existing: LocalThread[] = JSON.parse(localStorage.getItem(LOCAL_KEY) ?? "[]");
      localStorage.setItem(LOCAL_KEY, JSON.stringify([thread, ...existing]));
      router.push(`/comunidad/foro/${slug}`);
      return;
    }

    // Modo Supabase
    const supabase = createClient();
    try {
      const mediaUrls: string[] = [];
      for (const { file } of photos) {
        const path = await uploadImage(supabase, "forum-photos", userId!, file);
        mediaUrls.push(publicImageUrl(supabase, "forum-photos", path));
      }

      const { error: err } = await supabase.from("forum_threads").insert({
        category_id: categoryId,
        author_id: userId,
        slug,
        title: title.trim(),
        body: body.trim(),
        media_urls: mediaUrls,
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

      photos.forEach((p) => URL.revokeObjectURL(p.preview));
      router.push(`/comunidad/foro/${slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo publicar el hilo.");
      setLoading(false);
    }
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

      {/* Fotos adjuntas — solo con Supabase */}
      {!isDemo && (
        <div className="space-y-2">
          <Label>Fotos (opcional)</Label>
          {photos.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {photos.map((item, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.preview} alt="Vista previa" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(idx)}
                    disabled={loading}
                    className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-black/60 text-white"
                    aria-label="Quitar foto"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={loading || photos.length >= MAX_PHOTOS}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={loading || photos.length >= MAX_PHOTOS}
            onClick={() => fileInputRef.current?.click()}
            className="gap-1.5"
          >
            <ImageIcon className="size-4" />
            Añadir fotos
          </Button>
          <p className="text-xs text-muted-foreground">
            Hasta {MAX_PHOTOS} imágenes · JPG, PNG, WEBP o GIF · máx. 5 MB cada una.
          </p>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading || !title.trim() || !body.trim()}>
          {loading ? "Publicando…" : isDemo ? "Guardar localmente" : "Publicar hilo"}
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
