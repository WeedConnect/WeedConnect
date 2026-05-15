import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Iniciar sesión",
};

export default function LoginPage() {
  return (
    <section className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <div className="mb-8 flex justify-center">
        <div className="relative overflow-hidden rounded-2xl border border-border/40 shadow-sm shadow-black/5 transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
          <Image
            src="/images/logo_weedconnect.jpg"
            alt="WeedConnect Logo"
            width={300}
            height={150}
            priority
            className="object-cover aspect-[2/1]"
          />
        </div>
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-center">Iniciar sesión</h1>
      <p className="mt-2 text-sm text-muted-foreground text-center">
        Accede a tu cuenta para participar en el foro, guardar cultivos y más.
      </p>
      <div className="mt-8">
        <LoginForm />
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        ¿No tienes cuenta?{" "}
        <Link href="/auth/registro" className="font-medium text-emerald-700 hover:underline dark:text-emerald-300">
          Regístrate
        </Link>
      </p>
    </section>
  );
}
