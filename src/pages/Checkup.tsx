import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { WizardStepper, type WizardStep } from "@/components/wizard/WizardStepper";
import { IdentityForm } from "@/components/wizard/IdentityForm";
import { ChannelSelector } from "@/components/wizard/ChannelSelector";
import { CheckupForm } from "@/components/wizard/CheckupForm";
import { useWizardDraft } from "@/hooks/useWizardDraft";
import { calculateCRP } from "@/lib/crpEngine";
import { generateRecommendation } from "@/lib/recommendationEngine";
import type { Identity, Channel, Answer, Submission } from "@/types/checkup";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WIZARD_STEPS: WizardStep[] = [
  { id: "identify", label: "Identificação", description: "Dados da empresa" },
  { id: "channels", label: "Canais", description: "Presença online" },
  { id: "checkup", label: "Checkup", description: "20 perguntas" },
];

export default function Checkup() {
  const navigate = useNavigate();
  const { draft, isLoaded, updateStep, updateIdentity, updateChannels, setAnswer, clearDraft } = useWizardDraft();
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();

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

  const handleCheckupSubmit = (answers: Answer[]) => {
    try {
      // Calculate CRP
      const crpResult = calculateCRP(answers);
      
      // Generate recommendations
      const recommendation = generateRecommendation(
        crpResult.crp.band,
        crpResult.pillars,
        crpResult.topGaps
      );

      // Create submission
      const newSubmission: Submission = {
        id: crypto.randomUUID ? crypto.randomUUID() : `sub-${Date.now()}`,
        createdAt: new Date(),
        identity: draft.identity as Identity,
        channels: draft.channels,
        answers,
        pillars: crpResult.pillars,
        crp: crpResult.crp,
        topGaps: crpResult.topGaps,
        output: recommendation,
      };
      
      // Clear draft after successful submission
      clearDraft();
      
      // Navigate to results page with submission data
      navigate("/resultados", { state: { submission: newSubmission } });
    } catch (error) {
      console.error("Error calculating CRP:", error);
      toast({
        title: "Erro ao processar",
        description: "Ocorreu um erro ao calcular o CRP. Tente novamente.",
        variant: "destructive",
      });
    }
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
          <div className="rounded-lg border border-foreground/10 bg-muted/50 p-4 flex gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <strong className="text-foreground">Sobre este diagnóstico:</strong> O Coeficiente de Risco Percebido (CRP) mede o índice de desconfiança que o cliente tem sobre seu negócio. Quanto maior o índice, maior o risco e mais tempo ele demora para decidir. Ou desiste.
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
          <CheckupForm
            initialAnswers={draft.answers}
            onSubmit={handleCheckupSubmit}
            onBack={() => goToStep(1)}
            onAnswerChange={setAnswer}
          />
        )}
      </div>
    </AppShell>
  );
}
