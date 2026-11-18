import { useEffect, useRef, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { AccountPanel } from './components/AccountPanel';
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
import { errorMessage, loadCloudProgress, saveCloudProgress, supabase } from './lib/supabase';
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

type Theme = 'light' | 'dark';

export default function App() {
  const [progress, setProgress] = useState(() => loadProgress(Date.now()));
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return window.localStorage.getItem('habla-theme') === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });
  const [now, setNow] = useState(Date.now());
  const [screen, setScreen] = useState<Screen>({ name: 'home' });
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(!supabase);
  const [hydratedUserId, setHydratedUserId] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [retrySync, setRetrySync] = useState(0);
  const [showAccount, setShowAccount] = useState(false);
  const progressRef = useRef(progress);
  const saveQueue = useRef<Promise<void>>(Promise.resolve());
  const course = getCourse(progress.course);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      setSession(nextSession);
      setAuthReady(true);
      setSyncError(null);
    });
    void supabase.auth.getSession().then(({ data: sessionData, error }) => {
      if (!active) return;
      if (error) setSyncError(error.message);
      setSession(sessionData.session);
      setAuthReady(true);
    }).catch((error: unknown) => {
      if (!active) return;
      setSyncError(errorMessage(error));
      setAuthReady(true);
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!authReady || !session) {
      setHydratedUserId(null);
      return;
    }
    let active = true;
    const userId = session.user.id;
    setHydratedUserId(null);
    setSyncError(null);
    void (async () => {
      try {
        const cloudProgress = await loadCloudProgress(userId);
        if (!active) return;
        if (cloudProgress) {
          setProgress(cloudProgress);
        } else {
          await saveCloudProgress(userId, progressRef.current);
        }
        if (active) setHydratedUserId(userId);
      } catch (error) {
        if (active) setSyncError(`Could not load cloud progress: ${errorMessage(error)}`);
      }
    })();
    return () => {
      active = false;
    };
  }, [authReady, session?.user.id, retrySync]);

  useEffect(() => {
    saveProgress(progress);
    if (!session || hydratedUserId !== session.user.id) return;
    const userId = session.user.id;
    saveQueue.current = saveQueue.current
      .catch(() => undefined)
      .then(() => saveCloudProgress(userId, progress))
      .then(() => setSyncError(null))
      .catch((error: unknown) => setSyncError(`Could not sync progress: ${errorMessage(error)}`));
  }, [progress, session?.user.id, hydratedUserId]);

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

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute(
      'content',
      theme === 'dark' ? '#1A1B1F' : '#F0E7D5',
    );
    try {
      window.localStorage.setItem('habla-theme', theme);
    } catch {
      // Theme selection still works for the current visit when storage is unavailable.
    }
  }, [theme]);

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

  if (!authReady) {
    return <main className="account-loading" role="status">Loading account…</main>;
  }

  if (progress.course === null || screen.name === 'courses') {
    return (
      <div className="app">
        <div className="picker-top-actions">
          <button
            type="button"
            className="icon-btn theme-toggle"
            onClick={() => setTheme((current) => current === 'light' ? 'dark' : 'light')}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            {theme === 'light' ? '☾' : '☀'}
          </button>
          <button type="button" className="account-picker-btn" onClick={() => setShowAccount(true)}>
            {session ? 'Account' : 'Sign in'}
            {syncError && <span aria-label="Sync issue"> ⚠</span>}
          </button>
        </div>
        <CoursePicker
          progress={progress}
          onPick={(id) => {
            setProgress((p) => ({ ...p, course: id }));
            setScreen({ name: 'home' });
          }}
          onBack={progress.course === null ? undefined : () => setScreen({ name: 'home' })}
        />
        {showAccount && (
          <AccountPanel
            session={session}
            syncError={syncError}
            onClose={() => setShowAccount(false)}
            onRetrySync={() => setRetrySync((retry) => retry + 1)}
          />
        )}
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
            onAccount={() => setShowAccount(true)}
            accountLabel={session ? 'Account' : 'Sign in'}
            syncError={syncError}
            theme={theme}
            onToggleTheme={() => setTheme((current) => current === 'light' ? 'dark' : 'light')}
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
      {showAccount && (
        <AccountPanel
          session={session}
          syncError={syncError}
          onClose={() => setShowAccount(false)}
          onRetrySync={() => setRetrySync((retry) => retry + 1)}
        />
      )}
    </div>
  );
}
