import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/app-shell";
import { FaceTile } from "@/components/face-tile";
import { PhotoInput } from "@/components/photo-input";
import { TrendChart } from "@/components/trend-chart";
import { useApp } from "@/hooks/use-app";
import {
  deleteFamilyMember,
  deleteReminder,
  getPerformanceTrend,
  linkElderly,
  listFamily,
  listGameResults,
  listNotes,
  listReminders,
  recommendNextDifficulty,
  saveFamilyMember,
  saveReminder,
  seedDemoData,
} from "@/lib/api.functions";

export const Route = createFileRoute("/_authenticated/caregiver")({
  head: () => ({
    meta: [
      { title: "Caregiver dashboard — Smriti Sathi" },
      {
        name: "description",
        content:
          "Follow game performance trends, manage family photos and set daily reminders for the person you care for.",
      },
      { property: "og:title", content: "Smriti Sathi caregiver dashboard" },
      {
        property: "og:description",
        content: "Game performance trends, family photos and daily reminders in one place.",
      },
    ],
  }),
  component: CaregiverDashboard,
});

const GAMES = [
  { id: "family_memory_match", key: "family_game" },
  { id: "sequence_memory", key: "sequence_game" },
  { id: "routine_sequencing", key: "routine_game" },
  { id: "card_flip_pairs", key: "pairs_game" },
];

