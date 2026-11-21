import {
  SESSION_HISTORY_LIMIT,
  shiftDay,
  type LessonRecord,
  type Progress,
  type RecallStats,
  type SavedPhrase,
  type SessionStat,
  type WordReview,
} from './progress';

/**
 * Merge two copies of a learner's progress, e.g. this device's and the cloud's.
 *
 * `base` is the last version both sides agreed on (the last successful sync). With a base, counters add up
 * what each side earned since then and deletions are respected. Without one (first sign-in on a device, or
 * the base was lost), counters take the larger value so nothing is ever double counted.
 *
 * A reset of all progress wins over older changes: the side with the newer `resetAt` is kept as is.
 */
export function mergeProgress(local: Progress, remote: Progress, base: Progress | null): Progress {
  const localReset = local.resetAt ?? 0;
  const remoteReset = remote.resetAt ?? 0;
  if (localReset !== remoteReset) return normalize(localReset > remoteReset ? local : remote);
  // A base from before the latest reset says nothing about the current data.
  const b = base && (base.resetAt ?? 0) === localReset ? base : null;

  const dailyXp = mergeCounters(local.dailyXp, remote.dailyXp, b?.dailyXp);
  const lastActiveDate = laterDate(local.lastActiveDate, remote.lastActiveDate);
  const heartsSide = local.heartsUpdatedAt === remote.heartsUpdatedAt
    ? (local.hearts <= remote.hearts ? local : remote)
    : local.heartsUpdatedAt > remote.heartsUpdatedAt ? local : remote;

  return normalize({
    ...remote,
    xp: mergeCounter(local.xp, remote.xp, b?.xp),
    courseXp: mergeCounters(local.courseXp, remote.courseXp, b?.courseXp),
    dailyXp,
    completed: mergeRecords(local.completed, remote.completed, b?.completed),
    missions: mergeRecords(local.missions, remote.missions, b?.missions),
    recall: mergeRecall(local.recall, remote.recall, b?.recall),
    wordReviews: mergeReviews(local.wordReviews, remote.wordReviews),
    savedPhrases: mergePhrases(local.savedPhrases, remote.savedPhrases, b?.savedPhrases),
    sessionHistory: mergeSessions(local.sessionHistory, remote.sessionHistory),
    hearts: heartsSide.hearts,
    heartsUpdatedAt: heartsSide.heartsUpdatedAt,
    lastActiveDate,
    streak: mergeStreak(local, remote, lastActiveDate, dailyXp),
    dailyGoal: pickSetting(local.dailyGoal, remote.dailyGoal, b?.dailyGoal),
    sound: pickSetting(local.sound, remote.sound, b?.sound),
    showRoman: pickSetting(local.showRoman, remote.showRoman, b?.showRoman),
    course: pickSetting(local.course, remote.course, b?.course, null),
    learningReason: pickSetting(local.learningReason, remote.learningReason, b?.learningReason, null),
    resetAt: localReset,
  });
}

/** Whether two progress records hold the same data (key order doesn't matter). */
export function sameProgress(a: Progress, b: Progress): boolean {
  return stableStringify(normalize(a)) === stableStringify(normalize(b));
}

/** A counter both sides may have increased: the remote value plus whatever this side added since the base. */
function mergeCounter(local: number, remote: number, base: number | undefined): number {
  if (base === undefined) return Math.max(local, remote);
  return remote + Math.max(0, local - base);
}

function mergeCounters(
  local: Record<string, number>,
  remote: Record<string, number>,
  base: Record<string, number> | undefined,
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const key of new Set([...Object.keys(local), ...Object.keys(remote)])) {
    out[key] = mergeCounter(local[key] ?? 0, remote[key] ?? 0, base ? (base[key] ?? 0) : undefined);
  }
  return out;
}

function mergeRecords(
  local: Record<string, LessonRecord>,
  remote: Record<string, LessonRecord>,
  base: Record<string, LessonRecord> | undefined,
): Record<string, LessonRecord> {
  const out: Record<string, LessonRecord> = {};
  for (const key of new Set([...Object.keys(local), ...Object.keys(remote)])) {
    const l = local[key];
    const r = remote[key];
    out[key] = {
      times: mergeCounter(l?.times ?? 0, r?.times ?? 0, base ? (base[key]?.times ?? 0) : undefined),
      bestAccuracy: Math.max(l?.bestAccuracy ?? 0, r?.bestAccuracy ?? 0),
    };
  }
  return out;
}

