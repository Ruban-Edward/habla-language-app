import { useEffect, useRef, useState } from 'react';
import { MAX_HEARTS, msUntilNextHeart, type Progress } from '../lib/progress';
import type { Course, TextSize } from '../types';
import { CourseBadge, formatDuration } from './ui';

type Props = {
  course: Course;
  progress: Progress;
  streak: number;
  practicedToday: boolean;
  now: number;
  onSwitchCourse: () => void;
  onTranslate: () => void;
  onToggleSound: () => void;
  onAccount: () => void;
  accountLabel: string;
  syncError: string | null;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  textSize: TextSize;
  onTextSize: (size: TextSize) => void;
};

const TEXT_SIZE_OPTIONS: { value: TextSize; label: string }[] = [
  { value: 'normal', label: 'Default' },
  { value: 'large', label: 'Large' },
  { value: 'larger', label: 'Larger' },
];

/** 1240 → "1.2k" for the compact phone header. */
function compactNumber(value: number): string {
  return value < 1000 ? String(value) : new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value).toLowerCase();
}

export function TopBar({
  course,
  progress,
  streak,
  practicedToday,
  now,
  onSwitchCourse,
  onTranslate,
  onToggleSound,
  onAccount,
  accountLabel,
  syncError,
  theme,
  onToggleTheme,
  textSize,
  onTextSize,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const next = msUntilNextHeart(progress, now);
  const heartTitle =
    progress.hearts >= MAX_HEARTS ? 'Hearts are full' : `Next heart in ${formatDuration(next ?? 0)}`;
  const nextTheme = theme === 'light' ? 'dark' : 'light';
  const sizeIndex = TEXT_SIZE_OPTIONS.findIndex((option) => option.value === textSize);
  const nextSize = TEXT_SIZE_OPTIONS[(sizeIndex + 1) % TEXT_SIZE_OPTIONS.length];

  useEffect(() => {
    if (!menuOpen) return;
    const onPointer = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  /** Run a menu action and close the menu. */
  const choose = (action: () => void) => () => {
    setMenuOpen(false);
    action();
  };

  return (
    <header className="topbar">
      <div className="brand" aria-label="Habla">
        <img className="brand-mark" src="/favicon.svg" alt="" aria-hidden="true" />
        <span className="brand-name">habla<span className="brand-period">.</span></span>
      </div>
      <div className="stats">
        <button type="button" className="course-switch" onClick={onSwitchCourse} title="Change course" aria-label={`Course: ${course.name}. Change course`}>
          <CourseBadge course={course} size={30} />
          <span className="course-switch-name">{course.name}</span>
          <span className="caret" aria-hidden="true">▾</span>
        </button>
        <button type="button" className="translate-nav topbar-wide" onClick={onTranslate}>Translate</button>
        <div className="stat-group">
          <span className={`stat ${practicedToday ? 'stat-flame' : 'stat-dim'}`} title={`${streak} day streak`} aria-label={`${streak} day streak`}>
            🔥<b>{streak}</b>
          </span>
          <span className="stat stat-xp" title={`${progress.xp} XP in total`} aria-label={`${progress.xp} XP`}>
            ⭐<b><span className="num-full">{progress.xp}</span><span className="num-short">{compactNumber(progress.xp)}</span></b>
          </span>
          <span className="stat stat-heart" title={heartTitle} aria-label={`${progress.hearts} hearts. ${heartTitle}`}>
            ❤️<b>{progress.hearts}</b>
            {next !== null && <small>{formatDuration(next)}</small>}
          </span>
        </div>
        <button
          type="button"
          className="icon-btn topbar-wide"
          onClick={onToggleSound}
          aria-label={progress.sound ? 'Mute sound' : 'Turn sound on'}
          title={progress.sound ? 'Sound on' : 'Sound off'}
        >
          {progress.sound ? '🔊' : '🔇'}
        </button>
        <button
          type="button"
          className="icon-btn theme-toggle topbar-wide"
          onClick={onToggleTheme}
          aria-label={`Switch to ${nextTheme} theme`}
          title={`Switch to ${nextTheme} theme`}
        >
          {theme === 'light' ? '☾' : '☀'}
        </button>
        <button
          type="button"
          className="icon-btn text-size-toggle topbar-wide"
          onClick={() => onTextSize(nextSize.value)}
          aria-label={`Text size: ${TEXT_SIZE_OPTIONS[sizeIndex].label}. Change to ${nextSize.label}`}
          title={`Text size: ${TEXT_SIZE_OPTIONS[sizeIndex].label}`}
        >
          <span aria-hidden="true">A<small>A</small></span>
        </button>
        <button
          type="button"
          className={`account-btn topbar-wide ${syncError ? 'has-sync-error' : ''}`}
          onClick={onAccount}
          aria-label={syncError ? `Account, sync issue: ${syncError}` : accountLabel}
          title={syncError ?? accountLabel}
        >
          {syncError ? '⚠' : accountLabel}
        </button>

        <div className="topbar-more" ref={menuRef}>
          <button
            type="button"
            className={`icon-btn topbar-more-btn ${menuOpen ? 'is-open' : ''}`}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label={syncError ? 'Menu, sync issue' : 'Menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="menu-lines" aria-hidden="true"><span /><span /><span /></span>
            {syncError && <span className="menu-alert" aria-hidden="true" />}
          </button>
          {menuOpen && (
            <div className="topbar-menu" role="menu" aria-label="Menu">
              {next !== null && <p className="topbar-menu-note">❤️ Next heart in {formatDuration(next)}</p>}
              <button type="button" role="menuitem" onClick={choose(onTranslate)}>
                <span aria-hidden="true">文</span> Translate
              </button>
              <button type="button" role="menuitem" onClick={choose(onToggleSound)}>
                <span aria-hidden="true">{progress.sound ? '🔇' : '🔊'}</span> {progress.sound ? 'Mute sound' : 'Turn sound on'}
              </button>
              <button type="button" role="menuitem" onClick={choose(onToggleTheme)}>
                <span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span> {theme === 'light' ? 'Dark theme' : 'Light theme'}
              </button>
              <div className="topbar-menu-sizes" role="group" aria-label="Text size">
                <span>Text size</span>
                <div>
                  {TEXT_SIZE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      role="menuitemradio"
                      aria-checked={textSize === option.value}
                      aria-label={option.label}
                      title={option.label}
                      className={`size-${option.value}`}
                      onClick={() => onTextSize(option.value)}
                    >
                      A
                    </button>
                  ))}
                </div>
              </div>
              <button type="button" role="menuitem" className={syncError ? 'has-sync-error' : ''} onClick={choose(onAccount)}>
                <span aria-hidden="true">{syncError ? '⚠' : '◉'}</span> {syncError ? 'Account · sync issue' : accountLabel}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
