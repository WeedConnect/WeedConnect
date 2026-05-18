import Link from "next/link";
import { UserX, ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PerfilNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="rounded-full bg-muted/50 p-5">
        <UserX className="size-10 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Usuario no encontrado</h1>
        <p className="max-w-xs text-sm text-muted-foreground">
          Este perfil no existe o aún no se ha creado una cuenta con ese nombre de usuario.
        </p>
      </div>
      <Link
        href="/comunidad/foro"
        className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
      >
        <ArrowLeft className="size-4" />
        Volver a la comunidad
      </Link>
    </div>
  );
}
