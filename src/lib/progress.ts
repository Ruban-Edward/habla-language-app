import type { LearningReason } from '../types';

export const MAX_HEARTS = 5;
export const HEART_REFILL_MS = 15 * 60 * 1000;
export const REVIEW_RETRY_MS = 15 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
/** A review counts toward week-later recall when the word was last seen at least this long ago. */
export const RECALL_GAP_MS = 7 * DAY_MS;
const REVIEW_INTERVAL_DAYS = [1, 3, 7, 14, 30];
const STORAGE_KEY = 'habla:v1';

export type LessonRecord = { times: number; bestAccuracy: number };
export type WordReview = {
  dueAt: number;
  intervalDays: number;
  repetitions: number;
  lastReviewedAt: number;
};
export type SavedPhrase = {
  id: string;
  courseId: string;
  target: string;
  meaning: string;
  roman?: string;
  createdAt: number;
};
export type PhraseDraft = Omit<SavedPhrase, 'id' | 'createdAt'>;
export type RecallStats = { attempts: number; correct: number };
/** One finished lesson, practice, mission or story. `at` (ms) identifies it when merging devices. */
export type SessionStat = { at: number; courseId: string; date: string; accuracy: number; durationMs: number; xp: number };
/** How many recent sessions are kept for the progress dashboard. */
export const SESSION_HISTORY_LIMIT = 200;

export type Progress = {
  xp: number;
  completed: Record<string, LessonRecord>;
  hearts: number;
  /** When the next heart's refill timer started. */
  heartsUpdatedAt: number;
  streak: number;
  lastActiveDate: string | null;
  dailyXp: Record<string, number>;
  dailyGoal: number;
  sound: boolean;
  /** The course being studied; null until the learner picks one. */
  course: string | null;
  courseXp: Record<string, number>;
  wordReviews: Record<string, WordReview>;
  savedPhrases: SavedPhrase[];
  /** Show romanization for non-Latin scripts (learners can turn it off as they gain confidence). */
  showRoman: boolean;
  /** Why the learner is studying; null until they choose. */
  learningReason: LearningReason | null;
  /** Best results for missions and mini-stories, by their id. */
  missions: Record<string, LessonRecord>;
  /** Per course: answers given a week or more after the learner last saw the word. */
  recall: Record<string, RecallStats>;
  /** When all progress was last reset (0 if never), so a reset isn't undone by syncing older data. */
  resetAt: number;
  /** Recent sessions, oldest first, for the progress dashboard. */
  sessionHistory: SessionStat[];
};

export function initialProgress(now: number): Progress {
  return {
    course: null,
    courseXp: {},
    xp: 0,
    completed: {},
    hearts: MAX_HEARTS,
    heartsUpdatedAt: now,
    streak: 0,
    lastActiveDate: null,
    dailyXp: {},
    dailyGoal: 30,
    sound: true,
    wordReviews: {},
    savedPhrases: [],
    showRoman: true,
    learningReason: null,
    missions: {},
    recall: {},
    resetAt: 0,
    sessionHistory: [],
  };
}

export function wordReviewKey(courseId: string, target: string): string {
  return `${courseId}:${target}`;
}

export function dueWordIds(p: Progress, courseId: string, now: number): string[] {
  const prefix = `${courseId}:`;
  return Object.entries(p.wordReviews)
    .filter(([key, review]) => key.startsWith(prefix) && review.dueAt <= now)
    .sort((a, b) => a[1].dueAt - b[1].dueAt)
    .map(([key]) => key.slice(prefix.length));
}

export function recordWordReview(
  p: Progress,
  courseId: string,
  targets: string[],
  correct: boolean,
  now: number,
): Progress {
  const wordReviews = { ...p.wordReviews };
  let recall = p.recall[courseId] ?? { attempts: 0, correct: 0 };
  let recallChanged = false;
  for (const target of new Set(targets)) {
    const key = wordReviewKey(courseId, target);
    const previous = wordReviews[key];
    if (previous && now - previous.lastReviewedAt >= RECALL_GAP_MS) {
      recall = { attempts: recall.attempts + 1, correct: recall.correct + (correct ? 1 : 0) };
      recallChanged = true;
    }
    const repetitions = correct ? (previous?.repetitions ?? 0) + 1 : 0;
    const intervalDays = correct
      ? REVIEW_INTERVAL_DAYS[Math.min(repetitions - 1, REVIEW_INTERVAL_DAYS.length - 1)]
      : 0;
    wordReviews[key] = {
      dueAt: correct ? now + intervalDays * DAY_MS : now + REVIEW_RETRY_MS,
      intervalDays,
      repetitions,
      lastReviewedAt: now,
    };
  }
  return { ...p, wordReviews, recall: recallChanged ? { ...p.recall, [courseId]: recall } : p.recall };
}

export function recordMission(p: Progress, missionId: string, accuracy: number): Progress {
  const prev = p.missions[missionId];
  return {
    ...p,
    missions: {
      ...p.missions,
      [missionId]: { times: (prev?.times ?? 0) + 1, bestAccuracy: Math.max(prev?.bestAccuracy ?? 0, accuracy) },
    },
  };
}

export function toggleSavedPhrase(p: Progress, phrase: PhraseDraft, now: number): Progress {
  const id = wordReviewKey(phrase.courseId, phrase.target);
  if (p.savedPhrases.some((saved) => saved.id === id)) {
    return { ...p, savedPhrases: p.savedPhrases.filter((saved) => saved.id !== id) };
  }
  return { ...p, savedPhrases: [...p.savedPhrases, { ...phrase, id, createdAt: now }] };
}

