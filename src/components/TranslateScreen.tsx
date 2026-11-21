import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import type { Course } from '../types';
import { romanize } from '../lib/answer';
import { translateText, type TranslationLanguage } from '../lib/translate';
import type { PhraseDraft, SavedPhrase } from '../lib/progress';
import { playSpeech } from '../lib/speechStatus';

type Props = {
  course: Course;
  online: boolean;
  sound: boolean;
  savedPhrases: SavedPhrase[];
  onBack: () => void;
  onSavePhrase: (phrase: PhraseDraft) => void;
};

type Direction = 'to-course' | 'to-english';

function languageName(code: TranslationLanguage, course: Course): string {
  return code === 'en' ? 'English' : course.name;
}

function courseLanguage(course: Course): TranslationLanguage {
  switch (course.id) {
    case 'es': return 'es';
    case 'fr': return 'fr';
    case 'hi': return 'hi';
    default: throw new Error(`Unsupported course language: ${course.id}`);
  }
}

export function TranslateScreen({ course, online, sound, savedPhrases, onBack, onSavePhrase }: Props) {
  const [direction, setDirection] = useState<Direction>('to-course');
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [speaking, setSpeaking] = useState<'normal' | 'slow' | null>(null);
  const requestId = useRef(0);
  const controller = useRef<AbortController | null>(null);
  const courseCode = courseLanguage(course);
  const source: TranslationLanguage = direction === 'to-course' ? 'en' : courseCode;
  const target: TranslationLanguage = direction === 'to-course' ? courseCode : 'en';
  const sourceName = languageName(source, course);
  const targetName = languageName(target, course);
  const resultRoman = target === course.id && course.glossary ? romanize(result, course.glossary) : undefined;
  const phraseTarget = target === course.id ? result : input.trim();
  const phraseSaved = savedPhrases.some((phrase) => phrase.id === `${course.id}:${phraseTarget}`);

  useEffect(() => () => controller.current?.abort(), []);

  const translate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!online) {
      setError('An internet connection is required to translate. Reconnect and try again.');
      return;
    }

    controller.current?.abort();
    const activeController = new AbortController();
    controller.current = activeController;
    const currentRequest = ++requestId.current;
    setPending(true);
    setError('');
    try {
      const translated = await translateText(input, source, target, activeController.signal);
      if (currentRequest === requestId.current) setResult(translated);
    } catch (reason) {
      if (activeController.signal.aborted) return;
      if (currentRequest === requestId.current) {
        setResult('');
        setError(
          !online || !navigator.onLine
            ? 'An internet connection is required to translate. Reconnect and try again.'
            : reason instanceof Error
              ? reason.message
              : 'Translation failed. Check your connection and try again.',
        );
      }
    } finally {
      if (currentRequest === requestId.current) setPending(false);
    }
  };

  const swapDirection = () => {
    controller.current?.abort();
    requestId.current++;
    setPending(false);
    setDirection((current) => current === 'to-course' ? 'to-english' : 'to-course');
    setInput(result);
    setResult('');
    setError('');
  };

  const changeInput = (value: string) => {
    controller.current?.abort();
    requestId.current++;
    setPending(false);
    setInput(value);
    setResult('');
    setError('');
  };

  /** Status and errors appear in the app-wide speech toast. */
  const playResult = async (rate: 0.5 | 1, mode: 'normal' | 'slow') => {
    setSpeaking(mode);
    await playSpeech(result, target === 'en' ? 'en-US' : course.lang, { rate });
    setSpeaking(null);
  };

  const saveResult = () => {
    if (phraseSaved) return;
    onSavePhrase({
      courseId: course.id,
      target: phraseTarget,
      meaning: target === course.id ? input.trim() : result,
      ...(target === course.id && resultRoman ? { roman: resultRoman } : {}),
    });
  };

  return (
    <main className="translate-screen">
      <header className="translate-header">
        <button type="button" className="btn ghost translate-back" onClick={onBack}>← Back to learning</button>
        <span className="eyebrow">A QUICK LANGUAGE TOOL</span>
        <h1>Translate a word or sentence</h1>
        <p>Translate between English and {course.name}. Results are a helpful starting point; context can change the best translation.</p>
      </header>

      <section className="translate-card card">
        <div className="translate-languages">
          <label>
            <span>From</span>
            <strong>{sourceName}</strong>
          </label>
          <button type="button" className="icon-btn translate-swap" onClick={swapDirection} disabled={pending} aria-label="Swap translation languages" title="Swap languages">
            ⇄
          </button>
          <label>
            <span>To</span>
            <strong>{targetName}</strong>
          </label>
        </div>

        <form onSubmit={(event) => void translate(event)}>
          <label className="translate-input-label" htmlFor="translate-input">Text to translate</label>
          <textarea
            id="translate-input"
            value={input}
            onChange={(event) => changeInput(event.target.value)}
            placeholder={`Type in ${sourceName}…`}
            maxLength={500}
            rows={5}
            aria-describedby="translate-limit"
          />
          <div className="translate-form-foot">
            <small id="translate-limit">MyMemory allows 500 bytes per request; non-English characters use more bytes. Avoid private text.</small>
            <span>{new TextEncoder().encode(input).byteLength}/500 bytes</span>
          </div>
          {!online && (
            <p className="translate-offline" role="status">
              <strong>Internet required.</strong> Translation is unavailable while you’re offline. Your lessons and saved phrasebook remain available.
            </p>
          )}
          {error && <p className="translate-error" role="alert">{error}</p>}
          <button type="submit" className="btn primary translate-submit" disabled={!input.trim() || pending || !online}>
            {pending ? 'Translating…' : 'Translate'}
          </button>
        </form>

        {result && (
          <section className="translation-result" aria-live="polite" aria-labelledby="translation-result-title">
            <div className="translation-result-heading">
              <span className="eyebrow">{targetName.toUpperCase()}</span>
              <div className="translation-audio-controls">
                <button type="button" className="btn ghost" onClick={() => void playResult(1, 'normal')} disabled={speaking !== null || !sound}>
                  {speaking === 'normal' ? 'Playing…' : 'Hear · 1×'}
                </button>
                <button type="button" className="btn ghost" onClick={() => void playResult(0.5, 'slow')} disabled={speaking !== null || !sound}>
                  {speaking === 'slow' ? 'Playing…' : 'Hear · 0.5×'}
                </button>
              </div>
            </div>
            <p id="translation-result-title" className="translation-text" lang={target === 'en' ? 'en' : course.lang}>{result}</p>
            {target === course.id && resultRoman && (
              <p className="translation-roman" lang="en-Latn">{resultRoman}</p>
            )}
            <div className="translation-result-foot">
              <small>Translation by MyMemory · Your text is sent to their service.</small>
              <button type="button" className="btn ghost" onClick={saveResult} disabled={phraseSaved}>
                {phraseSaved ? 'Saved to phrasebook' : 'Save to phrasebook'}
              </button>
            </div>
          </section>
        )}
      </section>

      <p className="translate-disclaimer">
        Translation requires an internet connection and sends the text you enter to MyMemory. Avoid personal, confidential, or sensitive text.
        The free service has daily usage limits.
      </p>
    </main>
  );
}
