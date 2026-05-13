"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { MAIN_NAV } from "@/lib/nav";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";
import { LogoWeedConnect } from "@/components/icons/logo-weedconnect";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
          <LogoWeedConnect showText className="size-8" textClassName="text-lg font-bold tracking-tight" />
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-1">
          {MAIN_NAV.map((item) =>
            item.children?.length ? (
              <DropdownMenu key={item.href}>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      className="h-9 gap-1 px-3 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-accent/30 dark:hover:bg-accent/20"
                    >
                      {item.label}
                      <ChevronDown className="size-3.5 opacity-70" />
                    </Button>
                  }
                />
                <DropdownMenuContent align="start" className="min-w-44">
                  <DropdownMenuItem
                    render={
                      <Link
                        href={item.href}
                        className="flex items-center gap-2 font-medium text-brand-green dark:text-brand-gold"
                      >
                        <LogoWeedConnect className="size-4" />
                        Ver todo
                      </Link>
                    }
                  />
                  {item.children.map((c) => (
                    <DropdownMenuItem key={c.href} render={<Link href={c.href}>{c.label}</Link>} />
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Link
            href="/auth/login"
            className="hidden text-sm font-medium text-foreground/70 hover:text-foreground sm:inline-flex sm:px-3 sm:py-2"
          >
            Entrar
          </Link>
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
