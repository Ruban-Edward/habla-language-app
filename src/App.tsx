import { useEffect, useState } from 'react';
import { Complete } from './components/Complete';
import { CoursePicker } from './components/CoursePicker';
import { Home } from './components/Home';
import { Lesson } from './components/Lesson';
import { OutOfHearts } from './components/OutOfHearts';
import { TopBar } from './components/TopBar';
import { findLesson, getCourse, lessonsOf } from './data/courses';
import { generateLesson, generatePractice } from './lib/generate';
import {
  currentStreak,
  dayKey,
  gainHeart,
  initialProgress,
  loadProgress,
  loseHeart,
  msUntilNextHeart,
  recordSession,
  regenHearts,
  saveProgress,
  todayXp,
  xpFor,
} from './lib/progress';
import { hasVoice } from './lib/speech';
import type { Exercise, SessionResult } from './types';

type Screen =
  | { name: 'home' }
  | { name: 'courses' }
  | { name: 'lesson'; run: number; lessonId?: string; practice: boolean; exercises: Exercise[] }
  | {
      name: 'complete';
      result: SessionResult;
      xp: number;
      streak: number;
      streakUp: boolean;
      heartGained: boolean;
      goalJustMet: boolean;
    }
  | { name: 'nohearts' };

export default function App() {
  const [progress, setProgress] = useState(() => loadProgress(Date.now()));
  const [now, setNow] = useState(Date.now());
  const [screen, setScreen] = useState<Screen>({ name: 'home' });
  const course = getCourse(progress.course);

  useEffect(() => saveProgress(progress), [progress]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setProgress((p) => regenHearts(p, now));
  }, [now]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen.name, progress.course]);

  useEffect(() => {
    document.documentElement.style.setProperty('--course', course.color);
  }, [course.color]);

  // Listening exercises only when sound is on and the browser can speak this language.
  const genOpts = () => ({ speech: progress.sound && hasVoice(course.lang) });

  const startLesson = (lessonId: string) => {
    const lesson = findLesson(course, lessonId);
    if (!lesson) return;
    if (regenHearts(progress, Date.now()).hearts <= 0) return setScreen({ name: 'nohearts' });
    setScreen({
      name: 'lesson',
      run: Date.now(),
      lessonId,
      practice: false,
      exercises: generateLesson(course, lesson, genOpts()),
    });
  };

  const startPractice = () => {
    const all = lessonsOf(course);
    const done = all.filter((l) => l.id in progress.completed);
    const lessons = done.length ? done : [all[0]];
    setScreen({ name: 'lesson', run: Date.now(), practice: true, exercises: generatePractice(course, lessons, genOpts()) });
  };

  const finish = (result: SessionResult) => {
    const t = Date.now();
    const xp = xpFor(result);
    const before = currentStreak(progress, t);
    const xpBefore = todayXp(progress, t);
    let next = recordSession(
      progress,
      { courseId: course.id, lessonId: result.lessonId, xp, accuracy: result.accuracy },
      t,
    );
    const heartBefore = regenHearts(next, t).hearts;
    if (result.practice) next = gainHeart(next, t);
    const streak = currentStreak(next, t);
    setProgress(next);
    setScreen({
      name: 'complete',
      result,
      xp,
      streak,
      streakUp: streak > before,
      heartGained: next.hearts > heartBefore,
      goalJustMet: xpBefore < next.dailyGoal && (next.dailyXp[dayKey(t)] ?? 0) >= next.dailyGoal,
    });
  };

  const streak = currentStreak(progress, now);

  if (progress.course === null || screen.name === 'courses') {
    return (
      <div className="app">
        <CoursePicker
          progress={progress}
          onPick={(id) => {
            setProgress((p) => ({ ...p, course: id }));
            setScreen({ name: 'home' });
          }}
          onBack={progress.course === null ? undefined : () => setScreen({ name: 'home' })}
        />
      </div>
    );
  }

  return (
    <div className="app">
      {screen.name === 'home' && (
        <>
          <TopBar
            course={course}
            progress={progress}
            streak={streak}
            practicedToday={progress.lastActiveDate === dayKey(now)}
            now={now}
            onSwitchCourse={() => setScreen({ name: 'courses' })}
            onToggleSound={() => setProgress((p) => ({ ...p, sound: !p.sound }))}
          />
          <Home
            course={course}
            progress={progress}
            todayXp={todayXp(progress, now)}
            streak={streak}
            onStart={startLesson}
            onPractice={startPractice}
            onReset={() => setProgress({ ...initialProgress(Date.now()), course: progress.course })}
          />
        </>
      )}

      {screen.name === 'lesson' && (
        <Lesson
          key={screen.run}
          course={course}
          exercises={screen.exercises}
          lessonId={screen.lessonId}
          practice={screen.practice}
          hearts={progress.hearts}
          sound={progress.sound}
          onWrong={() => setProgress((p) => loseHeart(p, Date.now()))}
          onExit={() => setScreen({ name: 'home' })}
          onFinish={finish}
          onOutOfHearts={() => setScreen({ name: 'nohearts' })}
        />
      )}

      {screen.name === 'complete' && (
        <Complete
          result={screen.result}
          xp={screen.xp}
          streak={screen.streak}
          streakUp={screen.streakUp}
          heartGained={screen.heartGained}
          goalJustMet={screen.goalJustMet}
          onContinue={() => setScreen({ name: 'home' })}
        />
      )}

      {screen.name === 'nohearts' && (
        <OutOfHearts
          msUntilNext={msUntilNextHeart(progress, now)}
          onPractice={startPractice}
          onHome={() => setScreen({ name: 'home' })}
        />
      )}
    </div>
  );
}
