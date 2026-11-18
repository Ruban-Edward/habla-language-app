import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { frenchModelSizeMb, speak, type SpeechProgress, type SpeechResult } from '../lib/speech';
import type { Course } from '../types';

function speechFeedback(result: Exclude<SpeechResult, { ok: true }>, lang: string): string {
  if (result.reason === 'unsupported') return 'Speech playback is not supported in this browser.';
  if (result.reason === 'voice-missing') {
    const language = lang.toLowerCase().startsWith('fr') ? 'French' : lang.toLowerCase().startsWith('es') ? 'Spanish' : 'target-language';
    return `No ${language} voice is available. Install a ${language} text-to-speech voice in your device settings.`;
  }
  if (result.reason === 'model-load-failed') {
    return `Couldn't load the built-in French voice. Check your connection and try again.${result.message ? ` (${result.message})` : ''}`;
  }
  if (result.reason === 'playback-failed' && result.message) {
    return `Couldn't play the audio. ${result.message}`;
  }
  return "Couldn't play the audio. Check your device's media volume and try again.";
}

function speechProgressMessage(progress: SpeechProgress | null): string {
  if (progress?.phase === 'loading-model') {
    return progress.percent === null
      ? `Downloading the French voice model (about ${frenchModelSizeMb} MB on first use).`
      : `Downloading the French voice model: ${progress.percent}% (about ${frenchModelSizeMb} MB).`;
  }
  if (progress?.phase === 'preparing-engine') return 'Preparing the French speech engine…';
  if (progress?.phase === 'generating') return 'Generating French audio…';
  return 'Playing pronunciation…';
}

function useSpeechPlayback(text: string, lang: string) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState<SpeechProgress | null>(null);
  const [warning, setWarning] = useState(false);
  const play = async (slow = false) => {
    setPending(true);
    setMessage('');
    setProgress(null);
    setWarning(false);
    const result = await speak(text, lang, { slow, onProgress: setProgress });
    setPending(false);
    setProgress(null);
    if (!result.ok) setMessage(speechFeedback(result, lang));
    else if (result.warning) {
      setWarning(true);
      setMessage(result.warning);
    }
  };
  return { pending, message, progress, warning, play };
}

export function formatDuration(ms: number): string {
  const total = Math.ceil(ms / 1000);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

export function GoalRing({ value, goal, size = 64 }: { value: number; goal: number; size?: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const pct = Math.min(1, value / goal);
  return (
    <div className="goal-ring" style={{ width: size, height: size }} title={`Daily goal: ${value}/${goal} XP`}>
      <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
        <circle cx="32" cy="32" r={r} fill="none" stroke="var(--surface-2)" strokeWidth="7" />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke={pct >= 1 ? 'var(--ok)' : 'var(--gold)'}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={`${c * pct} ${c}`}
          transform="rotate(-90 32 32)"
          style={{ transition: 'stroke-dasharray .6s ease' }}
        />
      </svg>
      <span className="goal-ring-label">{pct >= 1 ? '✓' : value}</span>
    </div>
  );
}

export function CourseBadge({ course, size = 36 }: { course: Course; size?: number }) {
  return (
    <span
      className="course-badge"
      lang={course.lang}
      style={{ '--badge': course.color, width: size, height: size, fontSize: size * 0.4 } as CSSProperties}
      aria-hidden="true"
    >
      {course.badge}
    </span>
  );
}

export function SpeakButton({ text, lang, label = 'Play audio' }: { text: string; lang: string; label?: string }) {
  const { pending, message, progress, warning, play } = useSpeechPlayback(text, lang);
  return (
    <>
      <button
        type="button"
        className="icon-btn speak-btn"
        aria-label={pending ? 'Preparing pronunciation' : label}
        aria-busy={pending || undefined}
        disabled={pending}
        onClick={() => void play()}
      >
        <SpeakerIcon />
      </button>
      {pending && lang.toLowerCase().startsWith('fr') && <span className="speech-status speech-progress" role="status">{speechProgressMessage(progress)}</span>}
      {message && <span className={`speech-status${warning ? ' speech-warning' : ''}`} role="status">{message}</span>}
    </>
  );
}

export function AudioPrompt({ text, lang }: { text: string; lang: string }) {
  const { pending, message, progress, warning, play } = useSpeechPlayback(text, lang);
  return (
    <div className="audio-prompt">
      <button
        type="button"
        className="audio-big"
        aria-label={pending ? 'Preparing pronunciation' : 'Play audio'}
        aria-busy={pending || undefined}
        disabled={pending}
        onClick={() => void play()}
      >
        <SpeakerIcon size={40} />
      </button>
      <button
        type="button"
        className="audio-slow"
        aria-label="Play slowly"
        disabled={pending}
        onClick={() => void play(true)}
      >
        🐢
      </button>
      {pending && lang.toLowerCase().startsWith('fr') && <span className="speech-status speech-progress" role="status">{speechProgressMessage(progress)}</span>}
      {message && <span className={`speech-status${warning ? ' speech-warning' : ''}`} role="status">{message}</span>}
    </div>
  );
}

export function SpeakerIcon({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" fill="currentColor">
      <path d="M4 9v6h4l5 4V5L8 9H4z" />
      <path
        d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Modal({ children, onClose }: { children: ReactNode; onClose?: () => void }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal card" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
