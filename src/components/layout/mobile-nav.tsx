"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MAIN_NAV } from "@/lib/nav";
import { LogoWeedConnect } from "@/components/icons/logo-weedconnect";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  function close() {
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Abrir menú">
            <Menu className="size-5" />
          </Button>
        }
      />
      <SheetContent side="right" className="w-80 flex flex-col gap-0 p-0">
        <SheetHeader className="px-6 py-4 border-b border-border/40">
          <SheetTitle>
            <LogoWeedConnect showText className="size-8" textClassName="text-base font-bold" />
          </SheetTitle>
        </SheetHeader>
        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto px-4 py-4 pb-6">
          {MAIN_NAV.map((item) => (
            <div key={item.href} className="flex flex-col">
              <Link
                href={item.href}
                onClick={close}
                className="rounded-md px-3 py-2 text-base font-semibold text-foreground transition-colors hover:bg-accent"
              >
                {item.label}
              </Link>
              {item.children && (
                <div className="ml-3 flex flex-col border-l border-border/60 pl-3">
                  {item.children.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      onClick={close}
                      className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="mt-4 border-t border-border/60 pt-4">
            <Link
              href="/auth/login"
              onClick={close}
              className="rounded-md px-3 py-2 text-base font-medium text-foreground/80 hover:bg-accent hover:text-foreground"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/auth/registro"
              onClick={close}
              className="rounded-md px-3 py-2 text-base font-medium text-foreground/80 hover:bg-accent hover:text-foreground"
            >
              Crear cuenta
            </Link>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
