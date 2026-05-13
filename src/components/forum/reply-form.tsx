"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ReplyForm({ threadId }: { threadId: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setLoading(true);
    setError("");

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("Tienes que estar autenticado.");
      setLoading(false);
      return;
    }

    const { error: err } = await supabase.from("forum_posts").insert({
      thread_id: threadId,
      author_id: user.id,
      body: body.trim(),
    });

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    setBody("");
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Label htmlFor="reply-body">Tu respuesta</Label>
      <Textarea
        id="reply-body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Escribe tu respuesta..."
        rows={4}
        required
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={loading || !body.trim()}>
        {loading ? "Enviando…" : "Publicar respuesta"}
      </Button>
    </form>
  );
}
