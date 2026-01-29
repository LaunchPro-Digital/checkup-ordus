import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { RatingScale } from "./RatingScale";
import { QUESTIONS, PILLAR_NAMES, getQuestionsByPillar, type Pillar } from "@/lib/questionBank";
import type { Answer } from "@/types/checkup";
import { cn } from "@/lib/utils";

interface CheckupFormProps {
  initialAnswers?: Answer[];
  onSubmit: (answers: Answer[]) => void;
  onBack: () => void;
  onAnswerChange?: (questionId: string, score: 1 | 2 | 3 | 4 | 5) => void;
}

const PILLARS: Pillar[] = ["C", "O", "R", "E"];

const PILLAR_COLORS: Record<Pillar, string> = {
  C: "border-pillar-c/30 bg-pillar-c/5",
  O: "border-pillar-o/30 bg-pillar-o/5",
  R: "border-pillar-r/30 bg-pillar-r/5",
  E: "border-pillar-e/30 bg-pillar-e/5",
};

const PILLAR_BADGE_COLORS: Record<Pillar, string> = {
  C: "bg-pillar-c text-white",
  O: "bg-pillar-o text-white",
  R: "bg-pillar-r text-white",
  E: "bg-pillar-e text-white",
};

export function CheckupForm({ initialAnswers = [], onSubmit, onBack, onAnswerChange }: CheckupFormProps) {
  const [answers, setAnswers] = useState<Map<string, 1 | 2 | 3 | 4 | 5>>(
    new Map(initialAnswers.map((a) => [a.questionId, a.score]))
  );
  const [currentPillar, setCurrentPillar] = useState<number>(0);

  const currentPillarKey = PILLARS[currentPillar];
  const pillarQuestions = useMemo(() => getQuestionsByPillar(currentPillarKey), [currentPillarKey]);

  const totalAnswered = answers.size;
  const progress = (totalAnswered / QUESTIONS.length) * 100;
  
  const pillarAnswered = pillarQuestions.filter((q) => answers.has(q.id)).length;
  const isPillarComplete = pillarAnswered === pillarQuestions.length;
  const isAllComplete = totalAnswered === QUESTIONS.length;

  const handleAnswer = (questionId: string, score: 1 | 2 | 3 | 4 | 5) => {
    setAnswers((prev) => {
      const next = new Map(prev);
      next.set(questionId, score);
      return next;
    });
    onAnswerChange?.(questionId, score);
  };

  const handleSubmit = () => {
    const answerArray: Answer[] = Array.from(answers.entries()).map(([questionId, score]) => ({
      questionId,
      score,
    }));
    onSubmit(answerArray);
  };

  const goToPillar = (index: number) => {
    if (index >= 0 && index < PILLARS.length) {
      setCurrentPillar(index);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            {totalAnswered} de {QUESTIONS.length} perguntas respondidas
          </span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Pillar navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {PILLARS.map((pillar, index) => {
          const questions = getQuestionsByPillar(pillar);
          const answered = questions.filter((q) => answers.has(q.id)).length;
          const complete = answered === questions.length;
          const isCurrent = index === currentPillar;

          return (
            <button
              key={pillar}
              onClick={() => goToPillar(index)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all whitespace-nowrap",
                isCurrent && PILLAR_COLORS[pillar],
                isCurrent && "border-2",
                !isCurrent && "border-border hover:bg-muted/50"
              )}
            >
              {complete ? (
                <CheckCircle2 className="w-4 h-4 text-risk-low flex-shrink-0" />
              ) : answered > 0 ? (
                <div className="w-4 h-4 rounded-full border-2 border-risk-medium flex-shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-border flex-shrink-0" />
              )}
              <span className={cn("font-medium text-sm", isCurrent ? "text-foreground" : "text-muted-foreground")}>
                {PILLAR_NAMES[pillar]}
              </span>
              <span className="text-xs text-muted-foreground">
                {answered}/{questions.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Current pillar card */}
      <Card className={cn("card-elevated border-2", PILLAR_COLORS[currentPillarKey])}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className={cn("px-3 py-1 rounded-full text-sm font-semibold", PILLAR_BADGE_COLORS[currentPillarKey])}>
              {currentPillarKey}
            </span>
            <CardTitle className="font-display text-xl">{PILLAR_NAMES[currentPillarKey]}</CardTitle>
          </div>
          <CardDescription>
            {currentPillarKey === "C" && "O decisor entende o que você faz, para quem e por que confiar?"}
            {currentPillarKey === "O" && "Sua operação parece uma máquina organizada ou improvisada?"}
            {currentPillarKey === "R" && "Outros já confiaram? Dá para validar sem falar com você?"}
            {currentPillarKey === "E" && "Isso funciona agora e continua funcionando depois?"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {pillarQuestions.map((question, qIndex) => (
            <div
              key={question.id}
              className={cn(
                "space-y-4 pb-6",
                qIndex < pillarQuestions.length - 1 && "border-b border-border/50"
              )}
            >
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
                  {question.order}
                </span>
                <p className="text-foreground leading-relaxed pt-0.5">{question.text}</p>
              </div>
              <div className="pl-10">
                <RatingScale
                  value={answers.get(question.id)}
                  onChange={(score) => handleAnswer(question.id, score)}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={currentPillar === 0 ? onBack : () => goToPillar(currentPillar - 1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {currentPillar === 0 ? "Voltar" : "Pilar anterior"}
        </Button>

        {currentPillar < PILLARS.length - 1 ? (
          <Button
            onClick={() => goToPillar(currentPillar + 1)}
            disabled={!isPillarComplete}
          >
            Próximo pilar
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!isAllComplete}
            className={cn(isAllComplete && "bg-accent hover:bg-accent/90")}
          >
            {isAllComplete ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Ver Resultado
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 mr-2" />
                Responda todas ({totalAnswered}/{QUESTIONS.length})
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
