"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, User as UserIcon, Sprout } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { MAIN_NAV } from "@/lib/nav";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";
import { LogoWeedConnect } from "@/components/icons/logo-weedconnect";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sessionUser, setSessionUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{ username?: string; display_name?: string; avatar_url?: string; points?: number } | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function getInitialSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setSessionUser(session.user);
          const { data: prof } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
          if (prof) setProfile(prof);
        }
      } catch (error) {
        console.error("Error getting user session:", error);
      } finally {
        setLoading(false);
      }
    }

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setSessionUser(session.user);
        try {
          const { data: prof } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
          if (prof) setProfile(prof);
        } catch (error) {
          console.error("Error loading user profile:", error);
        }
      } else {
        setSessionUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

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
          
          {loading ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted/60 sm:ml-2" />
          ) : sessionUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button className="flex items-center gap-2 rounded-full border border-border/40 bg-muted/30 p-1 pl-2.5 pr-1 text-sm font-medium hover:bg-accent/20 hover:border-border/60 transition-all sm:ml-2 cursor-pointer">
                    {profile?.points !== undefined && (
                      <span className="hidden items-center gap-0.5 text-xs text-brand-gold font-semibold sm:flex pr-1">
                        <Sprout className="size-3 text-brand-green dark:text-brand-gold" />
                        {profile.points}
                      </span>
                    )}
                    <Avatar size="sm" className="select-none border border-border/80">
                      <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.username || "avatar"} />
                      <AvatarFallback className="bg-brand-green text-brand-pearl dark:bg-brand-gold dark:text-black text-[10px] font-bold">
                        {(profile?.username || "U").substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                }
              />
              <DropdownMenuContent align="end" className="min-w-48 shadow-lg ring-1 ring-border/40">
                <div className="px-3 py-2.5 flex flex-col border-b border-border/40">
                  <span className="font-semibold text-foreground text-sm truncate leading-none">
                    {profile?.display_name || profile?.username || "Cultivador"}
                  </span>
                  <span className="text-muted-foreground text-[11px] mt-1">
                    @{profile?.username || "anon"}
                  </span>
                </div>
                <DropdownMenuItem
                  render={
                    <Link href={`/perfil/${profile?.username || ""}`} className="flex items-center w-full gap-2">
                      <UserIcon className="size-4 text-muted-foreground group-focus/dropdown-menu-item:text-accent-foreground" />
                      Mi Perfil
                    </Link>
                  }
                />
                <DropdownMenuItem
                  render={
                    <Link href="/herramientas/cultivo" className="flex items-center w-full gap-2">
                      <Sprout className="size-4 text-muted-foreground group-focus/dropdown-menu-item:text-accent-foreground" />
                      Mis Cultivos
                    </Link>
                  }
                />
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={handleSignOut}
                  className="flex items-center w-full gap-2 cursor-pointer font-medium"
                >
                  <LogOut className="size-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/auth/login"
              className="hidden text-sm font-medium text-foreground/70 hover:text-foreground sm:inline-flex sm:px-3 sm:py-2"
            >
              Entrar
            </Link>
          )}
          
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}

