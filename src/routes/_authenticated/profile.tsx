import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { AppShell, LanguagePicker } from "@/components/app-shell";
import { useApp } from "@/hooks/use-app";
import { getPerformanceTrend, updateMyProfile } from "@/lib/api.functions";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Your profile — Smriti Sathi" },
      {
        name: "description",
        content: "Your name, age, chosen language, care code and caregiver details.",
      },
      { property: "og:title", content: "Your Smriti Sathi profile" },
      { property: "og:description", content: "Name, age, language and caregiver details." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { profile, t, refresh } = useApp();
  const save = useServerFn(updateMyProfile);
  const fetchTrend = useServerFn(getPerformanceTrend);

  const { data: trend } = useQuery({
    queryKey: ["trend", profile?.id],
    enabled: !!profile?.id,
    queryFn: () => fetchTrend({ data: { user_id: profile!.id } }),
  });

  const mutation = useMutation({
    mutationFn: (patch: { full_name?: string; age?: number | null }) => save({ data: patch }),
    onSuccess: () => {
      refresh();
      toast.success(t("save"));
    },
  });

  return (
    <AppShell>
      <div className="mx-auto grid max-w-2xl gap-6">
        <Link to="/home" className="inline-flex items-center gap-2 text-base font-semibold">
          <ArrowLeft className="size-5" aria-hidden /> {t("back_home")}
        </Link>

        <section className="panel rounded-3xl p-6 sm:p-8">
          <h1 className="font-display text-3xl font-bold">{t("profile")}</h1>
          <form
            className="mt-6 grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              mutation.mutate({
                full_name: String(form.get("full_name") ?? ""),
                age: form.get("age") ? Number(form.get("age")) : null,
              });
            }}
          >
            <label className="grid gap-1.5 text-sm font-semibold">
              {t("name")}
              <input
                name="full_name"
                defaultValue={profile?.full_name ?? ""}
                className="min-h-13 rounded-xl border border-input bg-card px-4 text-lg"
              />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold">
              {t("age")}
              <input
                name="age"
                inputMode="numeric"
                defaultValue={profile?.age ?? ""}
                className="min-h-13 rounded-xl border border-input bg-card px-4 text-lg"
              />
            </label>
            <button
              type="submit"
              className="gradient-primary min-h-14 rounded-xl text-lg font-semibold text-primary-foreground"
            >
              {t("save")}
            </button>
          </form>

          <div className="mt-8">
            <h2 className="mb-3 font-display text-xl font-semibold">{t("language")}</h2>
            <LanguagePicker />
          </div>
        </section>

        {profile?.role === "elderly" && (
          <section className="panel rounded-3xl p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold">{t("care_code")}</h2>
            <p className="mt-2 font-display text-4xl font-bold tracking-[0.3em]">
              {profile.care_code}
            </p>
            <p className="mt-2 text-base text-muted-foreground">{t("care_code_hint")}</p>
            <p className="mt-4 text-base">
              <span className="font-semibold">{t("caregiver")}: </span>
              {profile.caregiver?.full_name ?? t("not_linked")}
            </p>
          </section>
        )}

        <section className="panel rounded-3xl p-6 sm:p-8">
          <h2 className="font-display text-xl font-semibold">{t("game_performance")}</h2>
          <dl className="mt-4 grid grid-cols-2 gap-4">
            <Stat label={t("games_completed")} value={String(trend?.games_completed ?? 0)} />
            <Stat label={t("average_score")} value={String(trend?.average_score ?? 0)} />
            <Stat
              label={t("accuracy")}
              value={`${Math.round((trend?.average_accuracy ?? 0) * 100)}%`}
            />
            <Stat
              label={t("response_time")}
              value={`${((trend?.average_response_time_ms ?? 0) / 1000).toFixed(1)}s`}
            />
          </dl>
          <p className="mt-4 text-sm italic text-muted-foreground">{t("games_disclaimer")}</p>
        </section>
      </div>
    </AppShell>
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
