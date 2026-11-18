import type { CSSProperties } from 'react';
import {
  isLevelComplete,
  isLevelUnlocked,
  isUnlocked,
  lessonsOf,
  LEARNING_LEVELS,
  LEVEL_INFO,
  unitsInLevel,
} from '../data/courses';
import type { Progress } from '../lib/progress';
import type { Course } from '../types';
import { GoalRing, SpeakButton } from './ui';

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
  const progressPercent = lessons.length ? Math.round((done / lessons.length) * 100) : 0;
  const warmupWord = lessons[0]?.words[0]?.t ?? course.hello;
  const greeting = course.hello.replace(/[!?.]+$/, '');
  const availableLevels = LEARNING_LEVELS.filter((level) => unitsInLevel(course, level).length > 0);
  const currentLevel = availableLevels.find((level) => !isLevelComplete(course, level, progress.completed))
    ?? availableLevels[availableLevels.length - 1]
    ?? 'beginner';
  const allLevelsComplete = availableLevels.every((level) => isLevelComplete(course, level, progress.completed));

  const headline = done === 0
    ? `A little ${course.name}, a lot of possibility.`
    : !nextLesson
      ? `${course.congrats} You made it through the course.`
      : goalMet
        ? `Daily goal reached. ${course.praise[0]}`
        : streak > 0
          ? `Your ${streak}-day streak is looking good.`
          : 'Welcome back. Let’s keep going.';

  return (
    <main className="home">
      <div className="home-heading">
        <div>
          <span className="eyebrow"><span className="eyebrow-dot" /> YOUR {course.name.toUpperCase()} STUDIO</span>
          <h1>{headline}</h1>
          <p className="home-subtitle">A thoughtful path from your first {greeting.toLowerCase()} to speaking with confidence.</p>
        </div>
        <span className="level-chip"><span>{course.badge}</span> {course.id === 'fr'
          ? `${LEVEL_INFO[currentLevel].cefr} · ${LEVEL_INFO[currentLevel].title.toUpperCase()}${allLevelsComplete ? ' COMPLETE' : ''}`
          : 'STARTER PATH'}</span>
      </div>

      <div className="home-grid">
        <div className="home-main">
          <section className="hero card">
            <div className="hero-copy">
              <span className="hero-kicker">YOUR NEXT STEP</span>
              <h2>{nextLesson ? nextLesson.title : 'A course well learned'}</h2>
              <p>{nextLesson ? course.units.find((unit) => unit.lessons.some((lesson) => lesson.id === nextLesson.id))?.description : `Keep your ${course.name} fresh with a quick review.`}</p>
              <div className="hero-meta"><span>◷ 5 MIN</span><span>✦ {nextLesson?.words.length ?? 0} NEW WORDS</span></div>
              <div className="hero-actions">
                {nextLesson && <button type="button" className="btn primary" onClick={() => onStart(nextLesson.id)}>Continue learning <span aria-hidden="true">→</span></button>}
                {!nextLesson && <button type="button" className="btn primary" onClick={onPractice}>Review your {course.name} <span aria-hidden="true">→</span></button>}
              </div>
            </div>
            <div className="hero-art" aria-hidden="true">
              <span className="hero-art-orbit hero-art-orbit-one" />
              <span className="hero-art-orbit hero-art-orbit-two" />
              <span className="hero-art-word">{greeting}<span>.</span></span>
              {course.id === 'fr' && <span className="hero-art-caption">/ bɔ̃.ʒuʁ /</span>}
              <span className="hero-art-note">the beginning<br />of something</span>
            </div>
          </section>

          <section className="curriculum" aria-labelledby="curriculum-title">
            <div className="section-heading">
              <div><span className="eyebrow">THE LEARNING PATH</span><h2 id="curriculum-title">Your {course.name} journey</h2></div>
              <span className="section-progress">{done} <span>/ {lessons.length} lessons</span></span>
            </div>
            <div className="curriculum-progress" role="progressbar" aria-label={`${course.name} course progress`} aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100}>
              <span style={{ width: `${progressPercent}%` }} />
            </div>
            {availableLevels.map((level, levelIndex) => {
              const info = LEVEL_INFO[level];
              const units = unitsInLevel(course, level);
              const unlocked = isLevelUnlocked(course, level, progress.completed);
              const complete = isLevelComplete(course, level, progress.completed);
              const previousLevel = LEARNING_LEVELS[levelIndex - 1];
              return (
                <section
                  key={level}
                  className={`learning-level learning-level-${level} ${unlocked ? 'level-unlocked' : 'level-locked'}`}
                  aria-labelledby={`level-${course.id}-${level}`}
                >
                  <header className="learning-level-head">
                    <span className="learning-level-code">{info.cefr}</span>
                    <div className="learning-level-title">
                      <span className="eyebrow">STAGE {String(levelIndex + 1).padStart(2, '0')}</span>
                      <h3 id={`level-${course.id}-${level}`}>{info.title}</h3>
                      <p>{info.description}</p>
                    </div>
                    <span className={`level-status ${complete ? 'status-complete' : unlocked ? 'status-active' : 'status-locked'}`}>
                      {complete ? 'COMPLETE' : unlocked ? 'IN PROGRESS' : 'LOCKED'}
                    </span>
                  </header>
                  {!unlocked && previousLevel && (
                    <p className="level-unlock-note">
                      Complete all {LEVEL_INFO[previousLevel].title} lessons to unlock {info.title}.
                    </p>
                  )}
                  {units.map((unit) => {
                    const unitIndex = course.units.indexOf(unit);
                    const unitDone = unit.lessons.filter((lesson) => lesson.id in progress.completed).length;
                    const unitCurrent = unit.lessons.some((lesson) => lesson.id === nextLesson?.id);
                    return (
                      <section
                        key={unit.id}
                        className={`unit ${unitCurrent ? 'unit-current' : ''}`}
                        style={{ '--unit': unit.color } as CSSProperties}
                      >
                        <header className="unit-head">
                          <span className="unit-index">{String(unitIndex + 1).padStart(2, '0')}</span>
                          <div className="unit-title-wrap">
                            <span className="unit-kicker">{unitCurrent ? 'UP NEXT' : `CHAPTER ${String(unitIndex + 1).padStart(2, '0')}`}</span>
                            <h4>{unit.title}</h4>
                            <p>{unit.description}</p>
                          </div>
                          <span className="unit-count">{unitDone}/{unit.lessons.length}</span>
                        </header>
                        <ol className="steps">
                          {unit.lessons.map((lesson, lessonIndex) => {
                            const completed = lesson.id in progress.completed;
                            const lessonUnlocked = isUnlocked(course, lesson.id, progress.completed);
                            const current = lesson.id === nextLesson?.id;
                            const state = completed ? 'done' : current ? 'current' : lessonUnlocked ? 'open' : 'locked';
                            return (
                              <li key={lesson.id} className={`step step-${state}`}>
                                <button type="button" disabled={!lessonUnlocked} onClick={() => onStart(lesson.id)}>
                                  <span className="step-dot">{completed ? '✓' : lessonUnlocked ? String(lessonIndex + 1).padStart(2, '0') : '·'}</span>
                                  <span className="step-text">
                                    <strong>{lesson.title}</strong>
                                    <small lang={course.lang}>{lesson.words.map((word) => word.t).join(' · ')}</small>
                                  </span>
                                  <span className="step-cta">{completed ? 'REVISIT' : current ? 'START' : lessonUnlocked ? 'OPEN' : 'LOCKED'}</span>
                                </button>
                              </li>
                            );
                          })}
                        </ol>
                      </section>
                    );
                  })}
                </section>
              );
            })}
          </section>
        </div>

        <aside className="home-aside">
          <section className="daily-card card">
            <div className="aside-heading"><div><span className="eyebrow">A LITTLE, OFTEN</span><h2>Your daily rhythm</h2></div><GoalRing value={todayXp} goal={progress.dailyGoal} size={60} /></div>
            <p className="daily-copy">{goalMet ? 'Lovely work. Your daily goal is in the bag.' : 'Small, steady practice is how fluency happens.'}</p>
            <div className="daily-meter"><span style={{ width: `${Math.min(100, (100 * todayXp) / progress.dailyGoal)}%` }} /></div>
            <div className="daily-metric"><strong>{todayXp} <span>XP</span></strong><span>of {progress.dailyGoal} daily goal</span></div>
            <div className="streak-row"><span className="streak-icon">✳</span><span><strong>{streak} day{streak === 1 ? '' : 's'}</strong><small>your current streak</small></span><span className="streak-sparkle">✦</span></div>
          </section>

          <section className="speaking-card">
            <span className="speaking-label">SPEAKING · 01</span>
            <span className="speaking-quote" lang={course.lang}>{warmupWord}</span>
            <span className="speaking-hint">Listen. Say it out loud. Own the sound.</span>
            <SpeakButton text={warmupWord} lang={course.lang} label={`Listen to ${warmupWord}`} />
          </section>

          <section className="practice-card card">
            <span className="practice-icon" aria-hidden="true">↗</span>
            <div><span className="eyebrow">MAKE IT STICK</span><h2>Practice what you know</h2><p>A quick review brings yesterday’s words back into reach.</p></div>
            <button type="button" className="btn ghost" onClick={onPractice}>Start a review <span aria-hidden="true">→</span></button>
          </section>
          <footer className="home-foot">
            <button type="button" className="link-btn" onClick={() => {
              if (confirm('Reset all progress in every course? This cannot be undone.')) onReset();
            }}>Reset progress</button>
          </footer>
        </aside>
      </div>
    </main>
  );
}
