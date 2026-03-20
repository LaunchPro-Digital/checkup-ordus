import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Building2, User, Mail, Phone, Target, Users, CheckCircle2 } from "lucide-react";
import type { Identity } from "@/types/checkup";
import { cn } from "@/lib/utils";

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

  const isFieldValid = (name: keyof IdentityFormData) => {
    const val = watchedValues[name];
    return val && val.length >= 2 && !errors[name];
  };

  const handleFormSubmit = (data: IdentityFormData) => {
    onSubmit(data as Identity);
  };

  const inputClass = (name: keyof IdentityFormData) =>
    cn(
      errors[name]
        ? "border-destructive focus-visible:ring-destructive/20"
        : isFieldValid(name)
        ? "border-risk-low/60 focus-visible:ring-risk-low/20"
        : ""
    );

  return (
    <div className="w-full max-w-2xl mx-auto motion-safe:animate-fade-in">

      {/* Hero — headline + subtítulo */}
      <div className="text-center mb-10">
        <div
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm mx-auto mb-6"
          style={{
            background: 'rgba(0,164,123,.10)',
            border: '1px solid rgba(0,164,123,.25)',
            color: '#00D4A0',
          }}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span className="font-label text-[11px]">Diagnóstico gratuito · Resultado imediato</span>
        </div>

        <h1
          className="font-sans font-black uppercase leading-none mb-4"
          style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            letterSpacing: '-0.02em',
            color: '#F0F0F3',
          }}
        >
          Identifique por que seus clientes{' '}
          <span style={{ color: '#C060FF' }}>travam as decisões de compra</span>
        </h1>

        <p className="text-base md:text-lg leading-relaxed" style={{ color: '#ABABAB' }}>
          O <strong style={{ color: '#F0F0F3' }}>Coeficiente de Risco Percebido (CRP)</strong> mede
          o nível de desconfiança que o cliente tem sobre seu negócio.{' '}
          20 perguntas. Resultado imediato. Plano de ação.
        </p>
      </div>

      {/* Form Card */}
      <div className="card-elevated p-6 md:p-8 shadow-elevated">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">

            <div className="space-y-1.5">
              <Label htmlFor="companyName" className="flex items-center gap-2 text-xs font-label tracking-wide" style={{ color: '#6A6A6A' }}>
                <Building2 className="w-3.5 h-3.5" />
                NOME DA EMPRESA <span style={{ color: '#9A11E9' }}>*</span>
              </Label>
              <div className="relative">
                <Input id="companyName" placeholder="Ex: Sua Empresa Ltda" {...register("companyName")} className={inputClass("companyName")} />
                {isFieldValid("companyName") && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-risk-low pointer-events-none" />}
              </div>
              {errors.companyName && <p className="text-xs text-destructive">{errors.companyName.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="personName" className="flex items-center gap-2 text-xs font-label tracking-wide" style={{ color: '#6A6A6A' }}>
                <User className="w-3.5 h-3.5" />
                SEU NOME <span style={{ color: '#9A11E9' }}>*</span>
              </Label>
              <div className="relative">
                <Input id="personName" placeholder="Ex: João Silva" {...register("personName")} className={inputClass("personName")} />
                {isFieldValid("personName") && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-risk-low pointer-events-none" />}
              </div>
              {errors.personName && <p className="text-xs text-destructive">{errors.personName.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="flex items-center gap-2 text-xs font-label tracking-wide" style={{ color: '#6A6A6A' }}>
                <Mail className="w-3.5 h-3.5" />
                E-MAIL <span style={{ color: '#9A11E9' }}>*</span>
              </Label>
              <div className="relative">
                <Input id="email" type="email" placeholder="joao@suaempresa.com.br" {...register("email")} className={inputClass("email")} />
                {isFieldValid("email") && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-risk-low pointer-events-none" />}
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="whatsapp" className="flex items-center gap-2 text-xs font-label tracking-wide" style={{ color: '#6A6A6A' }}>
                <Phone className="w-3.5 h-3.5" />
                WHATSAPP <span style={{ color: '#9A11E9' }}>*</span>
              </Label>
              <div className="relative">
                <Input id="whatsapp" placeholder="+55 (11) 99999-9999" {...register("whatsapp")} className={inputClass("whatsapp")} />
                {isFieldValid("whatsapp") && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-risk-low pointer-events-none" />}
              </div>
              {errors.whatsapp ? (
                <p className="text-xs text-destructive">{errors.whatsapp.message}</p>
              ) : (
                <p className="text-xs" style={{ color: '#6A6A6A' }}>Formato: +55 (11) 99999-9999</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="segment" className="flex items-center gap-2 text-xs font-label tracking-wide" style={{ color: '#6A6A6A' }}>
                <Target className="w-3.5 h-3.5" />
                SEGMENTO
                <span className="font-sans normal-case tracking-normal" style={{ color: '#6A6A6A', fontWeight: 400 }}>(opcional)</span>
              </Label>
              <Input id="segment" placeholder="Ex: Consultoria B2B, SaaS, Indústria…" {...register("segment")} />
              <p className="text-xs" style={{ color: '#6A6A6A' }}>Qual mercado seu produto/serviço atende?</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="targetAudience" className="flex items-center gap-2 text-xs font-label tracking-wide" style={{ color: '#6A6A6A' }}>
                <Users className="w-3.5 h-3.5" />
                PÚBLICO-ALVO
                <span className="font-sans normal-case tracking-normal" style={{ color: '#6A6A6A', fontWeight: 400 }}>(opcional)</span>
              </Label>
              <Input id="targetAudience" placeholder="Ex: Diretores de marketing de PMEs B2B" {...register("targetAudience")} />
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" variant="cta" size="lg" disabled={!isValid} className="w-full h-12 text-sm">
              CONTINUAR → CANAIS
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <p className="text-center mt-3" style={{ fontSize: '11px', color: '#6A6A6A' }}>
              Seus dados estão seguros. Política de privacidade.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
                                                                                                                    }
