import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";
import { getMe, updateMyProfile } from "@/lib/api.functions";
import { t as translate, type LanguageCode, type TranslationKey } from "@/lib/i18n";
import { VoiceService } from "@/lib/voice";

export interface Profile {
  id: string;
  full_name: string;
  role: "elderly" | "caregiver";
  age: number | null;
  language: LanguageCode;
  photo_url: string | null;
  care_code: string | null;
  caregiver_id: string | null;
  caregiver?: { id: string; full_name: string } | null;
}

interface AppContextValue {
  session: Session | null;
  loadingSession: boolean;
  profile: Profile | null;
  people: Profile[];
  loadingProfile: boolean;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: TranslationKey | string) => string;
  refresh: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);
const LANG_KEY = "smriti_language";

export function AppProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [localLang, setLocalLang] = useState<LanguageCode | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoadingSession(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoadingSession(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(LANG_KEY) as LanguageCode | null;
    if (stored) setLocalLang(stored);
  }, []);

  const fetchMe = useServerFn(getMe);
  const { data, isLoading } = useQuery({
    queryKey: ["me", session?.user.id],
    enabled: !!session,
    queryFn: () => fetchMe(),
  });

  const profile = (data?.profile ?? null) as Profile | null;
  const people = (data?.people ?? []) as Profile[];
  const language = localLang ?? profile?.language ?? "en";

  const saveProfile = useServerFn(updateMyProfile);
  const languageMutation = useMutation({
    mutationFn: (lang: LanguageCode) => saveProfile({ data: { language: lang } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["me"] }),
  });

  const setLanguage = useCallback(
    (lang: LanguageCode) => {
      setLocalLang(lang);
      VoiceService.setLanguage(lang);
      if (typeof window !== "undefined") window.localStorage.setItem(LANG_KEY, lang);
      if (session) languageMutation.mutate(lang);
    },
    [session, languageMutation],
  );

  useEffect(() => {
    VoiceService.setLanguage(language);
  }, [language]);

  const value = useMemo<AppContextValue>(
    () => ({
      session,
      loadingSession,
      profile,
      people,
      loadingProfile: isLoading,
      language,
      setLanguage,
      t: (key) => translate(language, key),
      refresh: () => queryClient.invalidateQueries({ queryKey: ["me"] }),
    }),
    [session, loadingSession, profile, people, isLoading, language, setLanguage, queryClient],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
