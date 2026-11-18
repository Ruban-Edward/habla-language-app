import { MAX_HEARTS, msUntilNextHeart, type Progress } from '../lib/progress';
import type { Course } from '../types';
import { CourseBadge, formatDuration } from './ui';

type Props = {
  course: Course;
  progress: Progress;
  streak: number;
  practicedToday: boolean;
  now: number;
  onSwitchCourse: () => void;
  onToggleSound: () => void;
  onAccount: () => void;
  accountLabel: string;
  syncError: string | null;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
};

export function TopBar({
  course,
  progress,
  streak,
  practicedToday,
  now,
  onSwitchCourse,
  onToggleSound,
  onAccount,
  accountLabel,
  syncError,
  theme,
  onToggleTheme,
}: Props) {
  const next = msUntilNextHeart(progress, now);
  const heartTitle =
    progress.hearts >= MAX_HEARTS ? 'Hearts are full' : `Next heart in ${formatDuration(next ?? 0)}`;
  return (
    <header className="topbar">
      <div className="brand" aria-label="Habla">
        <span className="brand-mark" aria-hidden="true">h.</span>
        <span>habla<span className="brand-period">.</span></span>
      </div>
      <div className="stats">
        <button type="button" className="course-switch" onClick={onSwitchCourse} title="Change course">
          <CourseBadge course={course} size={30} />
          <span>{course.name}</span>
          <span className="caret" aria-hidden="true">▾</span>
        </button>
        <span className={`stat ${practicedToday ? 'stat-flame' : 'stat-dim'}`} title={`${streak} day streak`}>
          🔥<b>{streak}</b>
        </span>
        <span className="stat stat-xp" title="Total XP">
          ⭐<b>{progress.xp}</b>
        </span>
        <span className="stat stat-heart" title={heartTitle}>
          ❤️<b>{progress.hearts}</b>
          {next !== null && <small>{formatDuration(next)}</small>}
        </span>
        <button
          type="button"
          className="icon-btn"
          onClick={onToggleSound}
          aria-label={progress.sound ? 'Mute sound' : 'Turn sound on'}
          title={progress.sound ? 'Sound on' : 'Sound off'}
        >
          {progress.sound ? '🔊' : '🔇'}
        </button>
        <button
          type="button"
          className="icon-btn theme-toggle"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
          {theme === 'light' ? '☾' : '☀'}
        </button>
        <button
          type="button"
          className={`account-btn ${syncError ? 'has-sync-error' : ''}`}
          onClick={onAccount}
          aria-label={syncError ? `Account, sync issue: ${syncError}` : accountLabel}
          title={syncError ?? accountLabel}
        >
          {syncError ? '⚠' : accountLabel}
        </button>
      </div>
    </header>
  );
}
