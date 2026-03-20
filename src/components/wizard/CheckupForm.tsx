import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Circle } from "lucide-react";
import { RatingScale } from "./RatingScale";
import { QUESTIONS, PILLAR_NAMES, getQuestionsByPillar, type Pillar } from "@/lib/questionBank";
import { PILLAR_COLORS, PILLAR_BADGE_COLORS, PILLAR_DESCRIPTIONS } from "@/data/pillarConfig";
import type { Answer } from "@/types/checkup";
import { cn } from "@/lib/utils";

interface CheckupFormProps {
  initialAnswers?: Answer[];
  onSubmit: (answers: Answer[]) => void;
  onBack: () => void;
  onAnswerChange?: (questionId: string, score: 1 | 2 | 3 | 4 | 5) => void;
}

const PILLARS: Pillar[] = ["C", "O", "R", "E"];

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

  // #21 — Texto motivacional perto do fim
  const progressLabel = useMemo(() => {
    const remaining = QUESTIONS.length - totalAnswered;
    if (remaining === 0) return `${QUESTIONS.length} de ${QUESTIONS.length} — Diagnóstico completo!`;
    if (remaining <= 3) return `Quase lá — só mais ${remaining} pergunta${remaining > 1 ? "s" : ""}!`;
    if (remaining <= 6) return `${totalAnswered} de ${QUESTIONS.length} — Continue, está indo bem!`;
    return `${totalAnswered} de ${QUESTIONS.length} perguntas respondidas`;
  }, [totalAnswered]);

  // #16 — Auto-scroll para próxima pergunta sem resposta
  const scrollToNextUnanswered = useCallback(
    (justAnsweredId: string, currentAnswers: Map<string, 1 | 2 | 3 | 4 | 5>) => {
      const nextQuestion = pillarQuestions.find(
        (q) => q.id !== justAnsweredId && !currentAnswers.has(q.id)
      );
      if (nextQuestion) {
        setTimeout(() => {
          const el = document.getElementById(`question-${nextQuestion.id}`);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 350);
      }
    },
    [pillarQuestions]
  );

  const handleAnswer = (questionId: string, score: 1 | 2 | 3 | 4 | 5) => {
    setAnswers((prev) => {
      const next = new Map(prev);
      next.set(questionId, score);
      scrollToNextUnanswered(questionId, next);
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
      // Scroll to top of form when switching pillars
      setTimeout(() => {
        const el = document.getElementById("checkup-form-top");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  };

  // Remaining questions in current pillar (for disabled button hint)
  const pillarRemaining = pillarQuestions.length - pillarAnswered;

  return (
    <div className="space-y-6 motion-safe:animate-fade-in" id="checkup-form-top">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className={cn(
            "transition-colors",
            totalAnswered >= QUESTIONS.length - 3
              ? "text-risk-low font-medium"
              : "text-muted-foreground"
          )}>
            {progressLabel}
          </span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Pillar navigation — #18: gradient fade hint on overflow */}
      <div className="relative">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
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
        {/* Right-fade scroll hint */}
        <div
          className="absolute right-0 top-0 bottom-2 w-8 pointer-events-none"
          style={{ background: "linear-gradient(to right, transparent, hsl(var(--background)))" }}
        />
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
          <CardDescription>{PILLAR_DESCRIPTIONS[currentPillarKey]}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {pillarQuestions.map((question, qIndex) => {
            const isAnswered = answers.has(question.id);
            return (
              <div
                key={question.id}
                id={`question-${question.id}`}
                className={cn(
                  "space-y-4 pb-6 scroll-mt-24",
                  qIndex < pillarQuestions.length - 1 && "border-b border-border/50"
                )}
              >
                <div className="flex gap-3">
                  {/* #19 — Status indicator: círculo cinza → checkmark verde */}
                  {isAnswered ? (
                    <CheckCircle2 className="flex-shrink-0 w-6 h-6 mt-0.5 text-risk-low" />
                  ) : (
                    <Circle className="flex-shrink-0 w-6 h-6 mt-0.5 text-muted-foreground/40" />
                  )}
                  <p className="text-foreground leading-relaxed pt-0.5">{question.text}</p>
                </div>
                {/* #38 — Passar questionText para aria-label acessível */}
                <div className="pl-9">
                  <RatingScale
                    value={answers.get(question.id)}
                    onChange={(score) => handleAnswer(question.id, score)}
                    questionText={question.text}
                  />
                </div>
              </div>
            );
          })}
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
          <div className="flex flex-col items-end gap-1">
            <Button
              onClick={() => goToPillar(currentPillar + 1)}
              disabled={!isPillarComplete}
            >
              Próximo pilar
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            {/* #20 — Hint quando desabilitado */}
            {!isPillarComplete && (
              <p className="text-xs text-muted-foreground">
                Responda mais {pillarRemaining} pergunta{pillarRemaining > 1 ? "s" : ""} para continuar
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-end gap-1">
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
            {!isAllComplete && (
              <p className="text-xs text-muted-foreground">
                Faltam {QUESTIONS.length - totalAnswered} resposta{QUESTIONS.length - totalAnswered > 1 ? "s" : ""}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
