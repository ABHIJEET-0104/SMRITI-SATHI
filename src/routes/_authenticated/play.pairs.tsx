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

const GAME_ID = "card_flip_pairs";

export const Route = createFileRoute("/_authenticated/play/pairs")({
  head: () => ({
    meta: [
      { title: "Card Flip Pairs — Smriti Sathi" },
      {
        name: "description",
        content:
          "Gentle card matching game. Flip cards to reveal peaceful symbols and find pairs. No timers, stress-free.",
      },
      { property: "og:title", content: "Card Flip Pairs" },
      {
        property: "og:description",
        content: "A gentle memory pair matching game for elders.",
      },
    ],
  }),
  component: PairsGame,
});

interface CardSymbol {
  id: string;
  icon: string;
  label: string;
  bgColor: string;
}

const SYMBOLS: CardSymbol[] = [
  { id: "diya", icon: "🪔", label: "Diya", bgColor: "bg-amber-500/15 border-amber-400/50 text-amber-700 dark:text-amber-300" },
  { id: "lotus", icon: "🌸", label: "Lotus", bgColor: "bg-rose-500/15 border-rose-400/50 text-rose-700 dark:text-rose-300" },
  { id: "tea", icon: "☕", label: "Tea", bgColor: "bg-orange-500/15 border-orange-400/50 text-orange-700 dark:text-orange-300" },
  { id: "dove", icon: "🕊️", label: "Dove", bgColor: "bg-sky-500/15 border-sky-400/50 text-sky-700 dark:text-sky-300" },
  { id: "apple", icon: "🍎", label: "Apple", bgColor: "bg-red-500/15 border-red-400/50 text-red-700 dark:text-red-300" },
  { id: "veena", icon: "🪕", label: "Veena", bgColor: "bg-purple-500/15 border-purple-400/50 text-purple-700 dark:text-purple-300" },
  { id: "tree", icon: "🌳", label: "Tree", bgColor: "bg-emerald-500/15 border-emerald-400/50 text-emerald-700 dark:text-emerald-300" },
  { id: "sun", icon: "☀️", label: "Sun", bgColor: "bg-yellow-500/15 border-yellow-400/50 text-yellow-700 dark:text-yellow-300" },
];

interface PlayingCard {
  instanceId: string;
  symbolId: string;
  icon: string;
  label: string;
  bgColor: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const PAIRS_CONFIG: Record<Difficulty, { pairCount: number; gridClass: string }> = {
  easy: { pairCount: 2, gridClass: "grid-cols-2 max-w-sm" },
  medium: { pairCount: 3, gridClass: "grid-cols-2 sm:grid-cols-3 max-w-md" },
  hard: { pairCount: 4, gridClass: "grid-cols-2 sm:grid-cols-4 max-w-2xl" },
};

type Phase = "intro" | "playing" | "done";

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr;
}

