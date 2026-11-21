import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { AccountPanel } from './components/AccountPanel';
import { Complete } from './components/Complete';
import { CoursePicker } from './components/CoursePicker';
import { Home } from './components/Home';
import { Lesson } from './components/Lesson';
import { MissionScreen } from './components/MissionScreen';
import { OutOfHearts } from './components/OutOfHearts';
import { TopBar } from './components/TopBar';
import { SpeechToast } from './components/ui';
import { findLesson, findMission, getCourse, lessonsOf } from './data/courses';
import { generateLesson, generatePractice, generateReview } from './lib/generate';
import {
  currentStreak,
  dayKey,
  dueWordIds,
  gainHeart,
  initialProgress,
  loadProgress,
  loseHeart,
  msUntilNextHeart,
  recordMission,
  recordWordReview,
  recordSession,
  regenHearts,
  removeSavedPhrase,
  saveProgress,
  todayXp,
  toggleSavedPhrase,
  xpFor,
} from './lib/progress';
import { mergeProgress, sameProgress } from './lib/merge';
import { errorMessage, loadCloudSave, saveCloudSaveIfUnchanged, supabase } from './lib/supabase';
import {
  loadProgressOwner,
  loadSyncBase,
  storeProgressOwner,
  storeSyncBase,
  syncWithCloud,
  type SyncBase,
} from './lib/sync';
import { useOnline } from './lib/offline';
import { hasVoice } from './lib/speech';
import type { Exercise, SessionResult } from './types';

const TranslateScreen = lazy(() =>
  import('./components/TranslateScreen').then((module) => ({ default: module.TranslateScreen })),
);