function CaregiverDashboard() {
  const { profile, people, t } = useApp();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (profile && profile.role !== "caregiver") navigate({ to: "/home", replace: true });
  }, [profile, navigate]);

  useEffect(() => {
    if (!selectedId && people.length > 0) setSelectedId(people[0]!.id);
  }, [people, selectedId]);

  const selected = people.find((person) => person.id === selectedId) ?? null;
  const userId = selected?.id;

  const link = useServerFn(linkElderly);
  const linkMutation = useMutation({
    mutationFn: (code: string) => link({ data: { code } }),
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success(t("link"));
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const seed = useServerFn(seedDemoData);
  const seedMutation = useMutation({
    mutationFn: () => seed({ data: { user_id: userId! } }),
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success(t("load_demo"));
    },
  });

  const fetchFamily = useServerFn(listFamily);
  const fetchTrend = useServerFn(getPerformanceTrend);
  const fetchResults = useServerFn(listGameResults);
  const fetchReminders = useServerFn(listReminders);
  const fetchNotes = useServerFn(listNotes);
  const recommend = useServerFn(recommendNextDifficulty);

  const enabled = !!userId;
  const family = useQuery({
    queryKey: ["family", userId],
    enabled,
    queryFn: () => fetchFamily({ data: { user_id: userId! } }),
  });
  const trend = useQuery({
    queryKey: ["trend", userId],
    enabled,
    queryFn: () => fetchTrend({ data: { user_id: userId! } }),
  });
  const results = useQuery({
    queryKey: ["results", userId],
    enabled,
    queryFn: () => fetchResults({ data: { user_id: userId!, limit: 10 } }),
  });
  const reminders = useQuery({
    queryKey: ["reminders", userId],
    enabled,
    queryFn: () => fetchReminders({ data: { user_id: userId! } }),
  });
  const notes = useQuery({
    queryKey: ["notes", userId],
    enabled,
    queryFn: () => fetchNotes({ data: { user_id: userId! } }),
  });
  const levels = useQuery({
    queryKey: ["levels", userId],
    enabled,
    queryFn: async () =>
      Promise.all(
        GAMES.map(async (game) => ({
          game,
          value: await recommend({ data: { user_id: userId!, game_id: game.id } }),
        })),
      ),
  });

  const saveMember = useServerFn(saveFamilyMember);
  const removeMember = useServerFn(deleteFamilyMember);
  const memberMutation = useMutation({
    mutationFn: (input: {
      id?: string;
      name: string;
      relationship: string;
      photo_url: string | null;
    }) => saveMember({ data: { ...input, user_id: userId! } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["family", userId] }),
    onError: (error: Error) => toast.error(error.message),
  });
  const memberDelete = useMutation({
    mutationFn: (id: string) => removeMember({ data: { id } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["family", userId] }),
  });

  const putReminder = useServerFn(saveReminder);
  const dropReminder = useServerFn(deleteReminder);
  const reminderMutation = useMutation({
    mutationFn: (input: { title: string; category: string; scheduled_time: string }) =>
      putReminder({ data: { ...input, user_id: userId! } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reminders", userId] }),
    onError: (error: Error) => toast.error(error.message),
  });
  const reminderDelete = useMutation({
    mutationFn: (id: string) => dropReminder({ data: { id } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reminders", userId] }),
  });

  const [editing, setEditing] = useState<null | {
    id?: string;
    name: string;
    relationship: string;
    photo_url: string | null;
  }>(null);

  const trendLabel =
    trend.data?.trend === "improving"
      ? t("trend_improving")
      : trend.data?.trend === "declining"
        ? t("trend_declining")
        : t("trend_stable");

  return (
    <AppShell>
      <div className="mx-auto grid max-w-5xl gap-6">
        <section className="panel rounded-3xl p-6 sm:p-8">
          <h1 className="font-display text-3xl font-bold">{t("caregiver_dashboard")}</h1>
          <p className="mt-1 text-lg text-muted-foreground">{profile?.full_name}</p>

          <h2 className="mt-6 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            {t("linked_people")}
          </h2>
          {people.length === 0 ? (
            <p className="mt-2 text-lg">{t("no_linked")}</p>
          ) : (
            <div className="mt-3 flex flex-wrap gap-3">
              {people.map((person) => (
                <button
                  key={person.id}
                  type="button"
                  onClick={() => setSelectedId(person.id)}
                  aria-pressed={person.id === selectedId}
                  className={`min-h-12 rounded-xl border px-5 text-base font-semibold ${
                    person.id === selectedId
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card/60"
                  }`}
                >
                  {person.full_name}
                </button>
              ))}
            </div>
          )}

          <form
            className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end"
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              linkMutation.mutate(String(form.get("code") ?? ""));
              event.currentTarget.reset();
            }}
          >
            <label className="grid gap-1.5 text-sm font-semibold">
              {t("link_elderly")}
              <input
                name="code"
                placeholder="ABC123"
                maxLength={6}
                className="min-h-13 rounded-xl border border-input bg-card px-4 text-lg uppercase tracking-[0.3em]"
              />
              <span className="text-xs font-normal text-muted-foreground">{t("link_hint")}</span>
            </label>
            <button
              type="submit"
              className="gradient-primary min-h-13 rounded-xl px-8 text-base font-semibold text-primary-foreground"
            >
              {t("link")}
            </button>
          </form>
        </section>

        {selected && (
          <>
            <section className="panel rounded-3xl p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-bold">{selected.full_name}</h2>
                  <p className="text-base text-muted-foreground">
                    {selected.age ? `${t("age")} ${selected.age} · ` : ""}
                    {t("care_code")}: {selected.care_code}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => seedMutation.mutate()}
                  disabled={seedMutation.isPending}
                  className="min-h-12 rounded-xl border border-border bg-card/70 px-5 text-sm font-semibold"
                >
                  {t("load_demo")}
                </button>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-border bg-card/60 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-display text-lg font-semibold">
                      {t("performance_trend")}
                    </h3>
                    <span
                      className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                        trend.data?.trend === "improving"
                          ? "bg-positive/15 text-positive"
                          : trend.data?.trend === "declining"
                            ? "bg-warning/20 text-accent-foreground"
                            : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {trendLabel}
                    </span>
                  </div>
                  <div className="mt-4">
                    <TrendChart
                      points={(trend.data?.recent ?? []).map((point) => ({
                        score: point.score,
                        played_at: point.played_at,
                      }))}
                      label={t("performance_trend")}
                    />
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-3">
                    <Stat label={t("games_completed")} value={String(trend.data?.games_completed ?? 0)} />
                    <Stat label={t("average_score")} value={String(trend.data?.average_score ?? 0)} />
                    <Stat
                      label={t("accuracy")}
                      value={`${Math.round((trend.data?.average_accuracy ?? 0) * 100)}%`}
                    />
                    <Stat
                      label={t("response_time")}
                      value={`${((trend.data?.average_response_time_ms ?? 0) / 1000).toFixed(1)}s`}
                    />
                  </dl>
                  <p className="mt-4 text-sm italic text-muted-foreground">
                    {t("trend_disclaimer")}
                  </p>
                  <p className="mt-1 text-sm italic text-muted-foreground">
                    {t("games_disclaimer")}
                  </p>
                </div>

                <div className="grid gap-6">
                  <div className="rounded-2xl border border-border bg-card/60 p-5">
                    <h3 className="font-display text-lg font-semibold">
                      {t("adaptive_difficulty")}
                    </h3>
                    <ul className="mt-3 grid gap-3">
                      {(levels.data ?? []).map(({ game, value }) => (
                        <li key={game.id} className="text-base">
                          <span className="font-semibold">{t(game.key)}: </span>
                          {t(value.recommended_difficulty)}
                          <span className="block text-sm text-muted-foreground">
                            {value.reason}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-border bg-card/60 p-5">
                    <h3 className="font-display text-lg font-semibold">{t("alerts")}</h3>
                    {(notes.data?.notes ?? []).length === 0 ? (
                      <p className="mt-2 text-base text-muted-foreground">{t("no_alerts")}</p>
                    ) : (
                      <ul className="mt-3 grid gap-2 text-base">
                        {notes.data!.notes.map((note, index) => (
                          <li key={index} className="rounded-xl bg-secondary/70 px-4 py-3">
                            {note.message}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section className="panel rounded-3xl p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-display text-2xl font-bold">{t("family_members")}</h2>
                <button
                  type="button"
                  onClick={() => setEditing({ name: "", relationship: "", photo_url: null })}
                  className="gradient-primary inline-flex min-h-12 items-center gap-2 rounded-xl px-5 text-base font-semibold text-primary-foreground"
                >
                  <Plus className="size-5" aria-hidden /> {t("add_member")}
                </button>
              </div>

              {editing && (
                <form
                  className="mt-5 grid gap-4 rounded-2xl border border-primary/25 bg-card/70 p-5"
                  onSubmit={(event) => {
                    event.preventDefault();
                    memberMutation.mutate(editing);
                    setEditing(null);
                  }}
                >
                  <label className="grid gap-1.5 text-sm font-semibold">
                    {t("name")}
                    <input
                      value={editing.name}
                      onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                      required
                      className="min-h-12 rounded-xl border border-input bg-card px-4 text-base"
                    />
                  </label>
                  <label className="grid gap-1.5 text-sm font-semibold">
                    {t("relationship")}
                    <input
                      value={editing.relationship}
                      onChange={(e) => setEditing({ ...editing, relationship: e.target.value })}
                      required
                      className="min-h-12 rounded-xl border border-input bg-card px-4 text-base"
                    />
                  </label>
                  <PhotoInput
                    label={t("photo")}
                    value={editing.photo_url}
                    onChange={(photo_url) => setEditing({ ...editing, photo_url })}
                  />
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      className="gradient-primary min-h-12 rounded-xl px-6 text-base font-semibold text-primary-foreground"
                    >
                      {t("save")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(null)}
                      className="min-h-12 rounded-xl border border-border px-6 text-base font-semibold"
                    >
                      {t("cancel")}
                    </button>
                  </div>
                </form>
              )}

              <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {(family.data ?? []).map((member: any) => (
                  <li
                    key={member.id}
                    className="overflow-hidden rounded-2xl border border-border bg-card/60"
                  >
                    <div className="aspect-[4/3]">
                      <FaceTile photoUrl={member.photo_url} name={member.name} />
                    </div>
                    <div className="flex items-start justify-between gap-2 p-4">
                      <div>
                        <p className="text-lg font-semibold">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.relationship}</p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            setEditing({
                              id: member.id,
                              name: member.name,
                              relationship: member.relationship,
                              photo_url: member.photo_url,
                            })
                          }
                          className="min-h-10 rounded-lg px-3 text-sm font-semibold text-primary"
                        >
                          {t("edit")}
                        </button>
                        <button
                          type="button"
                          aria-label={`${t("delete")} ${member.name}`}
                          onClick={() => memberDelete.mutate(member.id)}
                          className="grid size-10 place-items-center rounded-lg text-destructive"
                        >
                          <Trash2 className="size-4" aria-hidden />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="panel rounded-3xl p-6 sm:p-8">
              <h2 className="font-display text-2xl font-bold">{t("reminders")}</h2>
              <form
                className="mt-4 grid gap-3 sm:grid-cols-[2fr_1fr_1fr_auto] sm:items-end"
                onSubmit={(event) => {
                  event.preventDefault();
                  const form = new FormData(event.currentTarget);
                  reminderMutation.mutate({
                    title: String(form.get("title") ?? ""),
                    category: String(form.get("category") ?? "general"),
                    scheduled_time: String(form.get("time") ?? "09:00"),
                  });
                  event.currentTarget.reset();
                }}
              >
                <label className="grid gap-1.5 text-sm font-semibold">
                  {t("add_reminder")}
                  <input
                    name="title"
                    required
                    className="min-h-12 rounded-xl border border-input bg-card px-4 text-base"
                  />
                </label>
                <label className="grid gap-1.5 text-sm font-semibold">
                  {t("category")}
                  <select
                    name="category"
                    className="min-h-12 rounded-xl border border-input bg-card px-3 text-base"
                  >
                    <option value="medicine">Medicine</option>
                    <option value="meal">Meal</option>
                    <option value="activity">Activity</option>
                    <option value="general">General</option>
                  </select>
                </label>
                <label className="grid gap-1.5 text-sm font-semibold">
                  {t("upcoming")}
                  <input
                    name="time"
                    type="time"
                    defaultValue="09:00"
                    className="min-h-12 rounded-xl border border-input bg-card px-3 text-base"
                  />
                </label>
                <button
                  type="submit"
                  className="gradient-primary min-h-12 rounded-xl px-6 text-base font-semibold text-primary-foreground"
                >
                  {t("save")}
                </button>
              </form>

              <ul className="mt-5 divide-y divide-border">
                {(reminders.data?.reminders ?? []).map((reminder: any) => {
                  const today = new Date().toISOString().slice(0, 10);
                  const done = (reminders.data?.logs ?? []).some(
                    (log: any) =>
                      log.reminder_id === reminder.id &&
                      log.log_date === today &&
                      log.status === "acknowledged",
                  );
                  return (
                    <li key={reminder.id} className="flex flex-wrap items-center gap-3 py-4">
                      <span className="flex-1">
                        <span className="block text-lg font-semibold">{reminder.title}</span>
                        <span className="block text-sm text-muted-foreground">
                          {String(reminder.scheduled_time).slice(0, 5)} · {reminder.category}
                        </span>
                      </span>
                      <span
                        className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                          done ? "bg-positive/15 text-positive" : "bg-secondary"
                        }`}
                      >
                        {done ? t("completed") : t("upcoming")}
                      </span>
                      <button
                        type="button"
                        aria-label={`${t("delete")} ${reminder.title}`}
                        onClick={() => reminderDelete.mutate(reminder.id)}
                        className="grid size-10 place-items-center rounded-lg text-destructive"
                      >
                        <Trash2 className="size-4" aria-hidden />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className="panel rounded-3xl p-6 sm:p-8">
              <h2 className="font-display text-2xl font-bold">{t("recent_sessions")}</h2>
              {(results.data ?? []).length === 0 ? (
                <p className="mt-2 text-lg text-muted-foreground">{t("no_sessions")}</p>
              ) : (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-base">
                    <thead className="text-sm text-muted-foreground">
                      <tr>
                        <th className="py-2 pr-4">{t("start_a_game")}</th>
                        <th className="py-2 pr-4">{t("score")}</th>
                        <th className="py-2 pr-4">{t("accuracy")}</th>
                        <th className="py-2 pr-4">{t("mistakes")}</th>
                        <th className="py-2 pr-4">{t("response_time")}</th>
                        <th className="py-2">{t("suggested_level")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(results.data ?? []).map((row: any) => (
                        <tr key={row.session_id} className="border-t border-border">
                          <td className="py-3 pr-4">
                            {(() => {
                              const match = GAMES.find((g) => g.id === row.game_id);
                              return match ? t(match.key as any) : row.game_id;
                            })()}
                            <span className="block text-sm text-muted-foreground">
                              {new Date(row.played_at).toLocaleString()}
                            </span>
                          </td>
                          <td className="py-3 pr-4">{row.score}</td>
                          <td className="py-3 pr-4">{Math.round(Number(row.accuracy) * 100)}%</td>
                          <td className="py-3 pr-4">{row.mistakes}</td>
                          <td className="py-3 pr-4">
                            {(Number(row.response_time_ms) / 1000).toFixed(1)}s
                          </td>
                          <td className="py-3">{t(row.difficulty)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-secondary/60 p-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-display text-xl font-semibold">{value}</dd>
    </div>
  );
}
