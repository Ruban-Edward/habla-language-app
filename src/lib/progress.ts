export const MAX_HEARTS = 5;
export const HEART_REFILL_MS = 15 * 60 * 1000;
const STORAGE_KEY = 'habla:v1';

export type LessonRecord = { times: number; bestAccuracy: number };

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
  };
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
  s: { courseId: string; lessonId?: string; xp: number; accuracy: number },
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
  };
}

export function xpFor(s: { practice: boolean; mistakes: number }): number {
  if (s.practice) return 5;
  return 10 + (s.mistakes === 0 ? 5 : 0);
}

export function loadProgress(now: number): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialProgress(now);
    return migrate({ ...initialProgress(now), ...JSON.parse(raw) }, raw);
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
