import { useState, useEffect, useCallback } from "react";
import type { WizardDraft, Identity, Channel, Answer } from "@/types/checkup";

const STORAGE_KEY = "crp_wizard_draft";

const defaultDraft: WizardDraft = {
  step: 0,
  identity: {},
  channels: [],
  answers: [],
  lastUpdated: new Date(),
};

export function useWizardDraft() {
  const [draft, setDraft] = useState<WizardDraft>(defaultDraft);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setDraft({
          ...parsed,
          lastUpdated: new Date(parsed.lastUpdated),
        });
      }
    } catch (error) {
      console.error("Failed to load wizard draft:", error);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when draft changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
      } catch (error) {
        console.error("Failed to save wizard draft:", error);
      }
    }
  }, [draft, isLoaded]);

  const updateStep = useCallback((step: number) => {
    setDraft((prev) => ({
      ...prev,
      step,
      lastUpdated: new Date(),
    }));
  }, []);

  const updateIdentity = useCallback((identity: Partial<Identity>) => {
    setDraft((prev) => ({
      ...prev,
      identity: { ...prev.identity, ...identity },
      lastUpdated: new Date(),
    }));
  }, []);

  const updateChannels = useCallback((channels: Channel[]) => {
    setDraft((prev) => ({
      ...prev,
      channels,
      lastUpdated: new Date(),
    }));
  }, []);

  const updateAnswers = useCallback((answers: Answer[]) => {
    setDraft((prev) => ({
      ...prev,
      answers,
      lastUpdated: new Date(),
    }));
  }, []);

  const setAnswer = useCallback((questionId: string, score: 1 | 2 | 3 | 4 | 5) => {
    setDraft((prev) => {
      const existing = prev.answers.findIndex((a) => a.questionId === questionId);
      const newAnswers = [...prev.answers];
      if (existing >= 0) {
        newAnswers[existing] = { questionId, score };
      } else {
        newAnswers.push({ questionId, score });
      }
      return {
        ...prev,
        answers: newAnswers,
        lastUpdated: new Date(),
      };
    });
  }, []);

  const clearDraft = useCallback(() => {
    setDraft(defaultDraft);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    draft,
    isLoaded,
    updateStep,
    updateIdentity,
    updateChannels,
    updateAnswers,
    setAnswer,
    clearDraft,
  };
}
