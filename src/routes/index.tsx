import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  HeartHandshake,
  ShieldCheck,
  Volume2,
  WifiOff,
} from "lucide-react";
import { useEffect } from "react";

import { LanguagePicker } from "@/components/app-shell";
import { useApp } from "@/hooks/use-app";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Smriti Sathi — Memory games and reminders for elders",
      },
      {
        name: "description",
        content:
          "Gentle memory games, daily reminders and voice guidance in English, Hindi, Marathi and Assamese, with a caregiver dashboard for game performance.",
      },
      {
        property: "og:title",
        content:
          "Smriti Sathi — a calm memory companion for elders",
      },
      {
        property: "og:description",
        content:
          "Family Memory Match and Sequence Memory, daily reminders, multilingual voice guidance and a caregiver view of game performance.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { session, profile, t } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session || !profile) return;

    navigate({
      to: profile.role === "caregiver" ? "/caregiver" : "/home",
      replace: true,
    });
  }, [session, profile, navigate]);

  const features = [
    {
      icon: HeartHandshake,
      text: t("feature_memory"),
    },
    {
      icon: Volume2,
      text: t("feature_voice"),
    },
    {
      icon: WifiOff,
      text: t("feature_offline"),
    },
    {
      icon: ShieldCheck,
      text: t("feature_caregiver"),
    },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden px-4 py-10 sm:px-8">
      {/* Scenic warm background scene */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-bottom bg-no-repeat opacity-80 transition-opacity duration-300 dark:opacity-30"
        style={{
          backgroundImage: "url('/images/auth-bg.png')",
        }}
        aria-hidden="true"
      />
      {/* Soft atmospheric overlay ensuring pristine readability */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-b from-background/50 via-background/35 to-background/60 backdrop-blur-[1px]"
        aria-hidden="true"
      />

      {/* Background Orb - Left */}
      <div
        className="orb -left-24 -top-32 size-[480px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--primary) 30%, transparent), transparent 70%)",
        }}
      />

      {/* Background Orb - Right */}
      <div
        className="orb -bottom-24 -right-24 size-[420px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--accent) 35%, transparent), transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">

          {/* Logo + App Name */}
          <div className="flex items-center gap-3">
            <span className="gradient-primary grid size-12 place-items-center rounded-2xl font-display text-lg font-bold text-primary-foreground shadow-[var(--shadow-lift)]">
              SS
            </span>

            <span className="leading-tight">
              <span className="block font-display text-xl font-bold drop-shadow-sm">
                {t("app_name")}
              </span>

              <span className="block text-xs text-muted-foreground">
                {t("tagline")}
              </span>
            </span>
          </div>

          {/* Language Dropdown */}
          <LanguagePicker compact />
        </div>

        {/* Main Card */}
        <section className="panel mt-8 rounded-3xl p-7 sm:p-10 backdrop-blur-xl bg-card/95 shadow-2xl border border-border/80">

          {/* Main Heading */}
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            {t("hero_title")}
          </h1>

          {/* Description */}
          <p className="mt-4 text-xl text-muted-foreground">
            {t("hero_description")}
          </p>

          {/* Login Options */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">

            {/* Patient / Elder Option */}
            <div className="flex flex-col justify-between rounded-2xl border border-primary/20 bg-primary/5 p-6 transition hover:border-primary/40 hover:shadow-md">
              <div>
                <h2 className="font-display text-xl font-bold">
                  {t("login_as_patient")}
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  {t("patient_desc")}
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-2.5">

                {/* Patient Sign In */}
                <Link
                  to="/auth"
                  search={{
                    role: "elderly",
                    mode: "signin",
                  }}
                  className="gradient-primary inline-flex min-h-12 items-center justify-center rounded-xl px-5 text-base font-semibold text-primary-foreground shadow-[var(--shadow-lift)]"
                >
                  {t("sign_in")}
                </Link>

                {/* Patient Register */}
                <Link
                  to="/auth"
                  search={{
                    role: "elderly",
                    mode: "signup",
                  }}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-card/80 px-4 text-sm font-semibold hover:bg-card"
                >
                  {t("patient_signup")}
                </Link>
              </div>
            </div>

            {/* Caregiver Option */}
            <div className="flex flex-col justify-between rounded-2xl border border-accent/20 bg-accent/5 p-6 transition hover:border-accent/40 hover:shadow-md">
              <div>
                <h2 className="font-display text-xl font-bold">
                  {t("login_as_caregiver")}
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  {t("caregiver_desc")}
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-2.5">

                {/* Caregiver Sign In */}
                <Link
                  to="/auth"
                  search={{
                    role: "caregiver",
                    mode: "signin",
                  }}
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-accent px-5 text-base font-semibold text-accent-foreground shadow-sm hover:opacity-95"
                >
                  {t("sign_in")}
                </Link>

                {/* Caregiver Register */}
                <Link
                  to="/auth"
                  search={{
                    role: "caregiver",
                    mode: "signup",
                  }}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-card/80 px-4 text-sm font-semibold hover:bg-card"
                >
                  {t("caregiver_signup")}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <li
              key={feature.text}
              className="panel flex items-start gap-3 rounded-2xl p-5 backdrop-blur-md bg-card/90 shadow-md border border-border/60"
            >
              <feature.icon
                className="mt-0.5 size-6 shrink-0 text-primary"
                aria-hidden
              />

              <span className="text-base">
                {feature.text}
              </span>
            </li>
          ))}
        </ul>

        {/* Disclaimer */}
        <p className="mt-6 text-sm italic text-muted-foreground">
          {t("medical_disclaimer")}
        </p>

      </div>
    </div>
  );
}