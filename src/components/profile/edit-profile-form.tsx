"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { updateProfile } from "@/app/actions/profile";
import { uploadImage, publicImageUrl, validateImageFile } from "@/lib/storage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Camera, Loader2, X } from "lucide-react";

interface EditProfileFormProps {
  userId: string;
  profile: {
    username: string;
    display_name: string | null;
    bio: string | null;
    avatar_url: string | null;
  };
}

export function EditProfileForm({ userId, profile }: EditProfileFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState(profile.display_name ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile.avatar_url);
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fallback = (profile.display_name || profile.username).slice(0, 2).toUpperCase();
  const shownAvatar = previewUrl ?? avatarUrl ?? undefined;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setNewAvatarFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function clearNewAvatar() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setNewAvatarFile(null);
    setPreviewUrl(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        let finalAvatarUrl = avatarUrl;

        if (newAvatarFile) {
          const supabase = createClient();
          const path = await uploadImage(supabase, "avatars", userId, newAvatarFile);
          finalAvatarUrl = publicImageUrl(supabase, "avatars", path);
        }

        const result = await updateProfile({
          displayName,
          bio,
          avatarUrl: finalAvatarUrl,
        });

        if (result.success) {
          if (previewUrl) URL.revokeObjectURL(previewUrl);
          setAvatarUrl(finalAvatarUrl);
          setNewAvatarFile(null);
          setPreviewUrl(null);
          router.push(`/perfil/${result.username}`);
          router.refresh();
        } else {
          setError(result.error || "No se pudieron guardar los cambios.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error inesperado al guardar.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative shrink-0">
          <Avatar className="size-24 border border-border">
            <AvatarImage src={shownAvatar} alt={profile.username} className="object-cover" />
            <AvatarFallback className="bg-brand-green text-white dark:bg-brand-gold dark:text-brand-green-deep text-xl font-bold">
              {fallback}
            </AvatarFallback>
          </Avatar>
          {newAvatarFile && (
            <button
              type="button"
              onClick={clearNewAvatar}
              disabled={isPending}
              className="absolute -top-1 -right-1 size-6 rounded-full bg-destructive text-white flex items-center justify-center shadow-sm"
              aria-label="Quitar foto seleccionada"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
        <div className="space-y-1.5">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={isPending}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={() => fileInputRef.current?.click()}
            className="gap-1.5"
          >
            <Camera className="size-4" />
            Cambiar foto
          </Button>
          <p className="text-xs text-muted-foreground">JPG, PNG, WEBP o GIF · máx. 5 MB</p>
        </div>
      </div>

      {/* Nombre visible */}
      <div className="space-y-1.5">
        <Label htmlFor="display-name">Nombre visible</Label>
        <Input
          id="display-name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder={profile.username}
          maxLength={60}
          disabled={isPending}
        />
        <p className="text-xs text-muted-foreground">
          Tu nombre de usuario (@{profile.username}) no cambia.
        </p>
      </div>

      {/* Biografía */}
      <div className="space-y-1.5">
        <Label htmlFor="bio">Biografía</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Cuéntale a la comunidad sobre ti, tu experiencia cultivando…"
          rows={4}
          maxLength={500}
          disabled={isPending}
        />
        <p className="text-xs text-muted-foreground text-right">{bio.length} / 500</p>
      </div>

      {error && <p className="text-sm text-destructive font-medium">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending} className="gap-1.5">
          {isPending && <Loader2 className="size-4 animate-spin" />}
          {isPending ? "Guardando…" : "Guardar cambios"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
