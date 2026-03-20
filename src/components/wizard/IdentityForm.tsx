import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Building2, User, Mail, Phone, Target, Users, CheckCircle2 } from "lucide-react";
import type { Identity } from "@/types/checkup";
import { cn } from "@/lib/utils";

// #5 — Apenas 4 campos obrigatórios; segmento e público-alvo são opcionais
const identitySchema = z.object({
  companyName:    z.string().min(2, "Nome da empresa é obrigatório").max(100),
  personName:     z.string().min(2, "Nome do responsável é obrigatório").max(100),
  email:          z.string().email("E-mail inválido").max(255),
  whatsapp:       z.string()
    .min(10, "WhatsApp inválido — use o formato +55 (11) 99999-9999")
    .max(20)
    .regex(/^[\d\s+\-()]+$/, "Use o formato +55 (11) 99999-9999"),
  segment:        z.string().max(100).optional().or(z.literal("")),
  targetAudience: z.string().max(200).optional().or(z.literal("")),
});

type IdentityFormData = z.infer<typeof identitySchema>;

interface IdentityFormProps {
  initialData?: Partial<Identity>;
  onSubmit: (data: Identity) => void;
}

export function IdentityForm({ initialData, onSubmit }: IdentityFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<IdentityFormData>({
    resolver: zodResolver(identitySchema),
    defaultValues: {
      companyName:    initialData?.companyName    || "",
      personName:     initialData?.personName     || "",
      email:          initialData?.email          || "",
      whatsapp:       initialData?.whatsapp       || "",
      segment:        initialData?.segment        || "",
      targetAudience: initialData?.targetAudience || "",
    },
    mode: "onChange",
  });

  const watchedValues = watch();

  // #7 — Feedback positivo por campo
  const isFieldValid = (name: keyof IdentityFormData) => {
    const val = watchedValues[name];
    return val && val.length >= 2 && !errors[name];
  };

  const handleFormSubmit = (data: IdentityFormData) => {
    onSubmit(data as Identity);
  };

  const fieldClass = (name: keyof IdentityFormData) =>
    cn(errors[name] ? "border-destructive" : isFieldValid(name) ? "border-risk-low/60" : "");

  return (
    <Card className="motion-safe:animate-fade-in card-elevated">
      <CardHeader>
        <CardTitle className="font-display text-2xl">Identificação</CardTitle>
        <CardDescription>
          Precisamos conhecer você e sua empresa para personalizar o diagnóstico.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">

            {/* Company Name */}
            <div className="space-y-2">
              <Label htmlFor="companyName" className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                Nome da Empresa
              </Label>
              <div className="relative">
                <Input
                  id="companyName"
                  placeholder="Ex: Sua Empresa Ltda"
                  {...register("companyName")}
                  className={fieldClass("companyName")}
                />
                {isFieldValid("companyName") && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-risk-low pointer-events-none" />
                )}
              </div>
              {errors.companyName && (
                <p className="text-xs text-destructive">{errors.companyName.message}</p>
              )}
            </div>

            {/* Person Name */}
            <div className="space-y-2">
              <Label htmlFor="personName" className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                Seu Nome
              </Label>
              <div className="relative">
                <Input
                  id="personName"
                  placeholder="Ex: João Silva"
                  {...register("personName")}
                  className={fieldClass("personName")}
                />
                {isFieldValid("personName") && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-risk-low pointer-events-none" />
                )}
              </div>
              {errors.personName && (
                <p className="text-xs text-destructive">{errors.personName.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                E-mail
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="joao@suaempresa.com.br"
                  {...register("email")}
                  className={fieldClass("email")}
                />
                {isFieldValid("email") && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-risk-low pointer-events-none" />
                )}
              </div>
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* WhatsApp — #6: hint de formato */}
            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                WhatsApp
              </Label>
              <div className="relative">
                <Input
                  id="whatsapp"
                  placeholder="+55 (11) 99999-9999"
                  {...register("whatsapp")}
                  className={fieldClass("whatsapp")}
                />
                {isFieldValid("whatsapp") && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-risk-low pointer-events-none" />
                )}
              </div>
              {errors.whatsapp ? (
                <p className="text-xs text-destructive">{errors.whatsapp.message}</p>
              ) : (
                <p className="text-xs text-muted-foreground">Formato: +55 (11) 99999-9999</p>
              )}
            </div>

            {/* Segment — opcional */}
            <div className="space-y-2">
              <Label htmlFor="segment" className="flex items-center gap-2">
                <Target className="w-4 h-4 text-muted-foreground" />
                Segmento de Atuação
                <span className="text-xs text-muted-foreground font-normal">(opcional)</span>
              </Label>
              <Input
                id="segment"
                placeholder="Ex: Consultoria B2B, SaaS, Indústria…"
                {...register("segment")}
              />
              <p className="text-xs text-muted-foreground">
                Qual mercado ou setor seu produto/serviço atende?
              </p>
            </div>

            {/* Target Audience — opcional */}
            <div className="space-y-2">
              <Label htmlFor="targetAudience" className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                Público-Alvo
                <span className="text-xs text-muted-foreground font-normal">(opcional)</span>
              </Label>
              <Input
                id="targetAudience"
                placeholder="Ex: Diretores de marketing de PMEs B2B"
                {...register("targetAudience")}
              />
            </div>
          </div>

          {/* #8 — Botão com contexto do próximo passo */}
          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg" disabled={!isValid}>
              Continuar → Canais
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
