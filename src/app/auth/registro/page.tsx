import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Crear cuenta",
};

export default function RegisterPage() {
  return (
    <section className="mx-auto flex max-w-md flex-col px-4 py-20 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Crear cuenta</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Únete a la comunidad. Necesitas ser mayor de edad.
      </p>
      <div className="mt-8">
        <RegisterForm />
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{" "}
        <Link href="/auth/login" className="font-medium text-emerald-700 hover:underline dark:text-emerald-300">
          Inicia sesión
        </Link>
      </p>
    </section>
  );
}
