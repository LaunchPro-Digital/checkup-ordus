import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Building2, User, Mail, Phone, Target, Users } from "lucide-react";
import type { Identity } from "@/types/checkup";

const identitySchema = z.object({
  companyName: z.string().min(2, "Nome da empresa é obrigatório").max(100),
  personName: z.string().min(2, "Nome do responsável é obrigatório").max(100),
  email: z.string().email("E-mail inválido").max(255),
  whatsapp: z.string()
    .min(10, "WhatsApp inválido")
    .max(20)
    .regex(/^[\d\s\+\-\(\)]+$/, "Formato de telefone inválido"),
  segment: z.string().min(2, "Segmento é obrigatório").max(100),
  targetAudience: z.string().min(2, "Público-alvo é obrigatório").max(200),
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
    formState: { errors, isValid },
  } = useForm<IdentityFormData>({
    resolver: zodResolver(identitySchema),
    defaultValues: {
      companyName: initialData?.companyName || "",
      personName: initialData?.personName || "",
      email: initialData?.email || "",
      whatsapp: initialData?.whatsapp || "",
      segment: initialData?.segment || "",
      targetAudience: initialData?.targetAudience || "",
    },
    mode: "onChange",
  });

  const handleFormSubmit = (data: IdentityFormData) => {
    onSubmit(data as Identity);
  };

  return (
    <Card className="animate-fade-in card-elevated">
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
              <Input
                id="companyName"
                placeholder="Ex: Sua Empresa Ltda"
                {...register("companyName")}
                className={errors.companyName ? "border-destructive" : ""}
              />
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
              <Input
                id="personName"
                placeholder="Ex: João Silva"
                {...register("personName")}
                className={errors.personName ? "border-destructive" : ""}
              />
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
              <Input
                id="email"
                type="email"
                placeholder="joao@suaempresa.com.br"
                {...register("email")}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* WhatsApp */}
            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                WhatsApp
              </Label>
              <Input
                id="whatsapp"
                placeholder="+55 11 99999-9999"
                {...register("whatsapp")}
                className={errors.whatsapp ? "border-destructive" : ""}
              />
              {errors.whatsapp && (
                <p className="text-xs text-destructive">{errors.whatsapp.message}</p>
              )}
            </div>

            {/* Segment */}
            <div className="space-y-2">
              <Label htmlFor="segment" className="flex items-center gap-2">
                <Target className="w-4 h-4 text-muted-foreground" />
                Segmento de Atuação
              </Label>
              <Input
                id="segment"
                placeholder="Ex: Consultoria B2B, SaaS, Indústria..."
                {...register("segment")}
                className={errors.segment ? "border-destructive" : ""}
              />
              {errors.segment && (
                <p className="text-xs text-destructive">{errors.segment.message}</p>
              )}
            </div>

            {/* Target Audience */}
            <div className="space-y-2">
              <Label htmlFor="targetAudience" className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                Público-Alvo
              </Label>
              <Input
                id="targetAudience"
                placeholder="Ex: Diretores de marketing de PMEs"
                {...register("targetAudience")}
                className={errors.targetAudience ? "border-destructive" : ""}
              />
              {errors.targetAudience && (
                <p className="text-xs text-destructive">{errors.targetAudience.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg" disabled={!isValid}>
              Continuar
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
