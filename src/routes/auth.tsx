import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { LanguagePicker } from "@/components/app-shell";
import { useApp } from "@/hooks/use-app";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { mode?: "signin" | "signup" | undefined; role?: "elderly" | "caregiver" | undefined } => ({
    mode: search["mode"] === "signup" ? "signup" : undefined,
    role:
      search["role"] === "caregiver" || search["role"] === "elderly"
        ? (search["role"] as "elderly" | "caregiver")
        : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign in — Smriti Sathi" },
      {
        name: "description",
        content:
          "Sign in to Smriti Sathi as an elder to play memory games, or as a caregiver to follow game performance and reminders.",
      },
      { property: "og:title", content: "Sign in to Smriti Sathi" },
      {
        property: "og:description",
        content:
          "Elders play memory games; caregivers follow game performance and reminders.",
      },
    ],
  }),
  component: AuthPage,
});

type Role = "elderly" | "caregiver";

function AuthPage() {
  const { mode, role: initialRole } = Route.useSearch();
  const navigate = useNavigate();
  const { session, profile, language, t } = useApp();

  const [isSignUp, setIsSignUp] = useState(mode === "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [role, setRole] = useState<Role>(initialRole ?? "elderly");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (session && profile) {
      navigate({
        to: profile.role === "caregiver" ? "/caregiver" : "/home",
        replace: true,
      });
    }
  }, [session, profile, navigate]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setNotice(null);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              full_name: fullName || email.split("@")[0],
              role,
              age: age ? Number(age) : null,
              language,
            },
          },
        });

        if (error) throw error;

        if (!data.session) {
          setNotice(t("check_email"));
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);

    try {
      // First try standard Supabase OAuth:
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth?role=${role}`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
          ...({ data: { role, language } } as Record<string, unknown>),
        },
      });

      if (error) {
        // Try Lovable Cloud OAuth fallback if configured
        const result = await lovable.auth.signInWithOAuth("google", {
          redirect_uri: window.location.origin,
        });

        if (result.error) {
          throw new Error(
            error.message ||
              "Google sign-in is not enabled on your Supabase project yet. Please enable Google in Supabase Auth Providers or sign in with Email & Password.",
          );
        }
      }
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Google sign-in is not enabled on your Supabase project yet.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden px-4 py-10 sm:px-8">
      {/* Scenic warm background scene */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-bottom bg-no-repeat opacity-85 transition-opacity duration-300 dark:opacity-35"
        style={{
          backgroundImage: "url('/images/auth-bg.png')",
        }}
        aria-hidden="true"
      />
      {/* Soft atmospheric overlay to ensure pristine contrast and focus */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-b from-background/40 via-background/25 to-background/50 backdrop-blur-[1px]"
        aria-hidden="true"
      />

      <div
        className="orb -left-24 -top-32 size-[420px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--primary) 35%, transparent), transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-lg">
        <Link to="/" className="flex items-center gap-3">
          <span className="gradient-primary grid size-11 place-items-center rounded-2xl font-display font-bold text-primary-foreground shadow-md">
            SS
          </span>

          <span className="font-display text-xl font-bold drop-shadow-sm">
            {t("app_name")}
          </span>
        </Link>

        <div className="panel mt-6 rounded-3xl p-6 sm:p-8 backdrop-blur-xl bg-card/95 shadow-2xl border border-border/80">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">
            {role === "elderly" ? (
              <span className="rounded-full bg-primary/15 px-3 py-1 text-primary">
                {t("role_elderly")}
              </span>
            ) : (
              <span className="rounded-full bg-accent/15 px-3 py-1 text-accent-foreground">
                {t("role_caregiver")}
              </span>
            )}
          </div>

          <h1 className="font-display text-3xl font-bold">
            {isSignUp
              ? role === "elderly"
                ? t("sign_up_patient")
                : t("sign_up_caregiver")
              : role === "elderly"
                ? t("sign_in_patient")
                : t("sign_in_caregiver")}
          </h1>

          <div className="mt-5">
            <LanguagePicker compact />
          </div>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            {isSignUp && (
              <>
                <label className="grid gap-1.5 text-sm font-semibold">
                  {t("full_name")}

                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    autoComplete="name"
                    className="min-h-13 rounded-xl border border-input bg-card px-4 text-base"
                  />
                </label>

                {role === "elderly" && (
                  <label className="grid gap-1.5 text-sm font-semibold">
                    {t("age")}

                    <input
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      inputMode="numeric"
                      className="min-h-13 rounded-xl border border-input bg-card px-4 text-base"
                    />
                  </label>
                )}
              </>
            )}

            <label className="grid gap-1.5 text-sm font-semibold">
              {t("email")}

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="min-h-13 rounded-xl border border-input bg-card px-4 text-base"
              />
            </label>

            <label className="grid gap-1.5 text-sm font-semibold">
              {t("password")}

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={isSignUp ? "new-password" : "current-password"}
                className="min-h-13 rounded-xl border border-input bg-card px-4 text-base"
              />
            </label>

            <button
              type="submit"
              disabled={busy}
              className="gradient-primary min-h-14 rounded-xl text-lg font-semibold text-primary-foreground shadow-[var(--shadow-lift)] disabled:opacity-60"
            >
              {isSignUp ? t("sign_up") : t("sign_in")}
            </button>
          </form>

          {notice && (
            <p className="mt-4 rounded-xl border border-primary/30 bg-primary/10 p-3 text-sm">
              {notice}
            </p>
          )}

          <button
            type="button"
            onClick={() => void handleGoogle()}
            disabled={busy}
            className="mt-4 min-h-14 w-full rounded-xl border border-border bg-card/70 text-base font-semibold disabled:opacity-60"
          >
            {t("continue_google")}
          </button>

          <button
            type="button"
            onClick={() => setIsSignUp((v) => !v)}
            className="mt-5 w-full text-sm font-semibold text-primary underline"
          >
            {isSignUp ? t("have_account") : t("need_account")}
          </button>
        </div>
      </div>
    </div>
  );
}