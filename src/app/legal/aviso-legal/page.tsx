import type { Metadata } from "next";
import { Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "Aviso Legal · WeedConnect",
  description: "Información legal sobre el titular del sitio web WeedConnect, sus condiciones de uso y propiedad intelectual.",
  robots: { index: false },
};

export default function AvisoLegalPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <PageHeader className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <Scale className="size-5 text-emerald-600" aria-hidden />
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Aviso Legal</h1>
        </div>
        <p className="text-sm text-muted-foreground">Última actualización: mayo 2026</p>
      </PageHeader>

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-8 text-sm leading-relaxed text-foreground/90">

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">1. Datos identificativos del titular</h2>
          <p>En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSI-CE), se facilitan los siguientes datos:</p>
          <ul className="mt-2 ml-5 list-disc space-y-1 text-muted-foreground">
            <li><strong className="text-foreground">Titular:</strong> [NOMBRE COMPLETO O RAZÓN SOCIAL]</li>
            <li><strong className="text-foreground">NIF/NIE/CIF:</strong> [NÚMERO DE IDENTIFICACIÓN FISCAL]</li>
            <li><strong className="text-foreground">Domicilio:</strong> [DIRECCIÓN COMPLETA, CIUDAD, CÓDIGO POSTAL, ESPAÑA]</li>
            <li><strong className="text-foreground">Correo electrónico:</strong> [EMAIL DE CONTACTO LEGAL]</li>
            <li><strong className="text-foreground">Dominio:</strong> [www.weedconnect.xxx]</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">2. Objeto y naturaleza del sitio</h2>
          <p>
            WeedConnect es una plataforma web de <strong>carácter informativo, educativo y comunitario</strong> sobre cannabis. Sus contenidos tienen finalidad exclusivamente divulgativa: información legal orientativa, cultivo como actividad de reducción de daños, foro de usuarios adultos y directorio de locales de acceso libre o entidades asociativas.
          </p>
          <p className="mt-2">
            WeedConnect <strong>no vende, distribuye, ni facilita el comercio o tráfico de cannabis</strong> o de cualquier sustancia sujeta a fiscalización. Cualquier contenido generado por usuarios que contravenga esta naturaleza será eliminado.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">3. Condiciones de uso</h2>
          <p>El acceso y uso de este sitio implica la aceptación de las presentes condiciones. El usuario se compromete a:</p>
          <ul className="mt-2 ml-5 list-disc space-y-1 text-muted-foreground">
            <li>Ser mayor de 18 años.</li>
            <li>No utilizar el sitio con fines ilícitos o contrarios a la legislación vigente.</li>
            <li>No publicar contenido que fomente el tráfico de drogas, la violencia, el odio o que vulnere derechos de terceros.</li>
            <li>Cumplir la legislación aplicable en su territorio respecto al cannabis.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">4. Propiedad intelectual e industrial</h2>
          <p>
            Los textos, diseños, logotipos, imágenes y demás contenidos de WeedConnect son propiedad de su titular o se utilizan bajo licencia. Queda prohibida su reproducción total o parcial sin autorización expresa por escrito, salvo para uso personal y privado.
          </p>
          <p className="mt-2">
            El contenido generado por usuarios (posts del foro, fotos, comentarios) es responsabilidad exclusiva de quien lo publica. El titular de WeedConnect actúa como prestador de servicios de alojamiento conforme al artículo 16 de la LSSI-CE, sin obligación de supervisión previa.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">5. Exención de responsabilidad</h2>
          <p>El titular no se responsabiliza de:</p>
          <ul className="mt-2 ml-5 list-disc space-y-1 text-muted-foreground">
            <li>La veracidad, exactitud o actualización de la información legal publicada, que tiene carácter meramente orientativo.</li>
            <li>Las decisiones tomadas por los usuarios a partir de los contenidos del sitio.</li>
            <li>Los contenidos de sitios web enlazados desde WeedConnect.</li>
            <li>Los daños o perjuicios derivados de interrupciones técnicas o fallos del servicio.</li>
            <li>El contenido publicado por usuarios registrados.</li>
          </ul>
          <p className="mt-2">
            La información sobre legislación cannábica puede quedar desactualizada. Ante cualquier situación legal concreta, consulta con un abogado.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">6. Ley aplicable y jurisdicción</h2>
          <p>
            El presente aviso legal se rige por la legislación española. Para la resolución de conflictos, las partes se someten a los juzgados y tribunales del domicilio del titular, con renuncia expresa a cualquier otro fuero que pudiera corresponderles.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">7. Modificaciones</h2>
          <p>
            El titular se reserva el derecho a modificar el presente aviso legal en cualquier momento. Las modificaciones serán efectivas desde su publicación en el sitio web.
          </p>
        </section>

      </div>
    </article>
  );
}

const PageHeader = "header";
