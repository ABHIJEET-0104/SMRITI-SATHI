/**
 * Adaptive difficulty + Game Performance Trend.
 *
 * Both are transparent, deterministic rule-based calculations over game
 * measurements only (accuracy, mistakes, response time, score, difficulty).
 * They never produce, imply, or accept medical interpretations.
 */

export type Difficulty = "easy" | "medium" | "hard";
export type Trend = "improving" | "stable" | "declining";

export interface SessionMeasurement {
  session_id: string;
  game_id: string;
  difficulty: string;
  score: number;
  accuracy: number; // 0..1
  mistakes: number;
  response_time_ms: number;
  total_questions: number;
  correct_answers: number;
  played_at: string;
}

export const DIFFICULTY_ORDER: Difficulty[] = ["easy", "medium", "hard"];

export function asDifficulty(value: string | null | undefined): Difficulty {
  return DIFFICULTY_ORDER.includes(value as Difficulty) ? (value as Difficulty) : "easy";
}

/** Number of elements / questions per round for each level. */
export const DIFFICULTY_CONFIG: Record<
  Difficulty,
  { sequenceLength: number; questions: number; previewMs: number; options: number }
> = {
  easy: { sequenceLength: 3, questions: 5, previewMs: 4000, options: 2 },
  medium: { sequenceLength: 5, questions: 8, previewMs: 3000, options: 3 },
  hard: { sequenceLength: 7, questions: 10, previewMs: 2000, options: 4 },
};

function step(level: Difficulty, delta: number): Difficulty {
  const index = Math.min(
    DIFFICULTY_ORDER.length - 1,
    Math.max(0, DIFFICULTY_ORDER.indexOf(level) + delta),
  );
  return DIFFICULTY_ORDER[index]!;
}

export interface DifficultyRecommendation {
  recommended_difficulty: Difficulty;
  reason: string;
  confidence: number;
}

/**
 * Rule-based next-level recommendation from the most recent sessions of
 * one game. No learning, no black box — the reason states the rule used.
 */
export function recommendDifficulty(
  sessions: SessionMeasurement[],
  gameId?: string,
): DifficultyRecommendation {
  const relevant = (gameId ? sessions.filter((s) => s.game_id === gameId) : sessions)
    .slice()
    .sort((a, b) => +new Date(b.played_at) - +new Date(a.played_at))
    .slice(0, 5);

  if (relevant.length === 0) {
    return {
      recommended_difficulty: "easy",
      reason: "No games played yet, starting at the gentlest level",
      confidence: 0.4,
    };
  }

  const avg = (pick: (s: SessionMeasurement) => number) =>
    relevant.reduce((sum, s) => sum + pick(s), 0) / relevant.length;

  const accuracy = avg((s) => Number(s.accuracy) || 0);
  const mistakes = avg((s) => s.mistakes);
  const responseTime = avg((s) => s.response_time_ms);
  const last = asDifficulty(relevant[0]!.difficulty);
  const confidence = Math.min(0.95, 0.5 + relevant.length * 0.09);

  if (accuracy >= 0.85 && mistakes <= 1 && responseTime <= 6000) {
    return {
      recommended_difficulty: step(last, 1),
      reason: "Recent game performance is strong, so the level is raised",
      confidence,
    };
  }
  if (accuracy < 0.5 || mistakes >= 4) {
    return {
      recommended_difficulty: step(last, -1),
      reason: "Recent games had many mistakes, so the level is eased",
      confidence,
    };
  }
  return {
    recommended_difficulty: last,
    reason: "Recent game performance is stable",
    confidence,
  };
}

export interface TrendResult {
  trend: Trend;
  games_completed: number;
  average_score: number;
  average_accuracy: number;
  average_mistakes: number;
  average_response_time_ms: number;
  recent: { played_at: string; score: number; accuracy: number; game_id: string }[];
}

/**
 * Game Performance Trend: compares the newer half of recent sessions
 * with the older half using a composite of accuracy, mistakes and
 * response time. Informational only — never a medical statement.
 */
export function calculateTrend(sessions: SessionMeasurement[]): TrendResult {
  const ordered = sessions
    .slice()
    .sort((a, b) => +new Date(a.played_at) - +new Date(b.played_at));

  const avg = (list: SessionMeasurement[], pick: (s: SessionMeasurement) => number) =>
    list.length ? list.reduce((sum, s) => sum + pick(s), 0) / list.length : 0;

  const summary: TrendResult = {
    trend: "stable",
    games_completed: ordered.length,
    average_score: Math.round(avg(ordered, (s) => s.score)),
    average_accuracy: Number(avg(ordered, (s) => Number(s.accuracy) || 0).toFixed(4)),
    average_mistakes: Number(avg(ordered, (s) => s.mistakes).toFixed(2)),
    average_response_time_ms: Math.round(avg(ordered, (s) => s.response_time_ms)),
    recent: ordered.slice(-10).map((s) => ({
      played_at: s.played_at,
      score: s.score,
      accuracy: Number(s.accuracy) || 0,
      game_id: s.game_id,
    })),
  };

  if (ordered.length < 4) return summary;

  const window = ordered.slice(-8);
  const half = Math.floor(window.length / 2);
  const older = window.slice(0, half);
  const newer = window.slice(half);

  // Composite index: accuracy up is better, mistakes and slow responses down.
  const index = (list: SessionMeasurement[]) =>
    avg(list, (s) => Number(s.accuracy) || 0) * 100 -
    avg(list, (s) => s.mistakes) * 4 -
    Math.min(20, avg(list, (s) => s.response_time_ms) / 1000);

  const delta = index(newer) - index(older);
  if (delta >= 5) summary.trend = "improving";
  else if (delta <= -5) summary.trend = "declining";
  else summary.trend = "stable";

  return summary;
}