type Screen =
  | { name: 'home' }
  | { name: 'translate' }
  | { name: 'courses' }
  | { name: 'lesson'; run: number; lessonId?: string; practice: boolean; exercises: Exercise[] }
  | { name: 'mission'; run: number; missionId: string }
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
  const [syncError, setSyncError] = useState<string | null>(null);
  const [retrySync, setRetrySync] = useState(0);
  const [showAccount, setShowAccount] = useState(false);
  const online = useOnline();
  const progressRef = useRef(progress);
  /** Signed-in user whose progress is being synced. */
  const syncUser = useRef<string | null>(null);
  const syncBase = useRef<SyncBase | null>(null);
  const syncRunning = useRef(false);
  const syncAgain = useRef(false);
  const syncTimer = useRef<number | undefined>(undefined);
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

  /**
   * Merge this device's progress with the cloud save and write the result back. Only one sync runs at a
   * time; changes made meanwhile trigger another round. Offline, it waits for the connection to return.
   */
  const runSync = useCallback(async () => {
    if (syncRunning.current) {
      syncAgain.current = true;
      return;
    }
    syncRunning.current = true;
    try {
      do {
        syncAgain.current = false;
        const userId = syncUser.current;
        if (!userId) return;
        if (!navigator.onLine) {
          setSyncError(null);
          return;
        }
        const sent = progressRef.current;
        const owner = loadProgressOwner();
        try {
          const result = await syncWithCloud(
            sent,
            syncBase.current,
            {
              load: () => loadCloudSave(userId),
              saveIfUnchanged: (next, expected) => saveCloudSaveIfUnchanged(userId, next, expected),
            },
            { replaceLocal: owner !== null && owner !== userId },
          );
          if (syncUser.current !== userId) return;
          syncBase.current = result;
          storeSyncBase(userId, result);
          storeProgressOwner(userId);
          setProgress((current) => {
            // Keep anything learned on this device while the sync was in flight.
            const next = current === sent ? result.progress : mergeProgress(current, result.progress, sent);
            return sameProgress(next, current) ? current : next;
          });
          setSyncError(null);
        } catch (error) {
          if (syncUser.current === userId) setSyncError(`Could not sync progress: ${errorMessage(error)}`);
          return;
        }
      } while (syncAgain.current);
    } finally {
      syncRunning.current = false;
    }
  }, []);

  useEffect(() => {
    const userId = authReady && session ? session.user.id : null;
    syncUser.current = userId;
    syncBase.current = userId ? loadSyncBase(userId) : null;
    setSyncError(null);
    if (userId) void runSync();
  }, [authReady, session?.user.id, retrySync, runSync]);

  useEffect(() => {
    saveProgress(progress);
    if (!syncUser.current) return;
    window.clearTimeout(syncTimer.current);
    syncTimer.current = window.setTimeout(() => void runSync(), 1500);
    return () => window.clearTimeout(syncTimer.current);
  }, [progress, runSync]);

  useEffect(() => {
    if (online && syncUser.current) void runSync();
  }, [online, runSync]);

  useEffect(() => {
    // Pick up progress from other devices when returning to the app, and send pending changes when leaving.
    const onVisibility = () => {
      if (!syncUser.current) return;
      window.clearTimeout(syncTimer.current);
      void runSync();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [runSync]);

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
    document.documentElement.dataset.roman = progress.showRoman ? 'shown' : 'hidden';
  }, [progress.showRoman]);

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

  /** Due words that still exist in the course; stale ids from older content are skipped. */
  const dueWords = (at: number) => {
    const wordsById = new Map(
      lessonsOf(course)
        .filter((lesson) => lesson.kind !== 'script')
        .flatMap((lesson) => lesson.words.map((word) => [word.t, word] as const)),
    );
    return dueWordIds(progress, course.id, at)
      .map((id) => wordsById.get(id))
      .filter((word) => word !== undefined);
  };

  const startDueReview = () => {
    const words = dueWords(Date.now());
    if (!words.length) return;
    setScreen({
      name: 'lesson',
      run: Date.now(),
      practice: true,
      exercises: generateReview(course, words, genOpts()),
    });
  };

  const reviewWords = (targets: string[], correct: boolean) => {
    setProgress((p) => recordWordReview(p, course.id, targets, correct, Date.now()));
  };

  const togglePhrase = (phrase: Parameters<typeof toggleSavedPhrase>[1]) => {
    setProgress((p) => toggleSavedPhrase(p, phrase, Date.now()));
  };

  const toggleRoman = () => setProgress((p) => ({ ...p, showRoman: !p.showRoman }));

  const startMission = (missionId: string) => {
    if (!findMission(course, missionId)) return;
    setScreen({ name: 'mission', run: Date.now(), missionId });
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
    if (result.missionId) next = recordMission(next, result.missionId, result.accuracy);
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
      {!online && (
        <p className="offline-banner" role="status">
          You’re offline. Lessons, missions and your phrasebook still work; sync resumes when you reconnect.
        </p>
      )}
      {screen.name === 'home' && (
        <>
          <TopBar
            course={course}
            progress={progress}
            streak={streak}
            practicedToday={progress.lastActiveDate === dayKey(now)}
            now={now}
            onSwitchCourse={() => setScreen({ name: 'courses' })}
            onTranslate={() => setScreen({ name: 'translate' })}
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
            dueReviewCount={dueWords(now).length}
            streak={streak}
            onStart={startLesson}
            onPractice={startPractice}
            onStartReview={startDueReview}
            onStartMission={startMission}
            onSetDailyGoal={(goal) => setProgress((p) => ({ ...p, dailyGoal: goal }))}
            onSetGoal={(reason, goal) => setProgress((p) => ({ ...p, learningReason: reason, dailyGoal: goal }))}
            onToggleRoman={toggleRoman}
            onRemovePhrase={(id) => setProgress((p) => removeSavedPhrase(p, id))}
            onReset={() => setProgress({ ...initialProgress(Date.now()), course: progress.course, resetAt: Date.now() })}
          />
        </>
      )}

      {screen.name === 'translate' && (
        <Suspense fallback={<main className="account-loading" role="status">Loading translator…</main>}>
          <TranslateScreen
            course={course}
            online={online}
            sound={progress.sound}
            savedPhrases={progress.savedPhrases}
            onBack={() => setScreen({ name: 'home' })}
            onSavePhrase={togglePhrase}
          />
        </Suspense>
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
          savedPhrases={progress.savedPhrases}
          showRoman={progress.showRoman}
          userId={session?.user.id ?? null}
          onToggleRoman={toggleRoman}
          onTogglePhrase={togglePhrase}
          onReview={reviewWords}
          onWrong={() => setProgress((p) => loseHeart(p, Date.now()))}
          onExit={() => setScreen({ name: 'home' })}
          onFinish={finish}
          onOutOfHearts={() => setScreen({ name: 'nohearts' })}
        />
      )}

      {screen.name === 'mission' && (() => {
        const mission = findMission(course, screen.missionId);
        if (!mission) return null;
        return (
          <MissionScreen
            key={screen.run}
            course={course}
            mission={mission}
            sound={progress.sound}
            showRoman={progress.showRoman}
            savedPhrases={progress.savedPhrases}
            userId={session?.user.id ?? null}
            onToggleRoman={toggleRoman}
            onTogglePhrase={togglePhrase}
            onExit={() => setScreen({ name: 'home' })}
            onFinish={finish}
          />
        );
      })()}

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
      <SpeechToast />
    </div>
  );
}
