export const speechSupported =
  typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

const voices = (): SpeechSynthesisVoice[] => (speechSupported ? window.speechSynthesis.getVoices() : []);

function pickVoice(lang: string): SpeechSynthesisVoice | null {
  const prefix = lang.slice(0, 2).toLowerCase();
  const all = voices();
  return all.find((v) => v.lang === lang) ?? all.find((v) => v.lang.toLowerCase().startsWith(prefix)) ?? null;
}

// Voices load asynchronously in some browsers; ask early so they're ready by the first lesson.
if (speechSupported) voices();

/** Whether the browser has a voice for this language (listening exercises need one). */
export function hasVoice(lang: string): boolean {
  return pickVoice(lang) !== null;
}

/** Read text aloud in the given language with the browser's speech engine. */
export function speak(text: string, lang: string, opts: { slow?: boolean } = {}): void {
  if (!speechSupported) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  const v = pickVoice(lang);
  if (v) u.voice = v;
  u.rate = opts.slow ? 0.6 : 0.95;
  synth.speak(u);
}
