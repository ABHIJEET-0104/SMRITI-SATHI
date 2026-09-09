/**
 * VoiceService — the only place that talks to the browser TTS engine.
 *
 *   UI screen -> VoiceService.speak(key) -> selected language
 *             -> localized string (src/lib/i18n.ts) -> TTS engine
 *
 * Screens pass semantic keys only. If speech synthesis is missing or
 * fails, everything keeps working: the caller still shows the same
 * localized text on screen.
 */
import { localeFor, t, type LanguageCode, type TranslationKey } from "./i18n";

let currentLang: LanguageCode = "en";
let enabled = true;
let failed = false;

function synth(): SpeechSynthesis | null {
  if (typeof window === "undefined") return null;
  return "speechSynthesis" in window ? window.speechSynthesis : null;
}

function pickVoice(locale: string): SpeechSynthesisVoice | undefined {
  const s = synth();
  if (!s) return undefined;
  const voices = s.getVoices();
  const lang = locale.split("-")[0];
  return (
    voices.find((v) => v.lang.replace("_", "-") === locale) ??
    voices.find((v) => v.lang.replace("_", "-").startsWith(`${lang}-`)) ??
    voices.find((v) => v.lang.startsWith("en"))
  );
}

export const VoiceService = {
  setLanguage(lang: LanguageCode) {
    currentLang = lang;
  },
  language(): LanguageCode {
    return currentLang;
  },
  setEnabled(value: boolean) {
    enabled = value;
    if (!value) VoiceService.stop();
  },
  isEnabled() {
    return enabled;
  },
  /** True when the device cannot speak — screens then rely on visible text. */
  isUnavailable() {
    return failed || synth() === null;
  },
  stop() {
    try {
      synth()?.cancel();
    } catch {
      /* ignore */
    }
  },
  /** Speak a semantic key in the selected language. Never throws. */
  speak(key: TranslationKey | string, options?: { lang?: LanguageCode; interrupt?: boolean }) {
    const lang = options?.lang ?? currentLang;
    VoiceService.speakText(t(lang, key), {
      lang,
      ...(options?.interrupt === undefined ? {} : { interrupt: options.interrupt }),
    });
  },
  /** Speak literal text (names, numbers) that is already localized. */
  speakText(text: string, options?: { lang?: LanguageCode; interrupt?: boolean }) {
    if (!enabled || !text) return;
    const s = synth();
    if (!s) {
      failed = true;
      return;
    }
    try {
      if (options?.interrupt !== false) s.cancel();
      const locale = localeFor(options?.lang ?? currentLang);
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = locale;
      const voice = pickVoice(locale);
      if (voice) utter.voice = voice;
      utter.rate = 0.85;
      utter.pitch = 1;
      utter.onerror = () => {
        failed = true;
      };
      s.speak(utter);
    } catch {
      failed = true;
    }
  },
};