function PairsGame() {
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
  const config = PAIRS_CONFIG[difficulty] ?? PAIRS_CONFIG.easy;

  const [phase, setPhase] = useState<Phase>("intro");
  const [cards, setCards] = useState<PlayingCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<PlayingCard[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Metrics
  const [mistakes, setMistakes] = useState(0);
  const [matchedPairsCount, setMatchedPairsCount] = useState(0);
  const [responseTimes, setResponseTimes] = useState<number[]>([]);
  const [result, setResult] = useState<GameResult | null>(null);

  const moveStartTime = useRef<number>(0);

  const initGame = () => {
    const chosenSymbols = shuffleArray(SYMBOLS).slice(0, config.pairCount);
    const deck: PlayingCard[] = [];

    chosenSymbols.forEach((sym) => {
      // 2 cards for each symbol
      deck.push({
        instanceId: `${sym.id}-1`,
        symbolId: sym.id,
        icon: sym.icon,
        label: sym.label,
        bgColor: sym.bgColor,
        isFlipped: false,
        isMatched: false,
      });
      deck.push({
        instanceId: `${sym.id}-2`,
        symbolId: sym.id,
        icon: sym.icon,
        label: sym.label,
        bgColor: sym.bgColor,
        isFlipped: false,
        isMatched: false,
      });
    });

    setCards(shuffleArray(deck));
    setSelectedCards([]);
    setIsProcessing(false);
    setMistakes(0);
    setMatchedPairsCount(0);
    setResponseTimes([]);
    setResult(null);
    setPhase("playing");
    moveStartTime.current = Date.now();

    VoiceService.speak("pairs_flip_prompt", { lang: language });
  };

  useEffect(() => {
    if (phase === "intro") {
      VoiceService.speak("pairs_instruction", { lang: language });
    }
  }, [phase, language]);

  const handleCardClick = (card: PlayingCard) => {
    if (phase !== "playing") return;
    if (isProcessing) return;
    if (card.isFlipped || card.isMatched) return;

    const timeTaken = Math.max(200, Date.now() - moveStartTime.current);

    // Flip the tapped card
    const updatedDeck = cards.map((c) =>
      c.instanceId === card.instanceId ? { ...c, isFlipped: true } : c,
    );
    setCards(updatedDeck);

    const newSelected = [...selectedCards, { ...card, isFlipped: true }];
    setSelectedCards(newSelected);

    if (newSelected.length === 1) {
      // First card flipped
      moveStartTime.current = Date.now();
    } else if (newSelected.length === 2) {
      // Second card flipped, evaluate match
      setIsProcessing(true);
      setResponseTimes((prev) => [...prev, timeTaken]);

      const [first, second] = newSelected;
      if (first!.symbolId === second!.symbolId) {
        // MATCH!
        VoiceService.speak("pairs_match_found", { lang: language });

        const matchedDeck = updatedDeck.map((c) =>
          c.symbolId === first!.symbolId ? { ...c, isMatched: true } : c,
        );
        setCards(matchedDeck);
        setSelectedCards([]);
        setIsProcessing(false);
        moveStartTime.current = Date.now();

        const newMatchCount = matchedPairsCount + 1;
        setMatchedPairsCount(newMatchCount);

        if (newMatchCount >= config.pairCount) {
          // All matched!
          handleGameComplete(matchedDeck);
        }
      } else {
        // MISMATCH
        setMistakes((prev) => prev + 1);
        VoiceService.speak("pairs_not_match", { lang: language });

        setTimeout(() => {
          setCards((curr) =>
            curr.map((c) =>
              c.instanceId === first!.instanceId || c.instanceId === second!.instanceId
                ? { ...c, isFlipped: false }
                : c,
            ),
          );
          setSelectedCards([]);
          setIsProcessing(false);
          moveStartTime.current = Date.now();
        }, 1100);
      }
    }
  };

  const handleGameComplete = async (finalCards: PlayingCard[]) => {
    setPhase("done");
    VoiceService.speak("game_complete", { lang: language });

    const totalPairs = config.pairCount;
    const computedResult = await finish({
      gameId: GAME_ID,
      difficulty,
      totalQuestions: totalPairs,
      correctAnswers: totalPairs,
      mistakes,
      responseTimes,
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
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-4xl">
              🎴
            </div>
            <h1 className="font-display text-3xl font-bold sm:text-4xl">
              {t("pairs_game")}
            </h1>
            <p className="mt-3 text-xl text-muted-foreground">
              {t("pairs_instruction")}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4">
              <button
                type="button"
                onClick={initGame}
                className="gradient-primary min-h-16 w-full max-w-sm rounded-2xl text-xl font-bold text-primary-foreground shadow-lg transition active:scale-95"
              >
                {t("start_game")}
              </button>

              <button
                type="button"
                onClick={() => VoiceService.speak("pairs_instruction", { lang: language })}
                className="inline-flex items-center gap-2 text-base text-muted-foreground hover:text-foreground"
              >
                <Volume2 className="h-5 w-5" />
                <span>{t("voice_hint")}</span>
              </button>
            </div>
          </div>
        )}

        {phase === "playing" && (
          <div className="space-y-6">
            <div className="panel rounded-3xl p-6 sm:p-8 text-center">
              <div className="flex items-center justify-between border-b border-border/60 pb-4 text-sm font-medium text-muted-foreground">
                <span>
                  {t("pairs_matched")}: {matchedPairsCount} / {config.pairCount}
                </span>
                <span>
                  {t("mistakes")}: {mistakes}
                </span>
              </div>

              <div className="mt-4">
                <h2 className="font-display text-2xl font-bold sm:text-3xl text-foreground">
                  {t("pairs_flip_prompt")}
                </h2>
              </div>

              {/* Cards Grid */}
              <div className={`mx-auto mt-8 grid gap-4 ${config.gridClass}`}>
                {cards.map((card) => {
                  const isVisible = card.isFlipped || card.isMatched;

                  return (
                    <button
                      key={card.instanceId}
                      type="button"
                      disabled={isVisible || isProcessing}
                      onClick={() => handleCardClick(card)}
                      aria-label={isVisible ? card.label : "Hidden card"}
                      className={`relative flex aspect-square min-h-28 sm:min-h-36 items-center justify-center rounded-3xl border-2 text-5xl sm:text-6xl transition-all duration-300 select-none ${
                        card.isMatched
                          ? "border-emerald-500 bg-emerald-500/15 scale-95 opacity-80"
                          : isVisible
                            ? `${card.bgColor} border-current shadow-md scale-100`
                            : "border-border/80 bg-card hover:border-primary/50 hover:bg-muted/30 shadow-sm active:scale-95 cursor-pointer"
                      }`}
                    >
                      {isVisible ? (
                        <div className="flex flex-col items-center justify-center gap-1">
                          <span className="drop-shadow">{card.icon}</span>
                          {card.isMatched && (
                            <Check className="h-5 w-5 text-emerald-600 animate-bounce" />
                          )}
                        </div>
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/60 text-2xl text-muted-foreground font-display font-bold shadow-inner">
                          ?
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {phase === "done" && (
          <div className="panel rounded-3xl p-6 sm:p-10">
            <ResultPanel
              result={result}
              onPlayAgain={initGame}
              totalQuestions={config.pairCount}
              correct={matchedPairsCount}
              mistakes={mistakes}
              times={responseTimes}
              levelLabel={t(difficulty as TranslationKey) || difficulty}
            />
          </div>
        )}
      </div>
    </AppShell>
  );
}
