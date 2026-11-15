import type { CSSProperties } from 'react';
import { isUnlocked, lessonsOf } from '../data/courses';
import type { Progress } from '../lib/progress';
import type { Course } from '../types';
import { Mascot } from './Mascot';
import { GoalRing } from './ui';

type Props = {
  course: Course;
  progress: Progress;
  todayXp: number;
  streak: number;
  onStart: (lessonId: string) => void;
  onPractice: () => void;
  onReset: () => void;
};

export function Home({ course, progress, todayXp, streak, onStart, onPractice, onReset }: Props) {
  const lessons = lessonsOf(course);
  const done = lessons.filter((l) => l.id in progress.completed).length;
  const nextLesson = lessons.find((l) => !(l.id in progress.completed));
  const goalMet = todayXp >= progress.dailyGoal;

  const headline =
    done === 0
      ? `${course.hello} Ready for your first ${course.name} lesson?`
      : !nextLesson
        ? `${course.congrats} You finished the ${course.name} course.`
        : goalMet
          ? `Daily goal reached. ${course.praise[0]}`
          : streak > 0
            ? `Keep your ${streak}-day streak going!`
            : "Let's pick up where you left off.";

  return (
    <main className="home">
      <section className="hero card">
        <Mascot mood={goalMet || !nextLesson ? 'cheer' : 'happy'} size={76} />
        <div className="hero-text">
          <h1>{headline}</h1>
          <p>
            {done}/{lessons.length} lessons · {todayXp}/{progress.dailyGoal} XP today
          </p>
          <div className="hero-actions">
            {nextLesson && (
              <button type="button" className="btn primary" onClick={() => onStart(nextLesson.id)}>
                {done === 0 ? 'Start learning' : 'Continue'}
              </button>
            )}
            {done > 0 && (
              <button type="button" className="btn ghost" onClick={onPractice}>
                Practice (+❤️)
              </button>
            )}
          </div>
        </div>
        <GoalRing value={todayXp} goal={progress.dailyGoal} />
      </section>

      {course.units.map((unit, ui) => {
        const unitDone = unit.lessons.filter((l) => l.id in progress.completed).length;
        return (
          <section key={unit.id} className="unit" style={{ '--unit': unit.color } as CSSProperties}>
            <header className="unit-head">
              <div>
                <span className="unit-kicker">Unit {ui + 1}</span>
                <h2>{unit.title}</h2>
                <p>{unit.description}</p>
              </div>
              <span className="unit-count">
                {unitDone}/{unit.lessons.length}
              </span>
            </header>
            <ol className="steps">
              {unit.lessons.map((lesson, li) => {
                const completed = lesson.id in progress.completed;
                const unlocked = isUnlocked(course, lesson.id, progress.completed);
                const current = lesson.id === nextLesson?.id;
                const state = completed ? 'done' : current ? 'current' : unlocked ? 'open' : 'locked';
                return (
                  <li key={lesson.id} className={`step step-${state}`}>
                    <button type="button" disabled={!unlocked} onClick={() => onStart(lesson.id)}>
                      <span className="step-dot">{completed ? '✓' : unlocked ? li + 1 : '🔒'}</span>
                      <span className="step-text">
                        <strong>{lesson.title}</strong>
                        <small lang={course.lang}>{lesson.words.map((w) => w.t).join(' · ')}</small>
                      </span>
                      <span className="step-cta">
                        {completed ? 'Review' : current ? 'Start' : unlocked ? 'Open' : ''}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}

      <footer className="home-foot">
        <button
          type="button"
          className="link-btn"
          onClick={() => {
            if (confirm('Reset all progress in every course? This cannot be undone.')) onReset();
          }}
        >
          Reset progress
        </button>
      </footer>
    </main>
  );
}
