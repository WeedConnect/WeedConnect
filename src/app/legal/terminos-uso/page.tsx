import type { Metadata } from "next";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Términos de Uso · WeedConnect",
  description: "Condiciones de uso de la plataforma WeedConnect. Plataforma informativa +18.",
  robots: { index: false },
};

export default function TerminosUsoPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <header className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <FileText className="size-5 text-emerald-600" aria-hidden />
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Términos de Uso</h1>
        </div>
        <p className="text-sm text-muted-foreground">Última actualización: mayo 2026</p>
      </header>

      <div className="space-y-8 text-sm leading-relaxed text-foreground/90">

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">1. Aceptación de los términos</h2>
          <p className="text-muted-foreground">
            El acceso o uso de WeedConnect implica la aceptación plena de estos términos. Si no los aceptas, no debes utilizar el servicio. WeedConnect se reserva el derecho a modificarlos en cualquier momento; las modificaciones serán efectivas desde su publicación.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">2. Restricción de edad — solo mayores de 18 años</h2>
          <p className="text-muted-foreground">
            WeedConnect está dirigido exclusivamente a personas <strong className="text-foreground">mayores de 18 años</strong>. Al acceder al sitio confirmas que cumples este requisito. El registro está prohibido a menores. WeedConnect podrá cancelar sin previo aviso cualquier cuenta donde se detecte que el usuario es menor de edad.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">3. Naturaleza informativa del servicio</h2>
          <p className="text-muted-foreground">
            WeedConnect es una <strong className="text-foreground">plataforma de información, reducción de daños y comunidad</strong>. No prestamos asesoramiento jurídico, médico, farmacológico ni financiero. Los contenidos publicados en WeedConnect son orientativos y no sustituyen la consulta con un profesional cualificado.
          </p>
          <p className="mt-2 text-muted-foreground">
            WeedConnect <strong className="text-foreground">no facilita, promueve ni intermedia en la compraventa, distribución o tráfico de cannabis</strong> ni de ninguna otra sustancia sujeta a legislación especial. La información sobre cultivo tiene carácter exclusivamente educativo.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">4. Cumplimiento de la legalidad local</h2>
          <p className="text-muted-foreground">
            El usuario es el único responsable de conocer y cumplir la legislación vigente en su país, comunidad autónoma o municipio respecto al cannabis y cualquier otra sustancia. WeedConnect no garantiza que los contenidos sean adecuados ni legales en todas las jurisdicciones. El acceso desde territorios donde el contenido sea ilegal queda bajo la responsabilidad exclusiva del usuario.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">5. Registro y seguridad de la cuenta</h2>
          <p className="text-muted-foreground">
            Al registrarte te comprometes a facilitar información veraz y actualizada. Eres responsable de mantener la confidencialidad de tus credenciales y de todas las actividades realizadas desde tu cuenta. Notifica inmediatamente a [EMAIL] cualquier uso no autorizado de tu cuenta.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">6. Contenido generado por usuarios (CGU)</h2>
          <p className="mb-2 text-muted-foreground">
            Al publicar contenido en WeedConnect (posts, fotos, comentarios), el usuario:
          </p>
          <ul className="ml-5 list-disc space-y-1 text-muted-foreground">
            <li>Garantiza que tiene derecho a publicarlo y que no infringe derechos de terceros.</li>
            <li>Concede a WeedConnect una licencia no exclusiva, gratuita y mundial para mostrar dicho contenido en el servicio.</li>
            <li>Acepta que WeedConnect puede eliminarlo si infringe estos términos, sin previo aviso ni obligación de compensación.</li>
          </ul>
          <p className="mt-2 text-muted-foreground">
            WeedConnect actúa como prestador de servicios de alojamiento conforme al artículo 16 de la LSSI-CE y no responde del CGU salvo que, teniendo conocimiento efectivo de su ilicitud, no actúe con diligencia para retirarlo.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">7. Contenido prohibido</h2>
          <p className="mb-2 text-muted-foreground">Está expresamente prohibido publicar o compartir:</p>
          <ul className="ml-5 list-disc space-y-1 text-muted-foreground">
            <li>Ofertas de venta, distribución o intercambio de cannabis u otras sustancias ilegales.</li>
            <li>Contenido que fomente el consumo a menores de edad.</li>
            <li>Datos personales de terceros sin su consentimiento.</li>
            <li>Contenido que incite al odio, la discriminación, la violencia o el acoso.</li>
            <li>Spam, publicidad no autorizada o contenido fraudulento.</li>
            <li>Malware, phishing o cualquier código malicioso.</li>
            <li>Contenido protegido por derechos de autor sin autorización.</li>
          </ul>
          <p className="mt-2 text-muted-foreground">
            La infracción de estas normas puede conllevar la suspensión o eliminación inmediata de la cuenta y, en casos graves, denuncia ante las autoridades competentes.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">8. Suspensión y cancelación de cuentas</h2>
          <p className="text-muted-foreground">
            WeedConnect puede suspender o cancelar cuentas <strong className="text-foreground">a su discreción</strong>, en particular cuando se detecte incumplimiento de estos términos, uso fraudulento del servicio o actividad que ponga en riesgo la plataforma, a terceros o al propio titular. El usuario puede cancelar su cuenta en cualquier momento desde la configuración de perfil.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">9. Limitación de responsabilidad</h2>
          <p className="text-muted-foreground">
            En la máxima medida permitida por la ley aplicable, WeedConnect no será responsable de daños directos, indirectos, incidentales o consecuentes derivados de:
          </p>
          <ul className="mt-2 ml-5 list-disc space-y-1 text-muted-foreground">
            <li>El uso o imposibilidad de uso del servicio.</li>
            <li>Contenido publicado por terceros usuarios.</li>
            <li>Decisiones tomadas por el usuario basándose en información del sitio.</li>
            <li>Consecuencias legales derivadas del consumo de cannabis u otras sustancias.</li>
            <li>Interrupciones, errores técnicos o pérdida de datos.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">10. Propiedad intelectual</h2>
          <p className="text-muted-foreground">
            Todo el código, diseño, textos propios, logotipos e interfaces de WeedConnect son propiedad del titular o están licenciados. Los componentes de código abierto utilizados mantienen sus licencias originales. El nombre «WeedConnect» y su logotipo son marcas del titular.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">11. Política de privacidad y cookies</h2>
          <p className="text-muted-foreground">
            El tratamiento de datos personales se rige por nuestra{" "}
            <a href="/legal/privacidad" className="text-emerald-600 underline underline-offset-2 hover:text-emerald-500">
              Política de Privacidad
            </a>{" "}
            y{" "}
            <a href="/legal/cookies" className="text-emerald-600 underline underline-offset-2 hover:text-emerald-500">
              Política de Cookies
            </a>.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">12. Ley aplicable y resolución de conflictos</h2>
          <p className="text-muted-foreground">
            Estos términos se rigen por la legislación española. Para cualquier disputa, las partes se someten a los juzgados y tribunales del domicilio del titular, salvo que la normativa de consumidores establezca un fuero imperativo distinto. Los usuarios con residencia en la UE también pueden utilizar la plataforma de resolución en línea de litigios de la Comisión Europea.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">13. Contacto</h2>
          <p className="text-muted-foreground">
            Para cualquier consulta sobre estos términos: <strong className="text-foreground">[EMAIL DE CONTACTO]</strong>
          </p>
        </section>

      </div>
    </article>
  );
}
