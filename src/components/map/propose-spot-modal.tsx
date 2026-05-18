"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { proposeSpot } from "@/app/actions/clubs";

const schema = z.object({
  name: z.string().min(3, "Mínimo 3 caracteres").max(100, "Máximo 100 caracteres"),
  type: z.enum(["asociacion", "spot_libre"] as const),
  city: z.string().min(2, "Mínimo 2 caracteres").max(80),
  address: z.string().min(5, "Mínimo 5 caracteres").max(200),
  description: z.string().max(500, "Máximo 500 caracteres").optional(),
});

type FormValues = z.infer<typeof schema>;

interface ProposeSpotModalProps {
  open: boolean;
  lat: number;
  lng: number;
  onClose: () => void;
}

export function ProposeSpotModal({ open, lat, lng, onClose }: ProposeSpotModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { type: "asociacion" },
  });

  async function onSubmit(values: FormValues) {
    const result = await proposeSpot({ ...values, lat, lng });
    if (result.ok) {
      toast.success("Propuesta enviada con éxito. Un moderador la revisará pronto.");
      reset();
      onClose();
    } else {
      toast.error(result.error);
    }
  }

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      reset();
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="size-4 text-emerald-600" />
            Proponer nuevo spot
          </DialogTitle>
          <DialogDescription>
            Coordenadas seleccionadas: {lat.toFixed(5)}, {lng.toFixed(5)}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 pt-1">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ps-name">Nombre del lugar *</Label>
            <Input
              id="ps-name"
              placeholder="Ej: Club Verde Barcelona"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ps-type">Tipo *</Label>
            <select
              id="ps-type"
              {...register("type")}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="asociacion">Asociación / Club</option>
              <option value="spot_libre">Spot Libre / Mirador</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ps-city">Ciudad *</Label>
            <Input id="ps-city" placeholder="Ej: Barcelona" {...register("city")} />
            {errors.city && (
              <p className="text-xs text-destructive">{errors.city.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ps-address">Dirección / Cómo llegar *</Label>
            <Input
              id="ps-address"
              placeholder="Ej: Calle Mayor 12, o 'Detrás del parque'"
              {...register("address")}
            />
            {errors.address && (
              <p className="text-xs text-destructive">{errors.address.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ps-description">Descripción (opcional)</Label>
            <Textarea
              id="ps-description"
              placeholder="Ambiente, horarios, acceso, requisitos…"
              rows={3}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enviando…" : "Enviar propuesta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
