import type { Metadata } from "next";
import { AlertTriangle, CheckCircle, Info, Scale, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Marco legal del cannabis en España",
  description:
    "Normativa vigente sobre cannabis en España: posesión, consumo, cultivo y asociaciones cannábicas. Información orientativa.",
};

const PAISES = [
  { pais: "Alemania", estado: "Legal (adultos)", color: "emerald" as const, nota: "Desde abril 2024: posesión de hasta 25g en público y 50g en casa. Clubs de cultivo hasta 500 miembros." },
  { pais: "Países Bajos", estado: "Tolerancia", color: "amber" as const, nota: "Venta en coffeeshops tolerada. Cultivo doméstico limitado." },
  { pais: "Portugal", estado: "Despenalizado", color: "blue" as const, nota: "Despenalizado para uso personal desde 2001. Cantidades de referencia: 25g hierba, 5g hachís." },
  { pais: "Italia", estado: "Parcialmente despenalizado", color: "amber" as const, nota: "CBD legal. THC: posesión para uso personal (pequeñas cantidades) puede no generar sanción penal." },
  { pais: "Francia", estado: "Ilegal", color: "red" as const, nota: "Posesión sancionable con multa de hasta 200€ y/o hasta 1 año de prisión." },
  { pais: "España", estado: "Alegal / Zona gris", color: "amber" as const, nota: "Consumo y cultivo para uso personal no están penalizados pero sí sancionados administrativamente." },
];

const COLOR_MAP = {
  emerald: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  amber: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
  red: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
};

export default function LegalPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <header className="mb-6">
        <div className="mb-3 flex items-center gap-2">
          <Scale className="size-6 text-emerald-600" aria-hidden />
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Marco legal</h1>
        </div>
        <p className="max-w-2xl text-muted-foreground">
          Guía orientativa sobre la normativa del cannabis en España y Europa. Esta información no
          constituye asesoramiento jurídico — consulta siempre con un profesional legal.
        </p>
      </header>

      <div className="mb-8 flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-4 text-sm dark:border-amber-800 dark:bg-amber-950/30">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" aria-hidden />
        <p className="text-amber-800 dark:text-amber-200">
          <strong>Aviso importante:</strong> La información de esta página es orientativa y puede
          quedar desactualizada. Las leyes cambian. Ante cualquier duda legal, consulta con un
          abogado especializado en derecho penal y drogas.
        </p>
      </div>

      {/* España */}
      <div className="mb-8 flex flex-col gap-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <span>🇪🇸</span> Situación en España
        </h2>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Info className="size-4 text-blue-600" aria-hidden />
              Consumo y posesión
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
            <p>
              El consumo de cannabis en España <strong className="text-foreground">no es delito</strong> —
              es una infracción administrativa. La Ley Orgánica 4/2015 (Ley Mordaza) y la Ley
              17/1967 regulan las sanciones aplicables.
            </p>
            <ul className="ml-4 list-disc space-y-1">
              <li>
                <strong className="text-foreground">Consumo en la vía pública:</strong> multa de
                601€ a 30.000€ según cantidad y circunstancias.
              </li>
              <li>
                <strong className="text-foreground">Posesión para consumo personal:</strong> no es
                delito penal, pero puede generar sanción administrativa y decomiso.
              </li>
              <li>
                <strong className="text-foreground">Venta:</strong> delito contra la salud pública
                (art. 368 CP). Penas de 1 a 3 años de prisión.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="size-4 text-emerald-600" aria-hidden />
              Cultivo personal
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
            <p>
              El cultivo para autoconsumo es la zona más gris del ordenamiento jurídico español.
              El Tribunal Supremo ha matizado en varias sentencias que el cultivo de pocas plantas
              en un espacio privado, sin indicio de distribución, no siempre constituye delito.
            </p>
            <ul className="ml-4 list-disc space-y-1">
              <li>No existe un número legal de plantas establecido por ley.</li>
              <li>La doctrina del Tribunal Supremo reconoce el autoconsumo compartido entre adultos en espacios privados.</li>
              <li>El cultivo visible desde la vía pública o en espacios comunes sí puede generar consecuencias penales.</li>
            </ul>
            <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs dark:border-blue-900 dark:bg-blue-950/30">
              <Info className="mt-0.5 size-3.5 shrink-0 text-blue-600" />
              <span className="text-blue-800 dark:text-blue-200">
                Recomendación: mantén las plantas en interior, fuera de vista, sin odores perceptibles al exterior. Documenta que el destino es el autoconsumo.
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle className="size-4 text-emerald-600" aria-hidden />
              Asociaciones cannábicas (clubs)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
            <p>
              Las asociaciones cannábicas en España operan en el marco del derecho de asociación
              (art. 22 CE) y la autoorganización. Su fundamento legal es el{" "}
              <strong className="text-foreground">consumo compartido entre adultos</strong> en un
              espacio cerrado.
            </p>
            <ul className="ml-4 list-disc space-y-1">
              <li>Deben ser asociaciones sin ánimo de lucro registradas ante el ministerio competente.</li>
              <li>Solo pueden acceder socios mayores de edad, con cuota y ficha de socio.</li>
              <li>La cantidad distribuida debe ser acorde al consumo personal del socio.</li>
              <li>No pueden vender ni distribuir a no socios.</li>
              <li>Cataluña tiene la regulación autonómica más desarrollada (Ley 13/2017).</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Europa */}
      <div className="mb-8">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          🌍 Panorama europeo
        </h2>
        <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
          {PAISES.map((p) => (
            <div key={p.pais} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-start sm:gap-4">
              <div className="flex shrink-0 items-center gap-3 sm:w-40">
                <span className="font-medium">{p.pais}</span>
              </div>
              <Badge className={`shrink-0 self-start border-0 text-[10px] ${COLOR_MAP[p.color]}`}>
                {p.estado}
              </Badge>
              <p className="text-sm text-muted-foreground">{p.nota}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recursos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recursos y organizaciones</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm">
          <p className="text-muted-foreground">Entidades de referencia en España para asesoramiento y activismo:</p>
          <ul className="ml-4 list-disc space-y-1 text-muted-foreground">
            <li><strong className="text-foreground">CATFAC</strong> — Confederació d&apos;Associacions Cannàbiques de Catalunya</li>
            <li><strong className="text-foreground">FAC</strong> — Federación de Asociaciones Cannábicas (estatal)</li>
            <li><strong className="text-foreground">Energy Control</strong> — análisis de sustancias y reducción de daños (ABD)</li>
            <li><strong className="text-foreground">Cáñamo</strong> — medio de referencia en legislación cannábica española</li>
            <li><strong className="text-foreground">ENCOD</strong> — European Coalition for Just and Effective Drug Policies</li>
          </ul>
        </CardContent>
      </Card>

      <p className="mt-8 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-4 text-sm text-muted-foreground">
        <strong className="text-foreground">Nota de reducción de daños:</strong> WeedConnect es una
        plataforma informativa y comunitaria. No fomentamos el consumo de cannabis. La información
        legal publicada es orientativa. Consulta siempre con un profesional jurídico ante cualquier
        situación concreta.
      </p>
    </section>
  );
}
