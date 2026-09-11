import { Link } from "@tanstack/react-router";

import { useApp } from "@/hooks/use-app";
import type { GameResult } from "@/hooks/use-game-session";

/** Shows the score of the game just played, from the actual gameplay. */
export function ResultPanel({
  result,
  onPlayAgain,
  totalQuestions,
  correct,
  mistakes,
  times,
  levelLabel,
}: {
  result: GameResult | null;
  onPlayAgain: () => void;
  totalQuestions: number;
  correct: number;
  mistakes: number;
  times: number[];
  levelLabel?: string;
}) {
  const { t } = useApp();
  const accuracy = result?.accuracy ?? (totalQuestions ? correct / totalQuestions : 0);
  const averageTime =
    result?.response_time_ms ??
    (times.length ? times.reduce((sum, value) => sum + value, 0) / times.length : 0);

  return (
    <div className="mt-6">
      <h2 className="font-display text-2xl font-bold">{t("your_result")}</h2>
      <p className="mt-1 text-xl text-muted-foreground">{t("game_complete")}</p>

      <dl className="mt-5 grid grid-cols-2 gap-4">
        {levelLabel && (
          <div className="col-span-2 rounded-2xl border border-primary/30 bg-primary/10 p-4">
            <dt className="text-sm font-medium text-primary">{t("highest_level_reached")}</dt>
            <dd className="font-display text-2xl font-bold text-primary">{levelLabel}</dd>
          </div>
        )}
        <Stat label={t("score")} value={`${correct} / ${totalQuestions}`} />
        <Stat label={t("accuracy")} value={`${Math.round(accuracy * 100)}%`} />
        <Stat label={t("mistakes")} value={String(mistakes)} />
        <Stat label={t("response_time")} value={`${(averageTime / 1000).toFixed(1)} sec`} />
      </dl>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onPlayAgain}
          className="gradient-primary min-h-14 rounded-xl px-8 text-lg font-semibold text-primary-foreground"
        >
          {t("play_again")}
        </button>
        <Link
          to="/home"
          className="inline-flex min-h-14 items-center rounded-xl border border-border bg-card/70 px-8 text-lg font-semibold"
        >
          {t("back_home")}
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="font-display text-2xl font-semibold">{value}</dd>
    </div>
  );
}
