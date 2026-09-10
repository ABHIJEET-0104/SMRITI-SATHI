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
import { DIFFICULTY_CONFIG, asDifficulty } from "@/lib/performance";
import { VoiceService } from "@/lib/voice";

const GAME_ID = "sequence_memory";
const ROUNDS = 5;

 const PADS = [
  { id: 0, label: "1", className: "bg-primary text-primary-foreground" },
  { id: 1, label: "2", className: "bg-accent text-accent-foreground" },
  { id: 2, label: "3", className: "bg-positive text-primary-foreground" },
  { id: 3, label: "4", className: "bg-red-500 text-white" },
];
export const Route = createFileRoute("/_authenticated/play/sequence")({
  head: () => ({
    meta: [
      { title: "Sequence Memory — Smriti Sathi" },
      {
        name: "description",
        content:
          "Watch a short pattern of large coloured tiles, then repeat it. The pattern length follows recent game performance.",
      },
      { property: "og:title", content: "Sequence Memory" },
      { property: "og:description", content: "Watch a pattern, then repeat it. Simple and calm." },
    ],
  }),
  component: SequenceGame,
});

type Phase = "intro" | "watch" | "input" | "feedback" | "done";

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

  const difficulty = asDifficulty(recommendation?.recommended_difficulty);
  const config = DIFFICULTY_CONFIG[difficulty];

  const [phase, setPhase] = useState<Phase>("intro");
  const [round, setRound] = useState(0);
  const [sequence, setSequence] = useState<number[]>([]);
  const [litPad, setLitPad] = useState<number | null>(null);
  const [entered, setEntered] = useState<number[]>([]);
  const [roundRight, setRoundRight] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [times, setTimes] = useState<number[]>([]);
  const [result, setResult] = useState<GameResult | null>(null);
  const inputStart = useRef(0);

  function makeSequence() {
    return Array.from({ length: config.sequenceLength }, () => Math.floor(Math.random() * 4));
  }

  function start() {
    setRound(0);
    setCorrect(0);
    setMistakes(0);
    setTimes([]);
    setResult(null);
    setSequence(makeSequence());
    setEntered([]);
    setPhase("watch");
    VoiceService.speak("sequence_instruction");
  }

  // Play the pattern back one tile at a time, then hand over to the player.
  useEffect(() => {
    if (phase !== "watch" || sequence.length === 0) return;
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
        window.setTimeout(showNext, 260);
      }, 700);
    };
    const timer = window.setTimeout(showNext, 900);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [phase, sequence]);

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
      VoiceService.speak("incorrect_feedback");
      setPhase("feedback");
      return;
    }

    setEntered(next);
    if (next.length === sequence.length) {
      setTimes((list) => [...list, Date.now() - inputStart.current]);
      setCorrect((c) => c + 1);
      setRoundRight(true);
      VoiceService.speak("correct_feedback");
      setPhase("feedback");
    }
  }

  // Next round, or finish.
  useEffect(() => {
    if (phase !== "feedback") return;
    const timer = window.setTimeout(() => {
      if (round + 1 >= ROUNDS) {
        VoiceService.speak("game_complete");
        setPhase("done");
      } else {
        setRound((r) => r + 1);
        setSequence(makeSequence());
        setEntered([]);
        setPhase("watch");
      }
    }, 1800);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, round]);

  // Store the result once, when the game ends.
  useEffect(() => {
    if (phase !== "done" || result) return;
    void finish({
      gameId: GAME_ID,
      difficulty,
      totalQuestions: ROUNDS,
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
                  {t("question_of")} {round + 1} {t("of")} {ROUNDS} ·{" "}
                  {phase === "watch" ? t("watch") : t("your_turn")}
                </p>
              )}
            </div>
            <span className="rounded-full border border-border bg-card/70 px-4 py-2 text-sm font-semibold">
              {t("suggested_level")}: {t(difficulty)}
            </span>
          </div>

          {phase === "intro" && (
            <div className="mt-6">
              <p className="text-xl text-muted-foreground">{t("sequence_game_desc")}</p>
              {recommendation && (
                <p className="mt-2 text-base text-muted-foreground">{recommendation.reason}.</p>
              )}
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
              <p className="mt-6 text-center font-display text-2xl font-bold">
                {phase === "watch" ? t("sequence_instruction") : t("repeat_sequence")}
              </p>
              <div className="mx-auto mt-6 grid max-w-md grid-cols-2 gap-4">
                {PADS.map((pad) => (
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
              totalQuestions={ROUNDS}
              correct={correct}
              mistakes={mistakes}
              times={times}
            />
          )}
        </section>
      </div>
    </AppShell>
  );
}
