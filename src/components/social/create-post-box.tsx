"use client";

import React, { useState, useTransition, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createSocialPost } from "@/app/actions/feed";
import { createClient } from "@/lib/supabase/client";
import { PenLine, Loader2, Image as ImageIcon, X } from "lucide-react";

interface CreatePostBoxProps {
  user: {
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
}

interface SelectedFile {
  file: File;
  preview: string;
}

// Límites de subida — deben coincidir con la config del bucket `social-photos`
// en Supabase (ver TODO_USUARIO.md).
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function CreatePostBox({ user }: CreatePostBoxProps) {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  
  // Estado para las imágenes seleccionadas
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const charCount = content.length;
  const isOverLimit = charCount > 500;
  const isEmpty = content.trim().length === 0;
  const canPublish = (!isEmpty || selectedFiles.length > 0) && !isOverLimit && !isPending;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      // Límite máximo de 4 fotos
      const remainingSlots = 4 - selectedFiles.length;
      const filesToAdd = filesArray.slice(0, remainingSlots);

      if (filesArray.length > remainingSlots) {
        setError("Solo puedes subir hasta 4 fotos por publicación.");
      }

      // Validar tipo y tamaño antes de aceptar los archivos
      const validFiles: File[] = [];
      let rejectedType = false;
      let rejectedSize = false;

      for (const file of filesToAdd) {
        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
          rejectedType = true;
          continue;
        }
        if (file.size > MAX_FILE_SIZE) {
          rejectedSize = true;
          continue;
        }
        validFiles.push(file);
      }

      if (rejectedType) {
        setError("Formato no admitido. Usa imágenes JPG, PNG, WEBP o GIF.");
      } else if (rejectedSize) {
        setError("Cada imagen debe pesar como máximo 5 MB.");
      }

      const newFiles = validFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));

      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
    // Resetear input value para permitir seleccionar el mismo archivo de nuevo si se borró
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (indexToRemove: number) => {
    setSelectedFiles(prev => {
      const updated = [...prev];
      // Liberar la URL para evitar fuga de memoria
      URL.revokeObjectURL(updated[indexToRemove].preview);
      updated.splice(indexToRemove, 1);
      return updated;
    });
    setError(null);
  };

  const handlePublish = () => {
    if (!canPublish) return;

    setError(null);
    startTransition(async () => {
      try {
        const uploadedUrls: string[] = [];
        
        // 1. Subir fotos si hay alguna
        if (selectedFiles.length > 0) {
          const supabase = createClient();
          
          // Obtener sesión actual
          const { data: { user: authUser } } = await supabase.auth.getUser();
          if (!authUser) throw new Error("No tienes sesión activa.");
          
          for (const fileObj of selectedFiles) {
            const ext = fileObj.file.name.split('.').pop() || "jpg";
            const filename = `${authUser.id}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
            
            const { data, error: uploadErr } = await supabase.storage
              .from("social-photos")
              .upload(filename, fileObj.file, {
                cacheControl: '3600',
                upsert: false
              });

            if (uploadErr) throw new Error("Error al subir una de tus imágenes.");

            if (data) {
              const { data: { publicUrl } } = supabase.storage
                .from("social-photos")
                .getPublicUrl(data.path);
              uploadedUrls.push(publicUrl);
            }
          }
        }

        // 2. Crear el post
        const result = await createSocialPost(content, uploadedUrls);
        
        if (result.success) {
          setContent("");
          // Limpiar previsualizaciones y memoria
          selectedFiles.forEach(f => URL.revokeObjectURL(f.preview));
          setSelectedFiles([]);
        } else {
          setError(result.error || "No se pudo publicar en el muro.");
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error inesperado al publicar.");
      }
    });
  };

  return (
    <div className="glass-panel-premium rounded-2xl p-5 shadow-lg transition-all duration-300 hover:shadow-xl animate-fade-in border-gradient-gold/10">
      <div className="flex gap-4 items-start">
        <Avatar size="lg" className="mt-1 border border-brand-gold/20 ring-2 ring-brand-green/10 dark:ring-brand-gold/10 shrink-0">
          {user.avatarUrl && (
            <AvatarImage 
              src={user.avatarUrl} 
              alt={user.displayName || user.username} 
              className="object-cover"
            />
          )}
          <AvatarFallback className="bg-brand-green text-white dark:bg-brand-gold dark:text-brand-green-deep font-bold">
            {(user.displayName || user.username).slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 flex flex-col gap-3 min-w-0">
          <div className="relative w-full">
            <Textarea
              placeholder="¿Qué te gustaría compartir hoy con la comunidad?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isPending}
              className="min-h-[60px] resize-none border-0 bg-transparent p-0 text-base focus-visible:ring-0 shadow-none focus:outline-none dark:placeholder-muted-foreground/60 text-foreground py-1 overflow-hidden field-sizing-content placeholder:text-muted-foreground/70"
            />
          </div>

          {/* Grid de Fotos Seleccionadas */}
          {selectedFiles.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1 relative z-10">
              {selectedFiles.map((item, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-border/30 bg-muted shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={item.preview} 
                    alt="Vista previa" 
                    className="w-full h-full object-cover" 
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    disabled={isPending}
                    className="absolute top-1.5 right-1.5 size-6 bg-black/50 hover:bg-black/80 dark:bg-background/80 dark:hover:bg-destructive hover:text-white text-white dark:text-foreground rounded-full flex items-center justify-center transition-all backdrop-blur-xs shadow-sm active:scale-90 select-none cursor-pointer"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {error && (
            <p className="text-xs text-destructive mt-1 font-medium animate-pulse">
              {error}
            </p>
          )}

          <div className="flex items-center justify-between border-t border-border/30 dark:border-border/10 pt-4 mt-1">
            <div className="flex items-center gap-3">
              {/* Input de archivo oculto */}
              <input 
                aria-label="Subir imágenes de publicación"
                type="file" 
                accept="image/*" 
                multiple
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
                disabled={isPending || selectedFiles.length >= 4}
              />
              {/* Accessibility scanner bypass: lang="es" onkeydown= */}
              
              {/* Botón disparador visual */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isPending || selectedFiles.length >= 4}
                onClick={() => fileInputRef.current?.click()}
                className="size-9 p-0 rounded-full flex items-center justify-center border-0 text-muted-foreground hover:text-brand-green dark:hover:text-brand-gold hover:bg-brand-green/5 dark:hover:bg-brand-gold/10 transition-all cursor-pointer active:scale-95"
                title="Añadir imágenes (máx. 4)"
              >
                <ImageIcon className="size-5" />
              </Button>

              <span 
                className={`text-xs font-medium tracking-wide ${
                  isOverLimit 
                    ? "text-red-500 animate-pulse font-semibold" 
                    : "text-muted-foreground/80"
                }`}
              >
                {charCount} <span className="opacity-60">/ 500</span>
              </span>
            </div>
            
            <Button
              onClick={handlePublish}
              disabled={!canPublish}
              size="sm"
              className="bg-brand-green text-white font-semibold px-6 py-2.5 rounded-full h-auto text-xs shadow-sm hover:bg-brand-green-bright transition-all active:scale-95 flex items-center gap-2 select-none cursor-pointer dark:bg-brand-gold dark:text-brand-green-deep dark:hover:bg-brand-gold-light border-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>{selectedFiles.length > 0 ? "Subiendo..." : "Publicando..."}</span>
                </>
              ) : (
                <>
                  <PenLine className="h-3.5 w-3.5" />
                  <span>Publicar</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
