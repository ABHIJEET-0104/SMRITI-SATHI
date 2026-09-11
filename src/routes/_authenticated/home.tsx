import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Check, Mic, User } from "lucide-react";
import { useEffect } from "react";

import { AppShell } from "@/components/app-shell";
import { useApp } from "@/hooks/use-app";
import { acknowledgeReminder, listReminders } from "@/lib/api.functions";
import { VoiceService } from "@/lib/voice";

export const Route = createFileRoute("/_authenticated/home")({
  head: () => ({
    meta: [
      { title: "Home — Smriti Sathi" },
      {
        name: "description",
        content:
          "Start a memory game, see today's reminders and hear spoken guidance in your own language.",
      },
      { property: "og:title", content: "Your Smriti Sathi home" },
      {
        property: "og:description",
        content: "Memory games, today's reminders and voice guidance in one simple screen.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { profile, t, language } = useApp();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userId = profile?.id;

  useEffect(() => {
    if (profile?.role === "caregiver") navigate({ to: "/caregiver", replace: true });
  }, [profile?.role, navigate]);

  const fetchReminders = useServerFn(listReminders);
  const { data } = useQuery({
    queryKey: ["reminders", userId],
    enabled: !!userId,
    queryFn: () => fetchReminders({ data: { user_id: userId! } }),
  });

  const ack = useServerFn(acknowledgeReminder);
  const ackMutation = useMutation({
    mutationFn: (id: string) => ack({ data: { id, user_id: userId! } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reminders", userId] }),
  });

  useEffect(() => {
    if (profile?.role === "elderly") VoiceService.speak("welcome");
  }, [profile?.role, language]);

  const today = new Date().toISOString().slice(0, 10);
  const doneToday = new Set(
    (data?.logs ?? [])
      .filter((log: any) => log.log_date === today && log.status === "acknowledged")
      .map((log: any) => log.reminder_id),
  );
  const reminders = (data?.reminders ?? []).filter((r: any) => r.active);

  return (
    <AppShell>
      <div className="mx-auto grid max-w-4xl gap-6">
        <section className="panel rounded-3xl p-6 sm:p-8">
          <p className="font-display text-3xl font-bold sm:text-4xl">
            {t("greeting")}, {profile?.full_name?.split(" ")[0]}
          </p>
          <p className="mt-2 text-xl text-muted-foreground">{t("home_prompt")}</p>
        </section>

        <section>
          <h2 className="mb-4 font-display text-2xl font-bold">{t("start_a_game")}</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <GameCard
              to="/play/family"
              title={t("family_game")}
              description={t("family_game_desc")}
              cta={t("start_game")}
              tone="primary"
            />
            <GameCard
              to="/play/sequence"
              title={t("sequence_game")}
              description={t("sequence_game_desc")}
              cta={t("start_game")}
              tone="accent"
            />
            <GameCard
              to="/play/routine"
              title={t("routine_game")}
              description={t("routine_game_desc")}
              cta={t("start_game")}
              tone="amber"
            />
            <GameCard
              to="/play/pairs"
              title={t("pairs_game")}
              description={t("pairs_game_desc")}
              cta={t("start_game")}
              tone="emerald"
            />
          </div>
        </section>

        <section className="panel rounded-3xl p-6 sm:p-8">
          <h2 className="font-display text-2xl font-bold">{t("todays_reminders")}</h2>
          {reminders.length === 0 ? (
            <p className="mt-3 text-lg text-muted-foreground">{t("no_reminders")}</p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {reminders.map((reminder: any) => {
                const done = doneToday.has(reminder.id);
                return (
                  <li key={reminder.id} className="flex flex-wrap items-center gap-4 py-4">
                    <span
                      className={`grid size-10 shrink-0 place-items-center rounded-full ${
                        done ? "bg-positive text-primary-foreground" : "border-2 border-primary"
                      }`}
                    >
                      {done && <Check className="size-5" aria-hidden />}
                    </span>
                    <span className="flex-1">
                      <span className="block text-xl font-semibold">{reminder.title}</span>
                      <span className="block text-base text-muted-foreground">
                        {String(reminder.scheduled_time).slice(0, 5)}
                      </span>
                    </span>
                    {done ? (
                      <span className="text-base font-semibold text-positive">
                        {t("reminder_done")}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          VoiceService.speakText(reminder.title);
                          ackMutation.mutate(reminder.id);
                        }}
                        className="gradient-primary min-h-12 rounded-xl px-6 text-base font-semibold text-primary-foreground"
                      >
                        {t("mark_done")}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <div className="grid gap-5 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => {
              VoiceService.speak("welcome");
              const next = reminders.find((r: any) => !doneToday.has(r.id));
              if (next) {
                window.setTimeout(() => {
                  VoiceService.speak("reminder_due", { interrupt: false });
                  VoiceService.speakText(next.title, { interrupt: false });
                }, 2200);
              }
            }}
            className="panel flex flex-col items-center gap-3 rounded-3xl p-8 text-center"
          >
            <span className="gradient-primary grid size-20 place-items-center rounded-full text-primary-foreground">
              <Mic className="size-9" aria-hidden />
            </span>
            <span className="text-xl font-semibold">{t("voice_assistant")}</span>
            <span className="text-base text-muted-foreground">
              {VoiceService.isUnavailable() ? t("voice_unavailable") : t("voice_hint")}
            </span>
          </button>

          <Link
            to="/profile"
            className="panel flex flex-col items-center gap-3 rounded-3xl p-8 text-center"
          >
            <span className="grid size-20 place-items-center rounded-full bg-secondary">
              <User className="size-9 text-primary" aria-hidden />
            </span>
            <span className="text-xl font-semibold">{t("profile")}</span>
            <span className="text-base text-muted-foreground">
              {profile?.age ? `${t("age")} ${profile.age} · ` : ""}
              {t("language")}
            </span>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}

function GameCard({
  to,
  title,
  description,
  cta,
  tone,
}: {
  to: string;
  title: string;
  description: string;
  cta: string;
  tone: "primary" | "accent" | "amber" | "emerald";
}) {
  const borderClass =
    tone === "primary"
      ? "border-primary/25"
      : tone === "accent"
        ? "border-accent/40"
        : tone === "amber"
          ? "border-amber-500/30"
          : "border-emerald-500/30";

  const ctaClass =
    tone === "primary"
      ? "gradient-primary text-primary-foreground"
      : tone === "accent"
        ? "gradient-accent text-accent-foreground"
        : tone === "amber"
          ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/20"
          : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-500/20";

  return (
    <div className={`rounded-3xl border bg-card/70 p-6 ${borderClass}`}>
      <h3 className="font-display text-2xl font-semibold">{title}</h3>
      <p className="mt-1 text-lg text-muted-foreground">{description}</p>
      <Link
        to={to}
        className={`mt-6 flex min-h-14 items-center justify-center rounded-xl text-lg font-semibold shadow-[var(--shadow-lift)] ${ctaClass}`}
      >
        {cta}
      </Link>
    </div>
  );
}
