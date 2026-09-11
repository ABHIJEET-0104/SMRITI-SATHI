import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Check, Sparkles, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { ResultPanel } from "@/components/result-panel";
import { useApp } from "@/hooks/use-app";
import { useGameSession, type GameResult } from "@/hooks/use-game-session";
import { recommendNextDifficulty } from "@/lib/api.functions";
import { asDifficulty, type Difficulty } from "@/lib/performance";
import { VoiceService } from "@/lib/voice";
import type { TranslationKey } from "@/lib/i18n";

const GAME_ID = "routine_sequencing";

export const Route = createFileRoute("/_authenticated/play/routine")({
  head: () => ({
    meta: [
      { title: "Daily Routine Sequencing — Smriti Sathi" },
      {
        name: "description",
        content:
          "Arrange daily activities in chronological order from morning to night. Calm pacing and voice assistance in your language.",
      },
      { property: "og:title", content: "Daily Routine Sequencing" },
      {
        property: "og:description",
        content: "A gentle daily activity ordering game for elders.",
      },
    ],
  }),
  component: RoutineGame,
});

interface ActivityItem {
  id: string;
  key: TranslationKey;
  icon: string;
  toneClass: string;
}

const ALL_ACTIVITIES: Record<string, ActivityItem> = {
  wake_up: {
    id: "wake_up",
    key: "activity_wake_up",
    icon: "🌅",
    toneClass: "border-amber-400/50 bg-amber-500/10 text-amber-900 dark:text-amber-100",
  },
  brush_teeth: {
    id: "brush_teeth",
    key: "activity_brush_teeth",
    icon: "🪥",
    toneClass: "border-cyan-400/50 bg-cyan-500/10 text-cyan-900 dark:text-cyan-100",
  },
  morning_tea: {
    id: "morning_tea",
    key: "activity_morning_tea",
    icon: "☕",
    toneClass: "border-orange-400/50 bg-orange-500/10 text-orange-900 dark:text-orange-100",
  },
  lunch: {
    id: "lunch",
    key: "activity_lunch",
    icon: "🍛",
    toneClass: "border-emerald-400/50 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100",
  },
  evening_walk: {
    id: "evening_walk",
    key: "activity_evening_walk",
    icon: "🚶",
    toneClass: "border-teal-400/50 bg-teal-500/10 text-teal-900 dark:text-teal-100",
  },
  dinner: {
    id: "dinner",
    key: "activity_dinner",
    icon: "🍲",
    toneClass: "border-indigo-400/50 bg-indigo-500/10 text-indigo-900 dark:text-indigo-100",
  },
  take_medicine: {
    id: "take_medicine",
    key: "activity_take_medicine",
    icon: "💊",
    toneClass: "border-rose-400/50 bg-rose-500/10 text-rose-900 dark:text-rose-100",
  },
  night_sleep: {
    id: "night_sleep",
    key: "activity_night_sleep",
    icon: "🌙",
    toneClass: "border-blue-400/50 bg-blue-500/10 text-blue-900 dark:text-blue-100",
  },
};

interface RoundSequence {
  orderedIds: string[];
}

const SEQUENCES_BY_DIFFICULTY: Record<Difficulty, RoundSequence[]> = {
  easy: [
    { orderedIds: ["wake_up", "night_sleep"] },
    { orderedIds: ["morning_tea", "night_sleep"] },
    { orderedIds: ["brush_teeth", "dinner"] },
  ],
  medium: [
    { orderedIds: ["wake_up", "lunch", "night_sleep"] },
    { orderedIds: ["morning_tea", "evening_walk", "night_sleep"] },
    { orderedIds: ["brush_teeth", "lunch", "take_medicine"] },
  ],
  hard: [
    { orderedIds: ["wake_up", "morning_tea", "evening_walk", "night_sleep"] },
    { orderedIds: ["brush_teeth", "lunch", "dinner", "night_sleep"] },
    { orderedIds: ["morning_tea", "lunch", "take_medicine", "night_sleep"] },
  ],
};

type Phase = "intro" | "playing" | "round_success" | "done";

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr;
}

