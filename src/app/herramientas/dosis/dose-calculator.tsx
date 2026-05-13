"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// El THC en flor es típicamente 10-25%. La eficiencia de extracción al cocinar
// (decarboxilación + infusión en grasa) suele rondar el 40-70%. Usamos 60% por
// defecto como valor conservador medio. Fuente: literatura sobre cannabinoides.
const DEFAULT_EFFICIENCY = 60;

export function DoseCalculator() {
  const [grams, setGrams] = useState(7);
  const [thcPct, setThcPct] = useState(18);
  const [efficiency, setEfficiency] = useState(DEFAULT_EFFICIENCY);
  const [servings, setServings] = useState(12);

  const totals = useMemo(() => {
    const totalThcMg = grams * 1000 * (thcPct / 100);
    const bioavailableMg = totalThcMg * (efficiency / 100);
    const perServingMg = servings > 0 ? bioavailableMg / servings : 0;
    const gramsPerServing = servings > 0 ? grams / servings : 0;
    return {
      totalThcMg: round(totalThcMg, 0),
      bioavailableMg: round(bioavailableMg, 0),
      perServingMg: round(perServingMg, 1),
      gramsPerServing: round(gramsPerServing, 2),
    };
  }, [grams, thcPct, efficiency, servings]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,360px)]">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Parámetros</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5">
          <Field
            id="grams"
            label="Cantidad de flor / extracto"
            unit="gramos"
            value={grams}
            min={0}
            step={0.5}
            onChange={setGrams}
            hint="Cuánto material vas a usar en la receta o extracción."
          />
          <Field
            id="thc"
            label="Potencia THC"
            unit="%"
            value={thcPct}
            min={0}
            max={99}
            step={0.5}
            onChange={setThcPct}
            hint="Si no sabes la cifra exacta, una flor comercial suele rondar el 15-22%."
          />
          <Field
            id="efficiency"
            label="Eficiencia de extracción"
            unit="%"
            value={efficiency}
            min={1}
            max={100}
            step={5}
            onChange={setEfficiency}
            hint="Cuánto THC se transfiere realmente del material al producto final. El valor por defecto (60%) es conservador para infusiones caseras en mantequilla o aceite."
          />
          <Field
            id="servings"
            label="Nº de porciones"
            unit="porciones"
            value={servings}
            min={1}
            max={500}
            step={1}
            onChange={setServings}
            hint="En cuántas porciones iguales repartirás el producto final."
          />
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        <Card className="border-emerald-300/60 bg-emerald-50/50 dark:bg-emerald-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Resultado por porción</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-4xl font-extrabold text-emerald-700 dark:text-emerald-300 tracking-tight">
                {totals.gramsPerServing} <span className="text-lg font-medium">g de marihuana</span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Equivalente de materia vegetal / flor por porción.
              </p>
            </div>
            <div className="border-t border-emerald-300/30 dark:border-emerald-700/30 pt-3">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {totals.perServingMg} <span className="text-base font-medium">mg THC</span>
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground leading-normal">
                Una dosis típica para principiantes ronda los <strong>2.5–5 mg</strong>; usuarios
                habituales suelen estar entre <strong>10–20 mg</strong> de THC por porción.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Detalle</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2 text-sm">
              <Row label="Marihuana total usada" value={`${grams} g`} />
              <Row label="Nº de porciones" value={`${servings}`} />
              <Row
                label="Marihuana por porción"
                value={`${totals.gramsPerServing} g`}
                highlight
              />
              <Row label="THC total en el material" value={`${totals.totalThcMg} mg`} />
              <Row label="THC biodisponible tras extracción" value={`${totals.bioavailableMg} mg`} />
              <Row
                label="THC estimado por porción"
                value={`${totals.perServingMg} mg`}
              />
            </dl>
          </CardContent>
        </Card>

        <p className="rounded-md border border-amber-300/60 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-700/40 dark:bg-amber-950/40 dark:text-amber-200">
          ⚠ Esta calculadora ofrece una estimación. Empieza siempre con la dosis más baja y
          espera <strong>al menos 2 horas</strong> antes de tomar más: el efecto oral es lento y
          acumulativo.
        </p>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  unit,
  value,
  min,
  max,
  step,
  onChange,
  hint,
}: {
  id: string;
  label: string;
  unit: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (n: number) => void;
  hint?: string;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>
        {label} <span className="text-muted-foreground">({unit})</span>
      </Label>
      <Input
        id={id}
        type="number"
        inputMode="decimal"
        min={min}
        max={max}
        step={step}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-border/50 pb-1.5 last:border-0 last:pb-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={highlight ? "font-semibold text-emerald-700 dark:text-emerald-300" : "font-medium"}>
        {value}
      </dd>
    </div>
  );
}

function round(n: number, digits: number) {
  const p = 10 ** digits;
  return Math.round(n * p) / p;
}
