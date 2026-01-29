import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { WizardStepper, type WizardStep } from "@/components/wizard/WizardStepper";
import { IdentityForm } from "@/components/wizard/IdentityForm";
import { ChannelSelector } from "@/components/wizard/ChannelSelector";
import { useWizardDraft } from "@/hooks/useWizardDraft";
import type { Identity, Channel } from "@/types/checkup";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

const WIZARD_STEPS: WizardStep[] = [
  { id: "identify", label: "Identificação", description: "Dados da empresa" },
  { id: "channels", label: "Canais", description: "Presença online" },
  { id: "checkup", label: "Checkup", description: "20 perguntas" },
  { id: "result", label: "Resultado", description: "Diagnóstico CRP" },
];

export default function Checkup() {
  const { draft, isLoaded, updateStep, updateIdentity, updateChannels } = useWizardDraft();
  const [currentStep, setCurrentStep] = useState(0);

  // Sync step from draft when loaded
  useEffect(() => {
    if (isLoaded && draft.step < WIZARD_STEPS.length) {
      setCurrentStep(draft.step);
    }
  }, [isLoaded, draft.step]);

  const goToStep = (step: number) => {
    setCurrentStep(step);
    updateStep(step);
  };

  const handleIdentitySubmit = (data: Identity) => {
    updateIdentity(data);
    goToStep(1);
  };

  const handleChannelsSubmit = (channels: Channel[]) => {
    updateChannels(channels);
    goToStep(2);
  };

  if (!isLoaded) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse text-muted-foreground">Carregando...</div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Stepper */}
        <WizardStepper
          steps={WIZARD_STEPS}
          currentStep={currentStep}
          onStepClick={(step) => step < currentStep && goToStep(step)}
        />

        {/* Context Notice (shown on first step) */}
        {currentStep === 0 && (
          <div className="rounded-lg border border-accent/30 bg-accent/5 p-4 flex gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <strong className="text-foreground">Sobre este diagnóstico:</strong> O CRP mede{" "}
              <em>risco percebido</em> (o que o cliente acha que pode dar errado), não risco real.
              Ele avalia até a qualificação e o repasse ao comercial — rotinas de vendas e entrega
              operacional são temas separados.
            </div>
          </div>
        )}

        {/* Step Content */}
        {currentStep === 0 && (
          <IdentityForm
            initialData={draft.identity}
            onSubmit={handleIdentitySubmit}
          />
        )}

        {currentStep === 1 && (
          <ChannelSelector
            initialChannels={draft.channels}
            onSubmit={handleChannelsSubmit}
            onBack={() => goToStep(0)}
          />
        )}

        {currentStep === 2 && (
          <Card className="animate-fade-in card-elevated">
            <CardHeader>
              <CardTitle className="font-display text-2xl">Checkup de Credibilidade</CardTitle>
              <CardDescription>
                Responda as 20 perguntas sobre sua presença online. (Em desenvolvimento - Fase 2)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                O formulário de perguntas será implementado na Fase 2.
              </p>
            </CardContent>
          </Card>
        )}

        {currentStep === 3 && (
          <Card className="animate-fade-in card-elevated">
            <CardHeader>
              <CardTitle className="font-display text-2xl">Resultado</CardTitle>
              <CardDescription>
                Seu diagnóstico CRP será exibido aqui. (Em desenvolvimento - Fase 3)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                A visualização de resultados será implementada na Fase 3.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
