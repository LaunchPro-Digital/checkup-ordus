import { describe, it, expect } from "vitest";
import { calculateCRP, TEST_FIXTURES } from "@/lib/crpEngine";
import { QUESTIONS } from "@/lib/questionBank";

describe("CRPEngine", () => {
  describe("calculateCRP", () => {
    it("should return CRP 0 and band low when all answers are 5", () => {
      const result = calculateCRP(TEST_FIXTURES.allFives.answers);
      
      expect(result.crp.score).toBe(0);
      expect(result.crp.band).toBe("low");
      
      // All pillar risks should be 0
      expect(result.pillars.C.risk).toBe(0);
      expect(result.pillars.O.risk).toBe(0);
      expect(result.pillars.R.risk).toBe(0);
      expect(result.pillars.E.risk).toBe(0);
      
      // All pillar averages should be 5
      expect(result.pillars.C.avg).toBe(5);
      expect(result.pillars.O.avg).toBe(5);
      expect(result.pillars.R.avg).toBe(5);
      expect(result.pillars.E.avg).toBe(5);
    });

    it("should return CRP 10 and band high when all answers are 1", () => {
      const result = calculateCRP(TEST_FIXTURES.allOnes.answers);
      
      expect(result.crp.score).toBe(10);
      expect(result.crp.band).toBe("high");
      
      // All pillar risks should be 10
      expect(result.pillars.C.risk).toBe(10);
      expect(result.pillars.O.risk).toBe(10);
      expect(result.pillars.R.risk).toBe(10);
      expect(result.pillars.E.risk).toBe(10);
      
      // All pillar averages should be 1
      expect(result.pillars.C.avg).toBe(1);
      expect(result.pillars.O.avg).toBe(1);
      expect(result.pillars.R.avg).toBe(1);
      expect(result.pillars.E.avg).toBe(1);
    });

    it("should return CRP 5 and band medium when all answers are 3", () => {
      const result = calculateCRP(TEST_FIXTURES.allThrees.answers);
      
      expect(result.crp.score).toBe(5);
      expect(result.crp.band).toBe("medium");
      
      // All pillar risks should be 5
      expect(result.pillars.C.risk).toBe(5);
      expect(result.pillars.O.risk).toBe(5);
      expect(result.pillars.R.risk).toBe(5);
      expect(result.pillars.E.risk).toBe(5);
    });

    it("should correctly calculate weighted CRP with mixed scores", () => {
      // Create answers with different scores per pillar
      // C: all 5 (avg 5, risk 0) - weight 30%
      // O: all 4 (avg 4, risk 2.5) - weight 25%
      // R: all 3 (avg 3, risk 5) - weight 30%
      // E: all 2 (avg 2, risk 7.5) - weight 15%
      
      const answers = QUESTIONS.map((q) => {
        let score: 1 | 2 | 3 | 4 | 5;
        switch (q.pillar) {
          case "C": score = 5; break;
          case "O": score = 4; break;
          case "R": score = 3; break;
          case "E": score = 2; break;
        }
        return { questionId: q.id, score };
      });

      const result = calculateCRP(answers);
      
      // Expected: (0 * 0.30) + (2.5 * 0.25) + (5 * 0.30) + (7.5 * 0.15)
      // = 0 + 0.625 + 1.5 + 1.125 = 3.25
      expect(result.crp.score).toBeCloseTo(3.25, 1);
      expect(result.crp.band).toBe("medium");
      
      expect(result.pillars.C.avg).toBe(5);
      expect(result.pillars.C.risk).toBe(0);
      
      expect(result.pillars.O.avg).toBe(4);
      expect(result.pillars.O.risk).toBe(2.5);
      
      expect(result.pillars.R.avg).toBe(3);
      expect(result.pillars.R.risk).toBe(5);
      
      expect(result.pillars.E.avg).toBe(2);
      expect(result.pillars.E.risk).toBe(7.5);
    });

    it("should return 3 top gaps sorted by score ascending", () => {
      // Create answers where Q01, Q06, Q11 have score 1 (lowest)
      const answers = QUESTIONS.map((q) => ({
        questionId: q.id,
        score: (["Q01", "Q06", "Q11"].includes(q.id) ? 1 : 5) as 1 | 2 | 3 | 4 | 5,
      }));

      const result = calculateCRP(answers);
      
      expect(result.topGaps).toHaveLength(3);
      expect(result.topGaps[0].questionId).toBe("Q01");
      expect(result.topGaps[1].questionId).toBe("Q06");
      expect(result.topGaps[2].questionId).toBe("Q11");
      
      result.topGaps.forEach((gap) => {
        expect(gap.score).toBe(1);
      });
    });

    it("should break ties by question_id when scores are equal", () => {
      // All answers are 3 (equal score)
      const result = calculateCRP(TEST_FIXTURES.allThrees.answers);
      
      // Top 3 should be Q01, Q02, Q03 (alphabetically first)
      expect(result.topGaps[0].questionId).toBe("Q01");
      expect(result.topGaps[1].questionId).toBe("Q02");
      expect(result.topGaps[2].questionId).toBe("Q03");
    });

    it("should throw error if not exactly 20 answers provided", () => {
      const partialAnswers = QUESTIONS.slice(0, 10).map((q) => ({
        questionId: q.id,
        score: 3 as const,
      }));

      expect(() => calculateCRP(partialAnswers)).toThrow("Expected 20 answers");
    });

    it("should correctly categorize risk bands", () => {
      // Band low: 0-2.9
      // Create answers that result in CRP ~2.5
      const lowAnswers = QUESTIONS.map((q) => ({
        questionId: q.id,
        score: 4 as const, // avg 4, risk 2.5
      }));
      const lowResult = calculateCRP(lowAnswers);
      expect(lowResult.crp.score).toBe(2.5);
      expect(lowResult.crp.band).toBe("low");

      // Band medium: 3.0-5.4 - already tested with all 3s
      
      // Band high: 5.5-10
      const highAnswers = QUESTIONS.map((q) => ({
        questionId: q.id,
        score: 2 as const, // avg 2, risk 7.5
      }));
      const highResult = calculateCRP(highAnswers);
      expect(highResult.crp.score).toBe(7.5);
      expect(highResult.crp.band).toBe("high");
    });
  });
});
