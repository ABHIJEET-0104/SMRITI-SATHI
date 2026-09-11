import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { ResultPanel } from "@/components/result-panel";
import { useApp } from "@/hooks/use-app";
import { useGameSession, type GameResult } from "@/hooks/use-game-session";
import { recommendNextDifficulty } from "@/lib/api.functions";
import { asDifficulty } from "@/lib/performance";
import { VoiceService } from "@/lib/voice";

const GAME_ID = "sequence_memory";

export type GameLevel = "easy" | "medium" | "hard";

interface LevelConfig {
  level: GameLevel;
  labelKey: "easy" | "medium" | "hard";
  tilesCount: number;
  sequenceLength: number;
  flashDurationMs: number;
  gapDurationMs: number;
  gridClassName: string;
}

const LEVEL_CONFIGS: Record<GameLevel, LevelConfig> = {
  easy: {
    level: "easy",
    labelKey: "easy",
    tilesCount: 2,
    sequenceLength: 2,
    flashDurationMs: 750,
    gapDurationMs: 280,
    gridClassName: "grid-cols-2 max-w-sm",
  },
  medium: {
    level: "medium",
    labelKey: "medium",
    tilesCount: 4,
    sequenceLength: 3,
    flashDurationMs: 650,
    gapDurationMs: 250,
    gridClassName: "grid-cols-2 max-w-md",
  },
  hard: {
    level: "hard",
    labelKey: "hard",
    tilesCount: 6,
    sequenceLength: 4,
    flashDurationMs: 550,
    gapDurationMs: 220,
    gridClassName: "grid-cols-3 max-w-lg",
  },
};

const PADS = [
  { id: 0, label: "1", className: "bg-primary text-primary-foreground" },
  { id: 1, label: "2", className: "bg-accent text-accent-foreground" },
  { id: 2, label: "3", className: "bg-positive text-primary-foreground" },
  { id: 3, label: "4", className: "bg-red-500 text-white" },
  { id: 4, label: "5", className: "bg-purple-600 text-white" },
  { id: 5, label: "6", className: "bg-teal-600 text-white" },
];

export const Route = createFileRoute("/_authenticated/play/sequence")({
  head: () => ({
    meta: [
      { title: "Sequence Memory — Smriti Sathi" },
      {
        name: "description",
        content:
          "Watch a short pattern of large coloured tiles, then repeat it. Progress through Easy, Medium, and Hard tiers.",
      },
      { property: "og:title", content: "Sequence Memory" },
      { property: "og:description", content: "Watch a pattern, then repeat it. Simple, calm, and progressive." },
    ],
  }),
  component: SequenceGame,
});

type Phase = "intro" | "watch" | "input" | "feedback" | "level_up" | "retry" | "done";

