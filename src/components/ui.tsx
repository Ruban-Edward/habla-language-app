import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { dismissSpeechNotice, playSpeech, useSpeechNotice } from '../lib/speechStatus';
import type { Course } from '../types';

type PlaybackState = 'idle' | 'loading' | 'playing';

/** Play one piece of text and track whether it is loading or playing, for the button's own look. */
function useSpeechPlayback(text: string, lang: string) {
  const [state, setState] = useState<PlaybackState>('idle');
  const play = async (slow = false) => {
    setState('loading');
    await playSpeech(text, lang, {
      slow,
      onProgress: (progress) => setState(progress.phase === 'playing' ? 'playing' : 'loading'),
    });
    setState('idle');
  };
  return { state, play };
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

function playbackLabel(state: PlaybackState, label: string): string {
  if (state === 'loading') return 'Loading pronunciation';
  if (state === 'playing') return 'Playing pronunciation';
  return label;
}

/**
 * A speaker button. Status and errors appear in the app-wide speech toast, never beside the button, so playing
 * audio can't change the layout of the text around it.
 */
export function SpeakButton({ text, lang, label = 'Play audio' }: { text: string; lang: string; label?: string }) {
  const { state, play } = useSpeechPlayback(text, lang);
  return (
    <button
      type="button"
      className={`icon-btn speak-btn${state === 'idle' ? '' : ` is-${state}`}`}
      aria-label={playbackLabel(state, label)}
      aria-busy={state === 'loading' || undefined}
      disabled={state !== 'idle'}
      onClick={() => void play()}
    >
      <SpeakerIcon />
    </button>
  );
}

export function AudioPrompt({ text, lang }: { text: string; lang: string }) {
  const { state, play } = useSpeechPlayback(text, lang);
  return (
    <div className="audio-prompt">
      <button
        type="button"
        className={`audio-big${state === 'idle' ? '' : ` is-${state}`}`}
        aria-label={playbackLabel(state, 'Play audio')}
        aria-busy={state === 'loading' || undefined}
        disabled={state !== 'idle'}
        onClick={() => void play()}
      >
        <SpeakerIcon size={40} />
      </button>
      <button
        type="button"
        className="audio-slow"
        aria-label="Play slowly"
        disabled={state !== 'idle'}
        onClick={() => void play(true)}
      >
        🐢
      </button>
    </div>
  );
}

/** The app-wide speech notice: voice download progress, playback errors and warnings. */
export function SpeechToast() {
  const notice = useSpeechNotice();
  return (
    <div className="speech-toast-region" aria-live="polite">
      {notice && (
        <div className={`speech-toast is-${notice.kind}`} role={notice.kind === 'error' ? 'alert' : 'status'}>
          <div className="speech-toast-copy">
            <span>{notice.text}</span>
            {notice.kind === 'progress' && (
              <span className={`speech-toast-meter${notice.percent === null ? ' is-indeterminate' : ''}`} aria-hidden="true">
                <span style={notice.percent === null ? undefined : { width: `${notice.percent}%` }} />
              </span>
            )}
          </div>
          {notice.kind !== 'progress' && (
            <button type="button" className="speech-toast-close" aria-label="Dismiss" onClick={dismissSpeechNotice}>✕</button>
          )}
        </div>
      )}
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

export function Modal({ children, onClose, className = '' }: { children: ReactNode; onClose?: () => void; className?: string }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={`modal card ${className}`} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
