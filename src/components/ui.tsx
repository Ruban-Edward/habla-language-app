import type { CSSProperties, ReactNode } from 'react';
import { speak, speechSupported } from '../lib/speech';
import type { Course } from '../types';

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
  if (!speechSupported) return null;
  return (
    <button type="button" className="icon-btn speak-btn" aria-label={label} onClick={() => speak(text, lang)}>
      <SpeakerIcon />
    </button>
  );
}

export function AudioPrompt({ text, lang }: { text: string; lang: string }) {
  return (
    <div className="audio-prompt">
      <button type="button" className="audio-big" aria-label="Play audio" onClick={() => speak(text, lang)}>
        <SpeakerIcon size={40} />
      </button>
      <button
        type="button"
        className="audio-slow"
        aria-label="Play slowly"
        onClick={() => speak(text, lang, { slow: true })}
      >
        🐢
      </button>
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
