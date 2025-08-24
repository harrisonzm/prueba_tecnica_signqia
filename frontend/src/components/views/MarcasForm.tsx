"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Stepper } from "@/components/ui/stepper";
import { ArrowLeft, ArrowRight, Check, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/hooks/use-toast";
import {
  useCreateMarca,
  useUpdateMarca,
  useMarca,
} from "@/components/hooks/marcas";
import {
  MarcaCreateSchema,
  EstadoEnum,
  type MarcaCreate,
  type MarcaUpdate,
} from "@/types/marca-api";

type Mode = "create" | "update";

export interface MarcaFormProps {
  mode: Mode;
  id?: number; // requerido si mode === "update"
}

type FormValues = MarcaCreate; // { nombre, titulo, estado }
const ESTADOS = EstadoEnum.options;

export default function MarcaForm({ mode, id = NaN }: MarcaFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const isUpdate = mode === "update" && typeof id === "number" && Number.isFinite(id);
  // data para update
  const { data: detail, isLoading: isLoadingDetail, error: errorDetail } = useMarca(id, { enabled: isUpdate });

  const update = useUpdateMarca(id ?? -1);
  // mutations
  const create = useCreateMarca();

  // RHF + Zod
  const form = useForm<FormValues>({
    resolver: zodResolver(MarcaCreateSchema),
    defaultValues: { nombre: "", titulo: "", estado: "ACTIVA" },
    mode: "onTouched",
  });

  // si es update, resetea cuando llegue el detalle
  useEffect(() => {
    if (mode === "update") {
      if (detail) {
        form.reset({
          nombre: detail.nombre,
          titulo: detail.titulo,
          estado: detail.estado,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, detail?.id]); // resetea si cambia el recurso

  // steps del multi-step
  const steps = useMemo(
    () => ["Datos Básicos", "Estado", "Resumen"],
    []
  );
  const [currentStep, setCurrentStep] = useState(0);

  const next = useCallback(async () => {
    const fieldsByStep: (keyof FormValues)[][] = [
      ["nombre", "titulo"],
      ["estado"],
      [],
    ];
    const valid = await form.trigger(fieldsByStep[currentStep]);
    if (!valid) return;
    setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  }, [currentStep, form, steps.length]);

  const back = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 0));
  }, []);

  // construir PATCH con solo cambios
  function buildPatch(values: FormValues, dirty: FieldValues): MarcaUpdate {
    const out: MarcaUpdate = {};
    if (dirty.nombre) out.nombre = values.nombre;
    if (dirty.titulo) out.titulo = values.titulo;
    if (dirty.estado) out.estado = values.estado;
    return out;
  }

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (mode === "create") {
        const saved = await create.mutateAsync(values);
        toast({
          title: "Marca creada",
          description: `Se creó "${saved.nombre}" (${saved.estado}).`,
        });
      } else {
        if (!id) throw new Error("Falta id para actualizar.");
        const patch = buildPatch(values, form.formState.dirtyFields);
        if (Object.keys(patch).length === 0) {
          toast({ title: "Sin cambios", description: "No hay cambios para guardar." });
          return;
        }
        const saved = await update.mutateAsync(patch);
        toast({
          title: "Marca actualizada",
          description: `Se actualizó "${saved.nombre}" (${saved.estado}).`,
        });
      }
      router.push("/marcas");
    } catch (err) {
      toast({
        title: mode === "create" ? "Error al crear" : "Error al actualizar",
        description: "Inténtalo de nuevo más tarde.",
        variant: "destructive",
      });
    }
  });

  // UI estados de carga/errores para update
  if (mode === "update") {
    if (isLoadingDetail) {
      return (
        <div className="min-h-[40vh] flex items-center justify-center text-muted-foreground">
          Cargando datos de la marca…
        </div>
      );
    }
    if (errorDetail || !detail) {
      return (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3 text-center">
          <p className="text-foreground font-medium">No se pudo cargar la marca.</p>
          <Link href="/marcas">
            <Button variant="outline">Volver</Button>
          </Link>
        </div>
      );
    }
  }

  // pasos
  const Step0 = (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Datos Básicos</h2>
        <p className="text-muted-foreground">Ingresa nombre y título del registro</p>
      </div>

      <div className="space-y-4 max-w-md mx-auto">
        <div className="space-y-2">
          <Label htmlFor="nombre" className="text-sm font-medium">Nombre *</Label>
          <Input id="nombre" placeholder="Ej: MiMarca Innovadora" {...form.register("nombre")} />
          {form.formState.errors.nombre && (
            <p className="text-sm text-destructive">{form.formState.errors.nombre.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="titulo" className="text-sm font-medium">Título *</Label>
          <Input id="titulo" placeholder="Ej: Titular / Empresa S.A." {...form.register("titulo")} />
          {form.formState.errors.titulo && (
            <p className="text-sm text-destructive">{form.formState.errors.titulo.message}</p>
          )}
        </div>
      </div>
    </div>
  );

  const Step1 = (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Estado</h2>
        <p className="text-muted-foreground">Selecciona el estado actual de la marca</p>
      </div>

      <div className="space-y-2 max-w-md mx-auto">
        <Label htmlFor="estado" className="text-sm font-medium">Estado *</Label>
        <select
          id="estado"
          className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          {...form.register("estado")}
        >
          {ESTADOS.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
        {form.formState.errors.estado && (
          <p className="text-sm text-destructive">{form.formState.errors.estado.message}</p>
        )}
      </div>
    </div>
  );

  const Step2 = (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Resumen</h2>
        <p className="text-muted-foreground">Revisa la información antes de {mode === "create" ? "crear" : "actualizar"}</p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardContent className="pt-6 space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Nombre</Label>
              <p className="text-lg font-semibold text-foreground">
                {form.getValues("nombre") || "—"}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Título</Label>
              <p className="text-lg font-semibold text-foreground">
                {form.getValues("titulo") || "—"}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Estado</Label>
              <p className="text-foreground">{form.getValues("estado") || "—"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderStep = () => {
    if (currentStep === 0) return Step0;
    if (currentStep === 1) return Step1;
    return Step2;
  };

  const canContinue =
    (currentStep === 0 && form.getValues("nombre").trim() && form.getValues("titulo").trim()) ||
    (currentStep === 1 && form.getValues("estado")) ||
    currentStep === 2;

  const isPending = mode === "create" ? create.isPending : update.isPending;

  return (
    <form onSubmit={onSubmit} className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      {/* Encabezado */}
      <div className="flex items-center gap-4">
        <Link href="/marcas">
          <Button type="button" variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {mode === "create" ? "Crear Registro" : "Editar Registro"}
          </h1>
          <p className="text-muted-foreground">
            {mode === "create" ? "Registra una nueva marca" : "Actualiza la información de la marca"}
          </p>
        </div>
      </div>

      {/* Stepper */}
      <div className="py-8">
        <Stepper steps={steps} currentStep={currentStep} />
      </div>

      {/* Contenido */}
      <Card className="card-elevated">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <CardTitle>Servicios/Registro de Marca</CardTitle>
          <CardDescription>
            Paso {currentStep + 1} de {steps.length}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 pb-8">
          {renderStep()}

          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            {currentStep > 0 ? (
              <Button type="button" variant="outline" onClick={back} className="btn-ghost-primary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Atrás
              </Button>
            ) : (
              <div />
            )}

            {currentStep < steps.length - 1 ? (
              <Button type="button" onClick={next} disabled={!canContinue} className="btn-gradient">
                Continuar
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button type="submit" disabled={isPending} className="btn-gradient">
                <Check className="w-4 h-4 mr-2" />
                {isPending ? (mode === "create" ? "Creando..." : "Guardando...") : (mode === "create" ? "Crear" : "Guardar")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