function mergeRecall(
  local: Record<string, RecallStats>,
  remote: Record<string, RecallStats>,
  base: Record<string, RecallStats> | undefined,
): Record<string, RecallStats> {
  const out: Record<string, RecallStats> = {};
  for (const key of new Set([...Object.keys(local), ...Object.keys(remote)])) {
    const b = base ? (base[key] ?? { attempts: 0, correct: 0 }) : undefined;
    out[key] = {
      attempts: mergeCounter(local[key]?.attempts ?? 0, remote[key]?.attempts ?? 0, b?.attempts),
      correct: mergeCounter(local[key]?.correct ?? 0, remote[key]?.correct ?? 0, b?.correct),
    };
  }
  return out;
}

/** Each word keeps whichever side reviewed it most recently. */
function mergeReviews(local: Record<string, WordReview>, remote: Record<string, WordReview>): Record<string, WordReview> {
  const out = { ...remote };
  for (const [key, review] of Object.entries(local)) {
    const other = out[key];
    if (!other || review.lastReviewedAt > other.lastReviewedAt) out[key] = review;
  }
  return out;
}

/** Sessions from both sides, each once (a session is identified by its course, finish time and result), oldest first. */
function mergeSessions(local: SessionStat[] = [], remote: SessionStat[] = []): SessionStat[] {
  const byId = new Map<string, SessionStat>();
  for (const session of [...remote, ...local]) {
    byId.set(`${session.courseId}@${session.at}:${session.xp}:${session.accuracy}:${session.durationMs}`, session);
  }
  return [...byId.values()].sort((a, b) => a.at - b.at).slice(-SESSION_HISTORY_LIMIT);
}

/** Phrases saved on either side are kept, unless one side removed a phrase both had before. */
function mergePhrases(local: SavedPhrase[], remote: SavedPhrase[], base: SavedPhrase[] | undefined): SavedPhrase[] {
  const baseIds = new Set(base?.map((p) => p.id) ?? []);
  const localIds = new Set(local.map((p) => p.id));
  const remoteIds = new Set(remote.map((p) => p.id));
  const removed = (id: string) => baseIds.has(id) && (!localIds.has(id) || !remoteIds.has(id));
  const byId = new Map<string, SavedPhrase>();
  for (const phrase of [...remote, ...local]) {
    if (removed(phrase.id)) continue;
    const existing = byId.get(phrase.id);
    if (!existing || phrase.createdAt < existing.createdAt) byId.set(phrase.id, phrase);
  }
  return [...byId.values()];
}

function laterDate(a: string | null, b: string | null): string | null {
  if (!a) return b;
  if (!b) return a;
  return a > b ? a : b;
}

/**
 * Keep the streak from the side that practised most recently, and extend it if the merged daily history
 * shows a longer unbroken run (for example, each device practised on different days while offline).
 */
function mergeStreak(local: Progress, remote: Progress, lastActiveDate: string | null, dailyXp: Record<string, number>): number {
  if (!lastActiveDate) return Math.max(local.streak, remote.streak);
  const candidates = [local, remote].filter((p) => p.lastActiveDate === lastActiveDate).map((p) => p.streak);
  let run = 0;
  for (let day = lastActiveDate; (dailyXp[day] ?? 0) > 0; day = shiftDay(day, -1)) run++;
  return Math.max(run, ...candidates);
}

/** A setting takes the side that changed it since the base; otherwise the remote value. */
function pickSetting<T>(local: T, remote: T, base: T | undefined, unset?: T): T {
  if (base !== undefined) return local !== base ? local : remote;
  // No shared history: prefer a value that has actually been chosen.
  if (unset !== undefined && remote === unset) return local;
  return remote;
}

/** Canonical form so the same data always serializes the same way. */
function normalize(p: Progress): Progress {
  return {
    ...p,
    savedPhrases: [...p.savedPhrases].sort((a, b) => a.createdAt - b.createdAt || a.id.localeCompare(b.id)),
  };
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v !== undefined)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${stableStringify(v)}`).join(',')}}`;
  }
  return JSON.stringify(value);
}
