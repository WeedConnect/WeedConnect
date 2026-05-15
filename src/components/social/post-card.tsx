"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  toggleLikePost,
  toggleBookmarkPost,
  deleteSocialPost,
  createSocialComment,
} from "@/app/actions/feed";
import { SocialPost, SocialComment } from "@/types";
import {
  Heart,
  MessageSquare,
  Bookmark,
  Share2,
  MoreHorizontal,
  Trash2,
  AlertTriangle,
  Send,
  Loader2,
  CheckCircle2
} from "lucide-react";

interface PostCardProps {
  post: SocialPost;
  currentUserId?: string;
}

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSecs = Math.max(0, Math.floor(diffInMs / 1000));
  const diffInMins = Math.floor(diffInSecs / 60);
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSecs < 20) return "Ahora mismo";
  if (diffInSecs < 60) return `Hace ${diffInSecs} s`;
  if (diffInMins < 60) return `Hace ${diffInMins} min`;
  if (diffInHours < 24) return `Hace ${diffInHours} h`;
  if (diffInDays < 7) return `Hace ${diffInDays} ${diffInDays === 1 ? "día" : "días"}`;
  
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
  });
}

function parseContent(content: string) {
  if (!content) return null;
  const words = content.split(/(\s+)/);
  return words.map((word, i) => {
    // @usuario
    if (word.startsWith("@") && word.length > 1) {
      const cleanUser = word.substring(1).replace(/[^a-zA-Z0-9_]/g, "");
      const tail = word.substring(1 + cleanUser.length);
      return (
        <React.Fragment key={i}>
          <Link href={`/perfil/${cleanUser}`} className="text-brand-green dark:text-brand-gold font-semibold hover:underline transition-colors">
            @{cleanUser}
          </Link>
          {tail}
        </React.Fragment>
      );
    }
    // #hashtag
    if (word.startsWith("#") && word.length > 1) {
      const cleanTag = word.substring(1).replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_]/g, "");
      const tail = word.substring(1 + cleanTag.length);
      return (
        <React.Fragment key={i}>
          <span className="text-brand-gold dark:text-brand-gold font-semibold cursor-default hover:brightness-110 transition-all">
            #{cleanTag}
          </span>
          {tail}
        </React.Fragment>
      );
    }
    return word;
  });
}

