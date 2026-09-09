import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { FaceTile } from "@/components/face-tile";
import { ResultPanel } from "@/components/result-panel";
import { useApp } from "@/hooks/use-app";
import { useGameSession } from "@/hooks/use-game-session";
import { listFamily, recommendNextDifficulty } from "@/lib/api.functions";
import { DIFFICULTY_CONFIG, asDifficulty } from "@/lib/performance";
import { VoiceService } from "@/lib/voice";
import type { GameResult } from "@/hooks/use-game-session";

const GAME_ID = "family_memory_match";

export const Route = createFileRoute("/_authenticated/play/family")({
  head: () => ({
    meta: [
      { title: "Family Memory Match — Smriti Sathi" },
      {
        name: "description",
        content:
          "Look at a family photo, then choose the right name. Difficulty adapts to recent game performance.",
      },
      { property: "og:title", content: "Family Memory Match" },
      { property: "og:description", content: "A gentle photo-and-name memory game for elders." },
    ],
  }),
  component: FamilyGame,
});

interface Member {
  id: string;
  name: string;
  relationship: string;
  photo_url: string | null;
}

interface Question {
  target: Member;
  options: Member[];
}

type Phase = "intro" | "preview" | "question" | "feedback" | "done";

function FamilyGame() {
  const { profile, t } = useApp();
  const { finish } = useGameSession();
  const userId = profile?.id;

  const fetchFamily = useServerFn(listFamily);
  const recommend = useServerFn(recommendNextDifficulty);

  const { data: family = [], isLoading } = useQuery({
    queryKey: ["family", userId],
    enabled: !!userId,
    queryFn: () => fetchFamily({ data: { user_id: userId! } }),
  });

  const { data: recommendation } = useQuery({
    queryKey: ["difficulty", userId, GAME_ID],
    enabled: !!userId,
    queryFn: () => recommend({ data: { user_id: userId!, game_id: GAME_ID } }),
  });

  const difficulty = asDifficulty(recommendation?.recommended_difficulty);
  const config = DIFFICULTY_CONFIG[difficulty];

  const [phase, setPhase] = useState<Phase>("intro");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [times, setTimes] = useState<number[]>([]);
  const [chosen, setChosen] = useState<string | null>(null);
  const [wasRight, setWasRight] = useState(false);
  const [result, setResult] = useState<GameResult | null>(null);
  const shownAt = useRef(0);

  const members = family as Member[];
  const optionCount = Math.max(2, Math.min(config.options, members.length));

  const canPlay = members.length >= 2;

  function buildQuestions(): Question[] {
    const rounds: Question[] = [];
    for (let i = 0; i < config.questions; i += 1) {
      const target = members[Math.floor(Math.random() * members.length)]!;
      const distractors = members
        .filter((m) => m.id !== target.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, optionCount - 1);
      rounds.push({
        target,
        options: [target, ...distractors].sort(() => Math.random() - 0.5),
      });
    }
    return rounds;
  }

  function start() {
    setQuestions(buildQuestions());
    setIndex(0);
    setCorrect(0);
    setMistakes(0);
    setTimes([]);
    setResult(null);
    setPhase("preview");
    VoiceService.speak("game_instruction");
  }

  // Preview the photo, then ask the question.
  useEffect(() => {
    if (phase !== "preview") return;
    const timer = window.setTimeout(() => {
      setPhase("question");
      shownAt.current = Date.now();
      VoiceService.speak("question_prompt");
    }, config.previewMs);
    return () => window.clearTimeout(timer);
  }, [phase, index, config.previewMs]);

  function answer(member: Member) {
    if (phase !== "question") return;
    const question = questions[index]!;
    const right = member.id === question.target.id;
    setTimes((list) => [...list, Date.now() - shownAt.current]);
    setChosen(member.id);
    setWasRight(right);
    if (right) setCorrect((c) => c + 1);
    else setMistakes((m) => m + 1);
    VoiceService.speak(right ? "correct_feedback" : "incorrect_feedback");
    setPhase("feedback");
  }

  // Move on after feedback, or finish the game.
  useEffect(() => {
    if (phase !== "feedback") return;
    const timer = window.setTimeout(() => {
      setChosen(null);
      if (index + 1 >= questions.length) {
        VoiceService.speak("game_complete");
        setPhase("done");
      } else {
        setIndex((i) => i + 1);
        setPhase("preview");
      }
    }, 1800);
    return () => window.clearTimeout(timer);
  }, [phase, index, questions.length]);

  // Store the result once, when the game ends.
  useEffect(() => {
    if (phase !== "done" || result) return;
    void finish({
      gameId: GAME_ID,
      difficulty,
      totalQuestions: questions.length,
      correctAnswers: correct,
      mistakes,
      responseTimes: times,
    }).then((saved) => saved && setResult(saved));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const question = questions[index];
  const heading = useMemo(() => t("family_game"), [t]);

  return (
    <AppShell>
      <div className="mx-auto grid max-w-3xl gap-6">
        <Link to="/home" className="inline-flex items-center gap-2 text-base font-semibold">
          <ArrowLeft className="size-5" aria-hidden /> {t("back_home")}
        </Link>

        <section className="panel rounded-3xl p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="font-display text-3xl font-bold">{heading}</h1>
              {phase !== "intro" && phase !== "done" && (
                <p className="mt-1 text-lg text-muted-foreground">
                  {t("question_of")} {index + 1} {t("of")} {questions.length}
                </p>
              )}
            </div>
            <span className="rounded-full border border-border bg-card/70 px-4 py-2 text-sm font-semibold">
              {t("suggested_level")}: {t(difficulty)}
            </span>
          </div>

          {isLoading && <p className="mt-6 text-lg">…</p>}

          {!isLoading && !canPlay && (
            <p className="mt-6 rounded-2xl border border-accent/40 bg-accent/10 p-5 text-lg">
              {t("need_family_first")}
            </p>
          )}

          {!isLoading && canPlay && phase === "intro" && (
            <div className="mt-6">
              <p className="text-xl text-muted-foreground">{t("family_game_desc")}</p>
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

          {canPlay && question && phase !== "intro" && phase !== "done" && (
            <div className="mt-6 grid gap-6 sm:grid-cols-5 sm:items-center">
              <div className="overflow-hidden rounded-2xl border border-border bg-secondary sm:col-span-3">
                <div className="aspect-[4/3]">
                  {phase === "preview" ? (
                    <FaceTile photoUrl={question.target.photo_url} name={question.target.name} />
                  ) : (
                    <div className="grid size-full place-items-center bg-secondary p-6 text-center">
                      <p className="font-display text-3xl font-bold">{t("question_prompt")}</p>
                    </div>
                  )}
                </div>
                <p className="border-t border-border px-4 py-3 text-center text-lg font-semibold">
                  {phase === "preview" ? t("memory_preview") : t("question_prompt")}
                </p>
              </div>

              <div className="grid gap-3 sm:col-span-2">
                {question.options.map((option) => {
                  const isChosen = chosen === option.id;
                  const isTarget = option.id === question.target.id;
                  const showState = phase === "feedback";
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => answer(option)}
                      disabled={phase !== "question"}
                      className={`min-h-16 rounded-2xl border-2 px-4 text-xl font-semibold transition-colors ${
                        showState && isTarget
                          ? "border-positive bg-positive/15"
                          : showState && isChosen
                            ? "border-destructive bg-destructive/10"
                            : "border-border bg-card/70 disabled:opacity-60"
                      }`}
                    >
                      {option.name}
                      <span className="block text-sm font-normal text-muted-foreground">
                        {option.relationship}
                      </span>
                    </button>
                  );
                })}
                {phase === "feedback" && (
                  <p className="text-lg font-semibold">
                    {wasRight ? t("correct_feedback") : t("incorrect_feedback")}
                  </p>
                )}
              </div>
            </div>
          )}

          {phase === "done" && (
            <ResultPanel
              result={result}
              onPlayAgain={start}
              totalQuestions={questions.length}
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
