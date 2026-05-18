"use client";

import { RefreshCw } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function RetryButton() {
  return (
    <button
      onClick={() => window.location.reload()}
      className={cn(buttonVariants({ variant: "default" }), "gap-2")}
    >
      <RefreshCw className="size-4" />
      Reintentar
    </button>
  );
}
