import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Cloud, CloudOff, LogOut, RefreshCw } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";

import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/hooks/use-app";
import { useSync } from "@/hooks/use-sync";
import { LANGUAGES, type LanguageCode } from "@/lib/i18n";
import { VoiceService } from "@/lib/voice";
import { cn } from "@/lib/utils";

export function SyncBadge({ className }: { className?: string }) {
  const { t } = useApp();
  const { online, pendingCount, state, sync } = useSync();

  return (
    <button
      type="button"
      onClick={() => void sync()}
      className={cn(
        "panel inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium",
        className,
      )}
      aria-label={online ? t("sync_now") : t("offline")}
    >
      {online ? (
        <Cloud className="size-4 text-positive" aria-hidden />
      ) : (
        <CloudOff className="size-4 text-warn" aria-hidden />
      )}

      <span>{online ? t("online") : t("offline")}</span>

      {pendingCount > 0 && (
        <span className="rounded-full bg-accent/25 px-2 py-0.5 text-xs font-semibold">
          {pendingCount} {t("results_waiting")}
        </span>
      )}

      {state === "syncing" && (
        <RefreshCw className="size-4 animate-spin" aria-hidden />
      )}
    </button>
  );
}

export function LanguagePicker({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage, t } = useApp();
  const [open, setOpen] = useState(false);

  const currentLanguage =
    LANGUAGES.find((lang) => lang.code === language) ?? LANGUAGES[0];

  return (
    <div
      className="relative"
      role="group"
      aria-label={t("language")}
    >
      {/* Language Button */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className={cn(
          "inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-card/90 px-4 py-2 font-semibold shadow-sm transition-colors hover:bg-card",
          compact ? "text-sm" : "text-base",
        )}
      >
        <span>{t("language")}</span>

        <span
          className={cn(
            "text-xs transition-transform",
            open && "rotate-180",
          )}
        >
          ▼
        </span>
      </button>

      {/* Language Dropdown */}
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 min-w-[160px] rounded-2xl border border-border bg-card p-2 shadow-lg">
          {LANGUAGES.map((lang) => {
            const active = lang.code === language;

            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setLanguage(lang.code as LanguageCode);

                  VoiceService.speak("welcome", {
                    lang: lang.code as LanguageCode,
                  });

                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-4 py-3 text-left font-semibold transition-colors",
                  active
                    ? "gradient-primary text-primary-foreground"
                    : "text-foreground hover:bg-secondary",
                )}
              >
                <span>{lang.native}</span>

                {active && <span>✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function AppShell({
  children,
  showSync = true,
}: {
  children: ReactNode;
  showSync?: boolean;
}) {
  const { profile, t } = useApp();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    VoiceService.stop();
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const initials = (profile?.full_name || "?")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="orb -left-24 -top-32 size-[480px]"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--primary) 35%, transparent), transparent 70%)",
        }}
      />

      <div
        className="orb -bottom-24 -right-24 size-[420px]"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--accent) 40%, transparent), transparent 70%)",
        }}
      />

      <header className="relative z-10 flex flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="gradient-primary grid size-12 place-items-center rounded-2xl font-display text-lg font-bold text-primary-foreground shadow-[var(--shadow-lift)]">
            SS
          </span>

          <span className="leading-tight">
            <span className="block font-display text-xl font-bold tracking-tight">
              {t("app_name")}
            </span>

            <span className="block text-xs text-muted-foreground">
              {t("tagline")}
            </span>
          </span>
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          {showSync && <SyncBadge />}

          <div className="panel flex items-center gap-2 rounded-full py-1 pl-1 pr-2">
            <span className="grid size-9 place-items-center rounded-full bg-secondary text-xs font-semibold">
              {initials}
            </span>

            <span className="max-w-[10rem] truncate text-sm font-semibold">
              {profile?.full_name}
            </span>

            <button
              type="button"
              onClick={() => void signOut()}
              aria-label={t("sign_out")}
              className="grid size-9 place-items-center rounded-full hover:bg-secondary"
            >
              <LogOut className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-4 pb-16 sm:px-8">
        {children}
      </main>
    </div>
  );
}