function RoutineGame() {
  const { profile, people, t, language } = useApp();
  const { finish } = useGameSession();

  const isCaregiver = profile?.role === "caregiver";
  const targetElder = isCaregiver ? (people[0] ?? null) : null;
  const targetUserId = isCaregiver ? (targetElder?.id ?? profile?.id) : profile?.id;

  const recommend = useServerFn(recommendNextDifficulty);
  const { data: recommendation } = useQuery({
    queryKey: ["difficulty", targetUserId, GAME_ID],
    enabled: !!targetUserId,
    queryFn: () => recommend({ data: { user_id: targetUserId!, game_id: GAME_ID } }),
  });

  const difficulty: Difficulty = asDifficulty(recommendation?.recommended_difficulty);

  const [phase, setPhase] = useState<Phase>("intro");
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [nextStepIndex, setNextStepIndex] = useState(0);
  const [shuffledChoices, setShuffledChoices] = useState<ActivityItem[]>([]);
  const [completedIdsInRound, setCompletedIdsInRound] = useState<string[]>([]);
  const [wrongTapId, setWrongTapId] = useState<string | null>(null);

  // Metrics
  const [mistakes, setMistakes] = useState(0);
  const [correctSteps, setCorrectSteps] = useState(0);
  const [stepResponseTimes, setStepResponseTimes] = useState<number[]>([]);
  const [result, setResult] = useState<GameResult | null>(null);

  const stepStartTime = useRef<number>(0);

  const rounds = SEQUENCES_BY_DIFFICULTY[difficulty] ?? SEQUENCES_BY_DIFFICULTY.easy;
  const currentRound = rounds[currentRoundIndex] ?? rounds[0]!;
  const totalRounds = rounds.length;
  const totalStepsInGame = rounds.reduce((acc, r) => acc + r.orderedIds.length, 0);

  // Initialize round
  const startRound = (roundIdx: number) => {
    const round = rounds[roundIdx] ?? rounds[0]!;
    const items = round.orderedIds.map((id) => ALL_ACTIVITIES[id]!).filter(Boolean);
    setShuffledChoices(shuffleArray(items));
    setCompletedIdsInRound([]);
    setNextStepIndex(0);
    setWrongTapId(null);
    setPhase("playing");
    stepStartTime.current = Date.now();

    VoiceService.speak("what_comes_first", { lang: language });
  };

  const handleStartGame = () => {
    setCurrentRoundIndex(0);
    setMistakes(0);
    setCorrectSteps(0);
    setStepResponseTimes([]);
    setResult(null);
    startRound(0);
  };

  useEffect(() => {
    if (phase === "intro") {
      VoiceService.speak("routine_instruction", { lang: language });
    }
  }, [phase, language]);

  const handleCardClick = (item: ActivityItem) => {
    if (phase !== "playing") return;
    if (completedIdsInRound.includes(item.id)) return;

    const responseTime = Math.max(200, Date.now() - stepStartTime.current);
    const expectedId = currentRound.orderedIds[nextStepIndex];

    if (item.id === expectedId) {
      // Correct step
      setStepResponseTimes((prev) => [...prev, responseTime]);
      setCorrectSteps((prev) => prev + 1);
      const newCompleted = [...completedIdsInRound, item.id];
      setCompletedIdsInRound(newCompleted);
      const nextIdx = nextStepIndex + 1;
      setNextStepIndex(nextIdx);
      setWrongTapId(null);
      stepStartTime.current = Date.now();

      if (nextIdx < currentRound.orderedIds.length) {
        // More steps in this round
        VoiceService.speak("what_comes_next", { lang: language });
      } else {
        // Round completed!
        setPhase("round_success");
        VoiceService.speak("correct_feedback", { lang: language });

        setTimeout(() => {
          if (currentRoundIndex + 1 < totalRounds) {
            const nextRound = currentRoundIndex + 1;
            setCurrentRoundIndex(nextRound);
            startRound(nextRound);
          } else {
            // Whole game finished!
            handleGameComplete();
          }
        }, 1300);
      }
    } else {
      // Mistake
      setMistakes((prev) => prev + 1);
      setWrongTapId(item.id);
      VoiceService.speak("try_again", { lang: language });
      setTimeout(() => setWrongTapId(null), 800);
    }
  };

  const handleGameComplete = async () => {
    setPhase("done");
    VoiceService.speak("game_complete", { lang: language });

    const totalExpectedSteps = totalStepsInGame;
    const computedResult = await finish({
      gameId: GAME_ID,
      difficulty,
      totalQuestions: totalExpectedSteps,
      correctAnswers: totalExpectedSteps,
      mistakes,
      responseTimes: stepResponseTimes,
      userId: targetUserId,
    });

    if (computedResult) {
      setResult(computedResult);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 flex items-center justify-between">
          <Link
            to="/home"
            className="inline-flex items-center gap-2 rounded-xl p-2 text-muted-foreground hover:bg-card hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">{t("back_home")}</span>
          </Link>
          <span className="rounded-full bg-secondary px-4 py-1 text-sm font-semibold capitalize text-secondary-foreground">
            {t(difficulty as TranslationKey) || difficulty}
          </span>
        </div>

        {phase === "intro" && (
          <div className="panel rounded-3xl p-6 sm:p-10 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-500/10 text-4xl">
              🌅
            </div>
            <h1 className="font-display text-3xl font-bold sm:text-4xl">
              {t("routine_game")}
            </h1>
            <p className="mt-3 text-xl text-muted-foreground">
              {t("routine_instruction")}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4">
              <button
                type="button"
                onClick={handleStartGame}
                className="gradient-primary min-h-16 w-full max-w-sm rounded-2xl text-xl font-bold text-primary-foreground shadow-lg transition active:scale-95"
              >
                {t("start_game")}
              </button>

              <button
                type="button"
                onClick={() => VoiceService.speak("routine_instruction", { lang: language })}
                className="inline-flex items-center gap-2 text-base text-muted-foreground hover:text-foreground"
              >
                <Volume2 className="h-5 w-5" />
                <span>{t("voice_hint")}</span>
              </button>
            </div>
          </div>
        )}

        {(phase === "playing" || phase === "round_success") && (
          <div className="space-y-6">
            <div className="panel rounded-3xl p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-4">
                <span className="text-lg font-medium text-muted-foreground">
                  {t("question_of")} {currentRoundIndex + 1} {t("of")} {totalRounds}
                </span>
                <span className="text-base text-muted-foreground">
                  {t("routine_step")} {nextStepIndex + 1} {t("of")} {currentRound.orderedIds.length}
                </span>
              </div>

              <div className="mt-6 text-center">
                <h2 className="font-display text-2xl font-bold sm:text-3xl text-foreground">
                  {nextStepIndex === 0 ? t("what_comes_first") : t("what_comes_next")}
                </h2>
                <p className="mt-2 text-lg text-muted-foreground">
                  {t("choose_name")}
                </p>
              </div>

              {/* Placed sequence preview */}
              <div className="mt-6 flex items-center justify-center gap-2 overflow-x-auto py-2">
                {currentRound.orderedIds.map((id, stepIdx) => {
                  const item = ALL_ACTIVITIES[id]!;
                  const isDone = completedIdsInRound.includes(id);
                  const isCurrent = stepIdx === nextStepIndex;

                  return (
                    <div
                      key={id}
                      className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-semibold transition ${
                        isDone
                          ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                          : isCurrent
                            ? "border-primary bg-primary/10 text-primary animate-pulse"
                            : "border-border/60 bg-muted/40 text-muted-foreground"
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="hidden sm:inline">{t(item.key)}</span>
                      {isDone && <Check className="h-4 w-4 text-emerald-600" />}
                    </div>
                  );
                })}
              </div>

              {/* Shuffled interactive tiles */}
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {shuffledChoices.map((item) => {
                  const isCompleted = completedIdsInRound.includes(item.id);
                  const isWrong = wrongTapId === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      disabled={isCompleted || phase === "round_success"}
                      onClick={() => handleCardClick(item)}
                      className={`group relative flex min-h-24 items-center gap-4 rounded-3xl border-2 p-5 text-left transition-all ${
                        isCompleted
                          ? "border-emerald-500 bg-emerald-500/15 opacity-60 scale-[0.98]"
                          : isWrong
                            ? "border-destructive bg-destructive/15 animate-shake"
                            : `${item.toneClass} hover:scale-[1.02] active:scale-[0.98] shadow-sm`
                      }`}
                    >
                      <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-card/80 text-4xl shadow-inner">
                        {item.icon}
                      </span>
                      <div className="flex-1">
                        <p className="font-display text-xl font-bold leading-snug">
                          {t(item.key)}
                        </p>
                      </div>
                      {isCompleted && (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow">
                          <Check className="h-5 w-5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {phase === "round_success" && (
                <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-emerald-500/15 p-4 text-emerald-700 dark:text-emerald-300">
                  <Sparkles className="h-6 w-6 animate-spin text-emerald-500" />
                  <span className="text-lg font-bold">{t("correct_feedback")}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {phase === "done" && (
          <div className="panel rounded-3xl p-6 sm:p-10">
            <ResultPanel
              result={result}
              onPlayAgain={handleStartGame}
              totalQuestions={totalStepsInGame}
              correct={correctSteps}
              mistakes={mistakes}
              times={stepResponseTimes}
              levelLabel={t(difficulty as TranslationKey) || difficulty}
            />
          </div>
        )}
      </div>
    </AppShell>
  );
}
