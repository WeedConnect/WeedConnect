import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Iniciar sesión",
};

export default function LoginPage() {
  return (
    <section className="mx-auto flex max-w-md flex-col px-4 py-20 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Iniciar sesión</h1>
      <p className="mt-2 text-sm text-muted-foreground">
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
