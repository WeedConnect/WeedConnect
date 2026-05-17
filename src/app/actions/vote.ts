"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type VoteTarget = "thread" | "post" | "strain";
export type VoteValue = "up" | "down";

export interface VoteResult {
  error?: string;
  success?: boolean;
}

export async function castVote(
  target: VoteTarget,
  targetId: string,
  value: VoteValue,
  revalidate?: string,
): Promise<VoteResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "no_auth" };

  const { error } = await supabase.from("votes").upsert(
    { user_id: user.id, target, target_id: targetId, value },
    { onConflict: "user_id,target,target_id" },
  );

  if (error) return { error: error.message };
  if (revalidate) revalidatePath(revalidate);
  return { success: true };
}

export async function removeVote(
  target: VoteTarget,
  targetId: string,
  revalidate?: string,
): Promise<VoteResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "no_auth" };

  const { error } = await supabase
    .from("votes")
    .delete()
    .eq("user_id", user.id)
    .eq("target", target)
    .eq("target_id", targetId);

  if (error) return { error: error.message };
  if (revalidate) revalidatePath(revalidate);
  return { success: true };
}
