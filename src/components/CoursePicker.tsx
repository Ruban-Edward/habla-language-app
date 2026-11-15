import { COURSES, lessonsOf } from '../data/courses';
import type { Progress } from '../lib/progress';
import { Mascot } from './Mascot';
import { CourseBadge } from './ui';

type Props = { progress: Progress; onPick: (id: string) => void; onBack?: () => void };

export function CoursePicker({ progress, onPick, onBack }: Props) {
  return (
    <main className="picker">
      {onBack && (
        <button type="button" className="icon-btn picker-back" aria-label="Back" onClick={onBack}>
          ←
        </button>
      )}
      <Mascot mood="happy" size={96} />
      <h1>{onBack ? 'Switch course' : 'What would you like to learn?'}</h1>
      <p className="muted">All courses are taught from English. Your streak, XP and hearts are shared.</p>
      <ul className="course-list">
        {COURSES.map((c) => {
          const lessons = lessonsOf(c);
          const done = lessons.filter((l) => l.id in progress.completed).length;
          const active = progress.course === c.id;
          return (
            <li key={c.id}>
              <button
                type="button"
                className={`course-card ${active ? 'active' : ''}`}
                aria-current={active || undefined}
                onClick={() => onPick(c.id)}
              >
                <CourseBadge course={c} size={52} />
                <span className="course-card-text">
                  <strong>{c.name}</strong>
                  <small>{c.tagline}</small>
                  <span className="course-meter" aria-label={`${done} of ${lessons.length} lessons done`}>
                    <span style={{ width: `${(100 * done) / lessons.length}%`, background: c.color }} />
                  </span>
                </span>
                <span className="course-card-meta">
                  {done}/{lessons.length}
                  <small>{progress.courseXp[c.id] ?? 0} XP</small>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
