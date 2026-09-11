import { useCallback } from "react";
import { toast } from "sonner";

import { useApp } from "@/hooks/use-app";
import { useSync } from "@/hooks/use-sync";
import { newSessionId, saveSessionLocally, type PendingSession } from "@/lib/offline";

export interface GameOutcome {
  gameId: string;
  difficulty: string;
  totalQuestions: number;
  correctAnswers: number;
  mistakes: number;
  responseTimes: number[];
  userId?: string;
}

export interface GameResult extends PendingSession {}

/**
 * The single place a finished game turns into a stored result: score,
 * accuracy and response time are derived here, saved to the device, then
 * synced. No screen computes or stores results on its own.
 */
export function useGameSession() {
  const { profile, t } = useApp();
  const { sync } = useSync();

  const finish = useCallback(
    async (outcome: GameOutcome): Promise<GameResult | null> => {
      if (!profile) return null;
      const total = Math.max(1, outcome.totalQuestions);
      const accuracy = Math.min(1, outcome.correctAnswers / total);
      const averageResponse =
        outcome.responseTimes.length > 0
          ? Math.round(
              outcome.responseTimes.reduce((sum, value) => sum + value, 0) /
                outcome.responseTimes.length,
            )
          : 0;

      const session: GameResult = {
        session_id: newSessionId(),
        user_id: outcome.userId || profile.id,
        game_id: outcome.gameId,
        difficulty: outcome.difficulty,
        score: Math.round(accuracy * 100),
        accuracy: Number(accuracy.toFixed(4)),
        mistakes: outcome.mistakes,
        response_time_ms: averageResponse,
        total_questions: outcome.totalQuestions,
        correct_answers: outcome.correctAnswers,
        played_at: new Date().toISOString(),
      };

      saveSessionLocally(session);

      if (typeof navigator !== "undefined" && navigator.onLine) {
        const outcomeSync = await sync();
        if (outcomeSync && "error" in outcomeSync && outcomeSync.error) toast(t("sync_failed"));
        else toast.success(t("sync_complete"));
      } else {
        toast(t("saved_offline"));
      }

      return session;
    },
    [profile, sync, t],
  );

  return { finish };
}