export function removeSavedPhrase(p: Progress, id: string): Progress {
  return { ...p, savedPhrases: p.savedPhrases.filter((phrase) => phrase.id !== id) };
}

/** Local calendar day as YYYY-MM-DD. */
export function dayKey(t: number): string {
  const d = new Date(t);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function shiftDay(key: string, days: number): string {
  const [y, m, d] = key.split('-').map(Number);
  return dayKey(new Date(y, m - 1, d + days).getTime());
}

/** Apply time-based heart refills. Returns the same object when nothing changes. */
export function regenHearts(p: Progress, now: number): Progress {
  if (p.hearts >= MAX_HEARTS) return p;
  const gained = Math.floor((now - p.heartsUpdatedAt) / HEART_REFILL_MS);
  if (gained <= 0) return p;
  const hearts = Math.min(MAX_HEARTS, p.hearts + gained);
  return {
    ...p,
    hearts,
    heartsUpdatedAt: hearts >= MAX_HEARTS ? now : p.heartsUpdatedAt + gained * HEART_REFILL_MS,
  };
}

export function msUntilNextHeart(p: Progress, now: number): number | null {
  if (p.hearts >= MAX_HEARTS) return null;
  return Math.max(0, p.heartsUpdatedAt + HEART_REFILL_MS - now);
}

export function loseHeart(p: Progress, now: number): Progress {
  const r = regenHearts(p, now);
  if (r.hearts <= 0) return r;
  return { ...r, hearts: r.hearts - 1, heartsUpdatedAt: r.hearts >= MAX_HEARTS ? now : r.heartsUpdatedAt };
}

export function gainHeart(p: Progress, now: number): Progress {
  const r = regenHearts(p, now);
  if (r.hearts >= MAX_HEARTS) return r;
  const hearts = r.hearts + 1;
  return { ...r, hearts, heartsUpdatedAt: hearts >= MAX_HEARTS ? now : r.heartsUpdatedAt };
}

/** The streak as it stands now: it survives until the end of the day after the last session. */
export function currentStreak(p: Progress, now: number): number {
  if (!p.lastActiveDate) return 0;
  const today = dayKey(now);
  return p.lastActiveDate === today || p.lastActiveDate === shiftDay(today, -1) ? p.streak : 0;
}

export function todayXp(p: Progress, now: number): number {
  return p.dailyXp[dayKey(now)] ?? 0;
}

export function recordSession(
  p: Progress,
  s: { courseId: string; lessonId?: string; xp: number; accuracy: number; durationMs?: number },
  now: number,
): Progress {
  const today = dayKey(now);
  const streak =
    p.lastActiveDate === today ? p.streak : p.lastActiveDate === shiftDay(today, -1) ? p.streak + 1 : 1;
  const prev = s.lessonId ? p.completed[s.lessonId] : undefined;
  const completed = s.lessonId
    ? {
        ...p.completed,
        [s.lessonId]: {
          times: (prev?.times ?? 0) + 1,
          bestAccuracy: Math.max(prev?.bestAccuracy ?? 0, s.accuracy),
        },
      }
    : p.completed;
  return {
    ...p,
    xp: p.xp + s.xp,
    courseXp: { ...p.courseXp, [s.courseId]: (p.courseXp[s.courseId] ?? 0) + s.xp },
    streak,
    lastActiveDate: today,
    dailyXp: { ...p.dailyXp, [today]: (p.dailyXp[today] ?? 0) + s.xp },
    completed,
    sessionHistory: [
      ...p.sessionHistory,
      { at: now, courseId: s.courseId, date: today, accuracy: s.accuracy, durationMs: s.durationMs ?? 0, xp: s.xp },
    ].slice(-SESSION_HISTORY_LIMIT),
  };
}

export function xpFor(s: { practice: boolean; mistakes: number; missionId?: string; storyId?: string }): number {
  if (s.missionId || s.storyId) return 10 + (s.mistakes === 0 ? 5 : 0);
  if (s.practice) return 5;
  return 10 + (s.mistakes === 0 ? 5 : 0);
}

/** Dashboard history is a nice-to-have, so malformed entries are dropped rather than rejecting the save. */
export function sessionHistoryOf(value: unknown): SessionStat[] {
  if (!Array.isArray(value)) return [];
  const finite = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
  return value.filter((s: any): s is SessionStat =>
    typeof s === 'object' && s !== null &&
    finite(s.at) &&
    typeof s.courseId === 'string' &&
    typeof s.date === 'string' &&
    finite(s.accuracy) &&
    finite(s.durationMs) &&
    finite(s.xp),
  );
}

export function loadProgress(now: number): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialProgress(now);
    const saved = JSON.parse(raw);
    return migrate({ ...initialProgress(now), ...saved, sessionHistory: sessionHistoryOf(saved.sessionHistory) }, raw);
  } catch {
    return initialProgress(now);
  }
}

/** Saves from the Spanish-only version had no `course` field and unprefixed lesson ids. */
export function migrate(p: Progress, raw: string): Progress {
  if ('course' in JSON.parse(raw)) return p;
  const completed = Object.fromEntries(
    Object.entries(p.completed).map(([id, r]) => [id.includes('-') ? id : `es-${id}`, r]),
  );
  return { ...p, completed, course: 'es', courseXp: { es: p.xp } };
}

export function saveProgress(p: Progress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    // Storage may be unavailable (private mode); progress then lasts for this visit only.
  }
}
