import type { Metadata } from "next";
import { Cookie } from "lucide-react";

export const metadata: Metadata = {
  title: "Política de Cookies · WeedConnect",
  description: "WeedConnect usa una analítica sin cookies (Plausible). Conoce qué cookies existen y cómo gestionarlas.",
  robots: { index: false },
};

export default function CookiesPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <PageHeader className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <Cookie className="size-5 text-emerald-600" aria-hidden />
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Política de Cookies</h1>
        </div>
        <p className="text-sm text-muted-foreground">Última actualización: mayo 2026</p>
      </PageHeader>

      <div className="space-y-8 text-sm leading-relaxed text-foreground/90">

        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-4 dark:border-emerald-800/40 dark:bg-emerald-950/30">
          <p className="text-sm text-emerald-800 dark:text-emerald-200">
            <strong>Buenas noticias:</strong> WeedConnect está diseñado con privacidad por defecto.
            Usamos <strong>Plausible Analytics</strong>, que <strong>no utiliza cookies</strong> y no rastrea tu actividad entre sitios.
            Las únicas cookies que existen son las estrictamente necesarias para el funcionamiento del servicio.
          </p>
        </div>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">1. ¿Qué son las cookies?</h2>
          <p className="text-muted-foreground">
            Las cookies son pequeños archivos de texto que un sitio web almacena en tu dispositivo. Sirven para recordar preferencias, mantener sesiones activas y, en algunos casos, recopilar datos de uso.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">2. Cookies que utiliza WeedConnect</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-3 py-2 text-left font-semibold">Nombre</th>
                  <th className="px-3 py-2 text-left font-semibold">Tipo</th>
                  <th className="px-3 py-2 text-left font-semibold">Finalidad</th>
                  <th className="px-3 py-2 text-left font-semibold">Duración</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/60">
                  <td className="px-3 py-2 font-mono">wc_age_ok</td>
                  <td className="px-3 py-2">Propia · técnica</td>
                  <td className="px-3 py-2">Verificación de mayoría de edad (+18). Sin esta cookie serías redirigido al age gate en cada visita.</td>
                  <td className="px-3 py-2">1 año</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="px-3 py-2 font-mono">sb-*</td>
                  <td className="px-3 py-2">Propia · técnica</td>
                  <td className="px-3 py-2">Cookies de sesión de Supabase Auth. Mantienen tu sesión activa cuando estás registrado.</td>
                  <td className="px-3 py-2">Sesión / 1 semana</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">—</td>
                  <td className="px-3 py-2">Analítica</td>
                  <td className="px-3 py-2">
                    WeedConnect usa <strong className="text-foreground">Plausible Analytics</strong>, que <strong className="text-foreground">no establece ninguna cookie</strong>. Los datos de uso son completamente anónimos y no permiten identificar a usuarios individuales.
                  </td>
                  <td className="px-3 py-2">N/A</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-muted-foreground">
            WeedConnect <strong className="text-foreground">no usa cookies publicitarias</strong>, de seguimiento entre sitios, ni de redes sociales de terceros.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">3. Cookies técnicas — exención de consentimiento</h2>
          <p className="text-muted-foreground">
            Las cookies <code className="rounded bg-muted px-1 text-foreground">wc_age_ok</code> y <code className="rounded bg-muted px-1 text-foreground">sb-*</code> son cookies estrictamente necesarias para el funcionamiento del servicio. Conforme al artículo 22.2 de la LSSI-CE y la Guía de Cookies de la AEPD, las cookies técnicas no requieren consentimiento del usuario.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">4. Cómo gestionar o eliminar cookies</h2>
          <p className="mb-2 text-muted-foreground">
            Puedes gestionar, bloquear o eliminar cookies desde la configuración de tu navegador:
          </p>
          <ul className="ml-5 list-disc space-y-1 text-muted-foreground">
            <li><strong className="text-foreground">Chrome:</strong> Configuración → Privacidad y seguridad → Cookies</li>
            <li><strong className="text-foreground">Firefox:</strong> Ajustes → Privacidad y seguridad → Cookies</li>
            <li><strong className="text-foreground">Safari:</strong> Preferencias → Privacidad → Gestionar datos de sitios web</li>
            <li><strong className="text-foreground">Edge:</strong> Configuración → Privacidad, búsqueda y servicios → Cookies</li>
          </ul>
          <p className="mt-2 text-muted-foreground">
            Ten en cuenta que bloquear las cookies técnicas puede afectar al funcionamiento del sitio (por ejemplo, tendrías que confirmar tu edad en cada visita o no podrías mantener la sesión iniciada).
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">5. Actualizaciones de esta política</h2>
          <p className="text-muted-foreground">
            Esta política puede actualizarse si añadimos nuevas funcionalidades que impliquen nuevas cookies. En tal caso, lo comunicaremos de forma visible en el sitio.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">6. Contacto</h2>
          <p className="text-muted-foreground">
            Para cualquier consulta sobre cookies o privacidad: <strong className="text-foreground">[EMAIL DE CONTACTO]</strong>
          </p>
        </section>

      </div>
    </article>
  );
}

const PageHeader = "header";
