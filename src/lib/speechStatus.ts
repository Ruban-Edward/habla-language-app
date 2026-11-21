import { useSyncExternalStore } from 'react';
import {
  builtInVoiceLanguage,
  builtInVoiceName,
  builtInVoiceSizeMb,
  speak,
  type SpeechProgress,
  type SpeechResult,
} from './speech';

/**
 * One app-wide notice for speech: download progress, errors and warnings. It is shown as a floating toast, so a
 * message never takes up room next to the text being read (where it used to squeeze words into a narrow column).
 */
export type SpeechNotice =
  | { kind: 'progress'; text: string; percent: number | null }
  | { kind: 'error' | 'warning'; text: string };

let notice: SpeechNotice | null = null;
let hideTimer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();

function setNotice(next: SpeechNotice | null, hideAfterMs?: number): void {
  clearTimeout(hideTimer);
  notice = next;
  if (next && hideAfterMs) hideTimer = setTimeout(() => setNotice(null), hideAfterMs);
  listeners.forEach((listener) => listener());
}

export function dismissSpeechNotice(): void {
  setNotice(null);
}

export function useSpeechNotice(): SpeechNotice | null {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => notice,
    () => null,
  );
}

function languageName(lang: string): string {
  const builtIn = builtInVoiceLanguage(lang);
  if (builtIn) return builtInVoiceName(builtIn);
  return lang.toLowerCase().startsWith('en') ? 'English' : 'target-language';
}

/** What went wrong, in words a learner can act on. */
export function speechFeedback(result: Exclude<SpeechResult, { ok: true }>, lang: string): string {
  const language = languageName(lang);
  if (result.reason === 'unsupported') return 'Speech playback is not supported in this browser.';
  if (result.reason === 'voice-missing') {
    return `No ${language} voice is available. Install a ${language} text-to-speech voice in your device settings.`;
  }
  if (result.reason === 'model-load-failed') {
    return `Couldn't load the built-in ${language} voice. Check your connection and try again.${result.message ? ` (${result.message})` : ''}`;
  }
  if (result.reason === 'playback-failed' && result.message) return `Couldn't play the audio. ${result.message}`;
  return "Couldn't play the audio. Check your device's media volume and try again.";
}

function progressText(progress: SpeechProgress, lang: string): string {
  const language = languageName(lang);
  const builtIn = builtInVoiceLanguage(lang);
  const size = builtIn ? builtInVoiceSizeMb(builtIn) : null;
  if (progress.phase === 'loading-model') {
    return progress.percent === null
      ? `Downloading the ${language} voice${size ? ` (about ${size} MB, first time only)` : ''}…`
      : `Downloading the ${language} voice: ${progress.percent}%${size ? ` of about ${size} MB` : ''}`;
  }
  if (progress.phase === 'preparing-engine') return `Preparing the ${language} voice…`;
  return `Getting the ${language} audio ready…`;
}

let latestPlay = 0;
/** Warnings (such as full storage) are worth saying once a session, not after every word. */
const shownWarnings = new Set<string>();

/**
 * Speak and report through the app-wide notice. Progress appears only when there is a wait worth explaining (a
 * download or a slow first start), so a normal tap doesn't flash a message.
 */
export async function playSpeech(
  text: string,
  lang: string,
  opts: { slow?: boolean; rate?: 0.5 | 1; onProgress?: (progress: SpeechProgress) => void } = {},
): Promise<SpeechResult> {
  const id = ++latestPlay;
  let progressTimer: ReturnType<typeof setTimeout> | undefined;
  let ownsNotice = false;
  const showProgress = (progress: SpeechProgress) => {
    ownsNotice = true;
    setNotice({ kind: 'progress', text: progressText(progress, lang), percent: progress.phase === 'loading-model' ? progress.percent : null });
  };
  const onProgress = (progress: SpeechProgress) => {
    opts.onProgress?.(progress);
    if (id !== latestPlay) return;
    clearTimeout(progressTimer);
    if (progress.phase === 'playing') {
      if (ownsNotice && notice?.kind === 'progress') setNotice(null);
      ownsNotice = false;
      return;
    }
    // Reading the stored voice reports 0 then 100% at once; only a real download shows right away.
    if (progress.phase === 'loading-model' && progress.percent !== null && progress.percent > 0 && progress.percent < 100) {
      showProgress(progress);
    } else if (ownsNotice) {
      showProgress(progress);
    } else {
      progressTimer = setTimeout(() => id === latestPlay && showProgress(progress), progress.phase === 'generating' ? 1200 : 500);
    }
  };

  const result = await speak(text, lang, { slow: opts.slow, rate: opts.rate, onProgress });
  clearTimeout(progressTimer);
  if (id === latestPlay) {
    if (!result.ok) setNotice({ kind: 'error', text: speechFeedback(result, lang) }, 9000);
    else if (result.warning && !shownWarnings.has(result.warning)) {
      shownWarnings.add(result.warning);
      setNotice({ kind: 'warning', text: result.warning }, 7000);
    }
    else if (ownsNotice && notice?.kind === 'progress') setNotice(null);
  }
  return result;
}