export function PostCard({ post, currentUserId }: PostCardProps) {
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();
  
  // Soporte para Optimistic UI y Estados Locales
  const [localLiked, setLocalLiked] = useState(post.isLikedByUser || false);
  const [localLikesCount, setLocalLikesCount] = useState(post.likesCount || 0);
  const [localBookmarked, setLocalBookmarked] = useState(post.isBookmarkedByUser || false);
  const [isDeleted, setIsDeleted] = useState(false);
  
  // Compartido feedback temporal
  const [isCopied, setIsCopied] = useState(false);

  // Comentarios Estados
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [localComments, setLocalComments] = useState<SocialComment[]>(post.comments || []);
  const [isCommenting, setIsCommenting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sincronización Reactiva de Props
  useEffect(() => {
    setLocalLiked(post.isLikedByUser || false);
    setLocalLikesCount(post.likesCount || 0);
    setLocalBookmarked(post.isBookmarkedByUser || false);
    setLocalComments(post.comments || []);
  }, [post.isLikedByUser, post.likesCount, post.isBookmarkedByUser, post.comments]);

  if (isDeleted) return null; // Animaciones manejables via CSS si es necesario

  const isOwner = currentUserId && post.authorId === currentUserId;

  const handleLike = () => {
    if (isPending) return;

    const originalLiked = localLiked;
    const originalCount = localLikesCount;
    
    const nextLiked = !originalLiked;
    setLocalLiked(nextLiked);
    setLocalLikesCount(prev => nextLiked ? prev + 1 : Math.max(0, prev - 1));

    startTransition(async () => {
      const result = await toggleLikePost(post.id);
      if (!result.success) {
        setLocalLiked(originalLiked);
        setLocalLikesCount(originalCount);
      }
    });
  };

  const handleBookmark = () => {
    if (isPending) return;
    const nextState = !localBookmarked;
    setLocalBookmarked(nextState);

    startTransition(async () => {
      const result = await toggleBookmarkPost(post.id);
      if (!result.success) {
        setLocalBookmarked(!nextState);
      }
    });
  };

  const handleShare = async () => {
    const postUrl = `${window.location.origin}/feed#post-${post.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Publicación de @${post.author?.username} en WeedConnect`,
          text: post.content.substring(0, 100),
          url: postUrl,
        });
      } catch (err) {
        console.log("Compartido nativo cancelado o fallido", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(postUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error("Error al copiar enlace:", err);
      }
    }
  };

  const handleDelete = () => {
    if (!isOwner) return;
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta publicación? Esta acción no se puede deshacer.")) return;

    // UI Optimista
    setIsDeleted(true);

    startTransition(async () => {
      const result = await deleteSocialPost(post.id);
      if (!result.success) {
        setIsDeleted(false);
        alert("Ocurrió un error al intentar borrar la publicación.");
      }
    });
  };

  const handleReport = () => {
    alert("¡Gracias! Tu reporte ha sido enviado y será revisado por nuestro equipo de moderadores a la brevedad.");
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = commentInput.trim();
    if (!trimmed || isCommenting) return;

    setIsCommenting(true);
    
    // Crear un comentario local temporal optimista
    const tempId = Math.random().toString();
    const optimisticComment: SocialComment = {
      id: tempId,
      postId: post.id,
      authorId: currentUserId || "unknown",
      content: trimmed,
      createdAt: new Date().toISOString(),
      author: {
        id: currentUserId || "",
        username: "tú",
        displayName: "Usuario",
      }
    };

    // Si el server devuelve ok, se refrescarán vía revalidatePath, pero esto da feedback instantáneo
    setLocalComments(prev => [...prev, optimisticComment]);
    setCommentInput("");

    const result = await createSocialComment(post.id, trimmed);
    
    if (!result.success) {
      // Quitar el optimista
      setLocalComments(prev => prev.filter(c => c.id !== tempId));
      setCommentInput(trimmed); // Devolver el texto
      alert("No se pudo enviar el comentario. Por favor intenta de nuevo.");
    }
    
    setIsCommenting(false);
  };

  const authorName = post.author?.displayName || post.author?.username || "Usuario";
  const authorUsername = post.author?.username || "";
  const avatarFallback = authorName.slice(0, 2).toUpperCase();

  return (
    <div 
      id={`post-${post.id}`}
      className="glass-panel rounded-xl p-5 border border-border/40 bg-card/40 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-border/60 dark:hover:border-brand-gold/20 transition-all duration-300 animate-slide-up flex flex-col gap-4 scroll-mt-20"
    >
      {/* Cabecera */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex gap-3">
          <Link href={`/perfil/${authorUsername}`} className="group cursor-pointer">
            <Avatar className="border border-border/50 transition-transform group-hover:scale-105 duration-300 shrink-0">
              {post.author?.avatarUrl && (
                <AvatarImage 
                  src={post.author.avatarUrl} 
                  alt={authorName} 
                  className="object-cover"
                />
              )}
              <AvatarFallback className="bg-muted text-muted-foreground font-medium group-hover:bg-brand-green group-hover:text-white dark:group-hover:bg-brand-gold dark:group-hover:text-brand-green-deep transition-colors">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
          </Link>
          
          <div className="flex flex-col justify-center leading-tight mt-0.5 min-w-0">
            <Link 
              href={`/perfil/${authorUsername}`}
              className="font-semibold text-foreground hover:text-brand-green dark:hover:text-brand-gold transition-colors text-[15px] truncate block"
            >
              {authorName}
            </Link>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <span className="truncate">@{authorUsername}</span>
              <span>•</span>
              <span className="shrink-0">{mounted ? getRelativeTime(post.createdAt) : "..."}</span>
            </div>
          </div>
        </div>

        {/* Menú de Acciones Superior */}
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button variant="ghost" size="sm" className="size-8 p-0 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 border-0 cursor-pointer active:scale-90">
              <MoreHorizontal className="size-4" />
            </Button>
          } />
          <DropdownMenuContent align="end" className="min-w-36 glass-panel shadow-xl bg-popover/95 backdrop-blur-sm border border-border/30 p-1">
            {isOwner ? (
              <DropdownMenuItem 
                variant="destructive"
                onClick={handleDelete}
                className="flex items-center w-full gap-2 font-medium text-sm cursor-pointer"
              >
                <Trash2 className="size-4" />
                Borrar post
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem 
                onClick={handleReport}
                className="flex items-center w-full gap-2 font-medium text-sm cursor-pointer text-muted-foreground hover:text-foreground"
              >
                <AlertTriangle className="size-4" />
                Reportar
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Cuerpo Texto */}
      {post.content && (
        <div className="text-[15px] leading-relaxed text-foreground/90 whitespace-pre-wrap break-words pl-1">
          {parseContent(post.content)}
        </div>
      )}

      {/* Visualizador Grid de Fotos */}
      {post.mediaUrls && post.mediaUrls.length > 0 && (
        <div className={`grid gap-2 rounded-2xl overflow-hidden border border-border/10 ${
          post.mediaUrls.length === 1 ? "grid-cols-1 max-h-[450px]" :
          post.mediaUrls.length === 2 ? "grid-cols-2 aspect-[16/9]" :
          post.mediaUrls.length === 3 ? "grid-cols-2 aspect-[16/9]" :
          "grid-cols-2 aspect-[1]"
        }`}>
          {post.mediaUrls.map((url, idx) => {
            const isSpanThree = post.mediaUrls.length === 3 && idx === 0;
            return (
              <div 
                key={idx} 
                className={`relative overflow-hidden bg-muted/30 shadow-sm group ${
                  isSpanThree ? "row-span-2 col-span-1" : ""
                } ${
                  post.mediaUrls.length === 1 ? "max-h-[450px] flex justify-center" : "h-full w-full"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={url} 
                  alt={`Adjunto ${idx + 1}`} 
                  className={`object-cover w-full h-full transition-transform duration-700 group-hover:scale-105`} 
                  loading="lazy"
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Barra de Interacciones */}
      <div className="border-t border-border/20 pt-2.5 mt-1 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {/* LIKE BUTTON */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`group h-9 py-2 px-3 rounded-full flex items-center gap-2 select-none transition-all duration-200 border-0 cursor-pointer ${
              localLiked 
                ? "text-brand-gold bg-brand-gold/5 hover:bg-brand-gold/10 dark:bg-brand-gold/10 dark:hover:bg-brand-gold/20 font-semibold" 
                : "text-muted-foreground hover:text-brand-green dark:hover:text-brand-gold hover:bg-muted/50"
            }`}
          >
            <Heart 
              className={`h-[18px] w-[18px] transition-transform duration-300 group-active:scale-125 ${
                localLiked 
                  ? "fill-brand-gold text-brand-gold scale-105" 
                  : "text-muted-foreground/70 group-hover:text-brand-green dark:group-hover:text-brand-gold"
              }`} 
            />
            <span className="text-xs tabular-nums font-medium">
              {localLikesCount}
            </span>
          </Button>

          {/* COMMENT BUTTON TRIGGER */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className={`group h-9 py-2 px-3 rounded-full flex items-center gap-2 select-none transition-all duration-200 border-0 cursor-pointer ${
              showComments 
                ? "text-brand-green bg-brand-green/5 dark:text-brand-gold dark:bg-brand-gold/5" 
                : "text-muted-foreground hover:text-brand-green dark:hover:text-brand-gold hover:bg-muted/50"
            }`}
          >
            <MessageSquare className="h-[18px] w-[18px] text-muted-foreground/70 group-hover:text-brand-green dark:group-hover:text-brand-gold" />
            <span className="text-xs font-medium tabular-nums">
              {localComments.length}
            </span>
          </Button>

          {/* SHARE BUTTON */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className={`group h-9 py-2 px-3 rounded-full flex items-center gap-2 select-none transition-all duration-200 border-0 cursor-pointer ${
              isCopied ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20" : "text-muted-foreground hover:text-brand-green dark:hover:text-brand-gold hover:bg-muted/50"
            }`}
          >
            {isCopied ? (
              <>
                <CheckCircle2 className="h-[17px] w-[17px] text-emerald-600 dark:text-emerald-400 animate-in zoom-in duration-200" />
                <span className="text-xs font-semibold hidden sm:inline">¡Copiado!</span>
              </>
            ) : (
              <>
                <Share2 className="h-[18px] w-[18px] text-muted-foreground/70 group-hover:text-brand-green dark:group-hover:text-brand-gold" />
                <span className="text-xs font-medium hidden sm:inline">Compartir</span>
              </>
            )}
          </Button>
        </div>

        {/* BOOKMARK BUTTON */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBookmark}
          className={`group h-9 w-9 p-0 rounded-full flex items-center justify-center select-none transition-all duration-200 border-0 cursor-pointer ${
            localBookmarked 
              ? "text-brand-green bg-brand-green/5 dark:text-brand-gold dark:bg-brand-gold/5" 
              : "text-muted-foreground hover:text-brand-green dark:hover:text-brand-gold hover:bg-muted/50"
          }`}
          title="Guardar publicación"
        >
          <Bookmark 
            className={`h-[18px] w-[18px] transition-transform duration-200 group-active:scale-110 ${
              localBookmarked 
                ? "fill-brand-green text-brand-green dark:fill-brand-gold dark:text-brand-gold" 
                : "text-muted-foreground/70 group-hover:text-brand-green dark:group-hover:text-brand-gold"
            }`} 
          />
        </Button>
      </div>

      {/* Sección de Comentarios Expandible */}
      {showComments && (
        <div className="border-t border-border/15 pt-4 mt-1 flex flex-col gap-4 animate-in slide-in-from-top-3 duration-200 ease-out">
          
          {/* Formulario de añadir comentario */}
          {currentUserId && (
            <form onSubmit={handleAddComment} className="flex gap-3 items-start w-full group/input">
              <div className="flex-1 relative">
                <Textarea
                  placeholder="Escribe un comentario..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  disabled={isCommenting}
                  className="min-h-[38px] max-h-[120px] py-2 px-3.5 bg-muted/40 hover:bg-muted/60 focus:bg-background rounded-2xl text-sm border border-border/30 focus:border-brand-green/40 focus-visible:ring-1 focus-visible:ring-brand-green/20 resize-none field-sizing-content pr-10 shadow-xs transition-all duration-200"
                />
                <button
                  type="submit"
                  disabled={!commentInput.trim() || isCommenting}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 size-7 bg-transparent text-muted-foreground hover:text-brand-green dark:hover:text-brand-gold disabled:opacity-30 flex items-center justify-center transition-all rounded-full active:scale-90 disabled:active:scale-100"
                >
                  {isCommenting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Send className="size-4" />
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Lista de Comentarios */}
          <div className="flex flex-col gap-3.5 pl-1 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
            {localComments.length === 0 ? (
              <p className="text-xs text-muted-foreground italic pl-2 font-medium">
                Aún no hay comentarios. ¡Sé el primero en opinar!
              </p>
            ) : (
              localComments.map((comment) => {
                const commAuthorName = comment.author?.displayName || comment.author?.username || "Usuario";
                const commAuthorUser = comment.author?.username || "";
                const commFallback = commAuthorName.slice(0, 2).toUpperCase();
                
                return (
                  <div key={comment.id} className="flex gap-3 items-start text-sm leading-tight">
                    <Link href={`/perfil/${commAuthorUser}`} className="shrink-0 mt-0.5">
                      <Avatar className="size-7 border border-border/40">
                        {comment.author?.avatarUrl && (
                          <AvatarImage src={comment.author.avatarUrl} className="object-cover" />
                        )}
                        <AvatarFallback className="bg-muted text-[10px] text-muted-foreground font-bold">
                          {commFallback}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className="flex-1 flex flex-col gap-1 bg-muted/20 rounded-2xl rounded-tl-none px-3.5 py-2.5 border border-border/20 shadow-xs">
                      <div className="flex justify-between items-baseline">
                        <Link 
                          href={`/perfil/${commAuthorUser}`}
                          className="font-bold text-xs text-foreground hover:text-brand-green dark:hover:text-brand-gold transition-colors"
                        >
                          {commAuthorName}
                        </Link>
                        <span className="text-[10px] text-muted-foreground shrink-0 pl-2">
                          {getRelativeTime(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-foreground/90 text-[13.5px] leading-relaxed break-words mt-0.5 whitespace-pre-wrap">
                        {parseContent(comment.content)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