function SequenceGame() {
  const { profile, t } = useApp();
  const { finish } = useGameSession();
  const userId = profile?.id;

  const recommend = useServerFn(recommendNextDifficulty);
  const { data: recommendation } = useQuery({
    queryKey: ["difficulty", userId, GAME_ID],
    enabled: !!userId,
    queryFn: () => recommend({ data: { user_id: userId!, game_id: GAME_ID } }),
  });

  const initialDifficulty = asDifficulty(recommendation?.recommended_difficulty);

  const [currentLevel, setCurrentLevel] = useState<GameLevel>("easy");
  const [highestLevel, setHighestLevel] = useState<GameLevel>("easy");
  const [hasRetriedCurrent, setHasRetriedCurrent] = useState(false);

  const [phase, setPhase] = useState<Phase>("intro");
  const [sequence, setSequence] = useState<number[]>([]);
  const [litPad, setLitPad] = useState<number | null>(null);
  const [entered, setEntered] = useState<number[]>([]);
  const [roundRight, setRoundRight] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [times, setTimes] = useState<number[]>([]);
  const [result, setResult] = useState<GameResult | null>(null);
  const inputStart = useRef(0);

  const currentConfig = LEVEL_CONFIGS[currentLevel];
  const activePads = PADS.slice(0, currentConfig.tilesCount);

  function makeSequence(level: GameLevel) {
    const cfg = LEVEL_CONFIGS[level];
    return Array.from({ length: cfg.sequenceLength }, () =>
      Math.floor(Math.random() * cfg.tilesCount),
    );
  }

  function start() {
    setCurrentLevel("easy");
    setHighestLevel("easy");
    setHasRetriedCurrent(false);
    setCorrect(0);
    setMistakes(0);
    setTimes([]);
    setResult(null);
    setSequence(makeSequence("easy"));
    setEntered([]);
    setPhase("watch");
    VoiceService.speak("sequence_instruction");
  }

  // Play pattern playback
  useEffect(() => {
    if (phase !== "watch" || sequence.length === 0) return;
    const cfg = LEVEL_CONFIGS[currentLevel];
    let step = 0;
    let cancelled = false;

    const showNext = () => {
      if (cancelled) return;
      if (step >= sequence.length) {
        setLitPad(null);
        setPhase("input");
        setEntered([]);
        inputStart.current = Date.now();
        VoiceService.speak("repeat_sequence");
        return;
      }
      setLitPad(sequence[step]!);
      window.setTimeout(() => {
        if (cancelled) return;
        setLitPad(null);
        step += 1;
        window.setTimeout(showNext, cfg.gapDurationMs);
      }, cfg.flashDurationMs);
    };

    const timer = window.setTimeout(showNext, 850);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [phase, sequence, currentLevel]);

  function tap(padId: number) {
    if (phase !== "input") return;
    const next = [...entered, padId];
    const position = next.length - 1;
    const expected = sequence[position];
    setLitPad(padId);
    window.setTimeout(() => setLitPad(null), 200);

    if (padId !== expected) {
      setMistakes((m) => m + 1);
      setTimes((list) => [...list, Date.now() - inputStart.current]);
      setRoundRight(false);
      setEntered(next);

      if (!hasRetriedCurrent) {
        // First error on this level -> allow 1 gentle retry
        setHasRetriedCurrent(true);
        VoiceService.speak("retry_prompt");
        setPhase("retry");
      } else {
        // Error on retry -> conclude gently without frustration
        VoiceService.speak("incorrect_feedback");
        setPhase("feedback");
      }
      return;
    }

    setEntered(next);
    if (next.length === sequence.length) {
      setTimes((list) => [...list, Date.now() - inputStart.current]);
      setCorrect((c) => c + 1);
      setRoundRight(true);

      if (currentLevel === "easy") {
        setHighestLevel("medium");
        VoiceService.speak("correct_feedback");
        setPhase("level_up");
      } else if (currentLevel === "medium") {
        setHighestLevel("hard");
        VoiceService.speak("correct_feedback");
        setPhase("level_up");
      } else {
        // Mastered Hard tier
        VoiceService.speak("game_complete");
        setPhase("done");
      }
    }
  }

  // Handle gentle retry
  useEffect(() => {
    if (phase !== "retry") return;
    const timer = window.setTimeout(() => {
      setEntered([]);
      setSequence(makeSequence(currentLevel));
      setPhase("watch");
    }, 2000);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentLevel]);

  // Handle level promotion
  useEffect(() => {
    if (phase !== "level_up") return;
    const timer = window.setTimeout(() => {
      if (currentLevel === "easy") {
        setCurrentLevel("medium");
        setHasRetriedCurrent(false);
        setEntered([]);
        setSequence(makeSequence("medium"));
        setPhase("watch");
      } else if (currentLevel === "medium") {
        setCurrentLevel("hard");
        setHasRetriedCurrent(false);
        setEntered([]);
        setSequence(makeSequence("hard"));
        setPhase("watch");
      }
    }, 2000);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentLevel]);

  // Handle failed attempt after retry
  useEffect(() => {
    if (phase !== "feedback") return;
    const timer = window.setTimeout(() => {
      VoiceService.speak("game_complete");
      setPhase("done");
    }, 1800);
    return () => window.clearTimeout(timer);
  }, [phase]);

  // Store final result
  useEffect(() => {
    if (phase !== "done" || result) return;
    const total = Math.max(1, correct + mistakes);
    void finish({
      gameId: GAME_ID,
      difficulty: highestLevel,
      totalQuestions: total,
      correctAnswers: correct,
      mistakes,
      responseTimes: times,
    }).then((saved) => saved && setResult(saved));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  return (
    <AppShell>
      <div className="mx-auto grid max-w-3xl gap-6">
        <Link to="/home" className="inline-flex items-center gap-2 text-base font-semibold">
          <ArrowLeft className="size-5" aria-hidden /> {t("back_home")}
        </Link>

        <section className="panel rounded-3xl p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="font-display text-3xl font-bold">{t("sequence_game")}</h1>
              {phase !== "intro" && phase !== "done" && (
                <p className="mt-1 text-lg text-muted-foreground">
                  {t("level")}: <span className="font-semibold text-foreground">{t(currentLevel)}</span> ({currentConfig.tilesCount} {t("tiles_count") || "tiles"}) ·{" "}
                  {phase === "watch" ? t("watch") : t("your_turn")}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-border bg-card/70 px-4 py-2 text-sm font-semibold">
                {t("level")}: <strong className="text-primary">{t(currentLevel)}</strong>
              </span>
            </div>
          </div>

          {phase === "intro" && (
            <div className="mt-6">
              <p className="text-xl text-muted-foreground">{t("sequence_game_desc")}</p>
              {recommendation && (
                <p className="mt-2 text-base text-muted-foreground">
                  {recommendation.reason} ({t("suggested_level")}: {t(initialDifficulty)}).
                </p>
              )}

              <div className="mt-5 grid grid-cols-3 gap-3">
                {(["easy", "medium", "hard"] as GameLevel[]).map((lvl) => {
                  const cfg = LEVEL_CONFIGS[lvl];
                  return (
                    <div
                      key={lvl}
                      className="rounded-2xl border border-border bg-card/60 p-3 text-center"
                    >
                      <p className="font-display text-base font-semibold">{t(lvl)}</p>
                      <p className="text-xs text-muted-foreground">
                        {cfg.tilesCount} tiles · {cfg.sequenceLength} steps
                      </p>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={start}
                className="gradient-primary mt-6 min-h-16 w-full rounded-2xl text-xl font-semibold text-primary-foreground shadow-[var(--shadow-lift)]"
              >
                {t("start_game")}
              </button>
            </div>
          )}

          {phase !== "intro" && phase !== "done" && (
            <>
              {phase === "level_up" && (
                <div className="mt-4 rounded-2xl border border-positive/40 bg-positive/10 p-4 text-center">
                  <p className="font-display text-xl font-bold text-positive">
                    {t("level_up")}
                  </p>
                </div>
              )}

              {phase === "retry" && (
                <div className="mt-4 rounded-2xl border border-accent/50 bg-accent/15 p-4 text-center">
                  <p className="font-display text-lg font-semibold text-accent-foreground">
                    {t("retry_prompt")}
                  </p>
                </div>
              )}

              <p className="mt-6 text-center font-display text-2xl font-bold">
                {phase === "watch" ? t("sequence_instruction") : t("repeat_sequence")}
              </p>

              <div className={`mx-auto mt-6 grid gap-4 ${currentConfig.gridClassName}`}>
                {activePads.map((pad) => (
                  <button
                    key={pad.id}
                    type="button"
                    aria-label={`Tile ${pad.label}`}
                    onClick={() => tap(pad.id)}
                    disabled={phase !== "input"}
                    className={`aspect-square rounded-3xl font-display text-4xl font-bold transition-all ${pad.className} ${
                      litPad === pad.id
                        ? "scale-[1.04] ring-4 ring-foreground/40 brightness-110"
                        : "opacity-80"
                    } ${phase === "input" ? "cursor-pointer hover:opacity-100" : ""}`}
                  >
                    {pad.label}
                  </button>
                ))}
              </div>

              <p className="mt-5 text-center text-lg font-semibold">
                {phase === "input" && `${entered.length} / ${sequence.length}`}
                {phase === "feedback" &&
                  (roundRight ? t("correct_feedback") : t("incorrect_feedback"))}
              </p>
            </>
          )}

          {phase === "done" && (
            <ResultPanel
              result={result}
              onPlayAgain={start}
              totalQuestions={Math.max(1, correct + mistakes)}
              correct={correct}
              mistakes={mistakes}
              times={times}
              levelLabel={t(highestLevel)}
            />
          )}
        </section>
      </div>
    </AppShell>
  );
}

