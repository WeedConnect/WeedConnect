import type { Metadata } from "next";
import { Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Política de Privacidad · WeedConnect",
  description: "Cómo WeedConnect recopila, trata y protege tus datos personales. RGPD y LOPDGDD.",
  robots: { index: false },
};

export default function PrivacidadPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <header className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <Shield className="size-5 text-emerald-600" aria-hidden />
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Política de Privacidad</h1>
        </div>
        <p className="text-sm text-muted-foreground">Última actualización: mayo 2026</p>
      </header>

      <div className="space-y-8 text-sm leading-relaxed text-foreground/90">

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">1. Responsable del tratamiento</h2>
          <ul className="ml-5 list-disc space-y-1 text-muted-foreground">
            <li><strong className="text-foreground">Identidad:</strong> [NOMBRE COMPLETO O RAZÓN SOCIAL]</li>
            <li><strong className="text-foreground">NIF/CIF:</strong> [NÚMERO]</li>
            <li><strong className="text-foreground">Dirección:</strong> [DIRECCIÓN, CIUDAD, ESPAÑA]</li>
            <li><strong className="text-foreground">Contacto privacidad:</strong> [EMAIL PROTECCIÓN DE DATOS]</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">2. Datos que recopilamos</h2>
          <p className="mb-2 text-muted-foreground">WeedConnect recopila los siguientes datos, en función de cómo uses el servicio:</p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-3 py-2 text-left font-semibold">Dato</th>
                  <th className="px-3 py-2 text-left font-semibold">Cuándo</th>
                  <th className="px-3 py-2 text-left font-semibold">Base legal</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/60">
                  <td className="px-3 py-2">Correo electrónico</td>
                  <td className="px-3 py-2">Al registrarte</td>
                  <td className="px-3 py-2">Ejecución del contrato</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="px-3 py-2">Nombre de usuario y contraseña (hash)</td>
                  <td className="px-3 py-2">Al registrarte</td>
                  <td className="px-3 py-2">Ejecución del contrato</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="px-3 py-2">Foto de perfil (opcional)</td>
                  <td className="px-3 py-2">Al actualizarla</td>
                  <td className="px-3 py-2">Consentimiento</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="px-3 py-2">Posts, comentarios, fotos de hilo</td>
                  <td className="px-3 py-2">Al publicarlos</td>
                  <td className="px-3 py-2">Consentimiento / interés legítimo</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="px-3 py-2">Diario de cultivo y fotos grow</td>
                  <td className="px-3 py-2">Al usarlo</td>
                  <td className="px-3 py-2">Consentimiento (acceso privado)</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="px-3 py-2">Datos de uso anonimizados</td>
                  <td className="px-3 py-2">Automáticamente (Plausible)</td>
                  <td className="px-3 py-2">Interés legítimo (sin cookies)</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">Dirección IP (sesión)</td>
                  <td className="px-3 py-2">Al navegar</td>
                  <td className="px-3 py-2">Seguridad / interés legítimo</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">3. Finalidad del tratamiento</h2>
          <ul className="ml-5 list-disc space-y-1 text-muted-foreground">
            <li>Gestionar tu cuenta y autenticación.</li>
            <li>Prestarte las funcionalidades del servicio (foro, grow tracker, asistente IA).</li>
            <li>Enviarte comunicaciones transaccionales (confirmación de cuenta, restablecimiento de contraseña).</li>
            <li>Mejorar el servicio mediante estadísticas agregadas y anónimas.</li>
            <li>Cumplir obligaciones legales y prevenir usos fraudulentos.</li>
          </ul>
          <p className="mt-2 text-muted-foreground">
            <strong className="text-foreground">No usamos tus datos para publicidad personalizada</strong> ni los cedemos a terceros con fines comerciales.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">4. Destinatarios y transferencias internacionales</h2>
          <ul className="ml-5 list-disc space-y-1 text-muted-foreground">
            <li>
              <strong className="text-foreground">Supabase Inc.</strong> (EE. UU.) — proveedor de base de datos, autenticación y almacenamiento. Los datos se alojan en servidores de la UE (Frankfurt). Supabase es certificado SOC2 Tipo 2 y ofrece garantías mediante cláusulas contractuales estándar (SCCs).
            </li>
            <li>
              <strong className="text-foreground">Plausible Analytics</strong> (Estonia/UE) — analítica web sin cookies, sin datos personales. Cumple el RGPD de serie.
            </li>
            <li>
              <strong className="text-foreground">Resend Inc.</strong> (EE. UU.) — envío de correos transaccionales. Solo recibe la dirección de email necesaria para cada envío. Ofrece garantías SCCs.
            </li>
            <li>
              <strong className="text-foreground">Vercel Inc.</strong> (EE. UU.) — hosting del sitio web. Edge functions en la UE cuando es posible. Ofrece DPA y garantías SCCs.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">5. Conservación de los datos</h2>
          <ul className="ml-5 list-disc space-y-1 text-muted-foreground">
            <li>Los datos de cuenta se conservan mientras la cuenta esté activa.</li>
            <li>Tras la eliminación de la cuenta, los datos se borran en un plazo máximo de 30 días, salvo los que deban conservarse por obligación legal.</li>
            <li>Los logs de acceso se conservan un máximo de 12 meses con fines de seguridad.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">6. Tus derechos (RGPD + LOPDGDD)</h2>
          <p className="mb-2 text-muted-foreground">Puedes ejercer los siguientes derechos escribiendo a <strong className="text-foreground">[EMAIL DE CONTACTO]</strong> con copia de tu DNI/NIE:</p>
          <ul className="ml-5 list-disc space-y-1 text-muted-foreground">
            <li><strong className="text-foreground">Acceso</strong> — obtener confirmación de si tratamos tus datos y recibirlos.</li>
            <li><strong className="text-foreground">Rectificación</strong> — corregir datos inexactos.</li>
            <li><strong className="text-foreground">Supresión</strong> ("derecho al olvido") — solicitar que borremos tus datos.</li>
            <li><strong className="text-foreground">Portabilidad</strong> — recibir tus datos en formato legible por máquina (JSON).</li>
            <li><strong className="text-foreground">Oposición y limitación</strong> — oponerte a determinados tratamientos.</li>
            <li><strong className="text-foreground">Retirar el consentimiento</strong> en cualquier momento, sin afectar al tratamiento anterior.</li>
          </ul>
          <p className="mt-2 text-muted-foreground">
            Si no recibes respuesta o no estás satisfecho, puedes reclamar ante la{" "}
            <strong className="text-foreground">Agencia Española de Protección de Datos (AEPD)</strong>: www.aepd.es.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">7. Seguridad</h2>
          <p className="text-muted-foreground">
            Aplicamos medidas técnicas y organizativas adecuadas: contraseñas almacenadas con hash bcrypt, comunicaciones cifradas con TLS, acceso a datos de producción restringido por rol (RLS), y almacenamiento de fotos privadas (grow tracker) mediante URLs firmadas de acceso temporal.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">8. Menores de edad</h2>
          <p className="text-muted-foreground">
            WeedConnect está dirigido exclusivamente a personas mayores de 18 años. Si detectamos que un menor ha facilitado datos sin consentimiento parental, procederemos a su eliminación inmediata. Contáctanos en <strong className="text-foreground">[EMAIL]</strong> si tienes conocimiento de ello.
          </p>
        </section>

      </div>
    </article>
  );
}
